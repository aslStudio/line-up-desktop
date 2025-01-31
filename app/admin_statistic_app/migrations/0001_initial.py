# Generated by Django 5.1.2 on 2024-11-27 22:00

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StatisticNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('createdAt', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата добавления в базу')),
                ('updatedAt', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата изменения в базе')),
                ('project_project', models.IntegerField(default=0, verbose_name='Поиск по проекту в проекте')),
                ('project_subgroup', models.IntegerField(default=0, verbose_name='Поиск по подгруппе в проекте')),
                ('schedule_project', models.IntegerField(default=0, verbose_name='Поиск по проекту в расписании')),
                ('schedule_subgroup', models.IntegerField(default=0, verbose_name='Поиск по подгруппе в расписании')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AllStatistic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('createdAt', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата добавления в базу')),
                ('updatedAt', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата изменения в базе')),
                ('name', models.CharField(max_length=255)),
                ('notification_filter', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='statistic', to='admin_statistic_app.statisticnotification')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
