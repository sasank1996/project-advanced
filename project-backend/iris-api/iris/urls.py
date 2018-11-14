from django.conf.urls import url, include
from rest_framework import routers
from iom import views as iom_views
from django.urls import path, re_path

router = routers.DefaultRouter()
router.register(r'users', iom_views.UserViewSet)
router.register(r'groups', iom_views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [

    path('register/', iom_views.UserViewSet.user_register, name = 'user_register'),
    path('login/', iom_views.UserViewSet.user_login, name = 'user_login'),
    re_path('user-iom/(?P<user_id>\d+)/$', iom_views.UserViewSet.user_index_page, name = 'user_index_page'),
    re_path('post_register/(?P<user_id>\d+)', iom_views.UserViewSet.user_post_register, name = 'user_post_register'),
    path('user/index', iom_views.UserViewSet.user_index, name = 'user_index'),
    re_path('user/(?P<user_id>\d+)/dashboard', iom_views.UserViewSet.user_dashboard, name = 'user_dashboard'),
    re_path('user-iom/(?P<user_id>\d+)/store/(?P<page_count>\d+)/(?P<page_number>\d+)', iom_views.UserViewSet.store_idea_index, name ='store_idea_index'),
    re_path('user-iom/(?P<user_id>\d+)/store/create/', iom_views.UserViewSet.store_idea_create, name ='store_idea_create'),
    re_path('user-iom/(?P<user_id>\d+)/voting/(?P<page_count>\d+)/(?P<page_number>\d+)', iom_views.UserViewSet.user_voting, name ='user_voting'),
    path('is_logged/', iom_views.UserViewSet.is_authenticated, name = 'is_authenticated'),

]   