# Generated by Django 5.1.2 on 2024-11-16 14:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0005_remove_statusapplication_notifications_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notificationforexecutor',
            name='status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notification_for_executor', to='notifications.statusapplication'),
        ),
        migrations.AlterField(
            model_name='notificationfororganizer',
            name='status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notification_for_organizer', to='notifications.statusapplication'),
        ),
    ]
