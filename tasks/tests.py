from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Task

class TaskViewsTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='password123')

        # Create a test task
        self.task = Task.objects.create(
            title='Test Task',
            description='This is a test task.',
            status='TODO',
            priority='HIGH',
            due_date='2024-06-20',
            category='Testing',
            assigned_to=self.user
        )

    def test_homepage_view(self):
        # Check if homepage redirects if you are not logged in.....
        response = self.client.get(reverse('homepage'))
        self.assertEqual(response.status_code, 302)

    def test_create_task_view(self):
        # Test creating a new task via POST request
        data = {
            'title': 'New Task',
            'description': 'This is a new task.',
            'status': 'TODO',
            'priority': 'MEDIUM',
            'due_date': '2024-06-30',
            'category': 'Testing',
            'assigned_to': self.user.id
        }
        response = self.client.post(reverse('create_task'), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        

    def test_get_tasks_view(self):
        # Test retrieving tasks based on status
        response = self.client.get(reverse('get_tasks', kwargs={'status': 'TODO'}))
        self.assertEqual(response.status_code, 200)
        tasks = response.json()
        self.assertEqual(len(tasks), 1)  # Ensure we get exactly one task

    def test_get_task_view(self):
        # Test retrieving a single task
        response = self.client.get(reverse('get_task', kwargs={'task_id': self.task.id}))
        self.assertEqual(response.status_code, 200)
        task = response.json()
        self.assertEqual(task['id'], self.task.id)

    def test_update_task_view(self):
        # Test updating an existing task via POST request
        data = {
            'title': 'Updated Task',
            'description': 'This task has been updated.',
            'status': 'IN_PROGRESS',
            'priority': 'LOW',
            'due_date': '2024-07-15',
            'category': 'Testing',
            'assigned_to': self.user.id
        }
        response = self.client.post(reverse('update_task', kwargs={'task_id': self.task.id}), data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        updated_task = Task.objects.get(id=self.task.id)
        self.assertEqual(updated_task.title, 'Test Task')

    def test_delete_task_view(self):
        # Test deleting an existing task via POST request
        response = self.client.post(reverse('delete_task', kwargs={'task_id': self.task.id}))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Task.objects.filter(id=self.task.id).exists())

    def test_login_view(self):
        # Test login view
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)

    def test_signup_view(self):
        # Test signup view
        response = self.client.get(reverse('signup'))
        self.assertEqual(response.status_code, 200)

    def test_users_list_view(self):
        # Test users list API view
        response = self.client.get(reverse('users_list'))
        self.assertEqual(response.status_code, 200)
        users = response.json()
        self.assertEqual(len(users), 1)  # Ensure there is at least one user in the list
