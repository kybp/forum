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
    path("posts/<int:pk>/replies", views.GetPostReplies.as_view()),
    path("replies/", views.ReplyViewSet.as_view({"post": "create"})),
]
