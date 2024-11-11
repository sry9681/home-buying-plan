from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MortgageCalculation
from .serializers import MortgageCalculationSerializer
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.urls import reverse_lazy
from django.views import generic

def home(request):
    return render(request, 'home.html')

@login_required
def mortgage_calculator(request):
    calculation, created = MortgageCalculation.objects.get_or_create(user=request.user)
    serializer = MortgageCalculationSerializer(calculation)
    return render(request, 'mortgage_calculator.html', {'calculation': serializer.data})

@api_view(['GET', 'POST'])
@login_required
def mortgage_calculation_api(request):
    calculation, created = MortgageCalculation.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        serializer = MortgageCalculationSerializer(calculation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    serializer = MortgageCalculationSerializer(calculation)
    return Response(serializer.data)

class RegisterView(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/register.html'

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')  # Redirect to home page after login
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')  # Redirect to home page after registration
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})
