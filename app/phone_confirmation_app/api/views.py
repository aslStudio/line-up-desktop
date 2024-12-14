from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR, \
    HTTP_503_SERVICE_UNAVAILABLE
from rest_framework.views import APIView
from rest_framework.response import Response
from phone_confirmation_app.models import TokenConfirmPhone
from django.utils.crypto import get_random_string
from phone_confirmation_app.tasks import delete_token
import hashlib
from rest_framework.authtoken.models import Token
from django.utils.translation import gettext_lazy as _
# from phone_confirmation_app.easy_sms import send_confirm_code # раскомментить когда нужно будет тестить easy-sms


def send_confirm_code(phone ,random_code) -> bool:
    return True


class SendConfirmPhoneNumberView(APIView):
    def post(self, request) -> Response:
        try:
            phone = request.POST.get('phone')
            random_code = get_random_string(length=6, allowed_chars='0123456789')
            token_confirm_phone = TokenConfirmPhone(
                phone=phone,
                random_hash = hashlib.sha256(random_code.encode()).hexdigest()
            )
            token_confirm_phone.save()

            delete_token.apply_async(args=[token_confirm_phone.id], countdown=120) # запускаем таску на удаление через две минуты

            # if send_confirm_code(phone ,random_code):
            #     return Response({"message": _("Вам отправлено СМС с кодом подтверждения")}, status=status.HTTP_200_OK)
            if send_confirm_code(phone ,random_code):
                return Response({"message": _(f"Для тестов возвращаю код {random_code}")}, status=HTTP_200_OK)
            else:
                return Response({"message": _("Сообщение не отправлено")}, status=HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            print(_("Неожиданная ошибка при отправке кода подтверждения: %s"), e)
            return Response({"error": _("Произошла внутренняя ошибка сервера")},
                            status=HTTP_500_INTERNAL_SERVER_ERROR)


class CheckConfirmPhoneNumberView(APIView):
    def post(self, request) -> Response:
        try:
            phone = request.POST.get('phone')
            random_code = request.POST.get('random_code')
            random_hash = hashlib.sha256(random_code.encode()).hexdigest()

            token_confirm_phone = TokenConfirmPhone.objects.get(phone=phone)

            if token_confirm_phone.random_hash != random_hash:
                print(_("Invalid confirmation code for phone number %s"), phone)
                return Response({"message": _("Неверный код подтверждения")}, status=HTTP_400_BAD_REQUEST)

            token_confirm_phone.delete()
            return Response({"message": _("Номер подтверждён")}, status=200)

        except TokenConfirmPhone.DoesNotExist:
            print(_("Token for phone number %s does not exist"), phone)
            return Response({"message": _("Код подтверждения для данного номера телефона не найден")}, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f'Exception occurred: {e}')
            return Response({"error": "Проблемы с сервисом"}, status=404)


class CheckConfirmPhoneNumberResetPasswordView(APIView):
    def post(self, request) -> Response:
        try:
            phone = request.POST.get('phone')
            random_code = request.POST.get('random_code')
            random_hash = hashlib.sha256(random_code.encode()).hexdigest()

            token_confirm_phone = TokenConfirmPhone.objects.get(phone=phone)

            if token_confirm_phone.random_hash != random_hash:
                print(_("Invalid confirmation code for phone number %s"), phone)
                return Response({"message": _("Неверный код подтверждения")}, status=HTTP_400_BAD_REQUEST)

            """для смены пароля"""
            if get_user_model().objects.filter(phone=phone).exists():
                user = get_user_model().objects.get(phone=phone)
                new_password = request.POST.get('new_password')

                try:
                    validate_password(new_password)
                except ValidationError as e:
                    print(_("Password validation failed for phone number %s: %s"), phone, e.messages)
                    return Response({"message": _("Новый пароль не соответствует требованиям безопасности")}, status=HTTP_400_BAD_REQUEST)

                user.set_password(new_password)
                user.save()
                token_confirm_phone.delete()
                return Response({"message": _("Пароль успешно сменён")}, status=HTTP_200_OK)
            else:
                print(_("User with phone number %s does not exist"), phone)
                return Response({"message": _("Пользователь с таким номером телефона не найден")}, status=HTTP_400_BAD_REQUEST)
        except TokenConfirmPhone.DoesNotExist:
            print(_("Token for phone number %s does not exist"), phone)
            return Response({"message": _("Код подтверждения для данного номера телефона не найден")}, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(_("Unexpected error during password change for phone number %s: %s"), phone, e)
            return Response({"message": _("Произошла ошибка при смене пароля")}, status=HTTP_500_INTERNAL_SERVER_ERROR)