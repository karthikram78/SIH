import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatWorker } from '@/lib/formatters';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const worker = await prisma.providerProfile.findFirst({
      where: {
        OR: [{ id: params.id }, { userId: params.id }],
      },
      include: {
        user: true,
        cooperative: true,
      },
    });

    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json(formatWorker(worker));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updateData: any = {};

    if (body.headline !== undefined) updateData.headline = body.headline;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.skills !== undefined) updateData.skills = JSON.stringify(body.skills);
    if (body.primaryCategory !== undefined) updateData.primaryCategory = body.primaryCategory;
    if (body.baseChargePerHour !== undefined) updateData.baseChargePerHour = Number(body.baseChargePerHour);
    if (body.serviceRadiusKm !== undefined) updateData.serviceRadiusKm = Number(body.serviceRadiusKm);
    if (body.experienceYears !== undefined) updateData.experienceYears = Number(body.experienceYears);
    if (body.availability !== undefined) {
      updateData.availability = body.availability;
      updateData.isAvailable = body.availability === 'available';
    }

    const updated = await prisma.providerProfile.update({
      where: { id: params.id },
      data: updateData,
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
