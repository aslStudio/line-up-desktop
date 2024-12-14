import requests
from django.conf import settings


def send_message_to_bot(message: str, chat_id: str):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_TOKEN}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': message
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Сообщение успешно отправлено")
        return True
    else:
        print(f"Ошибка: {response.status_code}")
        return False