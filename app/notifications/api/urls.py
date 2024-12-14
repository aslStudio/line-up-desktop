from django.urls import include, path
from rest_framework import routers
from notifications.api import views

router = routers.DefaultRouter()
router.register(r'notification', views.NotificationViewSet, basename='notification')
router.register(r'status', views.StatusApplicationViewSet, basename='status')
router.register(r'test_notification', views.TestNotificationViewSet, basename='test_notification')


urlpatterns = [
    path('', include(router.urls)),
]

