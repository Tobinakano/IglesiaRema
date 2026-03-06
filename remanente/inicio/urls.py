from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('familia/', views.familiaRemanente, name='familia_remanente'),
    path('equipos/', views.equipos, name='equipos'),
]