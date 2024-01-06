from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=64, unique=True)
    email = models.CharField(max_length=64)
    password = models.CharField(max_length=64)
    
    
class Post(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name="myposts", on_delete = models.CASCADE)
    content = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Follower(models.Model):
    id = models.AutoField(primary_key=True)
    main_user = models.ForeignKey(User, related_name="users", on_delete = models.CASCADE)
    followed_user = models.ForeignKey(User, related_name="followers", on_delete = models.CASCADE)

class Like(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    post = models.ManyToManyField(Post)
    