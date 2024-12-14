import os
import requests


login = os.getenv('SMS_LOGIN')
password = os.getenv('SMS_PASSWORD')
connect_id = os.getenv('SMS_CONNECT_ID')
url = os.getenv('SMS_URL') + connect_id + '/SendMessage'

def send_confirm_code(number: str, random_code: int, message_id: str = '0') -> bool:
    headers = {
        "Content-Type": "application_request/json application_response/json",
    }
    data = {
        "Header": {
            "login": f"{login}",
            "password": f"{password}"
        },
        "Payload": {
            "message": {
                "client_message_id": message_id,
                "messenger_type": "sms",
                "originator": "LineUpp",
                "recipient": number,
                "text": f"Ваш код подтверждения для приложения LineUpp: {random_code}"
            }
        }
    }

    response = requests.post(url = url, json=data, headers=headers)
    print(response.request)

    if response.status_code == 200:
        result = response.json()
        print(f"Ответ сервера: {result}")
        return True
    else:
        print(f"Ошибка: {response.status_code}")
        print(response.text)
        return False
