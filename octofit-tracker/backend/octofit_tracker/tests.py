from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout


class UserModelTest(TestCase):
    def setUp(self):
        User.objects.all().delete()

    def test_create_user(self):
        user = User.objects.create(username='ironman', email='tony@avengers.com', password='secret')
        self.assertEqual(user.username, 'ironman')
        self.assertEqual(user.email, 'tony@avengers.com')

    def test_user_str(self):
        user = User.objects.create(username='thor', email='thor@avengers.com', password='secret')
        self.assertEqual(str(user), 'thor')


class TeamModelTest(TestCase):
    def setUp(self):
        Team.objects.all().delete()

    def test_create_team(self):
        team = Team.objects.create(name='Team Marvel', members=['ironman', 'thor'])
        self.assertEqual(team.name, 'Team Marvel')
        self.assertIn('ironman', team.members)

    def test_team_str(self):
        team = Team.objects.create(name='Team DC', members=['batman'])
        self.assertEqual(str(team), 'Team DC')


class ActivityModelTest(TestCase):
    def setUp(self):
        Activity.objects.all().delete()

    def test_create_activity(self):
        activity = Activity.objects.create(username='spiderman', activity_type='Web Slinging', duration=30.0)
        self.assertEqual(activity.username, 'spiderman')
        self.assertEqual(activity.activity_type, 'Web Slinging')
        self.assertEqual(activity.duration, 30.0)

    def test_activity_str(self):
        activity = Activity.objects.create(username='batman', activity_type='Martial Arts', duration=90.0)
        self.assertIn('batman', str(activity))


class LeaderboardModelTest(TestCase):
    def setUp(self):
        Leaderboard.objects.all().delete()

    def test_create_leaderboard_entry(self):
        entry = Leaderboard.objects.create(username='wonderwoman', score=750.0)
        self.assertEqual(entry.username, 'wonderwoman')
        self.assertEqual(entry.score, 750.0)

    def test_leaderboard_str(self):
        entry = Leaderboard.objects.create(username='superman', score=500.0)
        self.assertIn('superman', str(entry))


class WorkoutModelTest(TestCase):
    def setUp(self):
        Workout.objects.all().delete()

    def test_create_workout(self):
        workout = Workout.objects.create(
            name='Avengers Endurance',
            description='Build stamina like an Avenger.',
            exercises=['Running', 'Burpees']
        )
        self.assertEqual(workout.name, 'Avengers Endurance')
        self.assertIn('Running', workout.exercises)

    def test_workout_str(self):
        workout = Workout.objects.create(name='DC Power Circuit', description='Strength training.', exercises=[])
        self.assertEqual(str(workout), 'DC Power Circuit')


class APIEndpointTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        User.objects.create(username='ironman', email='tony@avengers.com', password='secret')
        Team.objects.create(name='Team Marvel', members=['ironman'])
        Activity.objects.create(username='ironman', activity_type='Flying', duration=45.0)
        Leaderboard.objects.create(username='ironman', score=450.0)
        Workout.objects.create(name='Avengers Endurance', description='Build stamina.', exercises=['Running'])

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_root_path(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_users_list(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teams_list(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_activities_list(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leaderboard_list(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_workouts_list(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
