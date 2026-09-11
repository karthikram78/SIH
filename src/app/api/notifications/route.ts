import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const userId = searchParams.get('userId') || searchParams.get('user_id');

    const where: any = {};
    if (role) {
      where.OR = [
        { targetRole: role },
        { targetUserId: userId || undefined },
      ];
    }

    const notifs = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const formatted = notifs.map((n) => ({
      id: n.id,
      targetRole: n.targetRole,
      targetUserId: n.targetUserId,
      title: n.title,
      message: n.message,
      timestamp: n.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: n.read,
      type: n.type,
      actionUrl: n.actionUrl,
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
