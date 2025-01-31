# Generated by Django 5.1.2 on 2024-11-25 08:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events_app', '0008_remove_eventspecificdate_personal_note'),
        ('projects_app', '0003_personalnote_note'),
    ]

    operations = [
        migrations.AddField(
            model_name='personalnote',
            name='specific_event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='personal_note', to='events_app.eventspecificdate'),
        ),
        migrations.AlterField(
            model_name='personalnote',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='personal_note', to='projects_app.project'),
        ),
    ]
