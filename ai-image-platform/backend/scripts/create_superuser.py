#!/usr/bin/env python3
"""
Script to create a superuser
"""

import asyncio
import sys
from getpass import getpass

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.services.user_service import UserService


async def create_superuser():
    """Create a superuser interactively"""
    
    print("Creating superuser...")
    
    # Get user input
    email = input(f"Email ({settings.FIRST_SUPERUSER_EMAIL}): ").strip()
    if not email:
        email = settings.FIRST_SUPERUSER_EMAIL
    
    username = input("Username (admin): ").strip()
    if not username:
        username = "admin"
    
    password = getpass("Password: ").strip()
    if not password:
        password = settings.FIRST_SUPERUSER_PASSWORD
        print("Using default password from settings")
    
    # Create user
    async with AsyncSessionLocal() as db:
        user_service = UserService(db)
        
        # Check if user already exists
        existing_user = await user_service.get_by_email(email)
        if existing_user:
            print(f"User with email {email} already exists!")
            return
        
        # Create superuser
        user = await user_service.create_user(
            email=email,
            username=username,
            password=password,
            plan="enterprise",
            is_superuser=True,
            is_verified=True,
        )
        
        print(f"Superuser created successfully!")
        print(f"ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"Username: {user.username}")


if __name__ == "__main__":
    asyncio.run(create_superuser())