from django.urls import path

from users import views

urlpatterns = [
    path("", views.UserViewSet.as_view({"post": "create"})),
    path("<int:pk>/", views.UserViewSet.as_view({"get": "retrieve"})),
    path("token/", views.ObtainAuthTokenView.as_view()),
]
