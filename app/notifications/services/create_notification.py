from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from common.telegram_bot import send_message_to_bot
from events_app.models import EventSpecificDate
from notifications.api.serializers import NotificationSerializer
from notifications.models import StatusApplication, Notification
from profiles_app.models import Profile



def check_notification_settings(notification: Notification) -> bool:
    ns = notification.recipient.settings.notification_settings

    """Общее"""
    if ns.is_from_app:
        return True
    elif ns.is_reminder_about_event and notification.type_notification == 'reminder':
        return True
    elif ns.is_user_confirmed_event and notification.for_organizer.status.status == 'confirmed':
        return True

    """Для расписания"""
    if notification.recipient_type == 'for participant':
        if notification.type_notification == 'invitation': # ch
            if ns.is_invite_to_schedule:
                return True
            elif ns.is_invite_to_event:
                return True
        elif ns.is_change_in_event and notification.type_notification == 'change': # ch
            return True
        elif ns.is_cancellation_event and notification.type_notification == 'cancellation':
            return True
        elif ns.is_new_open_event and notification.type_notification == 'new': # ch
            return True

    """Для проекта"""
    if notification.recipient_type == 'for organizer':
        if ns.is_new_application and notification.type_notification == 'invitation':
            return True
        if ns.is_project_change_in_event and notification.type_notification == 'change':
            return True
        if ns.is_user_refused_to_participate and notification.for_organizer.status.status == 'reject':
            return True
        if ns.is_user_left_project:
            pass
        if ns.is_user_joined_project:
            pass

    return False


def adding_to_contacts(sender: Profile, recipient: Profile) -> dict:
    data = {
        'title': f"Контакты",
        'type_notification': 'system',
        'message': f"Вас добавил в контакты {sender.user.username}",
        'sender': sender.id,
        'recipient': recipient.id,
    }
    return data


def invitation_notification(status: StatusApplication,
                            recipient_type: str,
                            recipient: Profile) -> dict:
    recipient_username = recipient.user.username
    sender_username = status.sender_application.user.username
    project_or_event = status.project or status.specific_event
    project_or_event_type = 'project' if status.project else 'event'
    messages = {
        ('True','for organizer','participant', 'consideration', 'project',):
            lambda: f"Вы пригласили {recipient_username} стать участником в проект {project_or_event}",
        ('True','for organizer','participant', 'consideration', 'event',):
            lambda: f"Вы пригласили {recipient_username} стать участником в событие {project_or_event}",

        ('True', 'for organizer', 'participant', 'accept', 'project',):
            lambda: f"{recipient_username} стал участником в проекте {project_or_event}",
        ('True', 'for organizer', 'participant', 'accept', 'event',):
            lambda: f"{recipient_username} стал участником в событие {project_or_event}",

        ('True', 'for organizer', 'participant', 'reject', 'project',):
            lambda: f"{recipient_username} отказался быть участником в проекте {project_or_event}",
        ('True', 'for organizer', 'participant', 'reject', 'event',):
            lambda: f"{recipient_username} отказался быть участником в событие {project_or_event}",

        ('True', 'for organizer', 'participant', 'cancellation', 'project',):
            lambda: f"{recipient_username} отменил заявку участником в проекте {project_or_event}",
        ('True', 'for organizer', 'participant', 'cancellation', 'event',):
            lambda: f"{recipient_username} отменил заявку участником в событие {project_or_event}",

        #---------------------------------------------------------------------------------

        ('True', 'for organizer', 'organizer', 'consideration', 'project',):
            lambda: f"Вы пригласили {recipient_username} стать организатором в проект {project_or_event}",
        ('True', 'for organizer', 'organizer', 'consideration', 'event',):
            lambda: f"Вы пригласили {recipient_username} стать организатором в событие {project_or_event}",

        ('True', 'for organizer', 'organizer', 'accept', 'project',):
            lambda: f"{recipient_username} стал организатором в проекте {project_or_event}",
        ('True', 'for organizer', 'organizer', 'accept', 'event',):
            lambda: f"{recipient_username} стал организатором в событие {project_or_event}",

        ('True', 'for organizer', 'organizer', 'reject', 'project',):
            lambda: f"{recipient_username} отказался быть организатором в проекте {project_or_event}",
        ('True', 'for organizer', 'organizer', 'reject', 'event',):
            lambda: f"{recipient_username} отказался быть организатором в событие {project_or_event}",

        ('True', 'for organizer', 'organizer', 'cancellation', 'project',):
            lambda: f"{recipient_username} отменил заявку организатором в проекте {project_or_event}",
        ('True', 'for organizer', 'organizer', 'cancellation', 'event',):
            lambda: f"{recipient_username} отменил заявку организатором в событие {project_or_event}",

        #----------------------------------------------------------------------------------
        #----------------------------------------------------------------------------------

        ('True', 'for participant', 'participant', 'consideration', 'project',):
            lambda: f"Вас пригласили стать участником в проект {project_or_event}",
        ('True', 'for participant', 'participant', 'consideration', 'event',):
            lambda: f"Вас пригласили стать участником в событие {project_or_event}",

        ('True', 'for participant', 'participant', 'accept', 'project',):
            lambda: f"Вы стали участником в проекте {project_or_event}",
        ('True', 'for participant', 'participant', 'accept', 'event',):
            lambda: f"Вы стали участником в событие {project_or_event}",

        ('True', 'for participant', 'participant', 'reject', 'project',):
            lambda: f"Вы отказались быть участником в проекте {project_or_event}",
        ('True', 'for participant', 'participant', 'reject', 'event',):
            lambda: f"Вы отказались быть участником в событие {project_or_event}",

        ('True', 'for participant', 'participant', 'cancellation', 'project',):
            lambda: f"Вы отменили заявку участником в проекте {project_or_event}",
        ('True', 'for participant', 'participant', 'cancellation', 'event',):
            lambda: f"Вы отменили  заявку участником в событие {project_or_event}",

        # ---------------------------------------------------------------------------------

        ('True', 'for participant', 'organizer', 'consideration', 'project',):
            lambda: f"Вас пригласили стать организатором в проект {project_or_event}",
        ('True', 'for participant', 'organizer', 'consideration', 'event',):
            lambda: f"Вас пригласили стать организатором в событие {project_or_event}",

        ('True', 'for participant', 'organizer', 'accept', 'project',):
            lambda: f"Вы стали организатором в проекте {project_or_event}",
        ('True', 'for participant', 'organizer', 'accept', 'event',):
            lambda: f"Вы стали организатором в событие {project_or_event}",

        ('True', 'for participant', 'organizer', 'reject', 'project',):
            lambda: f"Вы отказались быть организатором в проекте {project_or_event}",
        ('True', 'for participant', 'organizer', 'reject', 'event',):
            lambda: f"Вы отказались быть организатором в событие {project_or_event}",

        ('True', 'for participant', 'organizer', 'cancellation', 'project',):
            lambda: f"Вы отменили заявку организатором в проекте {project_or_event}",
        ('True', 'for participant', 'organizer', 'cancellation', 'event',):
            lambda: f"Вы отменили заявку организатором в событие {project_or_event}",

        # ----------------------------------------------------------------------------------
        # ----------------------------------------------------------------------------------
        # ----------------------------------------------------------------------------------

        ('False', 'for organizer', 'participant', 'consideration', 'project',):
            lambda: f"{sender_username} подал заявку на участие в проекте {project_or_event}",
        ('False', 'for organizer', 'participant', 'consideration', 'event',):
            lambda: f"{sender_username} подал заявку на участие в событие {project_or_event}",

        ('False', 'for organizer', 'participant', 'accept', 'project',):
            lambda: f"{sender_username} стал участником в проекте {project_or_event}",
        ('False', 'for organizer', 'participant', 'accept', 'event',):
            lambda: f"{sender_username} стал участником в событие {project_or_event}",

        ('False', 'for organizer', 'participant', 'reject', 'project',):
            lambda: f"{sender_username} отказался быть участником в проекте {project_or_event}",
        ('False', 'for organizer', 'participant', 'reject', 'event',):
            lambda: f"{sender_username} отказался быть участником в событие {project_or_event}",

        ('False', 'for organizer', 'participant', 'cancellation', 'project',):
            lambda: f"{sender_username} отменил заявку участником в проекте {project_or_event}",
        ('False', 'for organizer', 'participant', 'cancellation', 'event',):
            lambda: f"{sender_username} отменил заявку участником в событие {project_or_event}",

        # ---------------------------------------------------------------------------------

        ('False', 'for organizer', 'organizer', 'consideration', 'project',):
            lambda: f"{sender_username} подал заявку на организацию проекта {project_or_event}",
        ('False', 'for organizer', 'organizer', 'consideration', 'event',):
            lambda: f"{sender_username} подал заявку на организацию события {project_or_event}",

        ('False', 'for organizer', 'organizer', 'accept', 'project',):
            lambda: f"{sender_username} стал организатором в проекте {project_or_event}",
        ('False', 'for organizer', 'organizer', 'accept', 'event',):
            lambda: f"{sender_username} стал организатором в событие {project_or_event}",

        ('False', 'for organizer', 'organizer', 'reject', 'project',):
            lambda: f"{sender_username} отказался быть организатором в проекте {project_or_event}",
        ('False', 'for organizer', 'organizer', 'reject', 'event',):
            lambda: f"{sender_username} отказался быть организатором в событие {project_or_event}",

        ('False', 'for organizer', 'organizer', 'cancellation', 'project',):
            lambda: f"{sender_username} отменил заявку организатором в проекте {project_or_event}",
        ('False', 'for organizer', 'organizer', 'cancellation', 'event',):
            lambda: f"{sender_username} отменил заявку организатором в событие {project_or_event}",

        # ----------------------------------------------------------------------------------
        # ----------------------------------------------------------------------------------

        ('False', 'for participant', 'participant', 'consideration', 'project',):
            lambda: f"Вы подали заявку на участие в проект {project_or_event}",
        ('False', 'for participant', 'participant', 'consideration', 'event',):
            lambda: f"Вы подали заявку на участие в событие {project_or_event}",

        ('False', 'for participant', 'participant', 'accept', 'project',):
            lambda: f"Вы стали участником в проекте {project_or_event}",
        ('False', 'for participant', 'participant', 'accept', 'event',):
            lambda: f"Вы стали участником в событие {project_or_event}",

        ('False', 'for participant', 'participant', 'reject', 'project',):
            lambda: f"Вам отказали в участие в проекте {project_or_event}",
        ('False', 'for participant', 'participant', 'reject', 'event',):
            lambda: f"Вам отказали в участие в событие {project_or_event}",

        ('False', 'for participant', 'participant', 'cancellation', 'project',):
            lambda: f"Вы отменили заявку на участие в проекте {project_or_event}",
        ('False', 'for participant', 'participant', 'cancellation', 'event',):
            lambda: f"Вы отменили заявку на участие в событие {project_or_event}",

        # ---------------------------------------------------------------------------------

        ('False', 'for participant', 'organizer', 'consideration', 'project',):
            lambda: f"Вы подали заявку, чтобы стать организатором в проект {project_or_event}",
        ('False', 'for participant', 'organizer', 'consideration', 'event',):
            lambda: f"Вы подали заявку, чтобы стать организатором в событие {project_or_event}",

        ('False', 'for participant', 'organizer', 'accept', 'project',):
            lambda: f"Вы стали организатором в проекте {project_or_event}",
        ('False', 'for participant', 'organizer', 'accept', 'event',):
            lambda: f"Вы стали организатором в событие {project_or_event}",

        ('False', 'for participant', 'organizer', 'reject', 'project',):
            lambda: f"Вам отказали в организации проекта {project_or_event}",
        ('False', 'for participant', 'organizer', 'reject', 'event',):
            lambda: f"Вам отказали в организации события {project_or_event}",

        ('False', 'for participant', 'organizer', 'cancellation', 'project',):
            lambda: f"Вы отменили заявку на организацию проекта {project_or_event}",
        ('False', 'for participant', 'organizer', 'cancellation', 'event',):
            lambda: f"Вы отменили заявку на организацию события {project_or_event}",

        #уведомления, что пользователь окончательно подтвердил своё участие (формирование по другой логике)
        #--------------------------------------------------------------------------------------
        #--------------------------------------------------------------------------------------

        ('False', 'for organizer', 'participant', 'confirmed', 'event',):
            lambda: f"{sender_username} окончательно подтвердил участие в событие {project_or_event}",
        ('True', 'for organizer', 'participant', 'confirmed', 'event',):
            lambda: f"{recipient_username} окончательно подтвердил участие в событие {project_or_event}",
    }

    key = (f'{status.is_organizer_to_participant}', # от организатора к участнику
           recipient_type, # для кого уведомление, для участников или организаторов
           status.role, # стать организатором или участником
           status.status, # статус приглашения
           project_or_event_type, #ивент или проект
           )
    correct_message = messages.get(key, lambda: None)()
    print(correct_message)

    data = {
        'title': 'Приглашение',
        'recipient_type': recipient_type,
        'type_notification': 'invitation',
        'message': correct_message,
        'sender': status.sender_application.id,
        'recipient': recipient.id,
        'for_executor': {
        },
        'for_organizer': {
        }
    }
    return data


def reminder_notification(specific_event: EventSpecificDate, recipient_type: str, recipient) -> dict:
    data = {
        'title': 'Напоминание',
        'recipient_type': recipient_type,
        'type_notification': 'reminder',
        'message': f'Событие {specific_event} начнётся через {specific_event.event.project.reminder_delta} час',
        'recipient': recipient.id,
        'for_executor': {},
        'for_organizer': {},
    }
    return data


def sending_in_both_directions(status: StatusApplication):
    if status.status != 'confirmed':
        create_notification(type_notification = 'invitation', status = status, recipient_type='for participant', recipient=status.sender_application)

    for recipient in status.recipient_application.all():
        create_notification(type_notification = 'invitation', status=status, recipient_type='for organizer',
                                        recipient=recipient)


def sending_in_both_directions_event(specific_event: EventSpecificDate):
    for recipient in specific_event.organizers.all():
        create_notification(type_notification = 'reminder', specific_event=specific_event,
                            recipient_type='for organizer', recipient=recipient)
    for recipient in specific_event.participants.all():
        create_notification(type_notification='reminder', specific_event=specific_event,
                            recipient_type='for participant', recipient=recipient)


def create_notification(type_notification: str, role: str = None, sender: Profile = None,
                        recipient: Profile = None, recipient_type: str = None, status: StatusApplication = None,
                        specific_event: EventSpecificDate = None):

    if type_notification == 'invitation':
        data = invitation_notification(status=status, recipient_type=recipient_type, recipient=recipient)

    elif type_notification == 'new contact':
        data = adding_to_contacts(sender, recipient)
    elif type_notification == 'reminder':
        data = reminder_notification(specific_event=specific_event,
                                     recipient_type=recipient_type, recipient=recipient)
    elif type_notification == 'system':
        pass
    elif type_notification == 'other':
        pass

    serializer = NotificationSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    notification = serializer.save()
    print(f"Было успешно создано уведомление {notification}")

    if type_notification == 'invitation':
        if notification.recipient_type == 'for organizer':
            status.notification_for_organizer.add(notification.for_organizer)
        elif notification.recipient_type == 'for participant':
            status.notification_for_executor.add(notification.for_executor)

    if type_notification == 'reminder':
        try:
            status = StatusApplication.objects.filter(
                Q(recipient_application=recipient) | Q(sender_application=recipient),
                specific_event=specific_event,
            ).first()
            if not status:
                print("Не найдено статуса для данного события и участника")

            if not specific_event.event.project.is_need_confirmation:  # если не требуется подтверждение
                status.status = 'confirmed'
                status.save()

            if notification.recipient_type == 'for organizer':
                status.notification_for_organizer.add(notification.for_organizer)
            elif notification.recipient_type == 'for participant':
                status.notification_for_executor.add(notification.for_executor)
        except:
            print('Не получилось полностью создать уведомление напоминание')

    """Отмечаем прочитанным, если не совпадает с настройками уведомлений,
    Иначе отправляем уведомление в телегу"""
    if check_notification_settings(notification=notification):
        if recipient.telegram_chat_id:
            send_message_to_bot(message=notification.message, chat_id=recipient.telegram_chat_id)
    else:
        notification.is_read = True
        notification.save()
