import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizePhone10(raw: string): string {
  return (raw || '').replace(/\D/g, '').replace(/^91/, '').slice(-10);
}

async function sendViaMsg91(phone10: string, otp: string): Promise<void> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId || authKey.includes('YOUR_')) {
    // In dev or without valid key, skip real network call
    console.log(`[MSG91 Simulation] SMS OTP ${otp} dispatched to +91 ${phone10}`);
    return;
  }

  const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${phone10}&authkey=${authKey}&otp=${otp}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (data.type === 'error') {
    throw new Error(data.message || 'MSG91 request failed');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone: string = body?.phone || body?.mobile || '';

    const phone10 = normalizePhone10(rawPhone);
    if (phone10.length !== 10) {
      return NextResponse.json({ success: false, message: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.otpSession.upsert({
      where: { phone: phone10 },
      update: {
        otp,
        expiresAt,
        attempts: 1,
      },
      create: {
        phone: phone10,
        otp,
        expiresAt,
        attempts: 1,
      },
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  📱 AvadiConnect OTP for +91 ${phone10}: ${otp}`);
    console.log(`  ⏰ Valid until: ${expiresAt.toLocaleTimeString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      await sendViaMsg91(phone10, otp);
    } catch (e: any) {
      console.warn('MSG91 call note:', e.message);
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to +91 ${phone10}`,
      devOtp: otp, // Returned for dev testing convenience
    });
  } catch (err: any) {
    console.error('OTP Send error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Failed to send OTP.' }, { status: 500 });
  }
}
