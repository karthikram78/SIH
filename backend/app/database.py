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
    migrations = [
        "ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) DEFAULT 'password123'",
        "ALTER TABLE service_requests ADD COLUMN payment_upi_id VARCHAR(100)",
        "ALTER TABLE service_requests ADD COLUMN payment_qr_data TEXT",
    ]
    with engine.connect() as conn:
        for migration in migrations:
            try:
                conn.execute(text(migration))
                conn.commit()
            except Exception:
                pass  # Column already exists or table is not created yet
        conn.execute(text("UPDATE users SET lat = 13.1147, lng = 80.1048, address = 'Avadi Main Road, Avadi', city = 'Avadi', pincode = '600054' WHERE id = 'cust-101'"))
        conn.execute(text("UPDATE workers SET lat = 13.1147, lng = 80.1048, address = 'Avadi Main Road, Avadi', city = 'Avadi', pincode = '600054' WHERE id LIKE 'worker-%'"))
        conn.commit()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

