from django.template.defaultfilters import title

from events_app.api.serializers import EventSpecificDateSerializer
from notifications.models import Notification, NotificationForOrganizer, NotificationForExecutor, StatusApplication
from rest_framework import serializers

from profiles_app.api.serializers import ProfileSerializer
from projects_app.api.serializers import ProjectSerializer


class StatusApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusApplication
        fields = '__all__'
        read_only_fields = ('createdAt', 'updatedAt')

    def create(self, validated_data):
        try:
            is_organizer_to_participant = validated_data.get('is_organizer_to_participant')
            specific_event = validated_data.get('specific_event', None)
            project = validated_data.get('project', None)
            sender_application = validated_data.get('sender_application', None)
            recipient_application = validated_data.get('recipient_application', None)

            if specific_event is None and project is None:
                raise serializers.ValidationError({'specific_event and project': 'Both fields are empty.'})
            if sender_application is None:
                raise serializers.ValidationError({'sender_application': 'field is empty.'})
            if is_organizer_to_participant:
                if not recipient_application:
                    raise serializers.ValidationError({'recipient_application': 'field is empty.'})
            else:
                if specific_event:
                    recipient_application = specific_event.organizers.all()
                elif project:
                    recipient_application = project.organizers.all()
                else:
                    raise serializers.ValidationError({'specific_event and project': 'Both fields are empty.'})
                validated_data['recipient_application'] = recipient_application

            status_application = super(StatusApplicationSerializer, self).create(validated_data)
            return status_application

        except Exception as e:
            print(f'Exception occurred: {e}')
            raise serializers.ValidationError(str(e))


class IDStatusApplicationSerializer(serializers.ModelSerializer):
    recipient_application = ProfileSerializer(many=True, read_only=True)
    sender_application = ProfileSerializer(many=False, read_only=True)
    class Meta:
        model = StatusApplication
        exclude = ('createdAt', 'updatedAt')


class SimpleStatusApplicationSerializer(serializers.ModelSerializer):
    specific_event = EventSpecificDateSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    class Meta:
        model = StatusApplication
        fields = '__all__'
        read_only_fields = ('createdAt', 'updatedAt')



class NotificationForOrganizerSerializer(serializers.ModelSerializer):
    status = SimpleStatusApplicationSerializer(read_only=True)
    class Meta:
        model = NotificationForOrganizer
        fields = ['status']


class NotificationForExecutorSerializer(serializers.ModelSerializer):
    status = SimpleStatusApplicationSerializer(read_only=True)
    class Meta:
        model = NotificationForExecutor
        fields = ['status']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'recipient_type', 'type_notification', 'message', 'is_read', 'is_archived', 'sender', 'recipient',
                  'for_organizer', 'for_executor']

    for_organizer = NotificationForOrganizerSerializer(required=False)
    for_executor = NotificationForExecutorSerializer(required=False)

    def create(self, validated_data):
        try:
            type_notification = validated_data.get('type_notification')
            recipient_type = validated_data.get('recipient_type')

            for_organizer_data = validated_data.pop('for_organizer', None)
            for_executor_data = validated_data.pop('for_executor', None)
            notification = super(NotificationSerializer, self).create(validated_data)

            if type_notification == 'system':
                return notification
            elif type_notification == 'new contact':
                return notification
            elif type_notification == 'reminder' and recipient_type == 'for anyone':
                return notification
            elif type_notification == 'cancellation':
                return notification
            elif type_notification == 'other':
                return notification

            elif type_notification == 'invitation' or type_notification == 'reminder':
                recipient_type = validated_data.get('recipient_type')
                if recipient_type == 'for organizer' and for_organizer_data is not None:
                    model, data = NotificationForOrganizer, for_organizer_data
                elif recipient_type == 'for participant' and for_executor_data is not None:
                    model, data = NotificationForExecutor, for_executor_data
            else:
                raise serializers.ValidationError({'type_notification': 'Invalid type of notification.'})

            model.objects.create(notification=notification, **data)
            return notification
        except Exception as e:
            print(f'Exception occurred: {e}')
            raise

    def update(self, instance, validated_data):
        type_notification = validated_data.get('type_notification')

        for_organizer_data = validated_data.pop('for_organizer', {})
        for_executor_data = validated_data.pop('for_executor', {})

        for_organizer_instance = getattr(instance, 'for_organizer', None)
        for_executor_instance = getattr(instance, 'for_executor', None)

        if type_notification == 'for organizer':
            if for_organizer_instance is None:
                NotificationForOrganizer.objects.create(notification=instance, **for_organizer_data)
            else:
                for key, value in for_organizer_data.items():
                    setattr(for_organizer_instance, key, value)
                for_organizer_instance.save()

        elif type_notification == 'for executor':
            if for_executor_instance is None:
                NotificationForExecutor.objects.create(notification=instance, **for_executor_data)
            else:
                for key, value in for_executor_data.items():
                    setattr(for_executor_instance, key, value)
                for_executor_instance.save()

        return super().update(instance, validated_data)


class TestNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


