from django.conf import Settings
from django.dispatch import receiver
from djoser.signals import user_registered

from profiles_app.models import Profile, ProfileSettings, NotificationSettings


@receiver(user_registered, dispatch_uid="create_profile")
def create_profile(sender, user, request, **kwargs):
    """Создаём профиль пользователя при регистрации"""
    data = request.data

    profile = Profile.objects.create(
        user=user,
        name=data.get("name", ""),
        surname=data.get("surname", "")
    )
    settings = ProfileSettings.objects.create(
        profile=profile,
    )
    notifications_settings = NotificationSettings.objects.create(
        settings=settings,
    )


