import base64
import uuid

from django.db.models.signals import post_save
from django.dispatch import receiver

from custom_links_app.models import LimitedLink


@receiver(post_save, sender=LimitedLink)
def encrypt_id(sender, instance, created, **kwargs):
    if created:
        new_uuid = uuid.uuid4()
        encrypted_id = base64.urlsafe_b64encode(str(instance.id).encode()).decode()
        instance.short_encrypted_id = encrypted_id
        instance.save(update_fields=['short_encrypted_id'])






