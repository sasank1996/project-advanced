# Generated by Django 2.1.2 on 2018-11-09 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iom', '0002_auto_20181108_1001'),
    ]

    operations = [
        migrations.AlterField(
            model_name='idea',
            name='datafile',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]