from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import JsonResponse
import json
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from .models import User, Post, Follower, Like
from django.core.paginator import Paginator
import datetime


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
def posts(request, name, n, id=None):
    if id == None:
        id = request.user.id
    if name == "all_posts":
        data = []
        followed_users = []
        if request.user.is_authenticated:
            followed_users = [follower.followed_user for follower in Follower.objects.filter(main_user=request.user)]
        
        for post in Post.objects.all().order_by("-created_at"):
            temp = dict()
            temp['username'] = post.user.username
            temp['user_id'] = post.user.id
            temp['post_id'] = post.id
            temp['likes'] = len([like for like in Like.objects.filter(post=post)])
            temp['content'] = post.content
            if str(post.created_at)[:11] == str(datetime.datetime.today())[:11]:
                temp['created_at'] = f'{post.created_at.hour}:{post.created_at.minute}'
            else:
                temp['created_at'] = str(post.created_at)[:11]
            if Like.objects.filter(user=request.user.id, post=post):
                temp['LikedByMe'] = True
            else:
                temp['LikedByMe'] = False
            temp['isFollowed'] = False
            temp['isUser'] = False
            temp['isLogged'] = False
            if post.user in followed_users:
                temp['isFollowed'] = True
            if request.user.is_authenticated:
                temp['isLogged'] = True
                if post.user == request.user:
                    temp['isUser'] = True
                    
            data.append(temp)
        p = Paginator(data, 10).page(n)
        page = p.object_list
        page.append({"hasPrev": p.has_previous(), "hasNext": p.has_next()})
        
        return JsonResponse(page, safe=False)
    elif name == "following":
        data = []
        followed_users = [follower.followed_user for follower in Follower.objects.filter(main_user=request.user)]
        for follower in followed_users:
            for post in Post.objects.filter(user=follower).order_by("-created_at"):
                temp = dict()
                temp['username'] = post.user.username
                temp['user_id'] = post.user.id
                temp['post_id'] = post.id
                temp['likes'] = len([like for like in Like.objects.filter(post=post)])
                temp['content'] = post.content
                if str(post.created_at)[:11] == str(datetime.datetime.today())[:11]:
                    temp['created_at'] = f'{post.created_at.hour}:{post.created_at.minute}'
                else:
                    temp['created_at'] = str(post.created_at)[:11]
                if Like.objects.filter(user=request.user.id, post=post):
                    temp['LikedByMe'] = True
                else:
                    temp['LikedByMe'] = False
                temp['isUser'] = False
                temp['isLogged'] = False
                if request.user.is_authenticated:
                    temp['isLogged'] = True
                    if post.user == request.user:
                        temp['isUser'] = True
                data.append(temp)
        p = Paginator(data, 10).page(n)
        page = p.object_list
        page.append({"hasPrev": p.has_previous(), "hasNext": p.has_next()})
        return JsonResponse(page, safe=False)
    elif name == "profile":
        data = []
        this_user = User.objects.get(id=id)
        followed_by_me = [follower.followed_user for follower in Follower.objects.filter(main_user=request.user)]
        followed_users = [follower.followed_user for follower in Follower.objects.filter(main_user=this_user)]
        follower_users = [follower.main_user for follower in Follower.objects.filter(followed_user=this_user)]
        for follower in followed_users:
            for post in Post.objects.filter(user=follower).order_by("-created_at"):
                temp = dict()
                temp['username'] = post.user.username
                temp['user_id'] = post.user.id
                temp['post_id'] = post.id
                temp['likes'] = len([like for like in Like.objects.filter(post=post)])
                temp['content'] = post.content
                if str(post.created_at)[:11] == str(datetime.datetime.today())[:11]:
                    temp['created_at'] = f'{post.created_at.hour}:{post.created_at.minute}'
                else:
                    temp['created_at'] = str(post.created_at)[:11]
                if Like.objects.filter(user=id, post=post):
                    temp['LikedByMe'] = True
                else:
                    temp['LikedByMe'] = False
                temp['isUser'] = False
                temp['isLogged'] = False
                if request.user.is_authenticated:
                    temp['isLogged'] = True
                    if post.user == request.user:
                        temp['isUser'] = True
                data.append(temp)
        p = Paginator(data, 10).page(n)
        page = p.object_list
        if this_user in followed_by_me:
            page.append({"hasPrev": p.has_previous(), "hasNext": p.has_next(), "following": len(followed_users), "followers": len(follower_users), "user": this_user.username, "id":this_user.id, "isFollowed": True})
        elif this_user == request.user:
            page.append({"hasPrev": p.has_previous(), "hasNext": p.has_next(), "following": len(followed_users), "followers": len(follower_users), "user": this_user.username, "id":this_user.id, "isFollowed": None})
        else:
            page.append({"hasPrev": p.has_previous(), "hasNext": p.has_next(), "following": len(followed_users), "followers": len(follower_users), "user": this_user.username, "id":this_user.id, "isFollowed": False})
        return JsonResponse(page, safe=False)
            
@csrf_exempt
def create(request):
    if request.method == "POST":
        content = json.loads(request.body)['content']
        Post.objects.create(user = request.user, content = content)
    return JsonResponse({"message": "Post created successfully"}, status=201)
    
@csrf_exempt
def users(request, id):
    followed_users = [follower.followed_user for follower in Follower.objects.filter(main_user=request.user)]
    if json.loads(request.body)['action'] == "Follow":
        if not User.objects.get(id=id) in followed_users:
            Follower.objects.create(main_user = request.user, followed_user = User.objects.get(id=id))
        return JsonResponse({"message": "User Followed successfully"}, status=201)
    if json.loads(request.body)['action'] == "Unfollow":
        if User.objects.get(id=id) in followed_users:
            Follower.objects.get(main_user = request.user, followed_user = User.objects.get(id=id)).delete()
        return JsonResponse({"message": "User Unfollowed successfully"}, status=201)

@csrf_exempt
def edit(request, id):
    post = Post.objects.filter(id=id)
    if request.method == "PUT":
        this_post = Post.objects.filter(id=id).update(content=json.loads(request.body)['content'])
    return JsonResponse({"content": f"{Post.objects.get(id=id).content}"}, status=201)

@csrf_exempt
def like(request, post_id):
    this_post = Post.objects.get(id=post_id)
    if json.loads(request.body)['action'] == "Like":
        like_object = Like(user = request.user)
        like_object.save()
        like_object.post.add(this_post)
        return JsonResponse({"message": f"Post made by {this_post.user.username} Liked"}, status=201)
    else:
        like_objects = Like.objects.filter(user=request.user, post=this_post)
        for like in like_objects:
            like.delete()
        return JsonResponse({"message": f"Post made by {this_post.user.username} Unliked"}, status=201)