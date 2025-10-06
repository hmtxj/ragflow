"""
User service for user-related business logic
"""

from datetime import datetime
from typing import Dict, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserUpdate
from app.services.base_service import BaseService
from app.utils.exceptions import ConflictError, NotFoundError


class UserService(BaseService[User]):
    """User service"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(db, User)
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        return result.scalar_one_or_none()
    
    async def create_user(
        self, 
        email: str, 
        username: str, 
        password: str,
        **kwargs
    ) -> User:
        """Create a new user"""
        
        # Hash password
        hashed_password = get_password_hash(password)
        
        # Set default credits based on plan
        plan = kwargs.get('plan', 'free')
        if plan == 'free':
            credits = settings.FREE_CREDITS_PER_DAY
        elif plan == 'pro':
            credits = settings.PRO_CREDITS_PER_DAY
        elif plan == 'enterprise':
            credits = settings.ENTERPRISE_CREDITS_PER_DAY
        else:
            credits = settings.FREE_CREDITS_PER_DAY
        
        # Create user
        user = await self.create(
            email=email,
            username=username,
            hashed_password=hashed_password,
            credits=credits,
            **kwargs
        )
        
        self.logger.info(
            "User created",
            user_id=str(user.id),
            email=email,
            username=username,
            plan=plan
        )
        
        return user
    
    async def update_user(
        self, 
        user_id: UUID, 
        user_update: UserUpdate
    ) -> User:
        """Update user profile"""
        
        # Check if username is already taken (if being updated)
        if user_update.username:
            existing_user = await self.get_by_username(user_update.username)
            if existing_user and existing_user.id != user_id:
                raise ConflictError("Username already taken")
        
        # Update user
        update_data = user_update.dict(exclude_unset=True)
        updated_user = await self.update_by_id(user_id, **update_data)
        
        if not updated_user:
            raise NotFoundError("User not found")
        
        self.logger.info(
            "User updated",
            user_id=str(user_id),
            fields=list(update_data.keys())
        )
        
        return updated_user
    
    async def get_usage_stats(self, user_id: UUID) -> Dict:
        """Get user usage statistics"""
        
        user = await self.get_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")
        
        # Calculate credits remaining based on plan
        today = datetime.now().strftime("%Y-%m-%d")
        
        if user.last_generation_at != today:
            # Reset daily credits
            if user.plan == 'free':
                daily_credits = settings.FREE_CREDITS_PER_DAY
            elif user.plan == 'pro':
                daily_credits = settings.PRO_CREDITS_PER_DAY
            elif user.plan == 'enterprise':
                daily_credits = settings.ENTERPRISE_CREDITS_PER_DAY
            else:
                daily_credits = settings.FREE_CREDITS_PER_DAY
            
            generations_today = 0
            credits_remaining = daily_credits
        else:
            generations_today = user.generations_today
            
            # Calculate remaining credits
            if user.plan == 'free':
                daily_limit = settings.FREE_CREDITS_PER_DAY
            elif user.plan == 'pro':
                daily_limit = settings.PRO_CREDITS_PER_DAY
            elif user.plan == 'enterprise':
                daily_limit = settings.ENTERPRISE_CREDITS_PER_DAY
            else:
                daily_limit = settings.FREE_CREDITS_PER_DAY
            
            credits_remaining = max(0, daily_limit - user.total_credits_used)
        
        return {
            "credits_used": user.total_credits_used,
            "credits_remaining": credits_remaining,
            "generations_today": generations_today,
            "total_generations": user.total_credits_used,  # Assuming 1 credit per generation
            "plan": user.plan,
        }
    
    async def consume_credits(self, user_id: UUID, credits: int) -> bool:
        """Consume user credits"""
        
        user = await self.get_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")
        
        # Check if user has enough credits
        usage_stats = await self.get_usage_stats(user_id)
        if usage_stats["credits_remaining"] < credits:
            return False
        
        # Update user credits and stats
        today = datetime.now().strftime("%Y-%m-%d")
        
        if user.last_generation_at != today:
            # Reset daily counter
            generations_today = 1
        else:
            generations_today = user.generations_today + 1
        
        await self.update_by_id(
            user_id,
            total_credits_used=user.total_credits_used + credits,
            last_generation_at=today,
            generations_today=generations_today
        )
        
        self.logger.info(
            "Credits consumed",
            user_id=str(user_id),
            credits=credits,
            total_used=user.total_credits_used + credits
        )
        
        return True