from rest_framework import generics
from .models import Judge
from .serializers import JudgeSerializer

class JudgeListAPIView(generics.ListAPIView):
    """
    GET /api/judges/
    Lists all judges for displaying on the landing page.
    """
    queryset = Judge.objects.all().order_by('id')
    serializer_class = JudgeSerializer
