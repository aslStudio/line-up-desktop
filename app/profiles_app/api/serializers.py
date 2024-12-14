from profiles_app.models import Profile, AccessLevel, ProfileSettings, NotificationSettings
from rest_framework import serializers

from users_app.api.serializers import UserSerializer


class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSettings
        fields = '__all__'


class ProfileSettingsSerializer(serializers.ModelSerializer):
    notification_settings = NotificationSettingsSerializer(required=False)
    class Meta:
        model = ProfileSettings
        fields = '__all__'

    def update(self, instance, validated_data):
        notification_settings_data = validated_data.pop('notification_settings', None)
        if notification_settings_data is not None:
            notification_settings_instance = instance.notification_settings
            for attr, value in notification_settings_data.items():
                setattr(notification_settings_instance, attr, value)
            notification_settings_instance.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class AccessLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessLevel
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    access_level = AccessLevelSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'


class IDProfileSerializer(serializers.ModelSerializer):
    # notifications = NotificationWithAcceptanceCancellationSerializer(many=True, read_only=False)
    user = UserSerializer(read_only=True)
    access_level = AccessLevelSerializer(many=True, read_only=True)

    settings = ProfileSettingsSerializer(many=False, read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'


class MeProfileSerializer(serializers.ModelSerializer):
    # notifications = NotificationWithAcceptanceCancellationSerializer(many=True, read_only=False)
    user = UserSerializer(read_only=True)
    access_level = AccessLevelSerializer(many=True, read_only=True)

    settings = ProfileSettingsSerializer(many=False, read_only=True)
    contacts = ProfileSerializer(many=True, read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'