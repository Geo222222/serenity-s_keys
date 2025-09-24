"""Custom exceptions for the Serenity's Keys backend."""
from typing import Any, Optional

from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    """Base exception for all API errors."""
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        extra: Optional[dict[str, Any]] = None
    ) -> None:
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code or "UNKNOWN_ERROR"
        self.extra = extra or {}


class ValidationError(BaseAPIException):
    """Raised when request validation fails."""
    def __init__(self, detail: str, extra: Optional[dict[str, Any]] = None) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code="VALIDATION_ERROR",
            extra=extra
        )


class ResourceNotFound(BaseAPIException):
    """Raised when a requested resource is not found."""
    def __init__(self, resource: str, resource_id: Any) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} with id {resource_id} not found",
            error_code="RESOURCE_NOT_FOUND",
            extra={"resource": resource, "id": str(resource_id)}
        )


class DependencyError(BaseAPIException):
    """Raised when a required external service fails."""
    def __init__(self, service: str, detail: str) -> None:
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"{service} service error: {detail}",
            error_code="DEPENDENCY_ERROR",
            extra={"service": service}
        )


class ResourceConflict(BaseAPIException):
    """Raised when there's a conflict with existing resources."""
    def __init__(self, detail: str, extra: Optional[dict[str, Any]] = None) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            error_code="RESOURCE_CONFLICT",
            extra=extra
        )