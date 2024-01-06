from newsdataapi import NewsDataApiClient
import datetime
from .models import Article, Category, User
import re
from django.core.mail import send_mail
from django.conf import settings
import datetime

def reEmail(text):
    pattern = re.compile(r'^[a-zA-Z0-9.-]+@{1}[a-zA-Z]+.{1}[a-z]+$')
    if re.fullmatch(pattern, text):
        return True
    else:
        return False
        
def removeDuplicates():
    titles = set([article.title for article in Article.objects.all()])
    for title in titles:
        filtered = list(Article.objects.filter(title=title))
        for i in range(1, len(filtered)):
            Article.objects.filter(id=filtered[i].id).delete()
    return

def Newsletter():
    top = list(Article.objects.filter(category=Category.objects.get(name="top")).order_by('-pubDate'))[4]
    sports = list(Article.objects.filter(category=Category.objects.get(name="sports")).order_by('-pubDate'))[2]
    world = list(Article.objects.filter(category=Category.objects.get(name="world")).order_by('-pubDate'))[0]
    recipients = [usr.email for usr in list(User.objects.filter(is_superuser=False))]
    html_content = f"""
        This is hoopoe newsletter about the top headlines on {datetime.date.today()}:
        <h1>Top</h1>
        <div>
            <img width="768" height="512" src="{top.image}"></img>
        </div>
        <div>
            <h4>{top.title}</h4>
            <p>{top.content[0:200]}...</p>
        </div>
        <h1>Sports</h1>
        <div>
            <img width="768" height="512" src="{sports.image}"></img>
        </div>
        <div>
            <h4>{sports.title}</h4>
            <p>{sports.content[0:200]}...</p>
        </div>
        <h1>world</h1>
        <div>
            <img width="768" height="512" src="{world.image}"></img>
        </div>
        <div>
            <h4>{world.title}</h4>
            <p>{world.content[0:200]}...</p>
        </div>
        
        Find out more by visiting hoopoenews.com.
        
        \t\t\tRegards,
    """
    send_mail(
        "Subject",
        html_content,
        settings.EMAIL_HOST_USER,
        recipients,
    )
    return 

def storeArticles():
    # API key authorization, Initialize the client with your API key
    api = NewsDataApiClient(apikey="pub_34931435791cfa2f671101e9b5f90ee9314b4")
    # You can paginate till last page by providing "page" parameter
    page=None
    i = 0
    while i < 10:
        response = api.news_api(page = page, language = 'en')
        results = response['results']
        page = response.get('nextPage',None)

        for res in results:
            id = res['article_id']
            title = res['title']
            if type(res['creator']) is list:
                creator = res['creator'][0]
            else:
                creator = ""
            if type(res['video_url']) is list:
                video = res['video_url'][0]
            else:
                video = ""
            if res['description']:
                description = res['description']
            else:
                description = ""
            if res['content']:
                content = res['content']
            else:
                content = ""
            if res['pubDate']:
                y = int(res['pubDate'][:4])
                m = int(res['pubDate'][5:7])
                d = int(res['pubDate'][8:10])
                pubDate = datetime.datetime(y, m, d)
            else:
                pubDate = ""
            if res['image_url']:
                image = res['image_url']
            else:
                image = ""
            if res['country']:
                country = res['country'][0]
            else:
                country = ""
            if not Category.objects.filter(name=res['category'][0]):
                Category.objects.create(name=res['category'][0])
            for i in range(len(res['category'])):
                category = Category.objects.get(name=res['category'][i])
                try:
                    temp = Article.objects.get(id=res['article_id'], category=category)
                    if not temp:
                        Article.objects.create(id=res['article_id'],
                                            title=title,
                                            creator=creator,
                                            video=video,
                                            description=description,
                                            content=content,
                                            pubDate=pubDate,
                                            image=image,
                                            country=country,
                                            category=category)
                    else:
                        print("Article already exists!")
                except error:
                    print("ERROR!")
        if not page:
            break
        i += 1

