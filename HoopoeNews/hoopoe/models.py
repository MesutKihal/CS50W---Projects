from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=64, unique=True)
    email = models.EmailField()
    password = models.CharField(max_length=64)
    def __str__(self):
        return self.username
    
class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    class Meta:
        verbose_name_plural = "Categories"
    def __str__(self):
        return self.name

class Article(models.Model):
    id = models.CharField(primary_key=True, default="0", max_length=64)
    title = models.CharField(max_length=255, default="")
    creator = models.CharField(max_length=255,  default=None)
    video = models.CharField(max_length=255,  default=None)
    description = models.TextField()
    content = models.TextField()
    pubDate = models.DateField(default=datetime.date(1900,1,1))
    image = models.CharField(max_length=255, default=None)
    country = models.CharField(max_length=255, default=None)
    category = models.ForeignKey(Category, related_name="article_category", on_delete=models.CASCADE)
    def __str__(self):
        return self.title
    
class Saved(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name="user_savings", on_delete=models.CASCADE)
    article = models.ForeignKey(Article, related_name="article_saved", on_delete=models.CASCADE)
    class Meta:
        verbose_name_plural = "Savings"
    def __str__(self):
        return str(self.user.username) + " saves article" + str(self.article.id)

class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name="user_comment", on_delete=models.CASCADE)
    article = models.ForeignKey(Article, related_name="article_comment", on_delete=models.CASCADE)
    content = models.CharField(max_length=255)
    class Meta:
        verbose_name_plural = "Comments"
    def __str__(self):
        return str(self.user.username) + " commented on article " + str(self.article.id)