from django.urls import path
from .views import (
    JudgeListAPIView,
    JudgeLoginAPIView,
    JudgeLogoutAPIView,
    JudgeSessionAPIView,
    JudgeDashboardDataAPIView,
    SaveProjectScoresAPIView,
    SubmitCategoryScoresAPIView,
)

urlpatterns = [
    path('judges/', JudgeListAPIView.as_view(), name='judge-list'),
    path('judge/login/', JudgeLoginAPIView.as_view(), name='judge-login'),
    path('judge/logout/', JudgeLogoutAPIView.as_view(), name='judge-logout'),
    path('judge/session/', JudgeSessionAPIView.as_view(), name='judge-session'),
    path('judge/dashboard-data/', JudgeDashboardDataAPIView.as_view(), name='judge-dashboard-data'),
    path('judge/save-scores/', SaveProjectScoresAPIView.as_view(), name='judge-save-scores'),
    path('judge/submit-category-scores/', SubmitCategoryScoresAPIView.as_view(), name='judge-submit-category-scores'),
]
