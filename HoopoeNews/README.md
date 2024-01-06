# Description

Hoopoe News is a cutting-edge web application designed to revolutionize the way users consume news. With its sleek and intuitive interface, the app provides a seamless experience for staying informed. Hoopoe News features real-time updates, breaking news alerts, and a user-friendly bookmarking system. Whether it's global headlines or specific topics, Hoopoe News delivers a diverse range of high-quality content, making it a go-to destination for individuals seeking an efficient and customized news browsing experience.

# Distinctiveness and Complexity

Hoopoe News distinctiveness manifests itself in many aspects, as the app is a web-based news outlet, which is different from all the other projects we worked on during the CS50 web programming course; it is neither an e-commerce nor a social network nor a clone of a popular website.

Second, Hoopoe News does not share the same features as the previous projects we worked on; it does not allow user intervention on the content (a.k.a., editing) like [Network](https://cs50.harvard.edu/web/2020/projects/4/network/) and [Wiki](https://cs50.harvard.edu/web/2020/projects/1/wiki/); it does not redirect users to other big websites for information like [Search](https://cs50.harvard.edu/web/2020/projects/0/search/); and lastly, it is not a platform for users to gain money like [Commerce](https://cs50.harvard.edu/web/2020/projects/2/commerce/) but rather to gain information.

The complexity of Hoopoe News lies in the fact that it fetches news from NewsData.io and organizes and stores it in a database for easier access later, as well as removing duplicates if needed, sending daily newsletters, and many more.

# Features

* **Interactiveness and Responsiveness**: The app is mobile responsive and uses the single-page application technique, which improves the interactiveness and speed of the app.
* **Daily news update**: Hoopoe News fetches the latest news from the [NewData.io API] (https://newsdata.io/) and organizes and stores those articles in the database, as well as removing duplicates if necessary.
* **Newsletters**: User will get daily newsletters containing the top headings in the three main categories top, world and sports. 
* **Categories**: The articles in Hoopoe News are divided into 12 different categories; each category has a different page. Some news can be found in two or more categories at the same time.
* **Pagination**: Users can read more articles than none after clicking on the'more' button at the end of the page. Each time the button is clicked, eleven more articles are loaded.
* **Bookmarking**: Users can bookmark and unbookmark news; the bookmarked news can be found on the profile page.
* **Comments**: Users can comment on articles using an input that can be found at the bottom of each article. The comments can also be seen at the end of each page.
* **Searching**: Both users and non-users can search for any news heading by typing any keywords, and the app will query the specific news that contains the keywords.

# File structure

```
______ capstone/
        |____ __init__.py
        |____ asgi.py
        |____ settings.py
        |____ urls.py
        |____ wsgi.py
______ hoopoe/
        |____ migrations/
                |____ __init__.py
        |____ static/
        |       |____ img/
        |       |      |____ hoopoe.png
        |       |      |____ noimage.jpg
        |       |      |____ saved.png 
        |       |      |____ unsaved.png
        |       |____ js/
        |              |____ index.js
        |____ templates/
        |          |____ hoopoe/
        |                   |____ index.html
        |                   |____ layout.html
        |                   |____ login.html
        |                   |____ register.html
        |____ __init__.py
        |____ admin.py
        |____ apps.py
        |____ models.py
        |____ tests.py
        |____ urls.py
        |____ util.py
        |____ views.py
______ manage.py
______ db.sqlite3
______ readme.md
______ requirements.txt
```
*hoopoe/models.py* 
this file contains all the models the app needs to operate.

*hoopoe/views.py* 
this file contains the views for the templates the app has.

*hoopoe/util.py*
contains many functions that app needs to fetch data from api, organize and store data aswell send newsletters and many more.

*hoopoe/static/js/index.js*
this file has all the javascript that the app heavily relies on.

# How to run the app

To run the app you need to follow these steps:

### Install all required dependencies
First open the terminal in the projects directory were you'll find requirements.txt then run this command:
```
pip install -r requirements.txt
```
### Make migrations and apply them
Next, you'll need to apply all migrations if you have deleted the db.sqlite3 database that we provided that has already many articles stored by running these commands:
```
python manage.py makemigrations hoopoe
python manage.py migrate
```
If you want to create a superuser run:
```
python manage.py createsuperuser
```
### Run the server
Afterwards you are good to go you'll just need to run the server by running:
```
python manage.py runserver
```
