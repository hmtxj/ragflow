"""
Custom exception classes for the application
"""

from typing import Any, Dict, Optional


class AppException(Exception):
    """Base application exception"""
    
    def __init__(
        self,
        message: str,
        error_code: str = "APP_ERROR",
        status_code: int = 400,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(AppException):
    """Validation error"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=422,
            details=details
        )


class AuthenticationError(AppException):
    """Authentication error"""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_ERROR",
            status_code=401
        )


class AuthorizationError(AppException):
    """Authorization error"""
    
    def __init__(self, message: str = "Access denied"):
        super().__init__(
            message=message,
            error_code="AUTHORIZATION_ERROR",
            status_code=403
        )


class NotFoundError(AppException):
    """Resource not found error"""
    
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            error_code="NOT_FOUND",
            status_code=404
        )


class ConflictError(AppException):
    """Resource conflict error"""
    
    def __init__(self, message: str = "Resource conflict"):
        super().__init__(
            message=message,
            error_code="CONFLICT",
            status_code=409
        )


class RateLimitError(AppException):
    """Rate limit exceeded error"""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(
            message=message,
            error_code="RATE_LIMIT_EXCEEDED",
            status_code=429
        )


class ExternalServiceError(AppException):
    """External service error"""
    
    def __init__(self, message: str, service: str):
        super().__init__(
            message=f"{service}: {message}",
            error_code="EXTERNAL_SERVICE_ERROR",
            status_code=502,
            details={"service": service}
        )


class InsufficientCreditsError(AppException):
    """Insufficient credits error"""
    
    def __init__(self, required: int, available: int):
        super().__init__(
            message=f"Insufficient credits. Required: {required}, Available: {available}",
            error_code="INSUFFICIENT_CREDITS",
            status_code=402,
            details={"required": required, "available": available}
        )


class FileUploadError(AppException):
    """File upload error"""
    
    def __init__(self, message: str):
        super().__init__(
            message=message,
            error_code="FILE_UPLOAD_ERROR",
            status_code=400
        )


class ImageGenerationError(AppException):
    """Image generation error"""
    
    def __init__(self, message: str, provider: str):
        super().__init__(
            message=f"Image generation failed: {message}",
            error_code="IMAGE_GENERATION_ERROR",
            status_code=500,
            details={"provider": provider}
        )