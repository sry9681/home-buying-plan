from rest_framework import serializers
from .models import MortgageCalculation, PersonContribution

class MortgageCalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortgageCalculation
        fields = [
            'id', 
            'name', 
            'home_price', 
            'down_payment', 
            'closing_costs', 
            'loan_term', 
            'interest_rate', 
            'property_tax', 
            'insurance_rate', 
            'hoa', 
            'gas', 
            'electricity', 
            'internet', 
            'water_trash'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            validated_data['user'] = user
        return super().create(validated_data)

class PersonContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonContribution
        fields = ['id', 'name', 'contribution_amount']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            validated_data['user'] = user
        return super().create(validated_data)
