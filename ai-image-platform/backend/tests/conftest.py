"""
Test configuration and fixtures
"""

import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.user import User
from app.services.user_service import UserService

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Create test engine
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    echo=False,
)

# Create test session factory
TestSessionLocal = sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest_asyncio.fixture
async def db_session():
    """Create a test database session"""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with TestSessionLocal() as session:
        yield session
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client(db_session):
    """Create a test client"""
    
    def override_get_db():
        return db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def test_user(db_session):
    """Create a test user"""
    user_service = UserService(db_session)
    user = await user_service.create_user(
        email="test@example.com",
        username="testuser",
        password="testpass123",
    )
    return user


@pytest_asyncio.fixture
async def superuser(db_session):
    """Create a test superuser"""
    user_service = UserService(db_session)
    user = await user_service.create_user(
        email="admin@example.com",
        username="admin",
        password="adminpass123",
        is_superuser=True,
        is_verified=True,
    )
    return user


@pytest.fixture
def auth_headers(test_user):
    """Get authentication headers for test user"""
    from app.core.security import create_access_token
    
    token = create_access_token(subject=str(test_user.id))
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def superuser_headers(superuser):
    """Get authentication headers for superuser"""
    from app.core.security import create_access_token
    
    token = create_access_token(subject=str(superuser.id))
    return {"Authorization": f"Bearer {token}"}