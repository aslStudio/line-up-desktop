from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from admin_statistic_app.models import AllStatistic, StatisticNotification
from common.decorators import check_auth_and_get_profile
from common.utils import and_search, exact_and_search
from notifications.api.serializers import NotificationSerializer, TestNotificationSerializer, \
    StatusApplicationSerializer, IDStatusApplicationSerializer
from notifications.models import Notification, NotificationForOrganizer, NotificationForExecutor, StatusApplication



class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    @check_auth_and_get_profile
    @action(methods=['get'], detail=False, permission_classes=[IsAuthenticated])
    def search(self, request):
        """Запрос для получения уведомлений для пользователя.
        Если оставить запрос пустым выдаст все его уведомления,
        есть возможность зафильтровать по этим парметрам 'is_read', 'is_archived', 'recipient_type'."""

        data = request.GET.copy()
        data.update({'profile': request.profile.id})
        value_requests = ['profile', 'is_read', 'is_archived', 'recipient_type',]
        value_db = ['recipient__id', 'is_read', 'is_archived', 'recipient_type',]

        queryset = exact_and_search(Notification, data, value_requests, value_db)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @check_auth_and_get_profile
    @action(methods=['get'], detail=False, permission_classes=[IsAuthenticated])
    def filter(self, request):
        """Фильтруем по пользователю запросившему (подтягивается автоматически), прочитано ли, заархивровано ли
        ['is_read', 'is_archived'].
        Фильтруем по проекту, если организатор (проект)
        ['project_project_id', 'project_subgroup_id'].
        Фильтруем по проекту, если участник (расписание)
        ['schedule_project_id', 'schedule_subgroup_id']."""

        try:
            applied_filters = StatisticNotification.objects.values('project_project',
                                                                         'project_subgroup',
                                                                         'schedule_project',
                                                                         'schedule_subgroup')[0]
        except:
            print(f'в статистику не улетело')

        if not self.request.GET: # если не подали никаких параметров фильтра
            queryset = Notification.objects.filter(recipient__id=request.profile.id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        data = dict(self.request.GET)
        data['profile'] = f'{request.profile.id}'

        value_requests = ['profile', 'is_read', 'is_archived']
        value_db = ['recipient__id', 'is_read', 'is_archived']

        base_filters = Q()
        for key_value, key_db in zip(value_requests, value_db):
            value = data.get(key_value)
            if isinstance(value, str):
                base_filters &= Q(**{f'{key_db}': value})
            elif isinstance(value, list):
                base_filters &= Q(**{f'{key_db}__in': value})

        """фильтр по проектам"""
        project_filters = Q()
        if data.get('project_project_id'):
            applied_filters['project_project'] += 1

            project_filters &= Q(**{f'recipient_type': 'for organizer'})
            project_filters &= Q(**{f'for_organizer__status__project__id__in': data.get('project_project_id')})
            if data.get('project_subgroup_id'):
                applied_filters['project_subgroup'] += 1

                project_filters &= Q(**{f'for_organizer__status__project__events__subgroups__id__in': data.get('project_subgroup_id')})

        """фильтр по расписаниям"""
        schedule_filters = Q()
        if data.get('schedule_project_id'):
            applied_filters['schedule_project'] += 1

            project_filters &= Q(**{f'recipient_type': 'for participant'})
            schedule_filters &= Q(**{f'for_executor__status_project_id__in': data.get('schedule_project_id')})
            if data.get('schedule_subgroup_id'):
                applied_filters['schedule_subgroup'] += 1

                project_filters &= Q(**{f'for_executor__status__project__events__subgroups__id__in': data.get('project_subgroup_id')})

        statistic = StatisticNotification.objects.first()
        for key, value in applied_filters.items():
            setattr(statistic, key, value)
        statistic.save()

        final_filter = Q(base_filters) & Q(project_filters | schedule_filters)
        queryset = Notification.objects.filter(final_filter)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class StatusApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = StatusApplication.objects.all()
    serializer_class = StatusApplicationSerializer

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        status = get_object_or_404(queryset, pk=pk)
        serializer = IDStatusApplicationSerializer(status)
        return Response(serializer.data)

    @action(methods=['get'], detail=False)
    def search(self, request):
        value_requests = ['specific_event', 'project', 'status']
        value_db = ['specific_event__id', 'project__id', 'status']

        data = dict(self.request.GET)
        data['status'] = 'consideration'
        queryset = exact_and_search(StatusApplication, data, value_requests, value_db)

        serializer = IDStatusApplicationSerializer(queryset, many=True)
        return Response(serializer.data)


class TestNotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()
    serializer_class = TestNotificationSerializer
