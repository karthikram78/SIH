import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalCustomers,
      totalWorkers,
      verifiedWorkers,
      pendingWorkers,
      totalRequests,
      completedRequests,
      activeRequests,
      cooperatives,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.providerProfile.count(),
      prisma.providerProfile.count({ where: { verified: true } }),
      prisma.providerProfile.count({ where: { verified: false } }),
      prisma.serviceRequest.count(),
      prisma.serviceRequest.count({ where: { status: 'completed' } }),
      prisma.serviceRequest.count({ where: { status: { in: ['requested', 'accepted', 'navigating', 'arrived', 'in_progress'] } } }),
      prisma.cooperative.findMany(),
    ]);

    const totalWelfareFund = cooperatives.reduce((sum, c) => sum + c.welfareFundBalance, 0);
    const totalEarnings = cooperatives.reduce((sum, c) => sum + c.monthlyEarningsTotal, 0);

    return NextResponse.json({
      totalCustomers,
      totalWorkers,
      verifiedWorkers,
      pendingWorkers,
      totalRequests,
      completedRequests,
      activeRequests,
      cooperativesCount: cooperatives.length,
      totalWelfareFund,
      totalEarnings,
      platformRevenue: Math.round(totalEarnings * 0.05),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
