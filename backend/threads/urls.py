from django.urls import path

from threads import views


urlpatterns = [
    path(
        "posts/",
        views.PostViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
    ),
    path("posts/<int:pk>/", views.PostViewSet.as_view({"get": "retrieve"})),
]
