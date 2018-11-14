# Generated by Django 2.1.2 on 2018-11-12 09:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('iom', '0003_auto_20181109_1244'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserStoreVote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(choices=[('VOTE', 'vote'), ('LIKE', 'like')], default='VOTE', max_length=10)),
                ('store', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='iom.Idea')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
