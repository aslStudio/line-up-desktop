from django.conf import settings
from django.db.models.signals import post_save, pre_save, m2m_changed
from django.dispatch import receiver
from django.template.defaultfilters import title
from drf_spectacular.contrib import rest_framework
# from jsonschema.benchmarks.unused_registry import instance
from pyexpat.errors import messages
from rest_framework.response import Response
from yaml import serialize

from common.telegram_bot import send_message_to_bot
from profiles_app.models import Profile
from .api.serializers import NotificationSerializer, NotificationForExecutorSerializer

from .models import Notification, StatusApplication
from events_app.models import Event
from .services.create_notification import create_notification, sending_in_both_directions
from .services.creating_connections import admission_to_event_or_project



@receiver(m2m_changed, sender=StatusApplication.recipient_application.through)
def create_first_notification_application(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    """Создание первого уведомления, после подачи заявки о вступление в событие
    или проект от участника или организатора"""
    if action == 'post_add':
        print(instance.recipient_application.all())
        sending_in_both_directions(status = instance)



@receiver(pre_save, sender=StatusApplication)
def create_notification_previous_mode(sender, instance, *args, **kwargs):
    original_status = None
    if instance.id: # если уже есть и меняем
        original_status = StatusApplication.objects.get(pk=instance.id).status

    else:
        pass
    instance.__original_status = original_status


@receiver(post_save, sender=StatusApplication)
def create_notification_save_mode_handler(sender, instance, created, **kwargs):
    try:
        if instance.__original_status != instance.status:
            if instance.status == 'accept':
                admission_to_event_or_project(instance)
                sending_in_both_directions(status=instance)
            elif instance.status == 'confirmed':
                if instance.specific_event.event.project.is_need_confirmation:
                    sending_in_both_directions(status=instance)
            elif instance.status == 'reject':
                sending_in_both_directions(status=instance)
                # instance.delete()
                return Response(status=rest_framework.status.HTTP_204_NO_CONTENT)
            elif instance.status == 'cancellation':
                sending_in_both_directions(status=instance)
            elif instance.status == 'delete':
                sending_in_both_directions(status=instance)
        else:
            print(f"Статус {instance.id} не изменился")

    except Exception as e:
        print(e)



@receiver(m2m_changed, sender=Profile.contacts.through)
def profile_contacts_changed(sender, instance, action, reverse, model, pk_set, **kwargs):
    if action == "post_add":
        added_contacts = model.objects.filter(pk__in=pk_set)
        for contact in added_contacts:
            create_notification(type_notification='new contact', sender=instance, recipient=contact)
    elif action == "post_remove":
        removed_contacts = model.objects.filter(pk__in=pk_set)
        for contact in removed_contacts:
            print(f"Пользователь {instance} удалил из контактов {contact}")
            # removing_from_contacts(contact)
