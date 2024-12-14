from django.urls import include, path
from rest_framework import routers
from projects_app.api import views

router = routers.DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='projects')
router.register(r'personal-note', views.PersonalNoteViewSet, basename='personal-note')



urlpatterns = [
    path('', include(router.urls)),
]

