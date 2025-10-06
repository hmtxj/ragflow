"""
Authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, Token
from app.schemas.common import APIResponse
from app.schemas.user import User as UserSchema
from app.services.user_service import UserService
from app.utils.exceptions import AuthenticationError, ConflictError

router = APIRouter()


@router.post("/register", response_model=APIResponse[AuthResponse])
async def register(
    user_data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""
    
    user_service = UserService(db)
    
    # Check if user already exists
    existing_user = await user_service.get_by_email(user_data.email)
    if existing_user:
        raise ConflictError("Email already registered")
    
    existing_username = await user_service.get_by_username(user_data.username)
    if existing_username:
        raise ConflictError("Username already taken")
    
    # Create user
    user = await user_service.create_user(
        email=user_data.email,
        username=user_data.username,
        password=user_data.password
    )
    
    # Generate tokens
    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))
    
    return APIResponse(
        success=True,
        data=AuthResponse(
            token=access_token,
            user=UserSchema.from_orm(user)
        ),
        message="Registration successful"
    )


@router.post("/login", response_model=APIResponse[AuthResponse])
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Login user"""
    
    user_service = UserService(db)
    
    # Get user by email
    user = await user_service.get_by_email(login_data.email)
    if not user:
        raise AuthenticationError("Invalid email or password")
    
    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        raise AuthenticationError("Invalid email or password")
    
    # Check if user is active
    if not user.is_active:
        raise AuthenticationError("Account is disabled")
    
    # Generate tokens
    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))
    
    return APIResponse(
        success=True,
        data=AuthResponse(
            token=access_token,
            user=UserSchema.from_orm(user)
        ),
        message="Login successful"
    )


@router.post("/logout", response_model=APIResponse[None])
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (client should discard tokens)"""
    
    # In a more sophisticated setup, you might want to:
    # 1. Add token to a blacklist in Redis
    # 2. Log the logout event
    # 3. Invalidate refresh tokens
    
    return APIResponse(
        success=True,
        message="Logout successful"
    )


@router.get("/me", response_model=APIResponse[UserSchema])
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    
    return APIResponse(
        success=True,
        data=UserSchema.from_orm(current_user)
    )


# TODO: Implement these endpoints
# @router.post("/refresh", response_model=APIResponse[Token])
# async def refresh_token(refresh_token: str):
#     """Refresh access token"""
#     pass

# @router.post("/forgot-password", response_model=APIResponse[None])
# async def forgot_password(email: str):
#     """Send password reset email"""
#     pass

# @router.post("/reset-password", response_model=APIResponse[None])
# async def reset_password(token: str, new_password: str):
#     """Reset password with token"""
#     pass

# @router.post("/verify-email", response_model=APIResponse[None])
# async def verify_email(token: str):
#     """Verify email address"""
#     pass