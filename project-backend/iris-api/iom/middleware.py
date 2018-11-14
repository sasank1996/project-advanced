from re import sub
from django.contrib.auth.models import User, Group

class GetUser(object):

  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    return self.get_response(request)
    
  def process_view(self, request, view_func, view_args, view_kwargs):
    import pdb
    pdb.set_trace()
    header_token = request.META.get('HTTP_AUTHORIZATION', None)
    if header_token is not None:
      try:
        token = sub('Token ', '', request.META.get('HTTP_AUTHORIZATION', None))
        token_obj = Token.objects.get(key = token)
        request.user = token_obj.user
      except Token.DoesNotExist:
        pass
    #This is now the correct user
    print (request.user)

  def process_request(self, request):
    print ('"The Dark Knight is the best superhero movie of all time"')