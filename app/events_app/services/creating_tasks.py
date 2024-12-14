from datetime import timedelta

from django_celery_beat.models import ClockedSchedule, CrontabSchedule, IntervalSchedule

from events_app.models import Event, EventPeriodicTask, EventSpecificDate



def create_task_for_owner(event: Event) -> bool:
    """Создание задачи для вызова уведомления по времени
    о предстоящем событии для создателя"""
    try:
        if not event.reminder_delta:
            return False
        start_time = event.specific_date.filter(is_main=True).first().reminder_date
        if start_time:
            clocked_schedule, _ = ClockedSchedule.objects.get_or_create(clocked_time=start_time)
        else:
            return False

        recurring_type = event.recurring.recurring_type
        if recurring_type == 'one-time':
            EventPeriodicTask.objects.create(
                event_recurring = event.recurring,
                name=f'{event.id, event.name}',
                task='notifications.tasks.create_task_for_owner',
                one_off=True,
                clocked=clocked_schedule,
                args=[event.recurring.id],
            )
            return True
        elif recurring_type == 'monthly':
            crontab_schedule, created = CrontabSchedule.objects.get_or_create(
                day_of_month=start_time.day, hour=start_time.hour,
                minute=start_time.minute,)
        elif recurring_type == 'weekly':
            crontab_schedule, created = CrontabSchedule.objects.get_or_create(
                day_of_week=','.join(event.recurring.weekly_days_array),
                hour=start_time.hour, minute=start_time.minute,)
        elif recurring_type == 'two-weekly':
            interval_schedule, _ = IntervalSchedule.objects.get_or_create(
                every=2, period='weeks'
            )
            EventPeriodicTask.objects.create(
                interval=interval_schedule,
                start_time=start_time,
                event_recurring=event.recurring,
                name=f'{event.id}, {event.name}',
                task='notifications.tasks.create_task_for_owner',
                args=[event.recurring.id],
            )
            return True
        elif recurring_type == 'yearly':
            crontab_schedule, created = CrontabSchedule.objects.get_or_create(
                month_of_year=start_time.month, day_of_month=start_time.day,
                hour=start_time.hour, minute=start_time.minute,)
        elif recurring_type == 'daily':
            crontab_schedule, created = CrontabSchedule.objects.get_or_create(
                day_of_month='*', hour=start_time.hour,
                minute=start_time.minute,)
        elif recurring_type == 'custom':
            for new_date in event.recurring.custom_period_array:
                start_time.replace(year=new_date.year, month=new_date.month, day=new_date.day)
                EventPeriodicTask.objects.create(
                    event_recurring=event.recurring,
                    name=f'{event.id, event.name}',
                    task='notifications.tasks.create_task_for_owner',
                    one_off=True,
                    clocked=clocked_schedule,
                    args=[event.recurring.id],
                )
                return True
        else:
            print(f"такого recurring_type = {recurring_type} не нашлось")

        EventPeriodicTask.objects.create(
            crontab=crontab_schedule,
            start_time=start_time,
            event_recurring=event.recurring,
            name=f'{event.id, event.name}',
            task='notifications.tasks.create_task_for_owner',
            args=[event.recurring.id],
        )

        return True
    except Exception as e:
        print(f'Временные таски для ивента для владельца {event} не создались по причине {e}')
        return False


def create_task_for_organizers_participants(specific_event: EventSpecificDate) -> bool:
    """Создание задачи для вызова уведомления по времени
    о предстоящем событии для организаторов и участников"""

    try:
        if not specific_event.event.project.reminder_delta:
            return False
        start_time = specific_event.start_date - timedelta(hours=specific_event.event.project.reminder_delta)
        if start_time:
            clocked_schedule, _ = ClockedSchedule.objects.get_or_create(clocked_time=start_time)
        else:
            return False

        EventPeriodicTask.objects.create(
            event_specific = specific_event,
            name=f'{specific_event.id, specific_event}',
            task='notifications.tasks.create_task_for_organizers_participants',
            one_off=True,
            clocked=clocked_schedule,
            args=[specific_event.id],
        )
        return True

    except Exception as e:
        print(f'Временные таски для ивента для организаторов и участников {specific_event} не создались по причине {e}')
        return False
