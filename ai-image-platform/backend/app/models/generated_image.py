"""
Generated Image model
"""

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.base import BaseModel


class GeneratedImage(Base, BaseModel):
    """Generated Image model"""
    
    __tablename__ = "generated_images"
    
    # Image info
    url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    
    # Generation parameters
    prompt = Column(Text, nullable=False)
    negative_prompt = Column(Text, nullable=True)
    style_tags = Column(ARRAY(String), nullable=True)
    ratio = Column(String(10), nullable=False)  # "1:1", "16:9", etc.
    quality = Column(String(10), nullable=False)  # "normal", "2K", "4K"
    
    # Metadata
    generation_time = Column(Integer, nullable=False)  # in seconds
    model_used = Column(String(100), nullable=False)
    provider_used = Column(String(50), nullable=False)
    
    # Social features
    is_public = Column(Boolean, default=False, nullable=False)
    likes = Column(Integer, default=0, nullable=False)
    downloads = Column(Integer, default=0, nullable=False)
    
    # Owner and API config
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    api_config_id = Column(UUID(as_uuid=True), ForeignKey("api_configs.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="generated_images")
    api_config = relationship("ApiConfig")
    
    def __repr__(self) -> str:
        return f"<GeneratedImage(id={self.id}, filename={self.filename}, user_id={self.user_id})>"