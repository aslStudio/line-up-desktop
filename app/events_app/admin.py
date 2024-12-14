from django.contrib import admin
from events_app.models import Event, EventRecurring, EventSpecificDate, Subgroup, Color, EventPeriodicTask
from django import forms



admin.site.register(Event)
admin.site.register(EventRecurring)
admin.site.register(EventSpecificDate)
admin.site.register(Subgroup)
admin.site.register(Color)
admin.site.register(EventPeriodicTask)