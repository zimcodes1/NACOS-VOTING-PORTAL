from django.db import models
from core.models import Project


class Payment(models.Model):
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUCCESS = 'success', 'Success'
        FAILED = 'failed', 'Failed'
        WAIVED = 'waived', 'Waived'

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='payments')
    paystack_reference = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    raw_webhook_payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.paystack_reference} - {self.project.title} ({self.status})"
