import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatServiceRequest } from '@/lib/formatters';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, paymentMethod, amount: customAmount, verificationOtp } = body;

    const existing = await prisma.serviceRequest.findUnique({
      where: { id: params.id },
      include: {
        assignedWorker: true,
        customer: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 });
    }

    const now = new Date();
    const updateData: any = { status };
    const finalAmount = customAmount || existing.amount;

    if (customAmount) {
      updateData.amount = finalAmount;
      updateData.workerEarnings = Math.round(finalAmount * 0.85);
      updateData.cooperativeFee = Math.round(finalAmount * 0.10);
      updateData.platformFee = finalAmount - updateData.workerEarnings - updateData.cooperativeFee;
    }

    if (status === 'accepted') updateData.acceptedAt = now;
    if (status === 'arrived') updateData.arrivedAt = now;
    if (status === 'in_progress') updateData.startedAt = now;
    if (status === 'completed') updateData.completedAt = now;
    if (status === 'paid') {
      updateData.paidAt = now;
      updateData.paymentStatus = 'completed';
      if (paymentMethod) updateData.paymentMethod = paymentMethod;

      // Increment worker completed jobs
      if (existing.assignedWorkerId) {
        await prisma.providerProfile.update({
          where: { id: existing.assignedWorkerId },
          data: { completedJobs: { increment: 1 } },
        });

        // Increment cooperative welfare fund and earnings
        if (existing.assignedWorker?.cooperativeId) {
          const coopShare = Math.round(finalAmount * 0.10);
          await prisma.cooperative.update({
            where: { id: existing.assignedWorker.cooperativeId },
            data: {
              monthlyJobsCount: { increment: 1 },
              monthlyEarningsTotal: { increment: finalAmount },
              welfareFundBalance: { increment: coopShare },
            },
          });
        }
      }
    }

    const updated = await prisma.serviceRequest.update({
      where: { id: params.id },
      data: updateData,
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

    // Also sync Booking record if exists
    await prisma.booking.updateMany({
      where: { serviceRequestId: params.id },
      data: {
        status,
        ...(status === 'completed' || status === 'paid' ? { completedAt: now } : {}),
      },
    });

    // Create Notification
    let msg = `Job status updated to ${status.replace('_', ' ').toUpperCase()}`;
    if (status === 'accepted') msg = `${updated.assignedWorker?.user?.name || 'Worker'} accepted your request and is preparing.`;
    if (status === 'navigating') msg = `${updated.assignedWorker?.user?.name || 'Worker'} is on the way to your location.`;
    if (status === 'arrived') msg = `Worker arrived at your address! Share OTP ${updated.verificationOtp} to begin.`;
    if (status === 'completed') msg = `Work marked complete! Please inspect and proceed to transparent payment.`;
    if (status === 'paid') msg = `Payment of ₹${finalAmount} confirmed via ${paymentMethod || 'UPI'}. Thank you!`;

    await prisma.notification.create({
      data: {
        id: `notif-${Date.now()}`,
        targetRole: 'customer',
        targetUserId: existing.customerId,
        title: `Job Update: ${status.replace('_', ' ').toUpperCase()}`,
        message: msg,
        type: 'job',
      },
    });

    return NextResponse.json(formatServiceRequest(updated));
  } catch (err: any) {
    console.error('Update job status error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
