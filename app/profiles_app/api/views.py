from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from events_app.models import EventSpecificDate
from notifications.api.serializers import NotificationSerializer
from notifications.models import Notification
from profiles_app.api.serializers import ProfileSerializer, ProfileSettingsSerializer, NotificationSettingsSerializer, \
    IDProfileSerializer, MeProfileSerializer
from profiles_app.models import Profile, ProfileSettings, NotificationSettings



class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def retrieve(self, request, pk=None):
        """Более подробная инфа по конкретному профилю"""
        queryset = self.get_queryset()
        profile = get_object_or_404(queryset, pk=pk)
        serializer = IDProfileSerializer(profile)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'], url_path='add-selected-events')
    def add_selected_events(self, request, pk=None):
        """Добавление в избранное события на конкретную дату.
        Требуемое поле ['specific_event_id']"""
        try:
            profile = Profile.objects.get(user=request.user)
            if profile != self.get_object():
                return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        specific_event_id = request.data.get('specific_event_id')
        if specific_event_id:
            try:
                specific_event = EventSpecificDate.objects.get(pk=specific_event_id)
                profile.selected_events.add(specific_event)
                return Response({'message': f'{specific_event} добавлен в избранное'}
                                , status=status.HTTP_200_OK)
            except EventSpecificDate.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Необходимо указать id события.'},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'], url_path='remove-selected-events')
    def remove_selected_events(self, request, pk=None):
        """Удаление из избранного события на конкретную дату.
        Требуемое поле ['specific_event_id']"""
        try:
            profile = Profile.objects.get(user=request.user)
            if profile != self.get_object():
                return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        specific_event_id = request.data.get('specific_event_id')
        if specific_event_id:
            try:
                specific_event = EventSpecificDate.objects.get(pk=specific_event_id)
                profile.selected_events.remove(specific_event)
                return Response({'message': f'{specific_event} удалён из избранного'}
                                , status=status.HTTP_200_OK)
            except EventSpecificDate.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Необходимо указать id события.'},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'], url_path='add_profile')
    def add_profile(self, request, pk=None):
        profile_me = self.get_object()
        profile_id = request.data.get('profile_id')
        role = request.data.get('role')
        if profile_id:
            if role == 'contact':
                try:
                    contact = Profile.objects.get(id=profile_id)
                    profile_me.contacts.add(contact)
                    return Response({'message': f'Контакт с id={profile_id} добавлен.'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': f'Контакта с id={profile_id} не найдено.'},
                                    status=status.HTTP_404_NOT_FOUND)
            elif role == 'blocked_contact':
                try:
                    blocked_contact = Profile.objects.get(id=profile_id)
                    profile_me.blocked_contacts.add(blocked_contact)
                    return Response({'message': f'Заблокированный контакт с id={profile_id} добавлен.'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': f'Заблокированного контакта с id={profile_id} не найдено.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Необходимо указать идентификатор профиля.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'], url_path='remove_profile')
    def remove_profile(self, request, pk=None):
        profile_me = self.get_object()
        profile_id = request.data.get('profile_id')
        role = request.data.get('role')
        if profile_id:
            if role == 'contact':
                try:
                    contact = Profile.objects.get(id=profile_id)
                    profile_me.contacts.remove(contact)
                    return Response({'message': f'Контакт с id={profile_id} удалён.'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': f'Контакта с id={profile_id} не найдено.'},
                                    status=status.HTTP_404_NOT_FOUND)
            elif role == 'blocked_contact':
                try:
                    blocked_contact = Profile.objects.get(id=profile_id)
                    profile_me.blocked_contacts.remove(blocked_contact)
                    return Response({'message': f'Заблокированный контакт с id={profile_id} удалён.'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': f'Заблокированного контакта с id={profile_id} не найдено.'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'error': f'Роль должна быть либо "contact", либо "blocked_contact"'},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Необходимо указать идентификатор профиля.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False, url_path='search')
    def search(self, request):
        value_db = ['name', 'user__username', 'telegram']
        if not self.request.GET:
            queryset = self.queryset.all()  # если нет параметров, просто возвращаем все посты
        else:
            value = self.request.GET.get('name')
            filters = Q()
            for key_db in value_db:
                if value:
                    filters |= Q(**{f'{key_db}__icontains': value})
            queryset = self.queryset.filter(filters)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='me')
    def me(self, request):
        user = request.user
        if user:
            profile = Profile.objects.get(user=user)
            serializer = MeProfileSerializer(profile)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)


class ProfileSettingsAPIView(APIView):
    def get(self, request, profile_id):
        try:
            profile_settings = ProfileSettings.objects.get(id=profile_id)
            serializer = ProfileSettingsSerializer(profile_settings)
            return Response(serializer.data)
        except ProfileSettings.DoesNotExist:
            return Response({'error': 'Profile settings not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, profile_id):
        try:
            profile_settings = ProfileSettings.objects.get(id=profile_id)
            serializer = ProfileSettingsSerializer(profile_settings, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProfileSettings.DoesNotExist:
            return Response({'error': 'Profile settings not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, profile_id):
        try:
            profile_settings = ProfileSettings.objects.get(id=profile_id)
            serializer = ProfileSettingsSerializer(
                profile_settings, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ProfileSettings.DoesNotExist:
            return Response({'error': 'Profile settings not found'}, status=status.HTTP_404_NOT_FOUND)
