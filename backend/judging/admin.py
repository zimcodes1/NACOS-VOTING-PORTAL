from django.contrib import admin
from .models import Judge, ScoreCriterion, Score, EventSettings


@admin.register(Judge)
class JudgeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'get_assigned_categories', 'created_at')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    filter_horizontal = ('assigned_categories',)

    def get_assigned_categories(self, obj):
        return ", ".join([c.name for c in obj.assigned_categories.all()])
    get_assigned_categories.short_description = "Assigned Categories"


@admin.register(ScoreCriterion)
class ScoreCriterionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'max_score', 'weight')
    list_filter = ('category',)
    search_fields = ('name',)


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'judge', 'project', 'criterion', 'value', 'submitted', 'created_at')
    list_filter = ('submitted', 'criterion', 'created_at')
    search_fields = ('judge__user__username', 'project__title', 'criterion__name')


@admin.register(EventSettings)
class EventSettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'voting_closed', 'judging_closed')

    def has_add_permission(self, request):
        # Prevent creating multiple EventSettings rows
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
