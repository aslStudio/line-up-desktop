from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.core.validators import EmailValidator
from django.db import models
from django.conf import settings

from common.models import TimeBasedModel



class Profile(TimeBasedModel):
    def __str__(self):
        return f"{self.name} {self.surname} ({self.user.username})"

    SAFETY_CHOICES = [
        ('open', 'Открытый профиль'),
        ('partial', 'Частичная информация'),
        ('closed', 'Закрытый профиль')
    ]

    user = models.OneToOneField(
        get_user_model(), on_delete=models.CASCADE
    )
    name = models.CharField("name", max_length=50)
    surname = models.CharField("surname", max_length=50, null=True, blank=True)
    safety = models.CharField(max_length=20, choices=SAFETY_CHOICES, default='open') # уровень закрытости аккаунта
    photo = models.URLField(max_length=200, null=True, blank=True) # фото ссылкой
    telegram = models.CharField(max_length=30, verbose_name='Телеграм', blank=True, null=True) # телеграм
    telegram_chat_id = models.CharField(max_length=30, null=True, blank=True) # id чат телеграм бота
    info = models.TextField(max_length=300, verbose_name='Информация о себе', blank=True) # инфа о себе
    email = models.EmailField(validators=[EmailValidator(message='Введите корректный адрес электронной почты')], verbose_name='Почта', blank=True) # почта
    personal_link = models.URLField(max_length=200, verbose_name='Моя ссылка', blank=True) # личная ссылка формируется автоматически
    personal_links = ArrayField(models.URLField(), size=5, null=True, blank=True)

    contacts = models.ManyToManyField('self', related_name='in_contacts', symmetrical=False, blank=True)
    blocked_contacts = models.ManyToManyField('self', related_name='in_blocked_contacts', symmetrical=False, blank=True)

    selected_events = models.ManyToManyField('events_app.EventSpecificDate', related_name='selected_events', blank=True)


class AccessLevel(TimeBasedModel):
    def __str__(self):
            return self.name

    profile = models.ForeignKey('Profile', related_name='access_level', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, verbose_name='Имя')  # название уровня доступа


class ProfileSettings(TimeBasedModel):
    def __str__(self):
        return f'настройки для ({self.profile.user.username})'

    profile = models.OneToOneField('Profile', related_name='settings', on_delete=models.CASCADE)
    is_dark_mode = models.BooleanField(default=True)
    is_search_by_nickname = models.BooleanField(default=False)
    is_warning_about_upcoming_events = models.BooleanField(default=False)

    is_name = models.BooleanField(default=False)
    is_about_me = models.BooleanField(default=False)
    is_phone = models.BooleanField(default=False)
    is_link_to_telegram = models.BooleanField(default=False)
    is_email = models.BooleanField(default=False)


class NotificationSettings(TimeBasedModel):
    def __str__(self):
        return f'настройки уведомлений для ({self.settings.profile.user.username})'

    settings = models.OneToOneField('ProfileSettings', related_name='notification_settings', on_delete=models.CASCADE)

    # general
    is_from_app = models.BooleanField(default=True)
    is_reminder_about_event = models.BooleanField(default=True)
    is_user_confirmed_event = models.BooleanField(default=True)

    # for schedule
    is_invite_to_schedule = models.BooleanField(default=True)
    is_invite_to_event = models.BooleanField(default=True)
    is_change_in_event = models.BooleanField(default=True)
    is_cancellation_event = models.BooleanField(default=True)
    is_new_open_event = models.BooleanField(default=True)

    # for project
    is_new_application = models.BooleanField(default=True)
    is_project_change_in_event = models.BooleanField(default=True)
    is_user_refused_to_participate = models.BooleanField(default=True)
    is_user_left_project = models.BooleanField(default=True)
    is_user_joined_project = models.BooleanField(default=True)

