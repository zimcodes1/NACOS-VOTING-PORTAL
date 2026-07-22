from django.urls import path
from .views import (
    CategoryListAPIView,
    ProjectListAPIView,
    ProjectDetailAPIView,
    VerifyVoterAPIView,
    VoteCreateAPIView,
    RegisterProjectAPIView,
    LookupProjectAPIView,
    UpdateProjectAPIView,
    ImageUploadAPIView,
    LiveResultsAPIView,
    PublicStatsAPIView,
)

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('projects/', ProjectListAPIView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailAPIView.as_view(), name='project-detail'),
    path('projects/<int:pk>/update/', UpdateProjectAPIView.as_view(), name='project-update'),
    path('verify-voter/', VerifyVoterAPIView.as_view(), name='verify-voter'),
    path('votes/', VoteCreateAPIView.as_view(), name='vote-create'),
    path('register-project/', RegisterProjectAPIView.as_view(), name='register-project'),
    path('lookup-project/', LookupProjectAPIView.as_view(), name='lookup-project'),
    path('upload-image/', ImageUploadAPIView.as_view(), name='upload-image'),
    path('results/live/', LiveResultsAPIView.as_view(), name='results-live'),
    path('stats/', PublicStatsAPIView.as_view(), name='public-stats'),
]
