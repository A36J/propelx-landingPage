// /app/api/auth/meta-ads/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();

// --- Configuration Constants (GET THESE FROM META FOR DEVELOPERS) ---
const META_APP_ID = process.env.META_APP_ID || 'YOUR_META_APP_ID';
// NOTE: Secret is not used in this step
const META_SCOPES = 'ads_management,ads_read,public_profile'; // Minimum scopes needed
const META_REDIRECT_URI = process.env.META_REDIRECT_REDIRECT_URI || 'https://getpropelx.com/api/auth/meta-ads/callback';
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
  
  // 3. GENERATE NONCE/STATE: Use the nonce for security (preventing CSRF)
  const nonce = generateNonce();
  const statePayload = `${account.id}:${nonce}`; // e.g., '123:abc123def456'

  // 4. SECURE STORAGE (MANDATORY): Store the nonce
  const headers = new Headers();
  headers.append('Set-Cookie', `meta_auth_nonce=${nonce}; Path=/; HttpOnly; Secure; Max-Age=300`);
  
  // 5. CONSTRUCT & REDIRECT: Build the Meta authorization URL
  const installUrl = `https://www.facebook.com/v19.0/dialog/oauth?` + // Use latest API version
    `client_id=${META_APP_ID}&` +
    `redirect_uri=${META_REDIRECT_URI}&` +
    `scope=${META_SCOPES}&` +
    `response_type=code&` +
    `state=${statePayload}`;

  // 6. Redirect the merchant
  return NextResponse.redirect(installUrl, { headers });
}