import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const coop = await prisma.cooperative.findUnique({
      where: { id: params.id },
      include: {
        providers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!coop) {
      return NextResponse.json({ error: 'Cooperative not found' }, { status: 404 });
    }

    return NextResponse.json(coop);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
