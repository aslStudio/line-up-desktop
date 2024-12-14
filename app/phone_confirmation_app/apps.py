from django.apps import AppConfig


class ProfilesAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'phone_confirmation_app'

    def ready(self):
        from phone_confirmation_app import signals