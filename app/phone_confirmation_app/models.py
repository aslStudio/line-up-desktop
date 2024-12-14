from django.contrib.auth import get_user_model
from django.db import models

from common.models import TimeBasedModel
from django.conf import settings
from django.utils.translation import gettext_lazy as _



class TokenConfirmPhone(TimeBasedModel):
    # user = models.OneToOneField(
    #     get_user_model(), on_delete=models.CASCADE
    # )
    phone = models.CharField(_('phone number'), max_length=30,
                             null=True, blank=True, unique=True
                             )
    random_hash = models.CharField(max_length=100, editable=False)
    expires_at = models.DateTimeField(auto_now_add=True, editable=False)