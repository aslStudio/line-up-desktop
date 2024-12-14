from django.urls import include, path
from rest_framework import routers
from profiles_app.api import views
from profiles_app.api.views import ProfileSettingsAPIView

# from .views import NotificationSettingsViewSet, ProfileSettingsView


router = routers.DefaultRouter()
router.register(r'profiles', views.ProfileViewSet, basename='profiles')
# router.register(r'profiles/(?P<profile_pk>\d+)/profile-settings', views.ProfileSettingsAPIView, basename='profile-settings')
# router.register(r'profiles/settings', views.ProfileSettingsViewSet, basename='profiles/settings')
# router.register(r'profiles/settings/notifications', views.NotificationSettingsViewSet, basename='profiles/settings/notifications')


urlpatterns = [
    path('', include(router.urls)),
    path(
        'profiles/<int:profile_id>/profile-settings/',
        ProfileSettingsAPIView.as_view(),
        name='profile-settings'
    ),
]

