import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await getUserFromRequest(req);
    if (!auth?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      include: { providerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const clientUser = {
      id: user.id,
      name: user.name || 'User',
      mobile: user.mobile,
      email: user.email || '',
      role: user.role,
      avatar: user.avatar || '',
      location: {
        lat: user.lat || 13.1147,
        lng: user.lng || 80.1048,
        address: user.address || 'Avadi Main Road, Avadi',
        city: user.city || 'Avadi',
        pincode: user.pincode || '600054',
      },
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json({ success: true, user: clientUser, role: user.role });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
