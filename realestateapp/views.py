from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MortgageCalculation, PersonContribution
from .serializers import MortgageCalculationSerializer, PersonContributionSerializer
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

def home(request):
    if request.user.is_authenticated:
        homes = MortgageCalculation.objects.filter(user=request.user)
        persons = PersonContribution.objects.filter(user=request.user)
        return render(request, 'home.html', {
            'homes': homes,
            'persons': persons
        })
    return render(request, 'home.html')

@login_required
def mortgage_calculator(request):
    # Get all homes for the current user for the dropdown
    homes = MortgageCalculation.objects.filter(user=request.user)
    # Initialize empty calculation with zeros
    empty_calculation = {
        'home_price': 0,
        'down_payment': 0,
        'closing_costs': 0,
        'loan_term': 30,  # Keep this as 30 for the dropdown default
        'interest_rate': 0,
        'property_tax': 0,
        'insurance_rate': 0,
        'hoa': 0,
        'gas': 0,
        'electricity': 0,
        'internet': 0,
        'water_trash': 0,
    }
    return render(request, 'mortgage_calculator.html', {
        'homes': homes,
        'calculation': empty_calculation
    })

@login_required
@api_view(['GET', 'POST', 'DELETE'])
def mortgage_calculation_api(request):
    if request.method == 'GET':
        home_id = request.GET.get('id')
        if home_id:
            calculation = get_object_or_404(MortgageCalculation, id=home_id, user=request.user)
            serializer = MortgageCalculationSerializer(calculation)
            return Response(serializer.data)
        return Response({'error': 'No home ID provided'}, status=400)
    
    elif request.method == 'POST':
        data = request.data
        home_id = data.get('id')
        name = data.get('name')
        
        if home_id:
            # Update existing home
            calculation = get_object_or_404(MortgageCalculation, id=home_id, user=request.user)
            serializer = MortgageCalculationSerializer(calculation, data=data, partial=True)
        else:
            # Create new home
            if not name:
                return Response({'error': 'Name is required for new homes'}, status=400)
            serializer = MortgageCalculationSerializer(data=data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        home_id = request.data.get('id')
        if home_id:
            calculation = get_object_or_404(MortgageCalculation, id=home_id, user=request.user)
            calculation.delete()
            return Response({'message': 'Home deleted successfully'})
        return Response({'error': 'No home ID provided'}, status=400)

@require_http_methods(["GET"])
@login_required
def get_saved_homes(request):
    homes = MortgageCalculation.objects.filter(user=request.user).values('id', 'name')
    return JsonResponse(list(homes), safe=False)

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

@login_required
def savings_amount(request):
    persons = PersonContribution.objects.filter(user=request.user)
    return render(request, 'savings_amount.html', {'persons': persons})

@login_required
@api_view(['GET', 'POST', 'DELETE'])
def person_contribution_api(request):
    if request.method == 'GET':
        persons = PersonContribution.objects.filter(user=request.user)
        serializer = PersonContributionSerializer(persons, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = request.data
        person_id = data.get('id')
        
        if person_id:
            # Update existing person
            person = get_object_or_404(PersonContribution, id=person_id, user=request.user)
            serializer = PersonContributionSerializer(person, data=data, partial=True)
        else:
            # Create new person
            serializer = PersonContributionSerializer(data=data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        person_id = request.data.get('id')
        if person_id:
            person = get_object_or_404(PersonContribution, id=person_id, user=request.user)
            person.delete()
            return Response({'message': 'Person deleted successfully'})
        return Response({'error': 'No person ID provided'}, status=400)
