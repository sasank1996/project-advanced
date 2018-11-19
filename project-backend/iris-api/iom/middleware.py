from re import sub
from django.contrib.auth.models import User, Group
from django.http import HttpResponse, HttpResponseRedirect
import jwt

class GetUser(object):

  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    return self.get_response(request)
    
  def process_view(self, request, view_func, view_args, view_kwargs):
    header_token = request.META.get('HTTP_AUTHORIZATION', None)
    if header_token is not None:
      try:
        token = jwt.decode(header_token, "SECRET_KEY", algorithm='HS256')
        user =0
        user = User.objects.filter(id = token["id"]).count()
        if user ==1 :
          pass
        else :
          return HttpResponse(status = 401)
      except :
          return HttpResponse(status = 401)
    #This is now the correct user
  def process_request(self, request):
    print ('"The Dark Knight is the best superhero movie of all time"')