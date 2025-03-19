from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoView

router = DefaultRouter()
router.register(r'todos', TodoView, basename='todo')

urlpatterns = [
    path('', include(router.urls))
]