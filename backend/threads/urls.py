from django.urls import include, path
from rest_framework_nested import routers

from threads import views

router = routers.SimpleRouter()
router.register("posts", views.PostViewSet)

posts_router = routers.NestedSimpleRouter(router, "posts", lookup="post")
posts_router.register("replies", views.ReplyViewSet)
posts_router.register("reactions", views.PostReactionViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("", include(posts_router.urls)),
    path(
        "posts/<int:pk>/reactions/<slug:type>/",
        views.DeletePostReaction.as_view(),
    ),
]
