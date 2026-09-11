import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatServiceRequest } from '@/lib/formatters';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customer_id') || searchParams.get('customerId');
    const workerId = searchParams.get('worker_id') || searchParams.get('workerId');
    const status = searchParams.get('status');

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (workerId) where.assignedWorkerId = workerId;
    if (status) where.status = status;

    const reqs = await prisma.serviceRequest.findMany({
      where,
      include: {
        customer: true,
        assignedWorker: {
          include: {
            user: true,
            cooperative: true,
          },
        },
        serviceCategory: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reqs.map(formatServiceRequest));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      category,
      skill,
      problem,
      urgency = 'medium',
      isEmergency = false,
      workerId,
      amount = 450,
      matchScore = 90,
      matchReasons = ['Optimal match'],
      location,
      customerId,
      customerName,
      customerMobile,
    } = body;

    // Resolve customer ID
    let targetCustomerId = customerId;
    if (!targetCustomerId) {
      const firstCust = await prisma.user.findFirst({ where: { role: 'customer' } });
      targetCustomerId = firstCust?.id || 'cust-101';
    }

    const verificationOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const workerEarnings = Math.round(amount * 0.85);
    const cooperativeFee = Math.round(amount * 0.10);
    const platformFee = amount - workerEarnings - cooperativeFee;

    // Create service request in Prisma
    const created = await prisma.serviceRequest.create({
      data: {
        id: `req-${Date.now().toString().slice(-4)}`,
        customerId: targetCustomerId,
        assignedWorkerId: workerId || undefined,
        categoryName: category,
        requiredSkill: skill,
        problemDescription: problem,
        urgency,
        isEmergency,
        status: 'requested',
        locationLat: location?.lat || 13.1147,
        locationLng: location?.lng || 80.1048,
        address: location?.address || 'Avadi Main Road, Avadi',
        city: location?.city || 'Avadi',
        pincode: location?.pincode || '600054',
        amount,
        workerEarnings,
        cooperativeFee,
        platformFee,
        verificationOtp,
        matchScore,
        matchReasons: JSON.stringify(matchReasons),
      },
      include: {
        customer: true,
        assignedWorker: {
          include: {
            user: true,
            cooperative: true,
          },
        },
        serviceCategory: true,
      },
    });

    // If a worker was assigned, also create the Booking record
    if (workerId) {
      await prisma.booking.create({
        data: {
          id: `book-${created.id}`,
          serviceRequestId: created.id,
          customerId: targetCustomerId,
          providerId: workerId,
          status: 'requested',
          description: problem,
          totalAmount: amount,
          workerEarnings,
          cooperativeFee,
          platformFee,
          locationLat: location?.lat || 13.1147,
          locationLng: location?.lng || 80.1048,
          address: location?.address || 'Avadi Main Road, Avadi',
        },
      });

      // Create Notification for Worker
      await prisma.notification.create({
        data: {
          id: `notif-${Date.now()}`,
          targetRole: 'worker',
          targetUserId: workerId,
          title: isEmergency ? '🚨 URGENT EMERGENCY REQUEST' : 'New Service Request Nearby',
          message: `${customerName || 'Customer'} requested ${category} (${skill}) in Avadi. Est: ₹${amount}`,
          type: 'job',
        },
      });
    }

    return NextResponse.json(formatServiceRequest(created));
  } catch (err: any) {
    console.error('Create request error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
