from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    due_date = models.DateTimeField()
    category = models.CharField(max_length=50)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
