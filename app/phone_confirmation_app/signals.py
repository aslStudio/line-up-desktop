from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from phone_confirmation_app.models import TokenConfirmPhone


@receiver(pre_save, sender=TokenConfirmPhone)
def delete_token_confirm_phone(sender, instance, *args, **kwargs):
    existing_instance = TokenConfirmPhone.objects.filter(phone=instance.phone)
    if existing_instance:
        existing_instance.delete()
