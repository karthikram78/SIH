import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'avadi-connect-super-secret-jwt-key-2026';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest): Promise<{ id: string; role: string; email?: string; mobile?: string } | null> {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    try {
      const payload = await decrypt(token);
      return payload as any;
    } catch {
      // Invalid token
    }
  }

  const cookieToken = req.cookies.get('session')?.value;
  if (cookieToken) {
    try {
      const payload = await decrypt(cookieToken);
      return payload as any;
    } catch {
      // Invalid cookie
    }
  }

  return null;
}
