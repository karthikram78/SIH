import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Namma Sevai Cooperative Platform API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./kaushalsetu.db")
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "*"
    ]
    
    # Statutory Fee distribution configuration (Section 14)
    WORKER_SHARE_PERCENT: int = int(os.getenv("WORKER_SHARE_PERCENT", "85"))
    COOPERATIVE_SHARE_PERCENT: int = int(os.getenv("COOPERATIVE_SHARE_PERCENT", "10"))
    PLATFORM_SHARE_PERCENT: int = int(os.getenv("PLATFORM_SHARE_PERCENT", "5"))
    PAYMENT_UPI_ID: str = os.getenv("PAYMENT_UPI_ID", "avadi.connect@upi")

    # Optional Gemini AI API Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
