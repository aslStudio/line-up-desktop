import time
from celery import shared_task
from .models import TokenConfirmPhone



@shared_task
def delete_token(token_id):
    try:
        token = TokenConfirmPhone.objects.get(id=token_id)
        token.delete()
        print('Токен для подтверждения номера телефона удалён')
    except TokenConfirmPhone.DoesNotExist:
        print('Токен для подтверждения номера телефона уже удалён или не существует')