import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cats = await prisma.serviceCategory.findMany();
    const formatted = cats.map((c) => ({
      id: c.id,
      name: c.name,
      group: c.group,
      description: c.description || '',
      iconName: c.iconName || 'Wrench',
      skills: c.skills ? JSON.parse(c.skills) : [],
      basePrice: c.basePrice,
      urgencyDefault: c.urgencyDefault,
    }));
    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
