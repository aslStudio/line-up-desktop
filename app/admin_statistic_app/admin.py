from itertools import count

from django.db.models import Count, Avg, Sum
from django.db.models import Q
from django.contrib import admin
import projects_app
from events_app.models import Event
from profiles_app.models import Profile, ProfileSettings, NotificationSettings
from projects_app.models import Project, PersonalNote
from .models import AllStatistic, StatisticNotification


class AllStatisticAdmin(admin.ModelAdmin):
    readonly_fields = ('analytics_data', 'create_personal_event', 'create_general_event',
                       'use_owl_mode', 'create_personal_note', 'create_comment',
                       'event_with_photo', 'event_with_recurring', 'event_with_subgroups',
                       'create_project',
                       'disabled_notifications', 'how_use_filter_notifications',
                       'profile_settings',
                       'average_personal_links', 'often_search', 'average_count_contacts')

    def analytics_data(self, obj):
        count = Project.objects.count()
        return f"Вот стока {count}"

    def create_personal_event(self, obj):
        name = 'Создание события личного'
        count = Event.objects.filter(is_personal=True).count()
        created_at = Event.objects.filter(is_personal=True).latest('id').createdAt
        return f"{name}, {count}, {created_at}"

    def create_general_event(self, obj):
        name = 'Создание события общего'
        count = Event.objects.count()
        created_at = Event.objects.last().createdAt
        return f"{name}, {count}, {created_at}"

    def use_owl_mode(self, obj):
        name = 'Использование режима совы'
        count = Event.objects.filter(is_owl_mode=True).count()
        created_at = Event.objects.filter(is_owl_mode=True).latest('id').createdAt
        return f"{name}, {count}, {created_at}"

    def create_personal_note(self, obj):
        name = 'Создание персональной заметки'
        count = PersonalNote.objects.count()
        created_at = PersonalNote.objects.last().createdAt
        return f"{name}, {count}, {created_at}"

    def create_comment(self, obj):
        name = 'Создание комментария'
        count = Event.objects.filter(comment__isnull=False).count()
        created_at = Event.objects.filter(comment__isnull=False).latest('id').createdAt
        return f"{name}, {count}, {created_at}"

    def event_with_photo(self, obj):
        name = 'Добавление фото к событиям'
        count = Event.objects.filter(photo__isnull=False).count()
        created_at = Event.objects.filter(photo__isnull=False).latest('id').createdAt
        return f"{name}, {count}, {created_at}"

    def event_with_recurring(self, obj):
        name = 'Создание повторений'
        count = Event.objects.exclude(recurring__recurring_type__exact='one-time').count()
        created_at = Event.objects.exclude(recurring__recurring_type__exact='one-time').latest('id').createdAt
        return f"{name}, {count}, {created_at}"

    def event_with_subgroups(self, obj):
        name = 'Добавление подгруппы'
        count = Event.objects.filter(subgroups__isnull=False).count()
        created_at = Event.objects.filter(subgroups__isnull=False).latest('id').createdAt
        return f"{name}, {count}, {created_at}"

    # --------------------------------------------------------------------------------

    def create_project(self, obj):
        name = 'Создание проекта'
        count = Project.objects.count()
        created_at = Project.objects.latest('id').createdAt
        return f"{name}, {count}, {created_at}"

    # --------------------------------------------------------------------------------

    def disabled_notifications(self, obj):
        name = 'Какие уведомления отключили'
        data_general = {
            'Уведомления от приложения': NotificationSettings.objects.filter(is_from_app=False).count(),
            'Напоминания о событиях': NotificationSettings.objects.filter(is_reminder_about_event=False).count(),
            'Пользователь подтвердил событие': NotificationSettings.objects.filter(is_user_confirmed_event=False).count(),
        }
        data_schedule = {
            'Приглашение в расписание': NotificationSettings.objects.filter(is_invite_to_schedule=False).count(),
            'Приглашение в событие': NotificationSettings.objects.filter(is_invite_to_event=False).count(),
            'Изменение в событие': NotificationSettings.objects.filter(is_change_in_event=False).count(),
            'Отмена события': NotificationSettings.objects.filter(is_cancellation_event=False).count(),
            'Новое открытое событие': NotificationSettings.objects.filter(is_new_open_event=False).count(),
        }
        data_project = {
            'Новая заявка': NotificationSettings.objects.filter(is_new_application=False).count(),
            'Изменение в событие': NotificationSettings.objects.filter(is_project_change_in_event=False).count(),
            'Пользователь отказался от участия': NotificationSettings.objects.filter(is_user_refused_to_participate=False).count(),
            'Пользователь покинул проект': NotificationSettings.objects.filter(is_user_left_project=False).count(),
            'Пользователь вступил в проект': NotificationSettings.objects.filter(is_user_joined_project=False).count(),
        }
        return (f"{name}, "
                f"Общее: {data_general}, "
                f"Для расписания: {data_schedule}, "
                f"Для проекта: {data_project}")

    def how_use_filter_notifications(self, obj):
        name = 'Как используют фильтр по уведомлениям'
        data = (
            f"Поиск по проекту в проекте: {obj.notification_filter.project_project}\n"
            f"Поиск по подгруппе в проекте: {obj.notification_filter.project_subgroup}\n"
            f"Поиск по проекту в расписании: {obj.notification_filter.schedule_project}\n"
            f"Поиск по подгруппе в расписании: {obj.notification_filter.schedule_subgroup}\n"
        )
        return f"{name}:\n {data}"
    #-------------------------------------------------------------------------------

    def profile_settings(self, obj):
        name = 'Сбор статистики по настройкам в профиле'
        data = {
            'безопасность': Profile.objects.exclude(safety__exact='open').count(),
            'photo': Profile.objects.filter(photo__isnull=False).count(),
            'telegram': Profile.objects.filter(telegram__isnull=False).count(),
            'info': Profile.objects.filter(info__isnull=False).count(),
            'email': Profile.objects.filter(email__isnull=False).count(),
        }
        return (f"{name}, "
                f"{data}")

    def average_personal_links(self, obj):
        name = 'Добавление персональных ссылок'
        profiles_links_counts = Profile.objects.annotate(num_links=Count('personal_links'))
        average_count = profiles_links_counts.aggregate(avg_links=Avg('num_links'))['avg_links']
        return f"{name}, {average_count}"

    def often_search(self, obj):
        # не мне
        name = 'Что чаще ищут(события, пользователей, расписание и т/д)'
        return

    def average_count_contacts(self, obj):
        name = 'Среднее количество контактов'
        profiles_with_contact_counts = Profile.objects.annotate(num_contacts=Count('contacts'))
        average_count = profiles_with_contact_counts.aggregate(avg_contacts=Avg('num_contacts'))['avg_contacts']

        return f"{name}, {average_count}"

    analytics_data.short_description = "Аналитика"



admin.site.register(AllStatistic, AllStatisticAdmin)
admin.site.register(StatisticNotification)