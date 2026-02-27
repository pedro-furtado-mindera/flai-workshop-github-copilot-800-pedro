from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    class Meta:
        model = Team
        fields = ['_id', 'name', 'members']


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    class Meta:
        model = Activity
        fields = ['_id', 'username', 'activity_type', 'duration']


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    class Meta:
        model = Leaderboard
        fields = ['_id', 'username', 'score']


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'exercises']
