import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workerId = searchParams.get('worker_id') || searchParams.get('workerId');
    const customerId = searchParams.get('customer_id') || searchParams.get('customerId');

    const where: any = {};
    if (workerId) where.workerId = workerId;
    if (customerId) where.customerId = customerId;

    const reviews = await prisma.ratingReview.findMany({
      where,
      include: {
        customer: true,
        worker: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      serviceRequestId: r.serviceRequestId || '',
      workerId: r.workerId,
      customerId: r.customerId,
      customerName: r.customer?.name || 'Customer',
      workerName: r.worker?.user?.name || 'Worker',
      rating: r.rating,
      reviewText: r.reviewText || '',
      comment: r.reviewText || '',
      createdAt: r.createdAt.toISOString(),
      serviceCategory: r.serviceCategory || 'Service',
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceRequestId,
      workerId,
      customerId,
      rating,
      reviewText,
      serviceCategory,
    } = body;

    let targetCustId = customerId;
    if (!targetCustId) {
      const firstCust = await prisma.user.findFirst({ where: { role: 'customer' } });
      targetCustId = firstCust?.id || 'cust-101';
    }

    const created = await prisma.ratingReview.create({
      data: {
        id: `rev-${Date.now()}`,
        serviceRequestId,
        workerId,
        customerId: targetCustId,
        rating: Number(rating) || 5.0,
        reviewText,
        serviceCategory: serviceCategory || 'Home Service',
      },
      include: {
        customer: true,
        worker: {
          include: { user: true },
        },
      },
    });

    // Update service request rating & review
    if (serviceRequestId) {
      await prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
          rating: Number(rating),
          reviewText,
        },
      }).catch(() => {});
    }

    // Recalculate worker rating average
    const allWorkerReviews = await prisma.ratingReview.findMany({
      where: { workerId },
    });
    if (allWorkerReviews.length > 0) {
      const avg = allWorkerReviews.reduce((sum, r) => sum + r.rating, 0) / allWorkerReviews.length;
      await prisma.providerProfile.update({
        where: { id: workerId },
        data: {
          rating: Math.round(avg * 100) / 100,
          reviewsCount: allWorkerReviews.length,
        },
      }).catch(() => {});
    }

    return NextResponse.json({
      id: created.id,
      serviceRequestId: created.serviceRequestId || '',
      workerId: created.workerId,
      customerId: created.customerId,
      customerName: created.customer?.name || 'Customer',
      workerName: created.worker?.user?.name || 'Worker',
      rating: created.rating,
      reviewText: created.reviewText || '',
      comment: created.reviewText || '',
      createdAt: created.createdAt.toISOString(),
      serviceCategory: created.serviceCategory || 'Service',
    });
  } catch (err: any) {
    console.error('Submit review error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
