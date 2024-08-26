from django.urls import include, path
from rest_framework_nested import routers

from users import views

router = routers.SimpleRouter()
router.register("users", views.UserViewSet)
router.register("accounts", views.AccountViewSet, "account")

urlpatterns = [
    path("", include(router.urls)),
    path("token/", views.ObtainAuthTokenView.as_view()),
    path("themes/", views.GetThemesView.as_view()),
]
