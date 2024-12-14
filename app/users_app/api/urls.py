from django.urls import include, path
from rest_framework import routers
from users_app.api import views
from users_app.api.views import UserMe

urlpatterns = [
    path('users/me/', UserMe.as_view(), name='me'),
]

