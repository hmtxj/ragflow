"""
Health check endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from app.schemas.common import APIResponse

router = APIRouter()


@router.get("/", response_model=APIResponse[dict])
async def health_check():
    """Basic health check"""
    return APIResponse(
        success=True,
        data={
            "status": "healthy",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
        }
    )


@router.get("/detailed", response_model=APIResponse[dict])
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health check with database connectivity"""
    
    # Check database
    db_status = "healthy"
    try:
        await db.execute("SELECT 1")
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # TODO: Add more health checks (Redis, external APIs, etc.)
    
    return APIResponse(
        success=db_status == "healthy",
        data={
            "status": "healthy" if db_status == "healthy" else "unhealthy",
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "checks": {
                "database": db_status,
                # "redis": redis_status,
                # "external_apis": api_status,
            }
        }
    )