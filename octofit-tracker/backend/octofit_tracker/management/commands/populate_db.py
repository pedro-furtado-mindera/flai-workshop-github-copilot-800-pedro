from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Cleared existing data.')

        # Users - superheroes
        users_data = [
            {'username': 'ironman', 'email': 'tony@avengers.com', 'password': 'pepper4ever'},
            {'username': 'spiderman', 'email': 'peter@avengers.com', 'password': 'mj4ever'},
            {'username': 'thor', 'email': 'thor@avengers.com', 'password': 'mjolnir123'},
            {'username': 'batman', 'email': 'bruce@dc.com', 'password': 'alfred123'},
            {'username': 'superman', 'email': 'clark@dc.com', 'password': 'krypton99'},
            {'username': 'wonderwoman', 'email': 'diana@dc.com', 'password': 'themyscira1'},
        ]
        for u in users_data:
            User.objects.create(**u)
        self.stdout.write('Users created.')

        # Teams
        Team.objects.create(
            name='Team Marvel',
            members=['ironman', 'spiderman', 'thor']
        )
        Team.objects.create(
            name='Team DC',
            members=['batman', 'superman', 'wonderwoman']
        )
        self.stdout.write('Teams created.')

        # Activities
        activities_data = [
            {'username': 'ironman', 'activity_type': 'Flying', 'duration': 45.0},
            {'username': 'spiderman', 'activity_type': 'Web Slinging', 'duration': 30.0},
            {'username': 'thor', 'activity_type': 'Hammer Throw', 'duration': 60.0},
            {'username': 'batman', 'activity_type': 'Martial Arts', 'duration': 90.0},
            {'username': 'superman', 'activity_type': 'Flying', 'duration': 50.0},
            {'username': 'wonderwoman', 'activity_type': 'Combat Training', 'duration': 75.0},
        ]
        for a in activities_data:
            Activity.objects.create(**a)
        self.stdout.write('Activities created.')

        # Leaderboard
        leaderboard_data = [
            {'username': 'ironman', 'score': 450.0},
            {'username': 'batman', 'score': 900.0},
            {'username': 'thor', 'score': 600.0},
            {'username': 'wonderwoman', 'score': 750.0},
            {'username': 'spiderman', 'score': 300.0},
            {'username': 'superman', 'score': 500.0},
        ]
        for lb in leaderboard_data:
            Leaderboard.objects.create(**lb)
        self.stdout.write('Leaderboard created.')

        # Workouts
        workouts_data = [
            {
                'name': 'Avengers Endurance',
                'description': 'Build stamina like an Avenger.',
                'exercises': ['Running', 'Jumping Jacks', 'Burpees', 'Push-ups']
            },
            {
                'name': 'DC Power Circuit',
                'description': 'Strength training inspired by DC heroes.',
                'exercises': ['Deadlift', 'Bench Press', 'Squat', 'Pull-ups']
            },
            {
                'name': 'Spider Agility',
                'description': 'Improve agility and flexibility like Spider-Man.',
                'exercises': ['Yoga', 'Box Jumps', 'Balance Drills', 'Sprints']
            },
        ]
        for w in workouts_data:
            Workout.objects.create(**w)
        self.stdout.write('Workouts created.')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
