from django.urls import path
from . import views

urlpatterns = [
    path('asistencias/', views.asistencias, name='asistencias'),
]