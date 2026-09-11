import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const coops = await prisma.cooperative.findMany();
    return NextResponse.json(coops);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
