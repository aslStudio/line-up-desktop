import hashlib
import uuid

from django.db import models
from yaml import serialize

from common.models import TimeBasedModel
import base64
from profiles_app.models import Profile



class LimitedLink(TimeBasedModel):
    def __str__(self):
        return f'{self.type} {self.resource_id} ({self.current_clicks}/{self.max_clicks})'

    TYPE_LINK = [
        ('contact', 'Добавление в контакты'),
        ('event', 'Cсылка в событие'),
        ('project', 'Cсылка в проект'),
    ]
    TYPE_ROLE = [
        ('organizer', 'Пригласить организатором'),
        ('participant', 'Пригласить участником')
    ]

    profile = models.ForeignKey('profiles_app.Profile', related_name='invites', on_delete=models.CASCADE, null=True,
                                blank=True)
    short_encrypted_id = models.TextField(unique=True)
    max_clicks = models.PositiveIntegerField(default=0)
    current_clicks = models.PositiveIntegerField(default=0)
    type = models.CharField(max_length=20, choices=TYPE_LINK, default='contact')
    role = models.CharField(max_length=20, choices=TYPE_ROLE, default='participant', null=True, blank=True)
    resource_id = models.PositiveIntegerField(null=False, blank=False)