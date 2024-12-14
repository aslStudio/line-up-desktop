# Generated by Django 5.1.2 on 2024-11-18 20:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_links_app', '0001_initial'),
        ('profiles_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='limitedlink',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='limited_links', to='profiles_app.profile'),
        ),
    ]
