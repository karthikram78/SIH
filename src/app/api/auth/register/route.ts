import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';

function normalizePhone10(raw: string): string {
  return (raw || '').replace(/\D/g, '').replace(/^91/, '').slice(-10);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      mobile,
      email,
      password,
      role = 'customer',
      address,
      city = 'Avadi',
      pincode = '600054',
      lat = 13.1147,
      lng = 80.1048,
      skill,
      primaryCategory,
      experienceYears = 3,
      baseChargePerHour = 350,
      cooperativeId = 'coop-1',
    } = body;

    const cleanMobile = normalizePhone10(mobile);
    if (!cleanMobile || cleanMobile.length !== 10) {
      return NextResponse.json({ success: false, message: 'Valid 10-digit mobile number required.' }, { status: 400 });
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    }

    // Check if mobile already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile: cleanMobile },
      include: { providerProfile: true },
    });

    let passwordHash = undefined;
    if (password && password.length >= 6) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    let user;
    const normalizedRole = role === 'worker' ? 'worker' : 'customer';

    const now = new Date();
    if (existingUser) {
      // Update existing user
      user = await prisma.user.update({
        where: { mobile: cleanMobile },
        data: {
          name: name.trim(),
          email: email?.trim() || existingUser.email,
          ...(passwordHash ? { passwordHash } : {}),
          role: normalizedRole,
          lat: Number(lat) || existingUser.lat,
          lng: Number(lng) || existingUser.lng,
          address: address || existingUser.address,
          city: city || existingUser.city,
          pincode: pincode || existingUser.pincode,
          lastLoginAt: now,
        },
        include: { providerProfile: true },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          mobile: cleanMobile,
          email: email?.trim() || undefined,
          passwordHash: passwordHash || (await bcrypt.hash('password123', 10)),
          role: normalizedRole,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          lat: Number(lat),
          lng: Number(lng),
          address: address || 'Avadi Main Road, Avadi',
          city: city || 'Avadi',
          pincode: pincode || '600054',
          registeredAt: now,
          lastLoginAt: now,
        },
        include: { providerProfile: true },
      });
    }

    // If Worker, create/update ProviderProfile
    if (normalizedRole === 'worker' && !user.providerProfile) {
      const skillsArray = skill ? [skill] : ['General Maintenance'];
      const workerCat = primaryCategory || skill || 'General Repair';

      await prisma.providerProfile.create({
        data: {
          id: `worker-${user.id.slice(0, 8)}`,
          userId: user.id,
          cooperativeId,
          headline: `Certified ${workerCat} Specialist`,
          bio: `Verified trade artisan in Avadi. Experienced in ${skillsArray.join(', ')}.`,
          primaryCategory: workerCat,
          skills: JSON.stringify(skillsArray),
          experienceYears: Number(experienceYears) || 3,
          rating: 5.0,
          reviewsCount: 0,
          availability: 'available',
          isAvailable: true,
          completedJobs: 0,
          serviceRadiusKm: 10,
          baseChargePerHour: Number(baseChargePerHour) || 350,
          verified: false,
          isOverallVerified: false,
          documents: JSON.stringify([]),
          verifications: JSON.stringify({
            identity: 'pending',
            skill: 'pending',
            shop: 'pending',
            mobile: 'verified',
          }),
        },
      });
    }

    // Generate token
    const token = await encrypt({ id: user.id, role: user.role, mobile: user.mobile, email: user.email });

    const clientUser = {
      id: user.id,
      name: user.name,
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
      registeredAt: user.registeredAt ? user.registeredAt.toISOString() : user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : now.toISOString(),
    };

    const res = NextResponse.json({
      success: true,
      user: clientUser,
      token,
      role: user.role,
      message: 'Account created and verified successfully!',
    });

    res.cookies.set({
      name: 'session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Registration failed.' }, { status: 500 });
  }
}
