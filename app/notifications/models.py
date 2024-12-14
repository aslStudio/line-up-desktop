from django.contrib.auth import get_user_model
from django.db import models
from common.models import TimeBasedModel
from events_app.models import Event, EventSpecificDate
from projects_app.models import Project



class Notification(TimeBasedModel): # база
    def __str__(self):
        return self.title

    RECIPIENT_TYPE = [
        ('for organizer', 'Для организатор'),
        ('for participant', 'Для участника'),
        ('for anyone', 'Для любого')
    ]

    TYPE_NOTIFICATION = [
        ('new contact', 'Вас добавили в контакт'),
        ('invitation', 'Приглашение'),
        ('cancellation', 'Отмена'),
        ('reminder', 'Напоминание'),
        ('system', 'От системы'),
        ('other', 'Другие'),
    ]

    title = models.CharField(max_length=100, blank=False)
    recipient_type = models.CharField(max_length=20, choices=RECIPIENT_TYPE, default='for anyone')
    type_notification = models.CharField(max_length=20, choices=TYPE_NOTIFICATION, default='system')
    message = models.TextField(max_length=100, blank=True)

    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    """в случае если отправителем будет система, в отправителя будем ставить в дальнейшем админов
    и им как раз будут прилетать логи"""
    sender = models.ForeignKey('profiles_app.Profile', related_name='sender', on_delete=models.CASCADE, null=True, blank=True)
    recipient = models.ForeignKey('profiles_app.Profile', related_name='recipient', on_delete=models.CASCADE, null=True, blank=True)


class NotificationForOrganizer(TimeBasedModel):
    notification = models.OneToOneField(Notification, related_name='for_organizer', on_delete=models.CASCADE)
    status = models.ForeignKey('StatusApplication', related_name='notification_for_organizer', on_delete=models.CASCADE, null=True, blank=True)


class NotificationForExecutor(TimeBasedModel):
    notification = models.OneToOneField(Notification, related_name='for_executor', on_delete=models.CASCADE)
    status = models.ForeignKey('StatusApplication', related_name='notification_for_executor', on_delete=models.CASCADE, null=True, blank=True)


class StatusApplication(TimeBasedModel):
    TYPE_STATUS = [
        ('accept', 'Заявка принята'),
        ('reject', 'Заявка отклонена'),
        ('confirmed', 'Заявка подтверждена'),
        ('consideration', 'Заявка на рассмотрении'),
        ('cancellation', 'Отмена заявки'),
        ('delete', '... удалено')
    ]
    TYPE_ROLE = [
        ('organizer', 'Стать\Пригласить организатором'),
        ('participant', 'Стать\Пригласить участником'),
    ]

    status = models.CharField(max_length=20, choices=TYPE_STATUS, default='consideration')
    role = models.CharField(max_length=20, choices=TYPE_ROLE, default='organizer')
    project = models.ForeignKey(Project, related_name='status_application', on_delete=models.SET_NULL, null=True, blank=True)
    specific_event = models.ForeignKey(EventSpecificDate, related_name='status_application', on_delete=models.SET_NULL, null=True, blank=True)

    is_organizer_to_participant = models.BooleanField(default=False)  # шоб понимать от кого заявка от организатора или от обычного юзера

    sender_application = models.ForeignKey('profiles_app.Profile', related_name='sender_application', on_delete=models.CASCADE, null=True, blank=True)
    # recipient_application = models.ForeignKey('profiles_app.Profile', related_name='recipient_application', on_delete=models.CASCADE, null=True, blank=True)
    recipient_application = models.ManyToManyField('profiles_app.Profile', related_name='recipient_application', blank=True)

    __original_status = None
    def __init__(self, *args, **kwargs):
        super(StatusApplication, self).__init__(*args, **kwargs)
        self.__original_mode = self.status