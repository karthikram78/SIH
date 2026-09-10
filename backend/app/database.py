from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Configure connect_args for SQLite if applicable
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def ensure_db_migrations():
    """Ensure any newly added columns exist in existing SQLite databases."""
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) DEFAULT 'password123'"))
            conn.commit()
    except Exception:
        pass  # Column already exists or table not yet created

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

