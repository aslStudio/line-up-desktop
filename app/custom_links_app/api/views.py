import base64

from django.http import HttpResponseForbidden
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from custom_links_app.models import LimitedLink
from events_app.models import EventSpecificDate
from notifications.models import StatusApplication
from profiles_app.models import Profile
from projects_app.models import Project
from .serializers import LimitedLinkSerializer


class LinkTestViewSet(viewsets.ModelViewSet):
    queryset = LimitedLink.objects.all()
    serializer_class = LimitedLinkSerializer


class CreateLimitedLinkAPIView(APIView):
    serializer_class = LimitedLinkSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            link = serializer.save()
            response_data = {
                'url': link.short_encrypted_id,
                'max_clicks': link.max_clicks,
                'current_clicks': link.current_clicks
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrackClickAPIView(APIView):
    def get(self, request, short_encrypted_id):
        recipient = request.user.profile
        try:
            decoded_id = int(base64.urlsafe_b64decode(short_encrypted_id.encode()).decode())
            link = LimitedLink.objects.get(pk=decoded_id)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if link.current_clicks >= link.max_clicks:
            return HttpResponseForbidden(
                f"Ссылка исчерпала свои возможности. Максимальное количество кликов: {link.max_clicks}")

        if link_action(link, recipient):
            link.current_clicks += 1
            link.save(update_fields=['current_clicks'])
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)


def link_action(link, recipient):
    try:
        if link.type == 'contact':
            Profile.objects.get(pk=link.profile.id).contacts.add(recipient.id)
            return True
        elif link.type == 'event':
            data = {
                'role': link.role,
                'specific_event' : EventSpecificDate.objects.get(pk=link.resource_id),
                'is_organizer_to_participant': True,
                'sender_application': link.profile,
            }
        elif link.type == 'project':
            data = {
                'role': link.role,
                'project': Project.objects.get(pk=link.resource_id),
                'is_organizer_to_participant': True,
                'sender_application': link.profile,
            }
        else:
            return False

        status_application = StatusApplication.objects.create(**data)
        status_application.recipient_application.add(recipient)
        return True
    except:
        return False