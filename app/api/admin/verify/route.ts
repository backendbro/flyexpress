import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const decoded = getTokenFromRequest(req);
  if (!decoded) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: decoded });
}