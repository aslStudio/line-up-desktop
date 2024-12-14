from notifications.models import StatusApplication
from projects_app.models import Project
from events_app.models import EventSpecificDate



def admission_to_event_or_project(status: StatusApplication):
    if status.status == 'accept':
        model = None
        object_id = None
        if status.specific_event: model, object_id = EventSpecificDate, status.specific_event.id
        elif status.project: model, object_id = Project, status.project.id

        if status.role == 'organizer':
            model.objects.get(pk=object_id).organizers.add(status.sender_application)
        elif status.role == 'participant':
            model.objects.get(pk=object_id).participants.add(status.sender_application)
        else:
            print(f"Не получилось добавить пользователя {status.sender_application} в {model}")
