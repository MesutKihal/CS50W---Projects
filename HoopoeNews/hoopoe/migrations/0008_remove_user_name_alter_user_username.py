# Generated by Django 4.2.1 on 2023-12-24 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hoopoe', '0007_alter_article_pubdate'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='name',
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=64, unique=True),
        ),
    ]
