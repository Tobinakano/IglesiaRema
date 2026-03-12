from django.shortcuts import render

def asistencias(request):
    return render(request, 'asistencia.html')