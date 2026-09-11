import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { bookingId: string } }) {
  try {
    const loc = await prisma.workerLocation.findFirst({
      where: {
        OR: [
          { bookingId: params.bookingId },
          { workerId: params.bookingId },
        ],
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!loc) {
      // Default to Avadi coordinates with minor simulated delta
      return NextResponse.json({
        lat: 13.1160,
        lng: 80.1055,
        heading: 45,
        speed: 18.5,
        isTrackingActive: true,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(loc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { bookingId: string } }) {
  try {
    const body = await req.json();
    const { workerId, lat, lng, heading = 0, speed = 0, isTrackingActive = true } = body;

    const loc = await prisma.workerLocation.create({
      data: {
        workerId: workerId || 'worker-1',
        bookingId: params.bookingId,
        lat: Number(lat),
        lng: Number(lng),
        heading: Number(heading),
        speed: Number(speed),
        isTrackingActive,
      },
    });

    return NextResponse.json(loc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
