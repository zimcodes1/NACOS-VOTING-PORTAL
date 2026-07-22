import re
from django.db import IntegrityError
from django.db.models import Count, Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, Project, Voter, Vote
from .serializers import (
    CategorySerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
)

MATRIC_REGEX = re.compile(r'^(?:FT\d{2}[A-Z]{3,4}\d{3,5}|[A-Z]{2,5}/\d{4}/\d{3,5}|[A-Z0-9]{7,15})$', re.IGNORECASE)


class CategoryListAPIView(generics.ListAPIView):
    """
    GET /api/categories/
    List all project categories with annotated project_count.
    """
    queryset = Category.objects.annotate(
        project_count=Count('projects')
    ).order_by('name')
    serializer_class = CategorySerializer


class ProjectListAPIView(generics.ListAPIView):
    """
    GET /api/projects/?category=&search=&status=&track=
    List projects filtered by category, search term, or track.
    Defaults to confirmed registration status for public discovery.
    """
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        queryset = Project.objects.annotate(
            vote_count=Count('votes')
        ).select_related('category')

        # Filter by registration status (default to confirmed for public discovery)
        status_param = self.request.query_params.get('status')
        show_all = self.request.query_params.get('all', 'false').lower() == 'true'

        if status_param:
            queryset = queryset.filter(registration_status=status_param)
        elif not show_all:
            queryset = queryset.filter(registration_status=Project.RegistrationStatus.CONFIRMED)

        # Filter by Category (ID or Name)
        category_param = self.request.query_params.get('category')
        if category_param:
            if category_param.isdigit():
                queryset = queryset.filter(category_id=int(category_param))
            else:
                queryset = queryset.filter(category__name__iexact=category_param)

        # Filter by Track
        track_param = self.request.query_params.get('track')
        if track_param and track_param != 'all':
            queryset = queryset.filter(track=track_param)

        # Search term filter
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(tagline__icontains=search_query) |
                Q(team_name__icontains=search_query) |
                Q(registration_code__icontains=search_query)
            )

        return queryset.order_by('-vote_count', '-created_at')


class ProjectDetailAPIView(generics.RetrieveAPIView):
    """
    GET /api/projects/<int:pk>/
    Retrieve single project details.
    """
    serializer_class = ProjectDetailSerializer

    def get_queryset(self):
        return Project.objects.annotate(
            vote_count=Count('votes')
        ).select_related('category')


class VerifyVoterAPIView(APIView):
    """
    POST /api/verify-voter/
    Validates student matriculation number format (e.g. FT24CMP0123)
    and registers/verifies voter.
    """
    def post(self, request):
        matric_number = request.data.get('matric_number', '')
        if not matric_number:
            return Response(
                {"valid": False, "error": "Matriculation number is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        clean_matric = matric_number.strip().upper()
        if not MATRIC_REGEX.match(clean_matric):
            return Response(
                {
                    "valid": False,
                    "error": "Invalid matric number format.",
                    "message": "Expected format e.g. FT24CMP0123 or FT22CYS0001"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        voter, created = Voter.objects.get_or_create(matric_number=clean_matric)

        return Response({
            "valid": True,
            "matric_number": voter.matric_number,
            "message": "Voter verified successfully."
        }, status=status.HTTP_200_OK)


class VoteCreateAPIView(APIView):
    """
    POST /api/votes/
    Accepts matric_number and project_id to cast a vote.
    Enforces 1 vote per category per matric number (returns 409 Conflict if duplicate).
    """
    def post(self, request):
        matric_number = request.data.get('matric_number', '')
        project_id = request.data.get('project_id')

        if not matric_number or not project_id:
            return Response(
                {"error": "Both matric_number and project_id are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        clean_matric = matric_number.strip().upper()
        if not MATRIC_REGEX.match(clean_matric):
            return Response(
                {"error": "Invalid matric number format.", "message": "Expected e.g. FT24CMP0123"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            project = Project.objects.select_related('category').get(pk=project_id)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        voter, _ = Voter.objects.get_or_create(matric_number=clean_matric)

        # Check unique constraint (1 vote per voter per category)
        if Vote.objects.filter(voter=voter, category=project.category).exists():
            return Response(
                {
                    "error": "Category vote limit reached",
                    "message": f"You have already cast your vote in {project.category.name}."
                },
                status=status.HTTP_409_CONFLICT
            )

        try:
            vote = Vote.objects.create(
                voter=voter,
                project=project,
                category=project.category
            )
        except IntegrityError:
            return Response(
                {
                    "error": "Category vote limit reached",
                    "message": f"You have already cast your vote in {project.category.name}."
                },
                status=status.HTTP_409_CONFLICT
            )

        new_vote_count = project.votes.count()

        return Response({
            "success": True,
            "message": f"Vote successfully recorded for '{project.title}'",
            "project_id": project.id,
            "vote_count": new_vote_count
        }, status=status.HTTP_201_CREATED)
