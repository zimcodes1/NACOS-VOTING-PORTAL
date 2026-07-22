from django.urls import path
from .views import JudgeListAPIView

urlpatterns = [
    path('judges/', JudgeListAPIView.as_view(), name='judge-list'),
]
