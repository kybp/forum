from rest_access_policy import AccessPolicy


class PostAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "retrieve"],
            "principal": "*",
            "effect": "allow",
        },
        {
            "action": ["create"],
            "principal": "authenticated",
            "effect": "allow",
        },
        {
            "action": ["destroy"],
            "principal": "authenticated",
            "condition": "is_author",
            "effect": "allow",
        },
    ]

    def is_author(self, request, view, action) -> bool:
        return request.user == view.get_object().author


class ReplyAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list"],
            "principal": "*",
            "effect": "allow",
        },
        {
            "action": ["create"],
            "principal": "authenticated",
            "effect": "allow",
        },
        {
            "action": ["destroy"],
            "principal": "authenticated",
            "condition": "is_author",
            "effect": "allow",
        },
    ]

    def is_author(self, request, view, action) -> bool:
        reply = view.get_object()
        return reply is None or request.user == reply.author


class PostReactionAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["create"],
            "principal": "authenticated",
            "effect": "allow",
        },
    ]
