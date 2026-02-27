from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']
    search_fields = ['username', 'email']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['username', 'activity_type', 'duration']
    list_filter = ['activity_type']
    search_fields = ['username']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['username', 'score']
    ordering = ['-score']
    search_fields = ['username']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
