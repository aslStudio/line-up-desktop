# Generated by Django 5.1.2 on 2024-11-17 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0009_alter_statusapplication_recipient_application'),
        ('profiles_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='statusapplication',
            name='recipient_application',
            field=models.ManyToManyField(blank=True, related_name='recipient_application', to='profiles_app.profile'),
        ),
    ]
