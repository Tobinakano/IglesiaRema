from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def familiaRemanente(request):
    return render(request, 'familiaRemanente.html')

def equipos(request):
    return render(request, 'Equipos.html')