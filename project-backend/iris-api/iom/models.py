from django.db import models
from django.contrib.auth.models import User
from singleton_model import SingletonModel

class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE)
    employee_id = models.IntegerField(blank=True, null = True)
    company = models.CharField(max_length=50, blank=True, null = True)
    total_votes = models.IntegerField(default=0)
    votes_left = models.IntegerField(default=0)

class Idea(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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


class AdminVoter(models.Model):
    user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE)
    is_voter = models.BooleanField(default=False)
    is_viewer = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)


class AdminSettings(SingletonModel):
    vote_count = models.IntegerField(default=0)
    start_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    end_date = models.DateTimeField(auto_now=False, auto_now_add=False)
    file_size = models.IntegerField(default=0)
    voters_count =  models.IntegerField(default=0)

