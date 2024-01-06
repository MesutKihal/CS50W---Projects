# Generated by Django 4.2.1 on 2023-12-18 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hoopoe', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='country',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='article',
            name='creator',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='article',
            name='image',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AddField(
            model_name='article',
            name='pubDate',
            field=models.DateField(default='1900-01-01'),
        ),
        migrations.AddField(
            model_name='article',
            name='video',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='article',
            name='title',
            field=models.CharField(default='', max_length=255),
        ),
    ]
