from rest_framework import routers
from django.urls import path, include

from custom_links_app.api import views
from custom_links_app.api.views import CreateLimitedLinkAPIView, TrackClickAPIView



router = routers.DefaultRouter()
router.register(r'test_link', views.LinkTestViewSet, basename='test_link')

urlpatterns = [
    path('create-link/', CreateLimitedLinkAPIView.as_view(), name='create_link'),
    path('track-click/<str:short_encrypted_id>/', TrackClickAPIView.as_view(), name='track_click'),
    path('', include(router.urls)),
]

