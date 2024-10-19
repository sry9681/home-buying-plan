from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class MortgageCalculation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    home_price = models.IntegerField(default=200000)
    down_payment = models.IntegerField(default=30000)
    closing_costs = models.FloatField(default=3.5)
    loan_term = models.IntegerField(default=30)
    interest_rate = models.FloatField(default=5.95)
    property_tax = models.FloatField(default=1.1)
    insurance_rate = models.FloatField(default=0.5)
    hoa = models.IntegerField(default=0)
    gas = models.IntegerField(default=20)
    electricity = models.IntegerField(default=200)
    internet = models.IntegerField(default=120)
    water_trash = models.IntegerField(default=90)
    person1_contribution = models.IntegerField(default=1875)
    person2_contribution = models.IntegerField(default=1875)
    savings_goal = models.IntegerField(default=50000)

    def __str__(self):
        return f"Mortgage Calculation for {self.user.username}"
