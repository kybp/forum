from django.urls import include, path
from rest_framework_nested import routers

from users import views

router = routers.SimpleRouter()
router.register("accounts", views.UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("token/", views.ObtainAuthTokenView.as_view()),
]
