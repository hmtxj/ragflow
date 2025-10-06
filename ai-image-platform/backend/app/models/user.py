"""
User model
"""

from sqlalchemy import Boolean, Column, Enum, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.base import BaseModel


class User(Base, BaseModel):
    """User model"""
    
    __tablename__ = "users"
    
    # Basic info
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Plan and credits
    plan = Column(
        Enum("free", "pro", "enterprise", name="user_plan"),
        default="free",
        nullable=False
    )
    credits = Column(Integer, default=10, nullable=False)
    total_credits_used = Column(Integer, default=0, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Timestamps for rate limiting
    last_generation_at = Column(String(10), nullable=True)  # YYYY-MM-DD
    generations_today = Column(Integer, default=0, nullable=False)
    
    # Relationships
    api_configs = relationship("ApiConfig", back_populates="user", cascade="all, delete-orphan")
    generated_images = relationship("GeneratedImage", back_populates="user", cascade="all, delete-orphan")
    generation_history = relationship("GenerationHistory", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"