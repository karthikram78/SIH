import random
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ServiceRequest, Worker, Cooperative, Notification, User, ServiceCategory
from app.schemas import (
    ServiceRequestResponse,
    ServiceRequestCreate,
    ServiceRequestStatusUpdate,
    LocationCoordinates,
    PaymentBreakdown
)
from app.services.fee_calculator import calculate_payment_split
from app.config import settings
from app.routers.workers import worker_model_to_schema

router = APIRouter(prefix="/requests", tags=["Service Requests & Jobs"])

def request_model_to_schema(req: ServiceRequest) -> ServiceRequestResponse:
    assigned_worker_res = None
    if req.assigned_worker:
        assigned_worker_res = worker_model_to_schema(req.assigned_worker)

    breakdown = PaymentBreakdown(
        totalAmount=req.amount,
        workerEarnings=req.worker_earnings,
        cooperativeContribution=req.cooperative_contribution,
        platformFee=req.platform_fee,
        workerPercentage=req.worker_percentage,
        cooperativePercentage=req.cooperative_percentage,
        platformPercentage=req.platform_percentage
    )

    return ServiceRequestResponse(
        id=req.id,
        customerId=req.customer_id,
        customerName=req.customer_name,
        customerMobile=req.customer_mobile,
        serviceCategory=req.service_category,
        requiredSkill=req.required_skill,
        problemDescription=req.problem_description,
        urgency=req.urgency,
        isEmergency=req.is_emergency,
        location=LocationCoordinates(
            lat=req.lat,
            lng=req.lng,
            address=req.address,
            city=req.city,
            pincode=req.pincode,
            landmark=req.landmark
        ),
        status=req.status,
        assignedWorkerId=req.assigned_worker_id,
        assignedWorker=assigned_worker_res,
        matchScore=req.match_score,
        matchReasons=req.match_reasons or [],
        createdAt=req.created_at,
        acceptedAt=req.accepted_at,
        arrivedAt=req.arrived_at,
        startedAt=req.started_at,
        completedAt=req.completed_at,
        paidAt=req.paid_at,
        notes=req.notes,
        amount=req.amount,
        paymentBreakdown=breakdown,
        paymentMethod=req.payment_method,
        paymentStatus=req.payment_status,
        paymentUpiId=req.payment_upi_id,
        paymentQrData=req.payment_qr_data,
        rating=req.rating,
        reviewText=req.review_text,
        verificationOtp=req.verification_otp
    )

@router.get("", response_model=List[ServiceRequestResponse])
def get_requests(
    customer_id: Optional[str] = None,
    worker_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ServiceRequest).order_by(ServiceRequest.created_at.desc())

    if customer_id:
        query = query.filter(ServiceRequest.customer_id == customer_id)
    if worker_id:
        query = query.filter(ServiceRequest.assigned_worker_id == worker_id)
    if status:
        query = query.filter(ServiceRequest.status == status)

    requests = query.all()
    return [request_model_to_schema(r) for r in requests]

@router.get("/{request_id}", response_model=ServiceRequestResponse)
def get_request(request_id: str, db: Session = Depends(get_db)):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Service request not found")
    return request_model_to_schema(req)

@router.post("", response_model=ServiceRequestResponse, status_code=201)
def create_service_request(
    payload: ServiceRequestCreate,
    db: Session = Depends(get_db)
):
    req_id = f"req-{uuid.uuid4().hex[:5]}"
    otp = f"{random.randint(1000, 9999)}"

    # Default location to customer's home coordinates if not provided
    loc = payload.location or LocationCoordinates(
        lat=13.1147,
        lng=80.1048,
        address="Avadi Main Road, Avadi",
        city="Avadi",
        pincode="600054"
    )

    customer_id = payload.customerId or "cust-101"
    customer = db.query(User).filter(User.id == customer_id).first()
    if not customer:
        customer = User(
            id=customer_id,
            name=payload.customerName or "Avadi Customer",
            mobile=payload.customerMobile or "+91 98421 77312",
            email=f"{customer_id}@avadi-connect.local",
            role="customer",
            address=loc.address,
            city=loc.city,
            pincode=loc.pincode,
            lat=loc.lat,
            lng=loc.lng,
            landmark=loc.landmark,
        )
        db.add(customer)

    category_price = db.query(ServiceCategory.base_price).filter(ServiceCategory.name.ilike(payload.category)).scalar()
    amount = payload.amount if payload.amount is not None and payload.amount > 0 else (category_price or 450.0)
    split = calculate_payment_split(amount)
    upi_id = settings.PAYMENT_UPI_ID
    payment_qr_data = f"upi://pay?pa={upi_id}&pn=Avadi%20Connect&am={split.totalAmount:.2f}&cu=INR"

    assigned_worker = None
    if payload.workerId:
        assigned_worker = db.query(Worker).filter(Worker.id == payload.workerId).first()

    new_req = ServiceRequest(
        id=req_id,
        customer_id=customer_id,
        customer_name=payload.customerName or "Priya Sharma",
        customer_mobile=payload.customerMobile or "+91 98421 77312",
        service_category=payload.category,
        required_skill=payload.skill,
        problem_description=payload.problem,
        urgency=payload.urgency,
        is_emergency=payload.isEmergency,
        lat=loc.lat,
        lng=loc.lng,
        address=loc.address,
        city=loc.city,
        pincode=loc.pincode,
        landmark=loc.landmark,
        status="requested",
        assigned_worker_id=payload.workerId,
        match_score=payload.matchScore or 92.0,
        match_reasons=payload.matchReasons or ["Optimal nearby cooperative worker match"],
        created_at=datetime.utcnow().isoformat(),
        amount=split.totalAmount,
        worker_earnings=split.workerEarnings,
        cooperative_contribution=split.cooperativeContribution,
        platform_fee=split.platformFee,
        worker_percentage=split.workerPercentage,
        cooperative_percentage=split.cooperativePercentage,
        platform_percentage=split.platformPercentage,
        payment_status="pending",
        payment_upi_id=upi_id,
        payment_qr_data=payment_qr_data,
        verification_otp=otp
    )
    db.add(new_req)

    # Trigger notification for worker if assigned
    if payload.workerId:
        notif = Notification(
            id=f"notif-{uuid.uuid4().hex[:6]}",
            target_role="worker",
            target_user_id=payload.workerId,
            title="🚨 URGENT EMERGENCY REQUEST" if payload.isEmergency else "New Service Request Nearby",
            message=f"{new_req.customer_name} requested {payload.category} ({payload.skill}) at {loc.address.split(',')[0]} (Est: ₹{amount})",
            timestamp="Just now",
            is_read=False,
            type="job"
        )
        db.add(notif)

    db.commit()
    db.refresh(new_req)
    return request_model_to_schema(new_req)

@router.patch("/{request_id}/status", response_model=ServiceRequestResponse)
def update_job_status(
    request_id: str,
    payload: ServiceRequestStatusUpdate,
    db: Session = Depends(get_db)
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Service request not found")

    new_status = payload.status
    now = datetime.utcnow().isoformat()

    # If completing job, verify OTP if passed
    if new_status == "completed":
        if payload.verificationOtp and payload.verificationOtp != req.verification_otp:
            raise HTTPException(status_code=400, detail="Invalid verification OTP. Please ask customer for correct 4-digit code.")
        req.completed_at = now

    if new_status == "accepted":
        req.accepted_at = now
    elif new_status == "navigating":
        pass
    elif new_status == "arrived":
        req.arrived_at = now
    elif new_status == "in_progress":
        req.started_at = now
    if payload.amount is not None and new_status in {"completed", "paid"}:
        if payload.amount < 100 or payload.amount > 50000:
            raise HTTPException(status_code=400, detail="Service amount must be between ₹100 and ₹50,000.")
        split = calculate_payment_split(payload.amount)
        req.amount = split.totalAmount
        req.worker_earnings = split.workerEarnings
        req.cooperative_contribution = split.cooperativeContribution
        req.platform_fee = split.platformFee
        req.worker_percentage = split.workerPercentage
        req.cooperative_percentage = split.cooperativePercentage
        req.platform_percentage = split.platformPercentage
        req.payment_upi_id = settings.PAYMENT_UPI_ID
        req.payment_qr_data = f"upi://pay?pa={settings.PAYMENT_UPI_ID}&pn=Avadi%20Connect&am={split.totalAmount:.2f}&cu=INR"
    if new_status == "paid":
        req.paid_at = now
        req.payment_status = "completed"
        if payload.paymentMethod:
            req.payment_method = payload.paymentMethod

        final_amount = payload.amount or req.amount
        split = calculate_payment_split(final_amount)
        req.amount = split.totalAmount
        req.worker_earnings = split.workerEarnings
        req.cooperative_contribution = split.cooperativeContribution
        req.platform_fee = split.platformFee
        req.payment_upi_id = settings.PAYMENT_UPI_ID
        req.payment_qr_data = f"upi://pay?pa={settings.PAYMENT_UPI_ID}&pn=Avadi%20Connect&am={split.totalAmount:.2f}&cu=INR"

        # Update worker completed jobs count
        if req.assigned_worker_id:
            worker = db.query(Worker).filter(Worker.id == req.assigned_worker_id).first()
            if worker:
                worker.completed_jobs_count += 1
                # Update cooperative welfare fund & monthly stats
                if worker.cooperative_id:
                    coop = db.query(Cooperative).filter(Cooperative.id == worker.cooperative_id).first()
                    if coop:
                        coop.monthly_jobs_count += 1
                        coop.monthly_earnings_total += final_amount
                        coop.welfare_fund_balance += split.cooperativeContribution

    req.status = new_status

    # Add notification for customer
    notif_msg = f"Job status updated to {new_status}"
    if new_status == "accepted":
        notif_msg = f"Your request has been accepted by the worker and they are preparing."
    elif new_status == "navigating":
        notif_msg = f"The worker is currently on the way to your location."
    elif new_status == "arrived":
        notif_msg = f"Worker has arrived at your address! Share OTP {req.verification_otp} to begin."
    elif new_status == "completed":
        notif_msg = f"Work marked complete! Please inspect the job and proceed to transparent payment."
    elif new_status == "paid":
        notif_msg = f"Payment of ₹{req.amount} confirmed via {req.payment_method or 'UPI'}. Thank you for supporting cooperative workers!"

    customer_notif = Notification(
        id=f"notif-{uuid.uuid4().hex[:6]}",
        target_role="customer",
        target_user_id=req.customer_id,
        title=f"Job Update: {new_status.replace('_', ' ').upper()}",
        message=notif_msg,
        timestamp="Just now",
        is_read=False,
        type="job"
    )
    db.add(customer_notif)

    db.commit()
    db.refresh(req)
    return request_model_to_schema(req)
