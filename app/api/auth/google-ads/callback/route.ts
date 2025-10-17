// /app/api/auth/google-ads/callback/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();

// --- Configuration Constants ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
const GOOGLE_ADS_REDIRECT_URI = process.env.GOOGLE_ADS_REDIRECT_URI || 'https://getpropelx.com/api/auth/google-ads/callback';
const REDIRECT_TO_UI = 'https://getpropelx.com/connections';
// -------------------------------

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const statePayload = url.searchParams.get('state'); // 'accountId:nonce'
  
  if (!code || !statePayload) {
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=missing_google_ads_params`, { status: 302 });
  }

  // 1. NONCE VERIFICATION
  const [accountIdStr, receivedNonce] = statePayload.split(':');
  const accountId = parseInt(accountIdStr, 10);
  const cookieStore = await cookies();
  const expectedNonce = cookieStore.get('google_ads_nonce')?.value;

  if (!expectedNonce || receivedNonce !== expectedNonce) {
    console.error(`Nonce mismatch for Google Ads account ${accountId}.`);
    cookieStore.delete('google_ads_nonce');
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=security_fail`, { status: 302 });
  }
  
  cookieStore.delete('google_ads_nonce');
  
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
        redirect_uri: GOOGLE_ADS_REDIRECT_URI,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      console.error('Google Ads token exchange failed:', data);
      return NextResponse.redirect(`${REDIRECT_TO_UI}?error=google_ads_token_fail`, { status: 302 });
    }

    // CRITICAL: We need the refresh_token (long-term key) and the access_token (short-term)
    const { access_token, refresh_token, scope } = data; 
    
    // 3. PERSISTENCE: Save the Refresh Token
    // We store the Refresh Token in the accessToken field (ENCRYPTED!)
    await prisma.connection.upsert({
      where: {
        accountId_platform_platformIdentifier: {
          accountId: accountId,
          platform: 'GOOGLE_ADS',
          shopDomain: null,
          // We won't know the Customer ID until a later step (MCID selection)
          platformIdentifier: refresh_token, // TEMPORARY: Use RT as unique identifier for now
        },
      },
      update: {
        accessToken: refresh_token, // Store the Refresh Token (MUST BE ENCRYPTED)
        scope: scope,
        // The actual Google Customer ID (MCID) is typically configured after this step.
      },
      create: {
        accountId: accountId,
        platform: 'GOOGLE_ADS',
        accessToken: refresh_token, // Store the Refresh Token (MUST BE ENCRYPTED)
        scope: scope,
        platformIdentifier: refresh_token,
      },
    });

    // 4. FINAL REDIRECT: Success
    return NextResponse.redirect(`${REDIRECT_TO_UI}?success=true&platformId=google-ads`, { status: 302 });

  } catch (error) {
    console.error('Error during Google Ads token flow:', error);
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=internal_server_error`, { status: 302 });
  }
}