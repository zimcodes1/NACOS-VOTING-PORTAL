from decimal import Decimal
from django.db import models


class Category(models.Model):
    class ExhibitionTrack(models.TextChoices):
        SOFTWARE = 'software', 'Software Track'
        GRAPHIC_DESIGN = 'graphic_design', 'Design Track'
        AI_PROMPTING = 'ai_prompting', 'AI Prompting'

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True, default='')
    description = models.TextField(blank=True, default='')
    track = models.CharField(
        max_length=50,
        choices=ExhibitionTrack.choices,
        default=ExhibitionTrack.SOFTWARE,
    )
    voting_open = models.BooleanField(default=True)
    requires_payment = models.BooleanField(default=False)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    icon_name = models.CharField(max_length=50, blank=True, default='Grid')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        status_str = "OPEN" if self.voting_open else "CLOSED"
        return f"{self.name} ({self.get_track_display()}) — [{status_str}]"


class Project(models.Model):
    class RegistrationStatus(models.TextChoices):
        PENDING_PAYMENT = 'pending_payment', 'Pending Payment'
        PAID = 'paid', 'Paid'
        CONFIRMED = 'confirmed', 'Confirmed'

    class ExhibitionTrack(models.TextChoices):
        SOFTWARE = 'software', 'Software Track'
        GRAPHIC_DESIGN = 'graphic_design', 'Design Track'
        AI_PROMPTING = 'ai_prompting', 'AI Prompting'

    registration_code = models.CharField(max_length=50, unique=True, null=True, blank=True, default=None)
    title = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    thumbnail_url = models.CharField(max_length=500, blank=True, default='')
    live_preview_url = models.CharField(max_length=500, blank=True, default='')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='projects')
    track = models.CharField(
        max_length=50,
        choices=ExhibitionTrack.choices,
        default=ExhibitionTrack.SOFTWARE,
    )
    team_name = models.CharField(max_length=255, blank=True, default='')
    team_members = models.JSONField(default=list, blank=True)
    contact_name = models.CharField(max_length=255, blank=True, default='')
    contact_email = models.EmailField(blank=True, default='')
    contact_phone = models.CharField(max_length=50, blank=True, default='')
    matric_number = models.CharField(max_length=50, blank=True, default='')
    level = models.CharField(max_length=50, blank=True, default='')
    show_contact_publicly = models.BooleanField(default=True)
    registration_status = models.CharField(
        max_length=20,
        choices=RegistrationStatus.choices,
        default=RegistrationStatus.CONFIRMED,
    )
    featured = models.BooleanField(default=False)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.matric_number:
            self.matric_number = self.matric_number.strip().upper()
        if self.category and not self.track:
            self.track = self.category.track

        if not self.registration_code:
            prefix_map = {
                self.ExhibitionTrack.SOFTWARE: 'SOFT',
                self.ExhibitionTrack.GRAPHIC_DESIGN: 'GRAP',
                self.ExhibitionTrack.AI_PROMPTING: 'AI',
            }
            track_val = self.track or (self.category.track if self.category else self.ExhibitionTrack.SOFTWARE)
            prefix = prefix_map.get(track_val, 'SOFT')

            # Query existing code numbers for this prefix to get auto-increment next number
            existing_codes = Project.objects.filter(
                registration_code__startswith=f"{prefix}_"
            ).values_list('registration_code', flat=True)

            numbers = []
            for code in existing_codes:
                try:
                    num = int(code.split('_')[-1])
                    numbers.append(num)
                except (ValueError, TypeError, IndexError):
                    pass

            next_num = (max(numbers) + 1) if numbers else 1
            self.registration_code = f"{prefix}_{next_num:03d}"

        if not self.pk and self.category and self.category.requires_payment:
            self.registration_status = self.RegistrationStatus.PENDING_PAYMENT
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.registration_code})"


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
