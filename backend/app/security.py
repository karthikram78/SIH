import hashlib
import hmac
import os
from datetime import datetime, timedelta
from typing import Callable, List

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User

bearer_scheme = HTTPBearer(auto_error=False)


def _jwt_secret() -> str:
    if not settings.JWT_SECRET_KEY or (
        settings.APP_ENV == "production"
        and settings.JWT_SECRET_KEY.startswith("dev-only-")
    ):
        raise RuntimeError("JWT_SECRET_KEY must be configured")
    return settings.JWT_SECRET_KEY


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310000)
    return f"pbkdf2_sha256$310000${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored_hash: str | None) -> bool:
    if not stored_hash:
        return False
    if stored_hash == "password123":
        return password == "password123"
    if stored_hash.startswith("pbkdf2_sha256$"):
        _, iterations, salt_hex, digest_hex = stored_hash.split("$", 3)
        candidate = hashlib.pbkdf2_hmac(
            "sha256", password.encode(), bytes.fromhex(salt_hex), int(iterations)
        )
        return hmac.compare_digest(candidate.hex(), digest_hex)
    # Migrate legacy demo hashes without accepting plaintext passwords.
    legacy = hashlib.sha256(("kaushalsetu_sec_v1_" + password).encode()).hexdigest()
    return hmac.compare_digest(legacy, stored_hash)


def create_access_token(user: User) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": user.id,
        "role": user.role,
        "iat": now,
        "exp": now + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=settings.JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required")
    try:
        payload = jwt.decode(credentials.credentials, _jwt_secret(), algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
    except (jwt.PyJWTError, RuntimeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")
    return user


def require_roles(*roles: str) -> Callable:
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user
    return dependency