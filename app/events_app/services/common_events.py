from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned



def find_event_specific_date(event, start_date):
    try:
        event_specific_date = event.specific_date.get(event=event, start_date=start_date) #может не нужен ивент внутри
        if event_specific_date:
            return event_specific_date
    except ObjectDoesNotExist:
        return None
    except MultipleObjectsReturned:
        print(f"В базе находятся два одинаковых ивента {event.name} на одну дату {start_date}")
        event_specific_date = event.specific_date.filter(event=event, start_date=start_date).first()
        return event_specific_date


def find_main_event_specific_date(event):
    try:
        event_specific_date = event.specific_date.get(event=event, is_main=True) #может не нужен ивент внутри
        if event_specific_date:
            return event_specific_date
    except ObjectDoesNotExist:
        return None
    except MultipleObjectsReturned:
        print(f"В базе находятся два главных модели с датой для {event.name}")
        event_specific_date = event.specific_date.filter(event=event, is_main=True).first()
        return event_specific_date