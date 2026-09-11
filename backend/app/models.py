import json
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    mobile = Column(String(20), nullable=False, index=True)
    email = Column(String(100), nullable=False, index=True)
    role = Column(String(30), nullable=False, default="customer")  # customer, worker, cooperative_admin, platform_admin
    avatar = Column(Text, nullable=True)
    lat = Column(Float, nullable=False, default=13.1147)
    lng = Column(Float, nullable=False, default=80.1048)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, default="Chennai")
    pincode = Column(String(10), nullable=False, default="600017")
    landmark = Column(String(255), nullable=True)
    password_hash = Column(String(255), nullable=True, default="password123")
    created_at = Column(String(50), default=lambda: datetime.utcnow().isoformat())

class OtpChallenge(Base):
    __tablename__ = "otp_challenges"

    id = Column(String(50), primary_key=True, index=True)
    mobile = Column(String(20), nullable=False, index=True)
    code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    attempts = Column(Integer, nullable=False, default=0)
    consumed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Cooperative(Base):
    __tablename__ = "cooperatives"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    registration_number = Column(String(100), nullable=False, unique=True)
    district = Column(String(100), nullable=False, default="Chennai")
    state = Column(String(100), nullable=False, default="Tamil Nadu")
    members_count = Column(Integer, default=50)
    active_workers_count = Column(Integer, default=30)
    monthly_jobs_count = Column(Integer, default=150)
    monthly_earnings_total = Column(Float, default=100000.0)
    welfare_fund_balance = Column(Float, default=10000.0)
    contact_person = Column(String(100), nullable=True)
    contact_mobile = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    established_year = Column(Integer, default=2020)

    workers = relationship("Worker", back_populates="cooperative")

class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    group = Column(String(100), nullable=False)  # Home Services, Vehicle Services, Community Services, Personal Services
    description = Column(Text, nullable=False)
    icon_name = Column(String(50), nullable=False)
    skills = Column(JSON, default=list)  # list of skill strings
    base_price = Column(Float, default=350.0)
    urgency_default = Column(String(20), default="medium")

class Worker(Base):
    __tablename__ = "workers"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    name = Column(String(100), nullable=False)
    mobile = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False)
    avatar = Column(Text, nullable=True)
    headline = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    primary_category = Column(String(100), nullable=False, index=True)
    skills = Column(JSON, default=list)  # list of skill strings
    experience_years = Column(Integer, default=1)
    rating = Column(Float, default=5.0)
    completed_jobs_count = Column(Integer, default=0)
    availability = Column(String(20), default="available", index=True)  # available, busy, offline
    
    # Location
    lat = Column(Float, nullable=False, default=13.0450)
    lng = Column(Float, nullable=False, default=80.2310)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, default="Chennai")
    pincode = Column(String(10), nullable=False, default="600017")
    landmark = Column(String(255), nullable=True)
    service_radius_km = Column(Float, default=8.0)
    base_charge_per_hour = Column(Float, default=350.0)

    # Cooperative affiliation
    cooperative_id = Column(String(50), ForeignKey("cooperatives.id"), nullable=True, index=True)
    cooperative_name = Column(String(200), nullable=False)

    # Verification & Shop
    shop = Column(JSON, nullable=True)  # dict with id, name, address, photoUrl, lat, lng, establishedYear, isShopVerified
    verifications = Column(JSON, default=lambda: {
        "identity": "pending",
        "skill": "pending",
        "shop": "pending",
        "mobile": "verified"
    })
    is_overall_verified = Column(Boolean, default=False)
    joined_date = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    response_time_minutes = Column(Integer, default=10)

    cooperative = relationship("Cooperative", back_populates="workers")
    documents = relationship("WorkerDocument", back_populates="worker", cascade="all, delete-orphan")
    reviews = relationship("RatingReview", back_populates="worker", cascade="all, delete-orphan")
    service_requests = relationship("ServiceRequest", back_populates="assigned_worker")

class WorkerDocument(Base):
    __tablename__ = "worker_documents"

    id = Column(String(50), primary_key=True, index=True)
    worker_id = Column(String(50), ForeignKey("workers.id"), nullable=False, index=True)
    type = Column(String(50), nullable=False)  # identity, skill_certificate, shop_proof, police_clearance
    name = Column(String(200), nullable=False)
    file_url = Column(Text, nullable=False)
    status = Column(String(30), default="pending")  # pending, verified, rejected, needs_info
    uploaded_at = Column(String(50), default=lambda: datetime.utcnow().isoformat())
    verified_at = Column(String(50), nullable=True)
    verified_by = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)

    worker = relationship("Worker", back_populates="documents")

class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), nullable=False, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_mobile = Column(String(20), nullable=False)
    service_category = Column(String(100), nullable=False, index=True)
    required_skill = Column(String(100), nullable=False)
    problem_description = Column(Text, nullable=False)
    urgency = Column(String(20), default="medium")  # low, medium, high, emergency
    is_emergency = Column(Boolean, default=False)

    # Customer Location at time of booking
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, default="Avadi")
    pincode = Column(String(10), nullable=False, default="600054")
    landmark = Column(String(255), nullable=True)

    # Status & Assignment
    status = Column(String(30), default="requested", index=True)  # requested, accepted, navigating, arrived, in_progress, completed, paid, cancelled
    assigned_worker_id = Column(String(50), ForeignKey("workers.id"), nullable=True, index=True)
    match_score = Column(Float, nullable=True)
    match_reasons = Column(JSON, default=list)

    # Timestamps
    created_at = Column(String(50), default=lambda: datetime.utcnow().isoformat())
    accepted_at = Column(String(50), nullable=True)
    arrived_at = Column(String(50), nullable=True)
    started_at = Column(String(50), nullable=True)
    completed_at = Column(String(50), nullable=True)
    paid_at = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)

    # Section 14 Statutory Pricing & Revenue Distribution
    amount = Column(Float, default=450.0)
    worker_earnings = Column(Float, default=382.5)  # 85%
    cooperative_contribution = Column(Float, default=45.0)  # 10%
    platform_fee = Column(Float, default=22.5)  # 5%
    worker_percentage = Column(Integer, default=85)
    cooperative_percentage = Column(Integer, default=10)
    platform_percentage = Column(Integer, default=5)

    payment_method = Column(String(30), nullable=True)  # UPI, Cash, CoopWallet
    payment_status = Column(String(20), default="pending")  # pending, completed
    payment_upi_id = Column(String(100), nullable=True)
    payment_qr_data = Column(Text, nullable=True)
    rating = Column(Float, nullable=True)
    review_text = Column(Text, nullable=True)
    verification_otp = Column(String(10), nullable=False)

    assigned_worker = relationship("Worker", back_populates="service_requests")

class RatingReview(Base):
    __tablename__ = "rating_reviews"

    id = Column(String(50), primary_key=True, index=True)
    service_request_id = Column(String(50), nullable=False, index=True)
    worker_id = Column(String(50), ForeignKey("workers.id"), nullable=False, index=True)
    customer_id = Column(String(50), nullable=False, index=True)
    customer_name = Column(String(100), nullable=False)
    rating = Column(Float, nullable=False)
    review_text = Column(Text, nullable=False)
    created_at = Column(String(50), default=lambda: datetime.utcnow().isoformat())
    service_category = Column(String(100), nullable=False)

    worker = relationship("Worker", back_populates="reviews")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(50), primary_key=True, index=True)
    target_role = Column(String(30), nullable=False, index=True)  # customer, worker, cooperative_admin, platform_admin
    target_user_id = Column(String(50), nullable=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(String(50), default="Just now")
    is_read = Column(Boolean, default=False)
    type = Column(String(30), default="job")  # job, verification, payment, alert
    action_url = Column(String(255), nullable=True)

class VerificationAudit(Base):
    __tablename__ = "verification_audits"

    id = Column(String(50), primary_key=True, index=True)
    worker_id = Column(String(50), nullable=False, index=True)
    worker_name = Column(String(100), nullable=False)
    document_type = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False)  # approved, rejected, more_info_requested
    decided_by = Column(String(100), nullable=False)
    decided_at = Column(String(50), default=lambda: datetime.utcnow().isoformat())
    notes = Column(Text, nullable=False)

class DemandForecast(Base):
    __tablename__ = "demand_forecasts"

    id = Column(String(50), primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    predicted_demand_change = Column(String(50), nullable=False)
    urgency_notice = Column(String(200), nullable=False)
    reason = Column(Text, nullable=False)
    affected_zones = Column(JSON, default=list)  # list of strings
    recommended_action = Column(Text, nullable=False)
