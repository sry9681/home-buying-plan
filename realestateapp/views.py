from django.shortcuts import render

# Create your views here.
def index(request):
    # Define a dictionary with all default values
    default_values = {
        'home_price_selected': 175000,
        'home_price_min': 50000,
        'home_price_max': 300000,
        'down_payment': 30000,
        'closing_costs_perc_min': 2,
        'closing_costs_perc_max': 3.5,
        'closing_costs_perc_selected': 3.5,
        'loan_term': 30,
        'interest_rate': 5.95,
        'property_tax': 1.1,
        'insurance_rate': 0.5,
        'hoa': 0,
        'gas': 0,
        'electricity': 0,
        'internet': 0,
        'water_trash': 0,
        'contribution': 0,
        'savings_goal': 50000,
    }
    
    context = {
        'defaults': default_values,
    }
    return render(request, 'index.html', context)