from django.contrib.auth.models import User
from django.core.exceptions import MultipleObjectsReturned
from rest_framework import serializers
from events_app.models import Event
from projects_app.models import Project, PersonalNote
from events_app.api.serializers import SimpleEventSerializer



class PersonalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalNote
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    events = SimpleEventSerializer(read_only=True, many=True)
    class Meta:
        model = Project
        fields = '__all__'

    def validate_organizers(self, value):
        if len(value) > 2:
            raise serializers.ValidationError('A project cannot have more than 2 organizers.')
        return value



class IDProjectSerializer(serializers.ModelSerializer):
    events = SimpleEventSerializer(read_only=True, many=True)
    personal_note = serializers.SerializerMethodField()
    # personal_note = PersonalNoteSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = '__all__'

    def get_personal_note(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            personal_note = PersonalNote.objects.filter(profile=request.user.profile,
                                                        project=obj).first()
            if personal_note: # можно возвращать и всю модель, но пока тупо текст
                # serializer = PersonalNoteSerializer(context=self.context)
                # return serializer.to_representation(personal_note)
                return personal_note.note
        return None

