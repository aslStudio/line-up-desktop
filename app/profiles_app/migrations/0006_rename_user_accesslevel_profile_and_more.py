# Generated by Django 5.1.2 on 2024-11-21 14:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles_app', '0005_alter_profile_photo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='accesslevel',
            old_name='user',
            new_name='profile',
        ),
        migrations.RenameField(
            model_name='personallinks',
            old_name='user',
            new_name='profile',
        ),
    ]
