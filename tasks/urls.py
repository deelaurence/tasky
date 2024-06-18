from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name='homepage'),  # Homepage URL
    path('signup/',views.SignUpView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('api/users/', views.users_list, name='users_list'),
    path('api/task/create/', views.create_task, name='create_task'),
    path('api/tasks/<str:status>/', views.get_tasks, name='get_tasks'),
    path('api/task/update/<int:task_id>/', views.update_task, name='update_task'),
    path('api/task/delete/<int:task_id>/', views.delete_task, name='delete_task'),
]

