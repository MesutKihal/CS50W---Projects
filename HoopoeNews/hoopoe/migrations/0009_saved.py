# Generated by Django 4.2.1 on 2023-12-26 12:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hoopoe', '0008_remove_user_name_alter_user_username'),
    ]

    operations = [
        migrations.CreateModel(
            name='Saved',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='article_saved', to='hoopoe.article')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_savings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
