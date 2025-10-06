"""
API Configuration model
"""

from sqlalchemy import Boolean, Column, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.base import BaseModel


class ApiConfig(Base, BaseModel):
    """API Configuration model"""
    
    __tablename__ = "api_configs"
    
    # Basic info
    name = Column(String(100), nullable=False)
    type = Column(
        Enum("text", "image", name="api_type"),
        nullable=False
    )
    provider = Column(String(50), nullable=False)  # openai, siliconflow, etc.
    
    # API details
    base_url = Column(String(500), nullable=False)
    api_key = Column(Text, nullable=False)  # Encrypted
    model = Column(String(100), nullable=False)
    
    # Settings
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Owner
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="api_configs")
    
    def __repr__(self) -> str:
        return f"<ApiConfig(id={self.id}, name={self.name}, type={self.type}, provider={self.provider})>"