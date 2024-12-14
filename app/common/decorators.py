import functools
from rest_framework.exceptions import PermissionDenied
from profiles_app.models import Profile



def check_auth_and_get_profile(func):
    @functools.wraps(func)
    def wrapper(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            try:
                profile = Profile.objects.get(user=user)
                request.profile = profile
                return func(self, request, *args, **kwargs)
            except Profile.DoesNotExist:
                raise PermissionDenied(detail="Профиль пользователя не найден.")
        else:
            raise PermissionDenied(detail="Необходимо быть аутентифицированным пользователем.")

    return wrapper