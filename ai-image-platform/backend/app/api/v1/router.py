"""
API v1 router
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, health

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])

# TODO: Add more routers as we implement them
# api_router.include_router(api_configs.router, prefix="/api-configs", tags=["api-configs"])
# api_router.include_router(generate.router, prefix="/generate", tags=["generation"])
# api_router.include_router(gallery.router, prefix="/gallery", tags=["gallery"])
# api_router.include_router(style_tags.router, prefix="/style-tags", tags=["style-tags"])