from decimal import Decimal
from django.contrib.auth.models import User
from django.db import models
from core.models import Category, Project


class Judge(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='judge_profile')
    name = models.CharField(max_length=255, blank=True, default='')
    title = models.CharField(max_length=255, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    image_url = models.CharField(max_length=500, blank=True, default='')
    assigned_categories = models.ManyToManyField(Category, blank=True, related_name='judges')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Judge: {self.name or self.user.username}"


class ScoreCriterion(models.Model):
    name = models.CharField(max_length=100)
    max_score = models.PositiveIntegerField(default=10)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('1.00'))
    categories = models.ManyToManyField(
        Category,
        blank=True,
        related_name='score_criteria'
    )

    class Meta:
        verbose_name_plural = "Score Criteria"

    def __str__(self):
        return f"{self.name} (Max: {self.max_score})"


class Score(models.Model):
    judge = models.ForeignKey(Judge, on_delete=models.CASCADE, related_name='scores')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='scores')
    criterion = models.ForeignKey(ScoreCriterion, on_delete=models.CASCADE, related_name='scores')
    value = models.PositiveIntegerField(default=0)
    submitted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['judge', 'project', 'criterion'],
                name='unique_judge_project_criterion_score'
            )
        ]

    def __str__(self):
        return f"{self.judge.user.username} -> {self.project.title}: {self.criterion.name} = {self.value}"


class EventSettings(models.Model):
    voting_closed = models.BooleanField(default=False)
    judging_closed = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Event Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        v_status = "Closed" if self.voting_closed else "Open"
        j_status = "Closed" if self.judging_closed else "Open"
        return f"Event Settings (Voting: {v_status}, Judging: {j_status})"
