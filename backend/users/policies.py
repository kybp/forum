from rest_access_policy import AccessPolicy


class UserAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["retrieve"],
            "principal": "*",
            "effect": "allow",
        },
        {
            "action": ["create"],
            "principal": "*",
            "effect": "allow",
        },
        {
            "action": ["destroy"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": "is_self",
        },
    ]

    def is_self(self, request, view, action) -> bool:
        return request.user == view.get_object()
