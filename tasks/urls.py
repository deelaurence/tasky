from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.homepage, name='homepage'),  # Homepage URL
    path('signup/',views.SignUpView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('api/users/', views.users_list, name='users_list'),
    path('api/task/create/', views.create_task, name='create_task'),
    path('api/tasks/<str:status>/', views.get_tasks, name='get_tasks'),
    path('api/single-task/<int:task_id>/', views.get_task, name='get_task'),
    path('api/task/update/<int:task_id>/', views.update_task, name='update_task'),
    path('api/task/delete/<int:task_id>/', views.delete_task, name='delete_task'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)