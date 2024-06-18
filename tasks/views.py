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
def homepage(request):
    return render(request, 'tasks/index.html')

def create_task(request):
    try:
        print("View function create_task is executing.")
        print("Request method:", request.method)
        print("Request POST data:", request.POST)
    except Exception as e:
        print("Exception occurred:", str(e))  # Print the exception details
        return JsonResponse({'success': False, 'message': 'An error occurred.'})

    # print(request)
    # # if request.method == 'POST':
    #     print("Request data:", request.POST)  # Debugging print
    #     form = TaskForm(request.POST)
    #     if form.is_valid():
    #         form.save()
    #         print("Task created successfully.")  # Debugging print
    #         return JsonResponse({'success': True, 'message': 'Task created successfully.'})
    #     else:
    #         print("Form errors:", form.errors)  # Debugging print
    #         return JsonResponse({'success': False, 'message': 'Form data is not valid.'})
    # else:
    #     return JsonResponse({'success': False, 'message': 'Invalid request method.'})
    

# Retrieve tasks based on status
def get_tasks(request, status):
    tasks = Task.objects.filter(status=status)
    tasks_list = list(tasks.values())
    return JsonResponse(tasks_list, safe=False)

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



