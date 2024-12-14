from celery import Celery
import os
# from event_organizer import settings



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'event_organizer.settings')

app = Celery('event_organizer')

app.config_from_object('django.conf:settings',  namespace='CELERY')

app.autodiscover_tasks()