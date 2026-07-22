from rest_framework import serializers
from .models import Judge, ScoreCriterion, Score
from core.serializers import CategorySerializer, ProjectListSerializer

class JudgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Judge
        fields = ['id', 'name', 'title', 'bio', 'image_url']


class ScoreCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreCriterion
        fields = ['id', 'name', 'max_score', 'weight']


class ScoreSerializer(serializers.ModelSerializer):
    criterion_id = serializers.ReadOnlyField(source='criterion.id')
    criterion_name = serializers.ReadOnlyField(source='criterion.name')
    max_score = serializers.ReadOnlyField(source='criterion.max_score')

    class Meta:
        model = Score
        fields = [
            'id',
            'project_id',
            'criterion_id',
            'criterion_name',
            'max_score',
            'value',
            'submitted',
            'created_at',
        ]
