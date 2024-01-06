from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('login/', views.login, name="login"),
    path('register/', views.register, name="register"),
    path('logout/', views.logout, name="logout"),

    # API Routes
    path('articles/<str:category>/<int:n>/<str:q>', views.articles, name="articles"),
    path('article/<str:id>', views.article, name="article"),
    path('profile/<int:id>', views.profile, name="profile"),
    path('save_article/', views.save_article, name="save"),
    path('comment_article/', views.comment_article, name="comment"),
]
