from django.contrib import admin
from .models import Category, Project, Voter, Vote


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'requires_payment', 'fee_amount', 'created_at')
    list_filter = ('requires_payment',)
    search_fields = ('name',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'registration_status', 'team_name', 'created_at')
    list_filter = ('category', 'registration_status')
    search_fields = ('title', 'description', 'team_name')


@admin.register(Voter)
class VoterAdmin(admin.ModelAdmin):
    list_display = ('matric_number', 'name', 'device_fingerprint', 'created_at')
    search_fields = ('matric_number', 'name')


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'voter', 'project', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('voter__matric_number', 'project__title')
