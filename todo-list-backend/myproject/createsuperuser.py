# users/management/commands/createsuperuser.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

class Command(BaseCommand):
    help = 'Creates a superuser with a token and predefined credentials'

    def handle(self, *args, **kwargs):
        # Predefined credentials
        username = 'jayrille'
        email = 'jayrille@example.com'
        password = 'admin123'

        # Create superuser
        User = get_user_model()
        
        # Check if the user already exists to avoid duplication
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_superuser(username=username, email=email, password=password)

            # Automatically create and assign a token
            token, created = Token.objects.get_or_create(user=user)

            self.stdout.write(self.style.SUCCESS(f'Superuser {username} created successfully!'))
            self.stdout.write(self.style.SUCCESS(f'Token: {token.key}'))
        else:
            self.stdout.write(self.style.WARNING(f'User with username {username} already exists.'))