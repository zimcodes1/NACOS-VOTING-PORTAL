from django.urls import path
from .views import (
    CategoryListAPIView,
    ProjectListAPIView,
    ProjectDetailAPIView,
    VerifyVoterAPIView,
    VoteCreateAPIView,
)

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('projects/', ProjectListAPIView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailAPIView.as_view(), name='project-detail'),
    path('verify-voter/', VerifyVoterAPIView.as_view(), name='verify-voter'),
    path('votes/', VoteCreateAPIView.as_view(), name='vote-create'),
]
