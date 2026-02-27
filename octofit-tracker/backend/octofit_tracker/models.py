from djongo import models
from django.contrib.auth.hashers import make_password, check_password, identify_hasher

class User(models.Model):
    _id = models.ObjectIdField()
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def set_password(self, raw_password):
        """
        Set the user's password, storing a hashed representation.
        """
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """
        Return True if the given raw_password matches the stored hashed password.
        """
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        """
        Ensure that the password is hashed before saving.
        If the current value of self.password is not a recognized hashed password,
        it will be hashed using Django's password hashing framework.
        """
        if self.password:
            try:
                # This will raise a ValueError if self.password is not a valid
                # encoded password recognized by Django's hashers.
                identify_hasher(self.password)
            except Exception:
                self.password = make_password(self.password)
        super().save(*args, **kwargs)
    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Team(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    members = models.JSONField(default=list)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    _id = models.ObjectIdField()
    username = models.CharField(max_length=100)
    activity_type = models.CharField(max_length=100)
    duration = models.FloatField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.username} - {self.activity_type}"


class Leaderboard(models.Model):
    _id = models.ObjectIdField()
    username = models.CharField(max_length=100)
    score = models.FloatField()

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.username}: {self.score}"


class Workout(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    description = models.TextField()
    exercises = models.JSONField(default=list)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
