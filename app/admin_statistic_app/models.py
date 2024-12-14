from django.db.models import JSONField

from common.models import TimeBasedModel
from django.db import models



class AllStatistic(TimeBasedModel): # база
    def __str__(self):
        return self.name

    name = models.CharField(max_length=255)
    # notification_filters = JSONField(default=dict, null=True, blank=True)
    notification_filter = models.OneToOneField('StatisticNotification', related_name='statistic', on_delete=models.CASCADE)


class StatisticNotification(TimeBasedModel):
    def __str__(self):
        return f'Как часто применяются фильтры к уведомлениям'

    project_project = models.IntegerField(verbose_name='Поиск по проекту в проекте', default=0)
    project_subgroup = models.IntegerField(verbose_name='Поиск по подгруппе в проекте', default=0)
    schedule_project = models.IntegerField(verbose_name='Поиск по проекту в расписании', default=0)
    schedule_subgroup = models.IntegerField(verbose_name='Поиск по подгруппе в расписании', default=0)