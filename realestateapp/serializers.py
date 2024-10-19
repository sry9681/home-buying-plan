from rest_framework import serializers
from .models import MortgageCalculation

class MortgageCalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortgageCalculation
        exclude = ['user']
