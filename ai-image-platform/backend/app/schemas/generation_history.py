"""
Generation History schemas
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import BaseSchema
from app.schemas.generated_image import GeneratedImage


class GenerationHistoryBase(BaseModel):
    """Base generation history schema"""
    status: str  # "pending", "processing", "completed", "failed"
    error_message: Optional[str] = None
    credits_used: int


class GenerationHistory(GenerationHistoryBase, BaseSchema):
    """Generation history response schema"""
    id: UUID
    retry_count: int
    user_id: UUID
    image_id: Optional[UUID] = None
    image: Optional[GeneratedImage] = None
    created_at: datetime
    updated_at: datetime