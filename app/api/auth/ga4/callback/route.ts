// /app/api/auth/ga4/callback/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// Assuming your Prisma import is correct
import { PrismaClient } from '@/lib/generated/prisma'; 
const prisma = new PrismaClient();

// --- Configuration Constants ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
const GA4_REDIRECT_URI = process.env.GA4_REDIRECT_URI || 'https://getpropelx.com/api/auth/ga4/callback';
const REDIRECT_TO_UI = 'https://getpropelx.com/connections';
// -------------------------------

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const statePayload = url.searchParams.get('state');
  
  if (!code || !statePayload) {
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=missing_ga4_params`, { status: 302 });
  }

  // 1. NONCE VERIFICATION
  const [accountIdStr, receivedNonce] = statePayload.split(':');
  const accountId = parseInt(accountIdStr, 10);
  const cookieStore = await cookies(); // Use direct import cookies()
  const expectedNonce = cookieStore.get('ga4_auth_nonce')?.value;

  if (!expectedNonce || receivedNonce !== expectedNonce) {
    console.error(`Nonce mismatch for GA4 account ${accountId}.`);
    cookieStore.delete('ga4_auth_nonce');
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=security_fail`, { status: 302 });
  }
  
  cookieStore.delete('ga4_auth_nonce');
  
  // 2. TOKEN EXCHANGE for Access Token and Refresh Token
  const tokenUrl = 'https://oauth2.googleapis.com/token';

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: GA4_REDIRECT_URI,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      console.error('GA4 token exchange failed:', data);
      return NextResponse.redirect(`${REDIRECT_TO_UI}?error=ga4_token_fail`, { status: 302 });
    }

    const { refresh_token, scope } = data; 
    
    // 3. PERSISTENCE: Save the Refresh Token
    // We use the unique key: @@unique([accountId, platform, platformIdentifier])
    await prisma.connection.upsert({
      where: {
        accountId_platform_platformIdentifier: {
          accountId: accountId,
          platform: 'GA4',
          // CRITICAL FIX: The type does NOT include shopDomain here.
          platformIdentifier: refresh_token, 
        },
      },
      update: {
        accessToken: refresh_token,
        scope: scope,
        // REQUIRED: Set the optional field to NULL when updating non-Shopify data
        shopDomain: null, 
      },
      create: {
        accountId: accountId,
        platform: 'GA4',
        accessToken: refresh_token,
        scope: scope,
        platformIdentifier: refresh_token,
        // REQUIRED: Set the optional field to NULL when creating non-Shopify data
        shopDomain: null, 
      },
    });

    // 4. FINAL REDIRECT: Success
    return NextResponse.redirect(`${REDIRECT_TO_UI}?success=true&platformId=ga4`, { status: 302 });

  } catch (error) {
    console.error('Error during GA4 token flow:', error);
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=internal_server_error`, { status: 302 });
  }
}