from rest_framework import serializers
from .models import Judge

class JudgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Judge
        fields = ['id', 'name', 'title', 'bio', 'image_url']
