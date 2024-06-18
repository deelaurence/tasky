from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Task
from .forms import TaskForm
from django.contrib.auth.forms import UserCreationForm 
from django.urls import reverse_lazy 
from django.views.generic import CreateView 
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView

class LoginView(LoginView):
    template_name = 'users/login.html'
    # redirect_authenticated_user = True
    # redirect_url = '/'




class SignUpView(CreateView): 
    form_class = UserCreationForm 
    template_name = 'users/signup.html' 
    success_url = reverse_lazy('login')

def users_list(request):
    users = User.objects.all().values('id', 'username')
    return JsonResponse(list(users), safe=False)



# Homepage view
@login_required
def homepage(request):
    return render(request, 'tasks/index.html')

# def create_task(request):
from django.http import JsonResponse
import json

def create_task(request):
    print(request)
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()          
            return JsonResponse({'success': True, 'message': 'Task created successfully.'})
        else:
            
            return JsonResponse({'success': False, 'message': 'Form data is not valid.'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'})
    

# Retrieve tasks based on status
def get_tasks(request, status):
    tasks = Task.objects.filter(status=status).select_related('assigned_to')
    tasks_list = [
        {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status,
            'priority': task.priority,
            'due_date': task.due_date,
            'category': task.category,
            'assigned_to': task.assigned_to.username if task.assigned_to else None  # Include username
        }
        for task in tasks
    ]
    return JsonResponse(tasks_list, safe=False)

#get one task by its id
def get_task(request, task_id):
    # Retrieve the task object from the database or return 404 if not found
    task = get_object_or_404(Task, pk=task_id)

    # Serialize task data into JSON-serializable format
    task_data = {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'priority': task.priority,
        'due_date': task.due_date,
        'category': task.category,
        'assigned_to': task.assigned_to.username if task.assigned_to else None
    }

    # Return JSON response with the task data
    return JsonResponse(task_data)



# Update task
@csrf_exempt
def update_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True, 'message': 'Task updated successfully.'})
    return JsonResponse({'success': False, 'message': 'Failed to update task.'})

# Delete task
@csrf_exempt
def delete_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    task.delete()
    return JsonResponse({'success': True, 'message': 'Task deleted successfully.'})



