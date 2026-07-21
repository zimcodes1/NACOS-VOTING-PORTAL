from django.db.models import Count, Q
from rest_framework import generics, filters
from .models import Category, Project
from .serializers import (
    CategorySerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
)


class CategoryListAPIView(generics.ListAPIView):
    """
    GET /api/categories/
    List all project categories.
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer


class ProjectListAPIView(generics.ListAPIView):
    """
    GET /api/projects/?category=&search=&status=
    List projects filtered by category and search term.
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

        # Search term filter
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(team_name__icontains=search_query)
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
