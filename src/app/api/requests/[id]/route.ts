import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatServiceRequest } from '@/lib/formatters';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const r = await prisma.serviceRequest.findUnique({
      where: { id: params.id },
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

    if (!r) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 });
    }

    return NextResponse.json(formatServiceRequest(r));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
