from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine, SessionLocal
from app.seed import seed_database
from app.routers import (
    auth,
    workers,
    cooperatives,
    categories,
    requests,
    matching,
    ai,
    reviews,
    notifications,
    admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed default database if empty
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full Backend REST API for the Namma Sevai Cooperative Platform empowering skilled local tradespeople, verified artisan cooperatives, and community service dispatch.",
    lifespan=lifespan
)

# Enable CORS for Next.js web application
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(workers.router, prefix=settings.API_PREFIX)
app.include_router(cooperatives.router, prefix=settings.API_PREFIX)
app.include_router(categories.router, prefix=settings.API_PREFIX)
app.include_router(requests.router, prefix=settings.API_PREFIX)
app.include_router(matching.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(reviews.router, prefix=settings.API_PREFIX)
app.include_router(notifications.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "statutory_fee_split": {
            "workerShare": f"{settings.WORKER_SHARE_PERCENT}%",
            "cooperativeWelfareShare": f"{settings.COOPERATIVE_SHARE_PERCENT}%",
            "platformOperationsShare": f"{settings.PLATFORM_SHARE_PERCENT}%"
        }
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
