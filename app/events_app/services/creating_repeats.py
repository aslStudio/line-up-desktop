from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from events_app.services.common_events import find_event_specific_date, find_main_event_specific_date



def calculate_occurrence(event, start_range: datetime, end_range: datetime):
    if event.recurring.recurring_type == 'one-time':
        specific_event = find_main_event_specific_date(event=event)
        if specific_event.start_date >= end_range or specific_event.end_date <= start_range:
            return []
        return [specific_event]
    if event.recurring:
        return get_recurring_event_for_range(event, start_range, end_range)
    print(f"Нет расписания для события {event.name}")
    return []


def get_recurring_event_for_range(event, start_range: datetime, end_range: datetime):
    recurring = event.recurring

    main_event_specific_date = find_main_event_specific_date(event=event)
    if main_event_specific_date is None:
        print(f"В базе нет главного события с датой для {event.name}")
        return []

    start_date = main_event_specific_date.start_date
    end_date = main_event_specific_date.end_date

    if event.is_owl_mode: # если включен режим совы
        start_range = start_date - timedelta(days=1)
        end_range = end_date + timedelta(days=1)

    if start_date > end_range: #если событие начинается позже, чем нужный нам диапазон
        return []
    if recurring.recurring_end is None: #если повтор события бесконечен
        if start_date > end_range:
            return []
        recurring_end = end_range
    else:
        recurring_end = recurring.recurring_end
    if recurring_end < start_range or start_date > end_range:
        return []

    events_dates_in_range = []

    current_date = start_date
    duration = end_date - start_date


    while current_date <= end_range and current_date <= recurring_end:
        if (start_range <= current_date <= end_range and
                (current_date not in recurring.excluded_days_array) if recurring.excluded_days_array is not None else True):
            events_dates_in_range.append(get_modified_event_with_recurring(
                event, main_event_specific_date, current_date, current_date + duration
            ))

        if recurring.recurring_type == 'yearly':
            current_date = calculate_yearly(current_date)
        elif recurring.recurring_type == 'monthly':
            current_date = calculate_monthly(current_date)
        elif recurring.recurring_type == 'weekly':
            current_date = calculate_weekly(current_date, recurring.weekly_days_array)
        elif recurring.recurring_type == 'two-weekly':
            current_date = calculate_two_weekly(current_date, recurring.weekly_days_array)
        elif recurring.recurring_type == 'daily':
            current_date = calculate_daily(current_date)
        elif recurring.recurring_type == 'custom':
            current_date = calculate_custom(current_date, recurring.custom_period_array)
            if current_date is None:
                break

    return events_dates_in_range


def calculate_yearly(current_date: datetime) -> datetime:
    return current_date + relativedelta(years=+1)


def calculate_monthly(current_date: datetime) -> datetime:
    return current_date + relativedelta(months=+1)


def calculate_weekly(current_date: datetime, week_days: list) -> datetime:
    dif = None
    for day in week_days:
        if current_date.weekday() < day:
            dif = day - current_date.weekday()
            break
    if dif is None:
        dif = 7 - current_date.weekday() + week_days[0]
    return current_date + timedelta(days=dif)


def calculate_two_weekly(current_date: datetime, week_days: list) -> datetime:
    dif = None
    for day in week_days:
        if current_date.weekday() < day:
            dif = day - current_date.weekday()
            break
    if dif is None:
        dif = 14 - current_date.weekday() + week_days[0]
    return current_date + timedelta(days=dif)


def calculate_daily(current_date: datetime) -> datetime:
    return current_date + timedelta(days=1)


def calculate_custom(current_date: datetime, dates: list) -> datetime:
    return next((date for date in dates if date > current_date), None)


def get_modified_event_with_recurring(event, main_event_specific_date, new_start_date=None, new_end_date=None):
    event_specific_date = find_event_specific_date(event, new_start_date)

    if event_specific_date is None:
        start_date, end_date = '', ''
        if new_start_date is not None:
            start_date = new_start_date
        if new_end_date is not None:
            end_date = new_end_date

        event_specific_date = {
            'event': event,
            'start_date': start_date,
            'end_date': end_date,
            'payment': main_event_specific_date.payment,
            'personal_note': main_event_specific_date.personal_note,
            'reminder_date': main_event_specific_date.start_date,
        }

    return event_specific_date
