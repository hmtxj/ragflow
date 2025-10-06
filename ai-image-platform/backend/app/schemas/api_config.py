"""
API Config schemas
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import BaseSchema


class ApiConfigBase(BaseModel):
    """Base API config schema"""
    name: str
    type: str  # "text" or "image"
    provider: str
    base_url: str
    model: str


class ApiConfigCreate(ApiConfigBase):
    """API config creation schema"""
    api_key: str


class ApiConfigUpdate(BaseModel):
    """API config update schema"""
    name: Optional[str] = None
    base_url: Optional[str] = None
    api_key: Optional[str] = None
    model: Optional[str] = None
    is_active: Optional[bool] = None


class ApiConfig(ApiConfigBase, BaseSchema):
    """API config response schema"""
    id: UUID
    is_active: bool
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    # Don't expose API key in responses
    class Config:
        exclude = {"api_key"}