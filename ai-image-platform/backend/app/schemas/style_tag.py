"""
Style Tag schemas
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import BaseSchema


class StyleTagBase(BaseModel):
    """Base style tag schema"""
    name: str
    category: str
    type: str = "positive"  # "positive" or "negative"
    description: Optional[str] = None


class StyleTagCreate(StyleTagBase):
    """Style tag creation schema"""
    pass


class StyleTagUpdate(BaseModel):
    """Style tag update schema"""
    name: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None


class StyleTag(StyleTagBase, BaseSchema):
    """Style tag response schema"""
    id: UUID
    popularity: int
    created_at: datetime
    updated_at: datetime