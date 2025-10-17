// /app/api/auth/google-ads/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();

// --- Configuration Constants (GET THESE FROM GOOGLE CLOUD CONSOLE) ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
// NOTE: Secret is not used in this step
const GOOGLE_ADS_SCOPES = [
  'https://www.googleapis.com/auth/adwords', // Full read/write access to Google Ads
  'https://www.googleapis.com/auth/userinfo.email', // To identify the user
].join(' '); 
const GOOGLE_ADS_REDIRECT_URI = process.env.GOOGLE_ADS_REDIRECT_URI || 'https://getpropelx.com/api/auth/google-ads/callback';
// --------------------------------------------------------------------

const generateNonce = () => crypto.randomBytes(16).toString('hex');

export async function GET(req: Request) {
  // 1. CLERK AUTHENTICATION
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized: User not logged in.' }, { status: 401 });
  }

  // 2. GET INTERNAL ACCOUNT ID
  const account = await prisma.account.findUnique({
    where: { clerkId },
    select: { id: true }
  });

  if (!account) {
     return NextResponse.json({ error: 'Internal account not found. Please relog.' }, { status: 500 });
  }
  
  // 3. GENERATE NONCE/STATE
  const nonce = generateNonce();
  const statePayload = `${account.id}:${nonce}`;

  // 4. SECURE STORAGE (MANDATORY): Store the nonce
  const headers = new Headers();
  headers.append('Set-Cookie', `google_ads_nonce=${nonce}; Path=/; HttpOnly; Secure; Max-Age=300`);
  
  // 5. CONSTRUCT & REDIRECT: Build the Google Authorization URL
  const installUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${GOOGLE_ADS_REDIRECT_URI}&` +
    `scope=${GOOGLE_ADS_SCOPES}&` +
    `response_type=code&` +
    `access_type=offline&` + // CRITICAL: Ensures we get a refresh token
    `prompt=consent select_account&` + // Forces consent screen and account selection
    `state=${statePayload}`;

  // 6. Redirect the merchant
  return NextResponse.redirect(installUrl, { headers });
}