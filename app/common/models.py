from django.db import models
from django.utils.timezone import now



class TimeBasedModel(models.Model):
    createdAt = models.DateTimeField(
        verbose_name="Дата добавления в базу", default=now
    )
    updatedAt = models.DateTimeField(
        verbose_name="Дата изменения в базе", default=now
    )

    class Meta:
        abstract = True