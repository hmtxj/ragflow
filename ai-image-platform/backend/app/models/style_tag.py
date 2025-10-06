"""
Style Tag model
"""

from sqlalchemy import Column, Enum, Integer, String, Text

from app.db.base import Base
from app.models.base import BaseModel


class StyleTag(Base, BaseModel):
    """Style Tag model"""
    
    __tablename__ = "style_tags"
    
    # Basic info
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(50), index=True, nullable=False)
    type = Column(
        Enum("positive", "negative", name="tag_type"),
        default="positive",
        nullable=False
    )
    
    # Details
    description = Column(Text, nullable=True)
    popularity = Column(Integer, default=0, nullable=False, index=True)
    
    # Metadata
    created_by_system = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self) -> str:
        return f"<StyleTag(id={self.id}, name={self.name}, category={self.category}, type={self.type})>"