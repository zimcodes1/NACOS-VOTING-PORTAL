from rest_framework import serializers
from .models import Category, Project


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'requires_payment', 'fee_amount', 'created_at']


class ProjectListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    vote_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'thumbnail_url',
            'live_preview_url',
            'category',
            'category_id',
            'team_name',
            'registration_status',
            'vote_count',
            'created_at',
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    vote_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'description',
            'thumbnail_url',
            'live_preview_url',
            'category',
            'category_id',
            'team_name',
            'team_members',
            'registration_status',
            'vote_count',
            'created_at',
        ]
