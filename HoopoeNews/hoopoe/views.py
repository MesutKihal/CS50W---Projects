from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib import messages
from .models import Article, Category, User, Saved, Comment
from django.db.models import Q
from django.contrib.auth import login as auth_login, logout as auth_logout
from . import util
import datetime
import json


def index(request):
    # Get all category names and pass them as a context
    categories = [category for category in Category.objects.all()]
    return render(request, 'hoopoe/index.html', {'items': categories[:4], 'dropdowns': categories[4:]})

def login(request):
    if request.method == "POST":
        # Get username and password from the user
        username = request.POST['username']
        password = request.POST['password']
        # Check if the user exists
        try:
            user = User.objects.get(username=username)
        except:
            user = None
        # Check if the password is right if so login
        if user:
            if password != user.password:
                messages.error(request, "Wrong password")
                return redirect('login')
            else:
                auth_login(request, user)
                return redirect('index')
        else:
            # Notify the user that the user does not exist
            messages.error(request, "User does not exist")
            return redirect('login')
    return render(request, 'hoopoe/login.html')

def register(request):
    if request.method == "POST":
        # Get information from the form
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirm = request.POST["confirm"]
        # Check if the username is taken
        if list(User.objects.filter(username=username)):
            messages.error(request, "Username already taken!")
            return redirect("register")
        # Check if the email is valid
        if not util.reEmail(email):
            messages.error(request, "Email not valid!")
            return redirect("register")
        # Check if the email is taken
        if list(User.objects.filter(email=email)):
            messages.error(request, "Email already taken!")
            return redirect("register")
        # Check if the passwords match
        if password != confirm:
            messages.error(request, "Passwords don't match!")
            return redirect("register")
        # Create a new user
        User.objects.create(username=username, email=email, password=password)
    return render(request, 'hoopoe/register.html')

def logout(request):
    auth_logout(request)
    return redirect('login')

@csrf_exempt
def articles(request, category, n, q):
    # Declaring variables
    data = []
    articles = list(Article.objects.all().order_by('-pubDate'))
    i = (n - 1) * 11
    j = i + 11
    if list(articles) == []: # If no articles are registered fetch them from api
        util.storeArticles()
    else: # Otherwise check if the last article is not uptodate then fetch from api and send newsletters to users 
        if articles[0].pubDate != datetime.date.today():
            util.storeArticles()
            util.removeDuplicates()
            util.Newsletter()
    articles = list(Article.objects.all().order_by('-pubDate'))
    # Filter articles based on category
    category_obj = Category.objects.get(name=category)
    if q == "no-search-query":
        articles = list(Article.objects.filter(category=category_obj).order_by('-pubDate'))
    else:
        articles = list(Article.objects.filter(Q(title__icontains=q) & Q(category=category_obj)).order_by('-pubDate'))
    if i < len(articles):
        # If j is bigger then the length of articles set j = length of articles
        if j > len(articles):
            j = len(articles)
        articles = articles[i:j]
    else:
        articles = []
        
    # Send articles as an array
    for article in articles:
        temp = dict()
        temp['id'] = article.id
        temp['title'] = article.title
        temp['description'] = article.description
        temp['image'] = article.image
        data.append(temp)
    return JsonResponse(data, safe=False)
    
@csrf_exempt
def article(request, id): 
    # Get article from Article model
    article = Article.objects.get(id=id)
    # Store article details inside a dictionnary
    data = dict()
    data['id'] = article.id
    data['title'] = article.title
    data['creator'] = article.creator
    data['pubDate'] = article.pubDate
    data['image'] = article.image
    data['video'] = article.video
    data['description'] = article.description
    data['content'] = article.content
    data['country'] = article.country
    data['category'] = article.category.name
    # Check if the article is saved or not
    if request.user.is_authenticated:
        if Saved.objects.filter(user=request.user, article=article):
            data['isSaved'] = True
    else:
        data['isSaved'] = False
    # Check if a user is logged
    if request.user.is_authenticated:
        data['isLogged'] = True
    else:
        data['isLogged'] = False
    # Get comments relating to the article
    data['comments'] = []
    for comment in Comment.objects.filter(article=article):
        temp = dict()
        temp['user'] = comment.user.username
        temp['content'] = comment.content
        data['comments'].append(temp)
    return JsonResponse(data, safe=False)
   
@csrf_exempt
def profile(request, id):
    # Get user information
    user = User.objects.get(id=id)
    # Get saved articles information
    saved_articles = list()
    for saved in Saved.objects.filter(user=user).values():
        article = Article.objects.get(id=saved['article_id'])
        temp = dict()
        temp['id'] = article.id
        temp['title'] = article.title
        temp['description'] = article.description
        temp['image'] = article.image
        saved_articles.append(temp)
    # Store data inside an array
    data = list()
    data.append(['Username', user.username])
    data.append(['Email', user.email])
    data.append(['Password', user.password])
    data.append(saved_articles)
    return JsonResponse(data, safe=False)
    
@csrf_exempt
def save_article(request):
    # Check whether its a save or unsave action and act accordingly
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            article = Article.objects.get(id=data['article_id'])
            if data['action'] == "save":
                Saved.objects.create(user=request.user, article=article)
            if data['action'] == "unsave": 
                Saved.objects.filter(user=request.user, article=article).delete()
    return JsonResponse({'message': 'request made successfully'}, safe=False)
    
@csrf_exempt
def comment_article(request):
    # Create a comment to the article
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            article = Article.objects.get(id=data['article_id'])
            Comment.objects.create(user=request.user, article=article, content=data['comment'])
    return JsonResponse({'message': 'request made successfully'}, safe=False)