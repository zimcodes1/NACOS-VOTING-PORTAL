import os
import re
import uuid
import cloudinary
import cloudinary.uploader
from django.conf import settings
from django.db import IntegrityError
from django.db.models import Count, Q
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Category, Project, Voter, Vote
from .serializers import (
    CategorySerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    ProjectCreateSerializer,
)

MATRIC_REGEX = re.compile(r'^(?:FT\d{2}[A-Z]{3,4}\d{3,5}|[A-Z]{2,5}/\d{4}/\d{3,5}|[A-Z0-9]{7,15})$', re.IGNORECASE)


class CategoryListAPIView(generics.ListAPIView):
    """
    GET /api/categories/?track=
    List all project categories sorted with voting_open=True at the top.
    """
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.annotate(
            project_count=Count('projects')
        ).order_by('-voting_open', 'name')

        track_param = self.request.query_params.get('track')
        if track_param and track_param != 'all':
            queryset = queryset.filter(track=track_param)

        return queryset


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
    Checks if category voting is open, and enforces 1 vote per category per voter.
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

        # Enforce Category Voting Open Check
        if not project.category.voting_open:
            return Response(
                {
                    "error": "Voting Closed",
                    "message": f"Voting for category '{project.category.name}' is currently closed."
                },
                status=status.HTTP_400_BAD_REQUEST
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


class RegisterProjectAPIView(generics.CreateAPIView):
    """
    POST /api/register-project/
    Creates a new project entry and auto-assigns track-based registration code (SOFT_001, GRAP_001, AI_001).
    Returns full project metadata & registration code.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectCreateSerializer


class LookupProjectAPIView(APIView):
    """
    GET /api/lookup-project/?code=&email=
    Allows an entrant team to look up their project status using registration_code + contact_email.
    """
    def get(self, request):
        code = request.query_params.get('code', '').strip()
        email = request.query_params.get('email', '').strip()

        if not code or not email:
            return Response(
                {"error": "Both registration_code and contact_email are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            project = Project.objects.select_related('category').get(
                registration_code__iexact=code,
                contact_email__iexact=email
            )
            serializer = ProjectDetailSerializer(project)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return Response(
                {"error": "No project found matching the provided registration code and email."},
                status=status.HTTP_404_NOT_FOUND
            )


class UpdateProjectAPIView(APIView):
    """
    PATCH /api/projects/<int:pk>/update/
    Allows an entrant team to update their project details.
    Requires registration_code and contact_email in headers, query parameters, or request body.
    """
    def put(self, request, pk):
        return self.patch(request, pk)

    def patch(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        code = (
            request.headers.get('X-Registration-Code')
            or request.query_params.get('code')
            or request.data.get('registration_code')
        )
        email = (
            request.headers.get('X-Contact-Email')
            or request.query_params.get('email')
            or request.data.get('contact_email')
        )

        if not code or not email:
            return Response(
                {"error": "Both registration code and contact email are required to authorize the update."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if (
            project.registration_code.strip().lower() != code.strip().lower()
            or project.contact_email.strip().lower() != email.strip().lower()
        ):
            return Response(
                {"error": "Invalid registration code or email for this project."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProjectCreateSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            category = serializer.validated_data.get('category')
            if category:
                project.track = category.track
            serializer.save()
            
            detail_serializer = ProjectDetailSerializer(project)
            return Response(detail_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImageUploadAPIView(APIView):
    """
    POST /api/upload-image/
    Accepts multipart/form-data with file 'image'.
    Uploads to Cloudinary if env keys exist, else saves locally.
    Returns { "url": "..." }
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response(
                {"error": "No image file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', '') or os.getenv('CLOUDINARY_CLOUD_NAME', '')
        api_key = getattr(settings, 'CLOUDINARY_API_KEY', '') or os.getenv('CLOUDINARY_API_KEY', '')
        api_secret = getattr(settings, 'CLOUDINARY_API_SECRET', '') or os.getenv('CLOUDINARY_API_SECRET', '')

        if cloud_name and api_key and api_secret:
            try:
                cloudinary.config(
                    cloud_name=cloud_name,
                    api_key=api_key,
                    api_secret=api_secret,
                    secure=True
                )
                upload_res = cloudinary.uploader.upload(
                    image_file,
                    folder="nacos_voting_portal"
                )
                return Response(
                    {"url": upload_res.get("secure_url")},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                print("Cloudinary upload failed, falling back to local storage:", e)

        # Fallback local upload handling
        upload_dir = settings.BASE_DIR / 'media' / 'uploads'
        upload_dir.mkdir(parents=True, exist_ok=True)
        ext = image_file.name.split('.')[-1] if '.' in image_file.name else 'png'
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = upload_dir / filename

        with open(filepath, 'wb+') as destination:
            for chunk in image_file.chunks():
                destination.write(chunk)

        local_url = request.build_absolute_uri(f"{settings.MEDIA_URL}uploads/{filename}")
        return Response({"url": local_url}, status=status.HTTP_201_CREATED)
