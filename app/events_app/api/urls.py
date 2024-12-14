from django.urls import include, path
from rest_framework import routers

from events_app.api import views



router = routers.DefaultRouter()
router.register(r'whole_events', views.WholeEventViewSet, basename='whole_events')
router.register(r'specific_events', views.EventSpecificDateViewSet, basename='specific_events')
router.register(r'subgroups', views.SubgroupViewSet, basename='subgroups')
router.register(r'color', views.ColorViewSet, basename='color')



urlpatterns = [
    path('', include(router.urls)),
]

