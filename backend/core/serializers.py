from rest_framework import serializers
from .models import Category, Project


class CategorySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'requires_payment',
            'fee_amount',
            'icon_name',
            'project_count',
            'created_at',
        ]


class ProjectListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.ReadOnlyField(source='category.id')
    category_name = serializers.ReadOnlyField(source='category.name')
    vote_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Project
        fields = [
            'id',
            'registration_code',
            'title',
            'tagline',
            'description',
            'thumbnail_url',
            'live_preview_url',
            'category',
            'category_id',
            'category_name',
            'track',
            'team_name',
            'team_members',
            'contact_name',
            'contact_email',
            'contact_phone',
            'show_contact_publicly',
            'registration_status',
            'vote_count',
            'featured',
            'tags',
            'created_at',
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.ReadOnlyField(source='category.id')
    category_name = serializers.ReadOnlyField(source='category.name')
    vote_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Project
        fields = [
            'id',
            'registration_code',
            'title',
            'tagline',
            'description',
            'thumbnail_url',
            'live_preview_url',
            'category',
            'category_id',
            'category_name',
            'track',
            'team_name',
            'team_members',
            'contact_name',
            'contact_email',
            'contact_phone',
            'show_contact_publicly',
            'registration_status',
            'vote_count',
            'featured',
            'tags',
            'created_at',
        ]
