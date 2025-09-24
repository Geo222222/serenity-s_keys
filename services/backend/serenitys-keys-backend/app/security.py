"""Security and authentication helpers."""
from __future__ import annotations

import time
import uuid
from enum import Enum
from typing import Any, List, Optional

import jwt
from fastapi import Depends, HTTPException, Request, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import get_settings
from .exceptions import BaseAPIException

settings = get_settings()

# Use strong algorithm by default
JWT_ALGORITHM = "HS256"

class Role(str, Enum):
    ADMIN = "admin"
    INSTRUCTOR = "instructor"
    USER = "user"

class AuthError(BaseAPIException):
    """Authentication related errors."""
    def __init__(self, detail: str) -> None:
        super().__init__(
            status_code=401,
            detail=detail,
            error_code="AUTHENTICATION_ERROR"
        )

class PermissionError(BaseAPIException):
    """Authorization related errors."""
    def __init__(self, detail: str) -> None:
        super().__init__(
            status_code=403,
            detail=detail,
            error_code="PERMISSION_DENIED"
        )

def create_token(
    subject: str,
    roles: List[Role],
    ttl_seconds: int = 3600,
    additional_claims: Optional[dict] = None
) -> str:
    """Create a JWT token with roles and claims."""
    now = int(time.time())
    claims = {
        "sub": subject,
        "roles": [role.value for role in roles],
        "jti": str(uuid.uuid4()),
        "iat": now,
        "exp": now + ttl_seconds,
    }
    if additional_claims:
        claims.update(additional_claims)
    
    return jwt.encode(claims, settings.admin_jwt_secret, algorithm=JWT_ALGORITHM)

def make_admin_token(sub: str = "admin", ttl_seconds: int = 3600) -> str:
    """Create an admin token with full privileges."""
    return create_token(
        subject=sub,
        roles=[Role.ADMIN],
        ttl_seconds=ttl_seconds,
        additional_claims={"type": "admin"}
    )

auth_scheme = HTTPBearer()

def get_token_claims(
    credentials: HTTPAuthorizationCredentials = Security(auth_scheme)
) -> dict[str, Any]:
    """Validate and decode JWT token."""
    try:
        return jwt.decode(
            credentials.credentials,
            settings.admin_jwt_secret,
            algorithms=[JWT_ALGORITHM]
        )
    except jwt.ExpiredSignatureError:
        raise AuthError("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthError("Invalid token")

def check_role(allowed_roles: List[Role]) -> Any:
    """Create a dependency that checks for required roles."""
    def role_checker(claims: dict = Depends(get_token_claims)) -> dict[str, Any]:
        user_roles = [Role(role) for role in claims.get("roles", [])]
        if not any(role in allowed_roles for role in user_roles):
            raise PermissionError("Insufficient permissions")
        return claims
    return role_checker

# Convenience dependencies for common auth patterns
require_admin = check_role([Role.ADMIN])
require_instructor = check_role([Role.ADMIN, Role.INSTRUCTOR])
require_auth = check_role([Role.ADMIN, Role.INSTRUCTOR, Role.USER])
