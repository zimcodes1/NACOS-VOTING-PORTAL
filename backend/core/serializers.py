import re
from rest_framework import serializers
from .models import Category, Project

MATRIC_REGEX = re.compile(r'^(?:FT\d{2}[A-Z]{3,4}\d{3,5}|[A-Z]{2,5}/\d{4}/\d{3,5}|[A-Z0-9]{7,15})$', re.IGNORECASE)


class CategorySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'track',
            'voting_open',
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
            'matric_number',
            'level',
            'show_contact_publicly',
            'registration_status',
            'vote_count',
            'featured',
            'selected',
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
            'matric_number',
            'level',
            'show_contact_publicly',
            'registration_status',
            'vote_count',
            'featured',
            'selected',
            'tags',
            'created_at',
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    category = CategorySerializer(read_only=True)
    registration_code = serializers.CharField(read_only=True)
    registration_status = serializers.CharField(read_only=True)

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
            'category_id',
            'category',
            'track',
            'team_name',
            'team_members',
            'contact_name',
            'contact_email',
            'contact_phone',
            'matric_number',
            'level',
            'show_contact_publicly',
            'registration_status',
            'selected',
            'tags',
            'created_at',
        ]

    def validate_matric_number(self, value):
        if value:
            clean_val = value.strip().upper()
            if not MATRIC_REGEX.match(clean_val):
                raise serializers.ValidationError("Invalid matric number format. Expected format e.g. FT24CMP0123")
            return clean_val
        return value
