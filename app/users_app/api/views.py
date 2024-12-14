from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from profiles_app.models import Profile
from users_app.api.serializers import UserProfileSerializer


class UserMe(APIView):
    def get(self, request):
        user = request.user
        if user:
            profile = Profile.objects.get(user=user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)



