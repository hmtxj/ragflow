"""
Generation History model
"""

from sqlalchemy import Column, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.base import BaseModel


class GenerationHistory(Base, BaseModel):
    """Generation History model"""
    
    __tablename__ = "generation_history"
    
    # Status
    status = Column(
        Enum("pending", "processing", "completed", "failed", name="generation_status"),
        default="pending",
        nullable=False,
        index=True
    )
    
    # Error handling
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    
    # Credits used
    credits_used = Column(Integer, nullable=False)
    
    # References
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    image_id = Column(UUID(as_uuid=True), ForeignKey("generated_images.id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="generation_history")
    image = relationship("GeneratedImage")
    
    def __repr__(self) -> str:
        return f"<GenerationHistory(id={self.id}, status={self.status}, user_id={self.user_id})>"