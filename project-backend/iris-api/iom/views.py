from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from iom.serializer import UserSerializer, GroupSerializer, UserStoreVoteSerializer, UserProfileSerializer, StoreIdeaSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from rest_framework import serializers, generics, pagination, test
from rest_framework import generics
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.authtoken.models import Token
from rest_framework_jwt.views import verify_jwt_token
from rest_framework.test import APIClient
import jwt,json
from iom.models import UserProfile, Idea, UserStoreVote

from rest_framework import status
from rest_framework.response import Response
from django.core.paginator import Paginator
from rest_framework.request import Request


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    @csrf_exempt 
    def user_register(request):
        firstname = request.POST['first_name']
        lastname = request.POST['last_name']
        username = request.POST['username']
        email = request.POST['email']
        password = make_password(request.POST['password'], salt=None, hasher='default')
        new_user = User.objects.create(first_name = firstname, last_name = lastname, username = username, email = email, password = password)
        new_user.save()
        user_profile = UserProfile.objects.update_or_create(user = new_user, votes_left = 5)
        user_profile[0].save()
        return HttpResponse(status=201) 

    @csrf_exempt 
    def user_post_register(request):
        auth_token = request.META["HTTP_AUTHORIZATION"]
        token = jwt.decode(auth_token, "SECRET_KEY", algorithm='HS256')
        user = User.objects.get(id = token["id"])
        if request.method == "POST" :
            employeeid = request.POST['employee_id']
            companyname = request.POST['company']
            user_profile = UserProfile.objects.update_or_create(user = user, employee_id = employeeid, company = companyname)
            user_profile.save()
            return HttpResponse(status=201)
        if request.method == "GET" :
            user_profile = UserProfile.objects.get(user = user)
            serializer = UserProfileSerializer(user_profile, many=False)
            return JsonResponse(serializer.data, safe =False)

    @csrf_exempt 
    def user_login(request):
        username = request.POST['username']
        password = request.POST['password']
        login_user = User.objects.get(username = username)
        is_auth = check_password(password, login_user.password)
        token = Token.objects.get_or_create(user=login_user)
        payload = {
            'id': login_user.id,
            'email': login_user.email,
        }
        jwt_token = {'token': jwt.encode(payload, "SECRET_KEY", algorithm='HS256')}
        data1 = {'token':jwt_token['token'].decode('utf-8'),'user_id':login_user.id,'status':201}
        print("data", data1)
        if is_auth :
            return HttpResponse(json.dumps(data1),content_type='application/json')
        else :
            return HttpResponse(json.dumps({'Error': "Invalid credentials"}), status = 401)

    @csrf_exempt
    def user_index(request):
        user_list = User.objects.all()
        serializer = UserSerializer(user_list, many=True)
        return JsonResponse(serializer.data, safe =False)

    @csrf_exempt 
    def user_index_page(request, user_id =None):
        import pdb
        pdb.set_trace()
        user_now = User.objects.get(id= user_id)
        return HttpResponse(status=204)

    @csrf_exempt 
    def user_dashboard(request, user_id =None):
        user_now = User.objects.get(id= user_id)
        user_profile = UserProfile.objects.get(user = user_now)
        data = {'received_votes': user_profile.total_votes,'remaining_votes': votes_left,'status':201}
        return HttpResponse(json.dumps(data1),content_type='application/json')

    @csrf_exempt
    def store_idea_index(request, page_count= 10, page_number= 1):
        auth_token = request.META["HTTP_AUTHORIZATION"]
        token = jwt.decode(auth_token, "SECRET_KEY", algorithm='HS256')
        user_store = Idea.objects.filter(user_id = token["id"])
        total_count = user_store.count()
        serializer_context = {
        'request': Request(request),
        }
        result_page = Paginator(user_store.order_by('user_id'), page_count)
        page_present = result_page.page(page_number)
        present_page_list = page_present.object_list
        serializer = StoreIdeaSerializer(present_page_list,context=serializer_context, many=True)
        return JsonResponse({'store_data': serializer.data,'total_count': total_count}, safe =False)
    
    @csrf_exempt
    def store_idea_create(request):
        auth_token = request.META["HTTP_AUTHORIZATION"]
        token = jwt.decode(auth_token, "SECRET_KEY", algorithm='HS256')
        teamName = request.POST["team_name"]
        managerName = request.POST["manager_name"]
        Theme = request.POST["theme"]
        Application = request.POST["application"]
        user = User.objects.get(id = token["id"])
        store = Idea.objects.create(user = user, team_name = teamName, manager_name = managerName, theme = Theme ,application = Application)
        store.save()
        return HttpResponse(status=201)

    @csrf_exempt
    def user_voting(request, page_count= 10, page_number= 1):
        auth_token = request.META["HTTP_AUTHORIZATION"]
        token = jwt.decode(auth_token, "SECRET_KEY", algorithm='HS256')
        if request.method == "GET":
            user_vote = UserProfile.objects.get(user_id = token["id"])
            user_votes_left  = user_vote.votes_left
            user_store = Idea.objects.exclude(user_id = token["id"])
            total_count = user_store.count()
            serializer_context = {
            'request': Request(request),
            }
            result_page = Paginator(user_store.order_by('user_id'), page_count)
            page_present = result_page.page(page_number)
            present_page_list = page_present.object_list
            serializer = StoreIdeaSerializer(present_page_list,context=serializer_context, many=True)
            idea_voted = UserStoreVote.objects.filter(user_id = token["id"], action = "vote")
            idea_serializer = UserStoreVoteSerializer(idea_voted,context=serializer_context, many=True)
            return JsonResponse({'votes_left': user_votes_left,'total_count': total_count,'store_data': serializer.data,'voted_ideas' : idea_serializer.data}, safe =False)
        if request.method == 'POST':
            store_id = json.loads(request.body.decode('utf-8'))['store_id']
            idea_get = Idea.objects.get(id = store_id)
            idea_get.vote_count += 1
            idea_get.save()
            user_voter = UserProfile.objects.get(user_id =token["id"])
            user_voter.votes_left -=1
            user_voter.save()
            voted_idea = UserStoreVote.objects.create(user_id = token["id"], store_id = store_id, action = 'vote')
            voted_idea.save()
            return HttpResponse(status=201)
    @csrf_exempt
    def is_authenticated(request):
        auth_token = json.loads(request.body.decode('utf-8'))['authenticity_token']
        data = jwt.decode(auth_token, "SECRET_KEY", algorithm='HS256')
        user = 0
        user = User.objects.filter(id = data['id'], email =data['email']).count()   
        if user == 1 :
            return HttpResponse(status =200)
        else:
            return HttpResponse(status=401)


        

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer  