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
    path('user/index', iom_views.UserViewSet.user_index, name = 'user_index'),
    re_path('user/(?P<user_id>\d+)/dashboard/$', iom_views.UserViewSet.user_dashboard, name = 'user_dashboard'),
    re_path('user-iom/store/(?P<page_count>\d+)/(?P<page_number>\d+)', iom_views.UserViewSet.store_idea_index, name ='store_idea_index'),
    re_path('user-iom/store/create/', iom_views.UserViewSet.store_idea_create, name ='store_idea_create'),
    re_path('user-iom/voting/(?P<page_count>\d+)/(?P<page_number>\d+)', iom_views.UserViewSet.user_voting, name ='user_voting'),
    path('is_logged/', iom_views.UserViewSet.is_authenticated, name = 'is_authenticated'),
    path('user-iom/post_register', iom_views.UserViewSet.user_post_register, name ='user_post_register'),
    path('admin/user-iom/dashboard', iom_views.UserViewSet.admin_dashboard, name ='admin_dashboard'),
    path('admin/user-iom/userindex', iom_views.UserViewSet.user_index_page, name ='user_index_page'),
    path('sendemail/', iom_views.UserViewSet.send_email, name ='send_email'),
    path('admin/user-iom/settings', iom_views.UserViewSet.admin_settings, name ='admin_settings'),
    re_path('user-iom/store/(?P<store_id>\d+)', iom_views.UserViewSet.store_idea_get, name ='store_idea_get'),





]   