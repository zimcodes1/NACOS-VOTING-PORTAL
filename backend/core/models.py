from decimal import Decimal
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    requires_payment = models.BooleanField(default=False)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Project(models.Model):
    class RegistrationStatus(models.TextChoices):
        PENDING_PAYMENT = 'pending_payment', 'Pending Payment'
        PAID = 'paid', 'Paid'
        CONFIRMED = 'confirmed', 'Confirmed'

    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail_url = models.CharField(max_length=500, blank=True, default='')
    live_preview_url = models.CharField(max_length=500, blank=True, default='')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='projects')
    team_name = models.CharField(max_length=255, blank=True, default='')
    team_members = models.JSONField(default=list, blank=True)
    registration_status = models.CharField(
        max_length=20,
        choices=RegistrationStatus.choices,
        default=RegistrationStatus.CONFIRMED,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-set status if category requires payment and creating new project
        if not self.pk and self.category and self.category.requires_payment:
            self.registration_status = self.RegistrationStatus.PENDING_PAYMENT
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.category.name})"


class Voter(models.Model):
    matric_number = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255, blank=True, default='')
    device_fingerprint = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.matric_number:
            self.matric_number = self.matric_number.strip().upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.matric_number


class Vote(models.Model):
    voter = models.ForeignKey(Voter, on_delete=models.CASCADE, related_name='votes')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='votes')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='votes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['voter', 'category'],
                name='unique_voter_category_vote'
            )
        ]

    def __str__(self):
        return f"{self.voter.matric_number} -> {self.project.title} ({self.category.name})"
