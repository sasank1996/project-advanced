from django.contrib.auth.models import User, Group
from iom.models import UserProfile, Idea, UserStoreVote
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username' ,'email' ,'first_name' , 'last_name' )

class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('user_id', 'employee_id' , 'company', 'total_votes', 'votes_left')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')
class StoreIdeaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Idea
        fields = ('id', 'user_id', 'team_name', 'manager_name', 'theme', 'application', 'vote_count')
class UserStoreVoteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserStoreVote
        fields = ('id', 'user_id', 'action', 'store_id')