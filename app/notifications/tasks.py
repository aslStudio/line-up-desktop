import logging
from datetime import datetime

from celery.utils.log import get_task_logger
from celery import shared_task
from django.utils import timezone

from common.telegram_bot import send_message_to_bot
from events_app.models import Event, EventRecurring, EventPeriodicTask, EventSpecificDate
from .api.serializers import NotificationSerializer
from .models import Notification
from .services.create_notification import check_notification_settings, sending_in_both_directions_event

logger = get_task_logger(__name__)



@shared_task
def add(x, y):
    logger.info(f"посчитали {x, y}")
    return x + y


@shared_task
def create_task_for_owner(event_recurring_id: int):
    """Уведомление напоминание, что событие сегодня для его создателя"""
    try:
        event_recurring = EventRecurring.objects.get(id=event_recurring_id)
        event = event_recurring.event
        print(f"Полученный EventRecurring: {event_recurring}")

        if not event.reminder_delta:
            return
        data = {
            'title': 'Напоминание',
            'recipient_type': 'for anyone',
            'type_notification': 'reminder',
            'message': f'Событие {event.name} начнётся через {event.reminder_delta}',
            'recipient': event.owner.id,
        }
        serializer = NotificationSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        notification = serializer.save()
        print(f"Было успешно создано уведомление {notification}")

        if check_notification_settings(notification=notification):
            if event.owner.telegram_chat_id:
                send_message_to_bot(message=notification.message, chat_id=event.owner.telegram_chat_id)
        else:
            notification.is_read = True
            notification.save()

    except EventPeriodicTask.DoesNotExist:
        print(f"Задача с событием с id={event_recurring_id} не найдена.")
    except Exception as e:
        print(f'Временные таски для ивента для владельца {event} не создались по причине {e}')

@shared_task
def create_task_for_organizers_participants(event_specific_id: int):
    """Уведомление напоминание-подтверждение, что событие сегодня
     для его организаторов и участников"""
    try:
        event_specific = EventSpecificDate.objects.get(id=event_specific_id)
        event = event_specific.event
        print(f"Полученный EventSpecificDate: {event_specific}")

        if not event.project.reminder_delta: # если напоминание не установлено
            return

        sending_in_both_directions_event(specific_event=event_specific)

    except EventPeriodicTask.DoesNotExist:
        print(f"Задача с событием с id={event_specific_id} не найдена.")
    except Exception as e:
        print(f'Временные таски для ивента для организаторов и участников {event_specific} не создались по причине {e}')