from django.db import models
from common.models import TimeBasedModel



class Project(TimeBasedModel):
    def __str__(self):
        return self.name

    name = models.CharField(max_length=100, blank=False) # название
    link = models.URLField(max_length=500, blank=True, null=True) # Ссылка
    access = models.CharField(max_length=20, choices=[ # Доступ. Единичный выбор: - для всех;- только я.
        ('all', 'For all'),
        ('me', 'Only me')
    ], default='all', blank=False)
    reminder_delta = models.IntegerField(blank=True, null=True) #  Напоминание о событиях - чекбокс, (в интовых секундах)
    comment = models.TextField(blank=True, max_length=100) # Комментарий
    # personal_note = models.TextField(blank=True, max_length=100) # Личная заметка

    owner = models.ForeignKey('profiles_app.Profile', related_name='project_owner', on_delete=models.CASCADE, null=True, blank=True) #создатель проекта
    organizers = models.ManyToManyField('profiles_app.Profile', related_name='project_organizers', blank=True) # Добавить организаторов события - карточки пользователей из контактов. (не более двух, проверка в сериалаизере)
    participants = models.ManyToManyField('profiles_app.Profile', related_name='project_participants', blank=True) # Добавить участников событий - карточки исполнителей.

    is_need_confirmation = models.BooleanField(default=False)


class PersonalNote(TimeBasedModel):
    def __str__(self):
        if self.project:
            return f'Заметка {self.profile.user.username} для {self.project.name}'
        elif self.specific_event:
            return f'Заметка {self.profile.user.username} для {self.specific_event}'

    profile = models.ForeignKey('profiles_app.Profile', related_name='personal_note', on_delete=models.CASCADE)
    project = models.ForeignKey('Project', related_name='personal_note', on_delete=models.CASCADE, null=True, blank=True)
    specific_event = models.ForeignKey('events_app.EventSpecificDate', related_name='personal_note', on_delete=models.CASCADE, null=True, blank=True)
    note = models.TextField(blank=True, max_length=100)