from rest_framework import serializers
from custom_links_app.models import LimitedLink



class LimitedLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = LimitedLink
        exclude = ['createdAt', 'updatedAt', 'short_encrypted_id', 'current_clicks']