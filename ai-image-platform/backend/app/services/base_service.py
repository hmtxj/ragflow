"""
Base service class with common functionality
"""

from typing import Any, Dict, Generic, List, Optional, Type, TypeVar
from uuid import UUID

from sqlalchemy import select, update, delete, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import LoggerMixin

ModelType = TypeVar("ModelType")


class BaseService(Generic[ModelType], LoggerMixin):
    """Base service with CRUD operations"""
    
    def __init__(self, db: AsyncSession, model: Type[ModelType]):
        self.db = db
        self.model = model
    
    async def get_by_id(self, id: UUID) -> Optional[ModelType]:
        """Get record by ID"""
        result = await self.db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_multi(
        self, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[ModelType]:
        """Get multiple records with pagination"""
        query = select(self.model)
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.where(getattr(self.model, key) == value)
        
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filters"""
        query = select(func.count(self.model.id))
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.where(getattr(self.model, key) == value)
        
        result = await self.db.execute(query)
        return result.scalar()
    
    async def create(self, **kwargs) -> ModelType:
        """Create new record"""
        obj = self.model(**kwargs)
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        
        self.logger.info(
            "Created record",
            model=self.model.__name__,
            id=str(obj.id)
        )
        
        return obj
    
    async def update_by_id(self, id: UUID, **kwargs) -> Optional[ModelType]:
        """Update record by ID"""
        await self.db.execute(
            update(self.model)
            .where(self.model.id == id)
            .values(**kwargs)
        )
        await self.db.commit()
        
        self.logger.info(
            "Updated record",
            model=self.model.__name__,
            id=str(id),
            fields=list(kwargs.keys())
        )
        
        return await self.get_by_id(id)
    
    async def delete_by_id(self, id: UUID) -> bool:
        """Delete record by ID"""
        result = await self.db.execute(
            delete(self.model).where(self.model.id == id)
        )
        await self.db.commit()
        
        deleted = result.rowcount > 0
        
        if deleted:
            self.logger.info(
                "Deleted record",
                model=self.model.__name__,
                id=str(id)
            )
        
        return deleted