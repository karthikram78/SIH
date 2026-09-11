import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatWorker } from '@/lib/formatters';
import { rankWorkers, DEFAULT_WEIGHTS } from '@/lib/matchingEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userLocation, targetCategory, targetSkill, customWeights } = body;

    const providers = await prisma.providerProfile.findMany({
      include: {
        user: true,
        cooperative: true,
      },
    });

    const formattedWorkers = providers.map(formatWorker);
    const loc = userLocation || {
      lat: 13.1147,
      lng: 80.1048,
      address: 'Avadi Main Road, Avadi',
      city: 'Avadi',
      pincode: '600054',
    };

    const ranked = rankWorkers(
      formattedWorkers,
      loc,
      targetCategory || 'Plumbing',
      targetSkill,
      customWeights || DEFAULT_WEIGHTS
    );

    return NextResponse.json(ranked);
  } catch (err: any) {
    console.error('Matching error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
