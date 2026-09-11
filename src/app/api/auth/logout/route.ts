import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  res.cookies.set({
    name: 'session',
    value: '',
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return res;
}
