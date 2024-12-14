from datetime import datetime, timedelta

from django.db.models import Q
import pytz

from common.utils import and_search_filter, and_search
from event_organizer import settings
from events_app.models import EventSpecificDate, Event
from events_app.services.creating_repeats import calculate_occurrence
from profiles_app.models import Profile


def check_specific_date(event, start_date):
    return True
    # if bool(calculate_occurrence(event, start_range=start_date, end_range=start_date)):
    #     return True
    # else:
    #     return False


def search_specific_event(data: dict, profile: Profile) -> list:
    """Проверяем есть ли в запросе даты начала
    и конца периода в которых должны оказаться события"""

    data_filter = Q()
    if data.get('start_date') and data.get('end_date'):
        timezone = pytz.timezone(settings.TIME_ZONE)
        range_start_date = timezone.localize(
            datetime.strptime(data.get('start_date'), '%Y-%m-%d'))
        range_end_date = timezone.localize(
            datetime.strptime(data.get('end_date'), '%Y-%m-%d'))

        data_filter = Q(
                Q(start_date__range=(range_start_date, range_end_date + timedelta(days=1)),
                  event__is_owl_mode=True) |
                Q(start_date__range=(range_start_date, range_end_date)) |
                Q(end_date__range=(range_start_date, range_end_date + timedelta(days=1))) |
                Q(end_date__range=(range_start_date, range_end_date + timedelta(days=1)), event__is_owl_mode=True)
        )
    # else:
    #     return

    if data.get('participants') or data.get('organizers') or data.get('is_selected'):
        """Если указаны участники, организаторы или выбран поиск по избранным,
        это означает, что событие на данную дату не является 'виртуальным', 
        а точно создано, следовательно мы ищем его просто по бд"""

        value_requests = ['name', 'participants', 'organizers', 'subgroups', 'color', 'project'
                          'is_selected']
        value_db = ['event__name', 'participants__user__username',
                    'organizers__user__username',
                    'event__subgroups__name', 'event__color__name',
                    'event__project__name']

        filter = and_search_filter(data, value_requests, value_db)
        filter &= data_filter

        if data.get('is_selected') == 'true':
            queryset = profile.selected_events.filter(filter)
        else:
            queryset = EventSpecificDate.objects.filter(filter)

        return queryset

    elif range_start_date and range_end_date:
        """Если ищем все ивенты по датам, и участники, организаторы, избранные нам не важны.
        Тогда ищем и уже созданные и 'виртуальные' события"""
        value_requests = ['name', 'participants', 'organizers', 'subgroups', 'color', 'project']
        value_db = ['name', 'specific_date__participants__user__username',
                    'specific_date__organizers__user__username',
                    'subgroups__name', 'color__name',
                    'project__name']

        queryset = and_search(Event, data, value_requests, value_db)

        events_specific_date = []
        for event in queryset:
            events_specific_date += calculate_occurrence(event, range_start_date, range_end_date)

        return events_specific_date

    else:
        return []
