"""
Authentication schemas
"""

from typing import Optional

from pydantic import BaseModel, EmailStr

from app.schemas.user import User


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Registration request schema"""
    email: EmailStr
    username: str
    password: str


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token payload data"""
    sub: Optional[str] = None


class AuthResponse(BaseModel):
    """Authentication response schema"""
    token: str
    user: User