"""
Generated Image schemas
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, validator

from app.schemas.common import BaseSchema


class GenerationRequest(BaseModel):
    """Image generation request schema"""
    prompt: str
    negative_prompt: Optional[str] = None
    style_tags: List[str] = []
    ratio: str = "1:1"
    quality: str = "normal"
    api_config_id: UUID
    is_fop_mode: bool = False
    
    @validator('prompt')
    def validate_prompt(cls, v):
        if not v or not v.strip():
            raise ValueError('Prompt cannot be empty')
        if len(v) > 2000:
            raise ValueError('Prompt cannot exceed 2000 characters')
        return v.strip()
    
    @validator('negative_prompt')
    def validate_negative_prompt(cls, v):
        if v and len(v) > 1000:
            raise ValueError('Negative prompt cannot exceed 1000 characters')
        return v.strip() if v else None
    
    @validator('ratio')
    def validate_ratio(cls, v):
        allowed_ratios = ["1:1", "2:3", "3:2", "4:3", "16:9", "9:16", "5:7", "7:5"]
        if v not in allowed_ratios:
            raise ValueError(f'Ratio must be one of: {", ".join(allowed_ratios)}')
        return v
    
    @validator('quality')
    def validate_quality(cls, v):
        allowed_qualities = ["normal", "2K", "4K"]
        if v not in allowed_qualities:
            raise ValueError(f'Quality must be one of: {", ".join(allowed_qualities)}')
        return v


class GeneratedImageBase(BaseModel):
    """Base generated image schema"""
    url: str
    thumbnail_url: Optional[str] = None
    filename: str
    file_size: int
    prompt: str
    negative_prompt: Optional[str] = None
    style_tags: List[str] = []
    ratio: str
    quality: str
    generation_time: int
    model_used: str
    provider_used: str
    is_public: bool = False


class GeneratedImage(GeneratedImageBase, BaseSchema):
    """Generated image response schema"""
    id: UUID
    likes: int
    downloads: int
    user_id: UUID
    api_config_id: UUID
    created_at: datetime
    updated_at: datetime