from django.urls import path
from phone_confirmation_app.api.views import SendConfirmPhoneNumberView, CheckConfirmPhoneNumberView, \
    CheckConfirmPhoneNumberResetPasswordView

urlpatterns = [
    path('send-confirm-phone-number/', SendConfirmPhoneNumberView.as_view(), name='send-confirm-phone-number'),
    path('check-confirm-phone-number/', CheckConfirmPhoneNumberView.as_view(), name='check-confirm-phone-number'),
    path('confirm-reset-password/', CheckConfirmPhoneNumberResetPasswordView.as_view(), name='confirm-reset-password'),
]