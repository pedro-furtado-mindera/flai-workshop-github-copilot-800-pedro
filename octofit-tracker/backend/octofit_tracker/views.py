from bson import ObjectId
from bson.errors import InvalidId
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import (
    UserSerializer, TeamSerializer, ActivitySerializer,
    LeaderboardSerializer, WorkoutSerializer
)


def _get_by_object_id(model, pk_string):
    """Retrieve a model instance by its MongoDB ObjectId string."""
    try:
        oid = ObjectId(pk_string)
    except (InvalidId, TypeError):
        raise NotFound()
    try:
        return model.objects.get(_id=oid)
    except model.DoesNotExist:
        raise NotFound()


@api_view(['GET'])
def api_root(request):
    import os
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev"
    else:
        base_url = "http://localhost:8000"

    return Response({
        'users': f"{base_url}/api/users/",
        'teams': f"{base_url}/api/teams/",
        'activities': f"{base_url}/api/activities/",
        'leaderboard': f"{base_url}/api/leaderboard/",
        'workouts': f"{base_url}/api/workouts/",
    })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return _get_by_object_id(User, self.kwargs.get('pk'))


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get_object(self):
        return _get_by_object_id(Team, self.kwargs.get('pk'))


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    def get_object(self):
        return _get_by_object_id(Activity, self.kwargs.get('pk'))


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all().order_by('-score')
    serializer_class = LeaderboardSerializer

    def get_object(self):
        return _get_by_object_id(Leaderboard, self.kwargs.get('pk'))


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

    def get_object(self):
        return _get_by_object_id(Workout, self.kwargs.get('pk'))
