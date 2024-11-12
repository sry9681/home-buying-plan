from django.urls import include, path
from django.contrib.auth.views import LogoutView
from . import views
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('mortgage-calculator/', views.mortgage_calculator, name='mortgage_calculator'),
    path('savings-amount/', views.savings_amount, name='savings_amount'),
    path('api/mortgage-calculation/', views.mortgage_calculation_api, name='mortgage_calculation_api'),
    path('api/persons/', views.person_contribution_api, name='person_contribution_api'),
    path('get_saved_homes/', views.get_saved_homes, name='get_saved_homes'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', LogoutView.as_view(next_page='home'), name='logout'),
]
