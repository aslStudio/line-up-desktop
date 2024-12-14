from datetime import datetime, timedelta
from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from common.utils import and_search, and_search_filter
from events_app.api.serializers import (EventSpecificDateSerializer, SubgroupsSerializer,
                                        WholeEventSerializer, SimpleEventSpecificDateSerializer, ColorSerializer,
                                        IDEventSpecificDateSerializer)
from events_app.models import Event, EventSpecificDate, Subgroup, Color
import pytz
from events_app.services.creating_repeats import calculate_occurrence
from events_app.services.creating_tasks import create_task_for_owner, create_task_for_organizers_participants
from events_app.services.specific_date import search_specific_event
from profiles_app.models import Profile



class WholeEventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = WholeEventSerializer

    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data.copy()
        data['owner'] = user.profile.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()

        try:
            # создаём временные такси на уведомления
            # для владельца
            if create_task_for_owner(event):
                print(f'Временные таски для ивента для владельца {event} создались')
            else:
                print(f'Временные таски для ивента для владельца {event} НЕ СОЗДАЛИСЬ')

            # создаём временные такси на уведомления
            # для организаторов и участников
            event_specific_date = event.specific_date.filter(is_main=True).first()
            if create_task_for_organizers_participants(event_specific_date):
                print(f'Временные таски для ивента для организаторов и участников {event} создались')
            else:
                print(f'Временные таски для ивента для организаторов и участников {event} НЕ СОЗДАЛИСЬ')

        except Exception as e:
            print(f'Временные таски не создались по причине {e}')

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class EventSpecificDateViewSet(viewsets.ModelViewSet):
    queryset = EventSpecificDate.objects.all()
    serializer_class = SimpleEventSpecificDateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event_specific_date = serializer.save()
        # создаём временные такси на уведомления
        # для организаторов и участников
        create_task_for_organizers_participants(event_specific_date)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        specific_event = get_object_or_404(queryset, pk=pk)
        serializer = IDEventSpecificDateSerializer(specific_event, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def remove_profile(self, request, pk=None):
        specific_event = self.get_object()
        profile_id = request.data.get('profile_id')
        role = request.data.get('role')
        if profile_id:
            if role == 'participant':
                try:
                    participant = Profile.objects.get(id=profile_id)
                    specific_event.participants.remove(participant)
                    return Response({'message': f'Участник с id={profile_id} удалён.'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': f'Участника с id={profile_id} не найдено.'},
                                    status=status.HTTP_404_NOT_FOUND)
            elif role == 'organizer':
                try:
                    organizer = Profile.objects.get(id=profile_id)
                    specific_event.organizers.remove(organizer)
                    return Response({'message': f'Организатор с id={profile_id} удалён.'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': f'Организатора с id={profile_id} не найдено.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Необходимо указать идентификатор профиля.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False)
    def search(self, request):
        queryset = search_specific_event(data = self.request.GET, profile = request.user.profile)

        serializer = EventSpecificDateSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False)
    def global_search(self, request):
        value_db = ['event__name', 'participants__user__username', 'organizers__user__username', 'event__subgroups__name', 'event__color__name']
        if not self.request.GET:
            queryset = self.queryset.all()  # если нет параметров, просто возвращаем все посты
        else:
            value = self.request.GET.get('name')
            filters = Q()
            for key_db in value_db:
                if value:
                    filters |= Q(**{f'{key_db}__icontains': value})
            queryset = self.queryset.filter(filters)

        serializer = EventSpecificDateSerializer(queryset, many=True)
        return Response(serializer.data)


class SubgroupViewSet(viewsets.ModelViewSet):
    queryset = Subgroup.objects.all()
    serializer_class = SubgroupsSerializer


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer