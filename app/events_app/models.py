from datetime import timedelta

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django_celery_beat.models import PeriodicTask

from common.models import TimeBasedModel



class Event(TimeBasedModel):
    def __str__(self):
        return self.name

    is_personal = models.BooleanField(default=False) # личное ли событие
    name = models.CharField(max_length=200, blank=False)  # название
    project = models.ForeignKey('projects_app.Project', related_name='events', on_delete=models.SET_NULL, null=True, blank=True)  # Проект - выбор из существующих, отсутствует у личных
    photo = models.URLField(max_length=200, null=True, blank=True)  # фото ссылкой
    subgroups = models.ManyToManyField('Subgroup', related_name='events', blank=True)  # Подгруппа - ввод текста
    color = models.ForeignKey('Color', related_name='events', on_delete=models.CASCADE, null=True, blank=True)  # Цвет
    event_type = models.TextField(max_length=300, blank=True)  # О событие
    is_owl_mode = models.BooleanField(default=False)  # Режим сова

    address = models.TextField(blank=True)  # Адрес - ввод текста
    is_open = models.BooleanField(default=False)  # Сделать событие открытым - чекбокс.
    comment = models.CharField(max_length=100, blank=True)  # Комментарий - ввод текста.
    # is_reminder = models.BooleanField(default=False)  # Напоминание - чекбокс
    reminder_delta = models.IntegerField(null=True, blank=True)

    owner = models.ForeignKey('profiles_app.Profile', related_name='event_owner',
                              on_delete=models.CASCADE, null=True, blank=True) #создатель события


class EventRecurring(TimeBasedModel):
    def __str__(self):
        return f"{self.event} - {self.get_recurring_type_display()}"

    RECURRING_TYPE_CHOICES = [
        ('one-time', 'Единоразово'),
        ('monthly', 'Ежемесячно'),
        ('weekly', 'Еженедельно'),
        ('two-weekly', 'Двухнедельный режим'),
        ('yearly', 'Раз в год'),
        ('daily', 'Раз в день'),
        ('custom', 'Настраиваемый'),
    ]

    event = models.OneToOneField('Event', related_name='recurring', on_delete=models.CASCADE)
    recurring_type = models.CharField(max_length=10, choices=RECURRING_TYPE_CHOICES) # тип повтора
    recurring_end = models.DateTimeField(null=True, blank=True) # конец повтора
    monthly_day = models.PositiveIntegerField(null=True, blank=True)
    weekly_days_array = ArrayField(models.IntegerField(), null=True, blank=True)
    yearly_interval = models.IntegerField(null=True, blank=True)
    custom_period_array = ArrayField(models.DateTimeField(), blank=True, null=True)

    excluded_days_array = ArrayField(models.DateTimeField(), blank=True, null=True)#дни исключения, которые удалили из расписания


class EventSpecificDate(TimeBasedModel):
    def __str__(self):
        return f'{self.event.name} на {self.start_date}'

    def save(self, *args, **kwargs):
        if self.event and self.event.reminder_delta:
            self.reminder_date = self.start_date - timedelta(hours=self.event.reminder_delta)
        super().save(*args, **kwargs)

    event = models.ForeignKey('Event', related_name='specific_date', on_delete=models.CASCADE)
    is_main = models.BooleanField(default=False) # первый и главный ли это ивент с датой
    start_date = models.DateTimeField()  # Дата начала
    end_date = models.DateTimeField()  # Дата окончания
    payment = models.IntegerField()  # Оплата - интовое число
    reminder_date = models.DateTimeField(null=True, blank=True) # подтягивается автоматически из времени ивента минус напоминание (это поле для владельца)
    organizers = models.ManyToManyField('profiles_app.Profile', related_name='event_organizers', blank=True)  # Добавить организаторов события - карточки пользователей из контактов.
    participants = models.ManyToManyField('profiles_app.Profile', related_name='event_participants', blank=True)  # Добавить участников событий - карточки исполнителей.


class Subgroup(TimeBasedModel):
    def __str__(self):
        return self.name

    name = models.CharField(max_length=50, blank=False)


class Color(TimeBasedModel):
    def __str__(self):
        return self.name

    name = models.CharField(max_length=50, blank=False)


class EventPeriodicTask(PeriodicTask):
    event_recurring = models.OneToOneField('EventRecurring', on_delete=models.CASCADE, related_name='periodic_task', null=True, blank=True)
    event_specific = models.OneToOneField('EventSpecificDate', on_delete=models.CASCADE, related_name='specific_task', null=True, blank=True)

