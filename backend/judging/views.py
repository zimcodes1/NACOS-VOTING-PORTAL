from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import Category, Project
from core.serializers import ProjectListSerializer
from .models import Judge, ScoreCriterion, Score
from .serializers import JudgeSerializer, ScoreCriterionSerializer, ScoreSerializer


class JudgeListAPIView(generics.ListAPIView):
    """
    GET /api/judges/
    Lists all judges for displaying on the landing page.
    """
    queryset = Judge.objects.all().order_by('id')
    serializer_class = JudgeSerializer


@method_decorator(csrf_exempt, name='dispatch')
class JudgeLoginAPIView(APIView):
    """
    POST /api/judge/login/
    Authenticates a judge using username and password.
    Returns judge details on success and establishes a session.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {"error": "Both username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = authenticate(request, username=username, password=password)
        if user is not None:
            try:
                judge = user.judge_profile
                login(request, user)
                serializer = JudgeSerializer(judge)
                return Response(
                    {"message": "Login successful.", "judge": serializer.data},
                    status=status.HTTP_200_OK
                )
            except Judge.DoesNotExist:
                return Response(
                    {"error": "This account is not registered as a judge."},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                {"error": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )


@method_decorator(csrf_exempt, name='dispatch')
class JudgeLogoutAPIView(APIView):
    """
    POST /api/judge/logout/
    Logs out the authenticated judge.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)


class JudgeSessionAPIView(APIView):
    """
    GET /api/judge/session/
    Checks if a judge is currently authenticated and returns their profile.
    """
    def get(self, request):
        if request.user.is_authenticated:
            try:
                judge = request.user.judge_profile
                serializer = JudgeSerializer(judge)
                return Response({"authenticated": True, "judge": serializer.data}, status=status.HTTP_200_OK)
            except Judge.DoesNotExist:
                pass
        return Response({"authenticated": False}, status=status.HTTP_200_OK)


def get_current_judge(request):
    """Helper to resolve current judge from authenticated user or session/id."""
    if request.user.is_authenticated:
        try:
            return request.user.judge_profile
        except Judge.DoesNotExist:
            pass
    judge_id = request.data.get('judge_id') or request.query_params.get('judge_id')
    if judge_id:
        try:
            return Judge.objects.get(id=judge_id)
        except Judge.DoesNotExist:
            pass
    return Judge.objects.first()


class JudgeDashboardDataAPIView(APIView):
    """
    GET /api/judge/dashboard-data/
    Fetches assigned categories, criteria, projects, and score entries for the judge.
    """
    def get(self, request):
        judge = get_current_judge(request)
        if not judge:
            return Response({"error": "Judge account not found."}, status=status.HTTP_404_NOT_FOUND)

        categories = list(judge.assigned_categories.all())
        if not categories:
            categories = list(Category.objects.filter(track='software'))
            if not categories:
                categories = list(Category.objects.all())

        categories_data = []
        for cat in categories:
            criteria = list(cat.score_criteria.all())
            if not criteria:
                criteria = list(ScoreCriterion.objects.all())

            criteria_serialized = ScoreCriterionSerializer(criteria, many=True).data

            projects = list(Project.objects.filter(category=cat))
            projects_data = []
            category_scores_submitted = True if projects else False

            for proj in projects:
                scores = list(Score.objects.filter(judge=judge, project=proj))
                scores_serialized = ScoreSerializer(scores, many=True).data
                
                if not scores:
                    scoring_status = "not_scored"
                    category_scores_submitted = False
                elif any(s.submitted for s in scores):
                    scoring_status = "submitted"
                else:
                    scoring_status = "draft_saved"
                    category_scores_submitted = False

                proj_data = ProjectListSerializer(proj).data
                proj_data['scoring_status'] = scoring_status
                proj_data['scores'] = scores_serialized
                projects_data.append(proj_data)

            categories_data.append({
                "id": str(cat.id),
                "name": cat.name,
                "slug": cat.slug,
                "description": cat.description,
                "criteria": criteria_serialized,
                "projects": projects_data,
                "all_submitted": category_scores_submitted,
            })

        return Response({
            "judge": JudgeSerializer(judge).data,
            "categories": categories_data
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class SaveProjectScoresAPIView(APIView):
    """
    POST /api/judge/save-scores/
    Saves or updates draft criteria scores for a project.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        judge = get_current_judge(request)
        if not judge:
            return Response({"error": "Judge account not found."}, status=status.HTTP_404_NOT_FOUND)

        project_id = request.data.get('project_id')
        scores_data = request.data.get('scores', [])

        if not project_id or not isinstance(scores_data, list):
            return Response({"error": "Invalid project_id or scores payload."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        saved_scores = []
        for item in scores_data:
            criterion_id = item.get('criterion_id')
            val = item.get('value', 0)
            if not criterion_id:
                continue

            try:
                criterion = ScoreCriterion.objects.get(id=criterion_id)
            except ScoreCriterion.DoesNotExist:
                continue

            bounded_value = min(max(int(val), 0), criterion.max_score)
            score_obj, _ = Score.objects.update_or_create(
                judge=judge,
                project=project,
                criterion=criterion,
                defaults={'value': bounded_value, 'submitted': False}
            )
            saved_scores.append(score_obj)

        return Response({
            "message": "Draft scores saved successfully.",
            "scores": ScoreSerializer(saved_scores, many=True).data
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class SubmitCategoryScoresAPIView(APIView):
    """
    POST /api/judge/submit-category-scores/
    Submits all draft scores for all projects under a category for the judge.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        judge = get_current_judge(request)
        if not judge:
            return Response({"error": "Judge account not found."}, status=status.HTTP_404_NOT_FOUND)

        category_id = request.data.get('category_id')
        if not category_id:
            return Response({"error": "category_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        projects = Project.objects.filter(category_id=category_id)
        updated_count = Score.objects.filter(judge=judge, project__in=projects).update(submitted=True)

        return Response({
            "message": "Category evaluation submitted successfully.",
            "updated_count": updated_count
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class JudgedResultsAPIView(APIView):
    """
    POST /api/results/judged/
    Accepts { "code": "evolve" }.
    Calculates aggregate criteria scores across judges for Software Track entries.
    Returns winner (#1 rank) and runner-up standings (#2 to #5).
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        code = (request.data.get('code') or '').strip()

        if code.lower() != 'evolve':
            return Response({
                "unlocked": False,
                "error": "Invalid unlock code. Please enter the correct code to reveal Software Track results."
            }, status=status.HTTP_400_BAD_REQUEST)

        software_categories = Category.objects.filter(track='software')
        category_standings = []

        for cat in software_categories:
            projects = Project.objects.filter(category=cat)
            project_rankings = []

            for proj in projects:
                scores = Score.objects.filter(project=proj, submitted=True)
                total_score = sum(s.value for s in scores)
                judge_count = scores.values('judge').distinct().count()
                avg_score = (total_score / judge_count) if judge_count > 0 else total_score

                project_rankings.append({
                    "id": str(proj.id),
                    "registration_code": proj.registration_code,
                    "title": proj.title,
                    "tagline": proj.tagline,
                    "team_name": proj.team_name or proj.contact_name or "Team Entry",
                    "thumbnail_url": proj.thumbnail_url,
                    "live_preview_url": proj.live_preview_url,
                    "total_score": total_score,
                    "average_score": round(avg_score, 1),
                    "judges_evaluated": judge_count,
                })

            project_rankings.sort(key=lambda x: x['total_score'], reverse=True)

            for idx, item in enumerate(project_rankings):
                item['rank'] = idx + 1

            winner = project_rankings[0] if project_rankings else None
            remaining_rankings = project_rankings[1:5] if len(project_rankings) > 1 else []

            category_standings.append({
                "category_id": str(cat.id),
                "category_name": cat.name,
                "winner": winner,
                "rankings": remaining_rankings,
                "all_rankings": project_rankings,
            })

        return Response({
            "unlocked": True,
            "message": "Software Track Standings Unlocked",
            "categories": category_standings
        }, status=status.HTTP_200_OK)
