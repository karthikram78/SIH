import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatWorker } from '@/lib/formatters';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const availability = body.availability || 'available';

    const updated = await prisma.providerProfile.update({
      where: { id: params.id },
      data: {
        availability,
        isAvailable: availability === 'available',
      },
      include: {
        user: true,
        cooperative: true,
      },
    });

    return NextResponse.json(formatWorker(updated));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
