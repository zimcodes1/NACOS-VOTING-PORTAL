from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'paystack_reference', 'project', 'amount', 'status', 'verified_at', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('paystack_reference', 'project__title')
