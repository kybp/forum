from django.urls import path

from users import views

urlpatterns = [
    path("", views.CreateUserView.as_view()),
    path("token/", views.ObtainAuthTokenView.as_view()),
]
