from django.db import models

# Create your models here.
class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(max_length=500, blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title