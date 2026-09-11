import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ status: 'healthy', database: 'connected', userCount });
  } catch (err: any) {
    return NextResponse.json({ status: 'unhealthy', error: err.message }, { status: 500 });
  }
}
