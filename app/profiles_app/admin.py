from django.contrib import admin
from profiles_app.models import Profile, AccessLevel,  ProfileSettings, NotificationSettings

admin.site.register(Profile)

admin.site.register(AccessLevel)

admin.site.register(ProfileSettings)
admin.site.register(NotificationSettings)
