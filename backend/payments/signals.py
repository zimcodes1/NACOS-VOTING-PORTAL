from decimal import Decimal
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from core.models import Project
from .models import Payment

@receiver(post_save, sender=Project)
def create_project_payment(sender, instance, created, **kwargs):
    if created:
        requires_payment = instance.category.requires_payment if instance.category else False
        fee_amount = instance.category.fee_amount if instance.category else Decimal('0.00')
        
        status_val = Payment.PaymentStatus.PENDING if requires_payment else Payment.PaymentStatus.WAIVED
        
        Payment.objects.create(
            project=instance,
            paystack_reference=f"OFFLINE_{instance.registration_code}",
            amount=fee_amount,
            status=status_val,
            verified_at=timezone.now() if not requires_payment else None
        )

@receiver(pre_save, sender=Payment)
def set_payment_verification_time(sender, instance, **kwargs):
    if instance.status == Payment.PaymentStatus.SUCCESS and not instance.verified_at:
        instance.verified_at = timezone.now()

@receiver(post_save, sender=Payment)
def update_project_status(sender, instance, created, **kwargs):
    if instance.status == Payment.PaymentStatus.SUCCESS:
        project = instance.project
        if project.registration_status != Project.RegistrationStatus.CONFIRMED:
            project.registration_status = Project.RegistrationStatus.CONFIRMED
            project.save(update_fields=['registration_status'])
