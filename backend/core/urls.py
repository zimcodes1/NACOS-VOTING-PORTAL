from django.urls import path
from .views import (
    CategoryListAPIView,
    ProjectListAPIView,
    ProjectDetailAPIView,
    VerifyVoterAPIView,
    VoteCreateAPIView,
    RegisterProjectAPIView,
    LookupProjectAPIView,
    ImageUploadAPIView,
)

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('projects/', ProjectListAPIView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailAPIView.as_view(), name='project-detail'),
    path('verify-voter/', VerifyVoterAPIView.as_view(), name='verify-voter'),
    path('votes/', VoteCreateAPIView.as_view(), name='vote-create'),
    path('register-project/', RegisterProjectAPIView.as_view(), name='register-project'),
    path('lookup-project/', LookupProjectAPIView.as_view(), name='lookup-project'),
    path('upload-image/', ImageUploadAPIView.as_view(), name='upload-image'),
]
