from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Notification, NotificationForOrganizer, NotificationForExecutor, StatusApplication
# from .models import AllNotifications

# admin.site.register(AllNotifications)
admin.site.register(Notification)
admin.site.register(NotificationForOrganizer)
admin.site.register(NotificationForExecutor)
admin.site.register(StatusApplication)
