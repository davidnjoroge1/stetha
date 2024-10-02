from django.urls import path
 
from conversa_dj.chats.consumers import ChatConsumer
 
websocket_urlpatterns = [path("", ChatConsumer.as_asgi())]