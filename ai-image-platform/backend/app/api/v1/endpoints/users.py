"""
User management endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.user import User as UserSchema, UserUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get("/profile", response_model=APIResponse[UserSchema])
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    
    return APIResponse(
        success=True,
        data=UserSchema.from_orm(current_user)
    )


@router.put("/profile", response_model=APIResponse[UserSchema])
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user profile"""
    
    user_service = UserService(db)
    
    # Update user
    updated_user = await user_service.update_user(
        user_id=current_user.id,
        user_update=user_update
    )
    
    return APIResponse(
        success=True,
        data=UserSchema.from_orm(updated_user),
        message="Profile updated successfully"
    )


@router.get("/usage", response_model=APIResponse[dict])
async def get_user_usage(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user usage statistics"""
    
    user_service = UserService(db)
    usage_stats = await user_service.get_usage_stats(current_user.id)
    
    return APIResponse(
        success=True,
        data=usage_stats
    )


# TODO: Implement these endpoints
# @router.post("/change-password", response_model=APIResponse[None])
# async def change_password(
#     current_password: str,
#     new_password: str,
#     current_user: User = Depends(get_current_user),
#     db: AsyncSession = Depends(get_db)
# ):
#     """Change user password"""
#     pass

# @router.delete("/account", response_model=APIResponse[None])
# async def delete_account(
#     current_user: User = Depends(get_current_user),
#     db: AsyncSession = Depends(get_db)
# ):
#     """Delete user account"""
#     pass