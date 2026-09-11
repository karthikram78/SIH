import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatWorker } from '@/lib/formatters';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const availability = searchParams.get('availability');
    const cooperativeId = searchParams.get('cooperative_id') || searchParams.get('cooperativeId');
    const search = searchParams.get('search');

    const where: any = {};
    if (category) {
      where.primaryCategory = { contains: category };
    }
    if (availability) {
      where.availability = availability;
    }
    if (cooperativeId) {
      where.cooperativeId = cooperativeId;
    }

    const providers = await prisma.providerProfile.findMany({
      where,
      include: {
        user: true,
        cooperative: true,
      },
    });

    let formatted = providers.map(formatWorker);
    if (search) {
      const q = search.toLowerCase();
      formatted = formatted.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.primaryCategory.toLowerCase().includes(q) ||
          w.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      name,
      mobile,
      email,
      primaryCategory = 'Plumbing',
      skills = ['General Maintenance'],
      experienceYears = 3,
      baseChargePerHour = 350,
      cooperativeId = 'coop-1',
    } = body;

    let targetUserId = userId;
    if (!targetUserId && mobile) {
      const u = await prisma.user.upsert({
        where: { mobile: mobile.replace(/\D/g, '').slice(-10) },
        update: { name, email, role: 'worker' },
        create: {
          name: name || 'New Worker',
          mobile: mobile.replace(/\D/g, '').slice(-10),
          email,
          role: 'worker',
          lat: 13.1147,
          lng: 80.1048,
          address: 'Avadi, Chennai',
        },
      });
      targetUserId = u.id;
    }

    const provider = await prisma.providerProfile.create({
      data: {
        id: `worker-${Date.now().toString().slice(-4)}`,
        userId: targetUserId,
        cooperativeId,
        headline: `Certified ${primaryCategory} Specialist`,
        bio: `Verified artisan in Avadi. Skills: ${skills.join(', ')}.`,
        primaryCategory,
        skills: JSON.stringify(skills),
        experienceYears: Number(experienceYears),
        baseChargePerHour: Number(baseChargePerHour),
        availability: 'available',
        isAvailable: true,
        documents: JSON.stringify([]),
        verifications: JSON.stringify({
          identity: 'pending',
          skill: 'pending',
          shop: 'pending',
          mobile: 'verified',
        }),
      },
      include: {
        user: true,
        cooperative: true,
      },
    });

    return NextResponse.json(formatWorker(provider));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
