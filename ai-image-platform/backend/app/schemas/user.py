"""
User schemas
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, validator

from app.schemas.common import BaseSchema


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema"""
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 2 or len(v) > 20:
            raise ValueError('Username must be between 2 and 20 characters')
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v


class UserUpdate(BaseModel):
    """User update schema"""
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    
    @validator('username')
    def validate_username(cls, v):
        if v is not None:
            if len(v) < 2 or len(v) > 20:
                raise ValueError('Username must be between 2 and 20 characters')
            if not v.replace('_', '').replace('-', '').isalnum():
                raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v


class User(UserBase, BaseSchema):
    """User response schema"""
    id: UUID
    plan: str
    credits: int
    total_credits_used: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime


class UserInDB(User):
    """User schema with sensitive data"""
    hashed_password: str
    is_superuser: bool
    last_generation_at: Optional[str] = None
    generations_today: int = 0