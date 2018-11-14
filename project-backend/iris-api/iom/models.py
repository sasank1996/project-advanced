from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE)
    employee_id = models.IntegerField(blank=True, null = True)
    company = models.CharField(max_length=50, blank=True, null = True)
    total_votes = models.IntegerField(default=0)
    votes_left = models.IntegerField(default=0)

class Idea(models.Model):
    user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE)
    team_name = models.CharField(max_length=50, blank=True,null = True)
    manager_name = models.CharField(max_length=50, blank=True, null = True)
    theme = models.CharField(max_length=200, blank=True,null = True)
    application = models.CharField(max_length=200, blank=True, null = True)
    vote_count = models.IntegerField(default=0)
    datafile = models.FileField(blank=True, null=True)
class UserStoreVote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    store = models.ForeignKey(Idea, on_delete=models.CASCADE)
    ACTION_CHOICES = (
    ("VOTE","vote"),
    ("LIKE","like"),
)
    action = models.CharField(max_length=10, choices = ACTION_CHOICES, default='VOTE')

