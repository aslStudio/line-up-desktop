from datetime import timedelta
from itertools import count

from django.contrib.auth.models import User
from rest_framework import serializers, status
from rest_framework.response import Response

from events_app.models import Event, EventRecurring, EventSpecificDate, Subgroup, Color
from events_app.services.common_events import find_event_specific_date
from events_app.services.specific_date import check_specific_date
from profiles_app.api.serializers import ProfileSerializer
from profiles_app.models import Profile
from projects_app.models import Project, PersonalNote


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        exclude = ['createdAt', 'updatedAt']


class SimpleProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        exclude = ['createdAt', 'updatedAt']


class SubgroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subgroup
        exclude = ['createdAt', 'updatedAt']


class ServiceSubgroupsSerializer(serializers.ModelSerializer):
    def to_representation(self, value): #отдаём только имена здесь и в событии
        return value.name
    class Meta:
        model = Subgroup
        exclude = ['createdAt', 'updatedAt']


class EventRecurringSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRecurring
        fields = '__all__'


class SimpleEventSerializer(serializers.ModelSerializer):
    project = SimpleProjectSerializer(read_only=True)
    color = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    subgroups = SubgroupsSerializer(read_only=True, many=True)
    recurring = EventRecurringSerializer(read_only=True, many=False)
    class Meta:
        model = Event
        fields = '__all__'


class EventSpecificDateSerializer(serializers.ModelSerializer):
    event = SimpleEventSerializer(read_only=True)
    additional_detail = serializers.SerializerMethodField()
    class Meta:
        model = EventSpecificDate
        fields = '__all__'
        # read_only_fields = ['additional_detail']
        # fields = ['id', 'personal_note', 'additional_detail', 'event']

    def get_additional_detail(self, obj):
        if isinstance(obj, dict): #если здесь не реальный specific_event, а виртуальный в виде словаря
            return
        two_participants = obj.participants.values_list('id', flat=True)[:2]
        number_of_participants = obj.participants.count()
        limited_participants = []
        for participant_id in two_participants:
            participant = Profile.objects.get(id=participant_id)
            serializer = ProfileSerializer(participant)
            limited_participants.append(serializer.data)

        is_applications = True if obj.status_application.first() is not None else False
        data = {
            'participants': limited_participants,
            'number_of_participants': number_of_participants,
            'is_applications': is_applications,
        }
        return data


class IDEventSpecificDateSerializer(serializers.ModelSerializer):
    event = SimpleEventSerializer(read_only=True)
    participants = ProfileSerializer(read_only=True, many=True)
    organizers = ProfileSerializer(read_only=True, many=True)
    personal_note = serializers.SerializerMethodField()

    class Meta:
        model = EventSpecificDate
        fields = '__all__'

    def get_personal_note(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            personal_note = PersonalNote.objects.filter(profile=request.user.profile,
                                                        specific_event=obj).first()
            if personal_note: # можно возвращать и всю модель, но пока тупо текст
                # serializer = PersonalNoteSerializer(context=self.context)
                # return serializer.to_representation(personal_note)
                return personal_note.note
        return None


class SimpleEventSpecificDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSpecificDate
        # fields = '__all__'
        exclude = ['createdAt', 'updatedAt']

    def create(self, validated_data):
        event = validated_data.get('event')
        new_start_date = validated_data.get('start_date')

        is_correct_date = check_specific_date(event, new_start_date)
        if is_correct_date:
            return super(SimpleEventSpecificDateSerializer, self).create(validated_data)
        else:
            raise serializers.ValidationError({'start_date': 'There are no events with such a date.'})

    def update(self, instance, validated_data):
        event = validated_data.get('event')
        new_start_date = validated_data.get('start_date')

        is_correct_date = check_specific_date(event, new_start_date)
        specific_event = find_event_specific_date(event, new_start_date)

        if specific_event is not None:
            if new_start_date:
                return super().update(instance, validated_data)
            else:
                raise serializers.ValidationError({'start_date': 'There are no events with such a date.'})
        elif is_correct_date:
            new_instance = EventSpecificDate.objects.create(**validated_data)
            return new_instance

    def destroy(self, instance):
        """Добавляем дату данного specific_event в исключение"""
        instance.event.recurring.excluded_days_array.append(instance.start_date)
        instance.event.recurring.save()

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class EventSerializer(serializers.ModelSerializer):
    color = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    project = SimpleProjectSerializer(read_only=True)
    subgroups = ServiceSubgroupsSerializer(read_only=True, many=True)
    recurring = EventRecurringSerializer(read_only=True, many=False)
    specific_date = EventSpecificDateSerializer(read_only=True, many=True)
    class Meta:
        model = Event
        fields = '__all__'


#-------------------------------------------------------------------------------


class ForWholeEventRecurringSerializer(serializers.ModelSerializer):
    # excluded_days = serializers.ListField(child=serializers.DateField())
    class Meta:
        model = EventRecurring
        # fields = '__all__'
        exclude = ['event', 'createdAt', 'updatedAt']


class ForWholeEventSpecificDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSpecificDate
        # fields = '__all__'
        fields = ['id', 'start_date', 'end_date', 'payment',
                  'reminder_date', 'organizers',
                  'participants']
        write_only_fields = ['is_main', ]
        # exclude = ['createdAt', 'updatedAt']
        # read_only_fields = ['event']


class WholeEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'owner', 'name', 'project', 'subgroups', 'color', 'event_type',
                  'is_owl_mode', 'address', 'is_open', 'comment',
                  'reminder_delta', 'recurring',  'main_specific_date',
                  ]

    recurring = ForWholeEventRecurringSerializer(required=False)
    main_specific_date = ForWholeEventSpecificDateSerializer(required=False)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        main_specific_date = EventSpecificDate.objects.filter(event__id=instance.id, is_main=True).first()
        if main_specific_date:
            representation['main_specific_date'] = ForWholeEventSpecificDateSerializer(main_specific_date).data
        return representation

    def create(self, validated_data):
        try:
            recurring_data = validated_data.pop('recurring', {})
            main_specific_date_data = validated_data.pop('main_specific_date', {})

            subgroups_data = validated_data.pop('subgroups')
            event = super(WholeEventSerializer, self).create(validated_data)
            if subgroups_data: event.subgroups.set(subgroups_data)

            if recurring_data and main_specific_date_data:
                event_recurring = EventRecurring.objects.create(event=event, **recurring_data)

                organizers_data = main_specific_date_data.pop('organizers', [])
                participants_data = main_specific_date_data.pop('participants', [])
                personal_note_data = main_specific_date_data.pop('personal_note', [])

                main_specific_date_data['is_main'] = True
                event_specific_date = EventSpecificDate.objects.create(event=event, **main_specific_date_data)

                if organizers_data: event_specific_date.organizers.set(organizers_data)
                if participants_data: event_specific_date.participants.set(participants_data)
                if personal_note_data: event_specific_date.personal_note.set(personal_note_data)
                # if event.reminder_delta: event_specific_date.reminder_date.set(event_specific_date.start_date-timedelta(hours=event.reminder_delta)) #перенесено в создание модели
            else:
                event.delete()
                raise serializers.ValidationError({'event_recurring and event_specific': 'These fields are required.'})

            return event
        except Exception as e:
            event.delete()
            print(f'Exception occurred: {e}')
            raise

    def update(self, instance, validated_data):
        try:
            recurring_data = validated_data.pop('recurring', None)
            main_specific_date_data = validated_data.pop('main_specific_date', None)

            subgroups_data = validated_data.pop('subgroups', None)
            event = super(WholeEventSerializer, self).update(instance, validated_data)

            if subgroups_data is not None: event.subgroups.set(subgroups_data)

            if recurring_data:
                event_recurring = EventRecurring.objects.get_or_create(event=event)[0]
                for attr, value in recurring_data.items():
                    setattr(event_recurring, attr, value)
                event_recurring.save()

            if main_specific_date_data:
                main_specific_date = EventSpecificDate.objects.get_or_create(
                    event=event,
                    is_main=True
                )[0]

                organizers_data = main_specific_date_data.pop('organizers', [])
                participants_data = main_specific_date_data.pop('participants', [])
                personal_note_data = main_specific_date_data.pop('personal_note', [])

                for attr, value in main_specific_date_data.items():
                    setattr(main_specific_date, attr, value)
                main_specific_date.save()

                if organizers_data: main_specific_date.organizers.set(organizers_data)
                if participants_data: main_specific_date.participants.set(participants_data)
                if personal_note_data: main_specific_date.personal_note.set(personal_note_data)

            return event
        except Exception as e:
            print(f'Exception occurred: {e}')
            raise