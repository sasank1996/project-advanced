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
from iom.models import UserProfile, Idea, UserStoreVote, AdminSettings

from rest_framework import status
from rest_framework.response import Response
from django.core.paginator import Paginator
from rest_framework.request import Request
from mailjet_rest import Client
from django.db.models import Sum
from django.shortcuts import render
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.serializers.json import DjangoJSONEncoder

from django.db.models import F

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
        if request.method == "GET":
            users_list = list(User.objects.all().exclude(id = token["id"]).values('email'))
            return HttpResponse(json.dumps(users_list),content_type='application/json')
        if request.method =="POST":
            teamName = request.POST["team_name"]
            managerName = request.POST["manager_name"]
            Theme = request.POST["theme"]
            file_uploaded = request.FILES["datafile"]
            Application = request.POST["application"]
            fs = FileSystemStorage(location='../assets')
            filename = fs.save(file_uploaded.name, file_uploaded)
            file_url = fs.url(filename)
            file_path= fs.base_location+'/'+file_uploaded.name
            user = User.objects.get(id = token["id"])
            store = Idea.objects.create(user = user, team_name = teamName, manager_name = managerName, theme = Theme ,application = Application,datafile = file_path)
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
            user_voter = UserProfile.objects.get(user_id =token["id"])
            if (user_voter.votes_left) <=0 :
                store_id = json.loads(request.body.decode('utf-8'))['store_id']
                idea_get = Idea.objects.get(id = store_id)
                idea_get.vote_count += 1
                idea_get.save()
                total_vote = Idea.objects.filter(user_id = idea_get.user_id).aggregate(Sum('vote_count'))
                user_total_votes = UserProfile.objects.get(user_id = idea_get.user_id)
                user_total_votes.total_votes = total_vote['vote_count__sum']
                user_total_votes.save()
                user_voter.votes_left -=1
                user_voter.save()
                voted_idea = UserStoreVote.objects.create(user_id = token["id"], store_id = store_id, action = 'vote')
                voted_idea.save()
                return HttpResponse(status=201)
            return HttpResponse(status=401)

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
    
    @csrf_exempt
    def admin_dashboard(request):
        users_count = User.objects.filter(is_staff = 0).count()
        staff_count = User.objects.filter(is_staff = 1).count()
        Ideas_count = Idea.objects.all().count()
        users_with_ideas = Idea.objects.values('user_id').distinct().count()
        users_with_out_ideas = users_count - users_with_ideas

        data1 = {'users_count': users_count,
                'staff_count': staff_count,
                'Ideas_count': Ideas_count,
                'users_with_ideas': users_with_ideas,
                'users_with_out_ideas': users_with_out_ideas,
                'status':201}
        return HttpResponse(json.dumps(data1),content_type='application/json')

    @csrf_exempt 
    def user_index_page(request):
        user_now = UserProfile.objects.all().values('user__first_name','user__last_name','employee_id','votes_left','user__email','total_votes')
        return HttpResponse(json.dumps(list(user_now)),content_type='application/json')

    @csrf_exempt 
    def send_email(request):
        feedback = request.POST.get('feedback-entry')
        mailjet = Client(auth=('8745ac0e4e09bf378f6e3ae03dcd163e', '7ced505df89ead7ee173805d142ef4ab'), version='v3')
        email = {
            'FromName': 'Admin',
            'FromEmail': 'babbu.sasank1996@gmail.com',
            'Subject': 'Test Email',
            'Text-Part': feedback,
            'Recipients': [{'Email': 'sasank.thumati@ggktech.com'}]
        }

        res = mailjet.send.create(email)
    @csrf_exempt
    def store_idea_get(request, store_id):
        idea = Idea.objects.filter(id = store_id).values('vote_count','datafile','team_name','manager_name','theme','application','user__first_name','user__last_name')
        return HttpResponse(json.dumps(list(idea)),content_type='application/json')

    @csrf_exempt
    def admin_settings(request):
        if request.method == 'POST' :            
            original_setting = AdminSettings.objects.get(id =1) 
            votes_per_user = request.POST['Votes_per_user']
            start_date = request.POST['start_date']
            end_date = request.POST['end_date']
            file_size = request.POST['file_size']
            total_voters = request.POST['total_voters']
            settings = AdminSettings.objects.create(vote_count = votes_per_user,start_date = start_date,end_date =end_date,file_size = file_size,voters_count = total_voters)
            settings.save()
            user_profile_update = UserProfile.objects.all().update(votes_left = (F('votes_left') + (int(votes_per_user) - int(original_setting.vote_count))))
            return HttpResponse(status=201)
        if request.method == 'GET' :
            settings = list(AdminSettings.objects.filter(id = 1).values())
            return HttpResponse(json.dumps(settings,sort_keys=True,indent=1,cls=DjangoJSONEncoder),content_type='application/json')



        

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer  