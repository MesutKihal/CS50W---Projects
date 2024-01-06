
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    # API routes
    path("posts/<str:name>/<int:n>/<int:id>", views.posts, name="posts"),
    path("like/<int:post_id>", views.like, name="like"),
    path("edit/<int:id>", views.edit, name="edit"),
    path("create/", views.create, name="create"),
    path("users/<int:id>", views.users, name="users"),
] 
