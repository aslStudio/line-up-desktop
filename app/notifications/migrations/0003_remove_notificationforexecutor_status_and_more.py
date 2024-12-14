# Generated by Django 5.1.2 on 2024-11-16 10:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_delete_notificationnewcontact'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notificationforexecutor',
            name='status',
        ),
        migrations.RemoveField(
            model_name='notificationfororganizer',
            name='status',
        ),
        migrations.AddField(
            model_name='statusapplication',
            name='notifications',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='status', to='notifications.notification'),
        ),
    ]
