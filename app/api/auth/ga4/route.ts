// /app/api/auth/ga4/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();
// --- Configuration Constants ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const GA4_SCOPES = [
  // Read-only access to GA4 data (Reports API)
  'https://www.googleapis.com/auth/analytics.readonly', 
  // Read access to Analytics configuration (Management API)
  'https://www.googleapis.com/auth/analytics.manage.readonly', 
  'https://www.googleapis.com/auth/userinfo.email',
].join(' '); 
const GA4_REDIRECT_URI = process.env.GA4_REDIRECT_URI || 'https://getpropelx.com/api/auth/ga4/callback';
// --------------------------------------------------------------------

const generateNonce = () => crypto.randomBytes(16).toString('hex');

export async function GET(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized: User not logged in.' }, { status: 401 });
  }

  const account = await prisma.account.findUnique({
    where: { clerkId },
    select: { id: true }
  });

  if (!account) {
     return NextResponse.json({ error: 'Internal account not found. Please relog.' }, { status: 500 });
  }
  
  const nonce = generateNonce();
  const statePayload = `${account.id}:${nonce}`;

  const headers = new Headers();
  headers.append('Set-Cookie', `ga4_auth_nonce=${nonce}; Path=/; HttpOnly; Secure; Max-Age=300`);
  
  const installUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${GA4_REDIRECT_URI}&` +
    `scope=${GA4_SCOPES}&` +
    `response_type=code&` +
    `access_type=offline&` + 
    `prompt=consent select_account&` +
    `state=${statePayload}`;

  return NextResponse.redirect(installUrl, { headers });
}