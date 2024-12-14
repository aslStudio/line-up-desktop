from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from common.utils import and_search
from profiles_app.models import Profile
from projects_app.models import Project, PersonalNote
from projects_app.api.serializers import ProjectSerializer, IDProjectSerializer, PersonalNoteSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        project = get_object_or_404(queryset, pk=pk)
        serializer = IDProjectSerializer(project, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def remove_profile(self, request, pk=None):
        project = self.get_object()
        profile_id = request.data.get('profile_id')
        role = request.data.get('role')
        if profile_id:
            if role == 'participant':
                try:
                    participant = Profile.objects.get(id=profile_id)
                    project.participants.remove(participant)
                    return Response({'message': f'Участник с id={profile_id} удалён.'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': f'Участника с id={profile_id} не найдено.'},
                                    status=status.HTTP_404_NOT_FOUND)
            elif role == 'organizer':
                try:
                    organizer = Profile.objects.get(id=profile_id)
                    project.organizers.remove(organizer)
                    return Response({'message': f'Организатор с id={profile_id} удалён.'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': f'Организатора с id={profile_id} не найдено.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Необходимо указать идентификатор профиля.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False)
    def search(self, request):
        value_requests = ['name', 'participants', 'organizers']
        value_db = ['name', 'participants__user__username', 'organizers__user__username']

        queryset = and_search(Project, self.request.GET, value_requests, value_db)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PersonalNoteViewSet(viewsets.ModelViewSet):
    queryset = PersonalNote.objects.all()
    serializer_class = PersonalNoteSerializer