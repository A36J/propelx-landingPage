// /app/api/auth/meta-ads/callback/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();

// --- Configuration Constants ---
const META_APP_ID = process.env.META_APP_ID || 'YOUR_META_APP_ID';
const META_APP_SECRET = process.env.META_APP_SECRET || 'YOUR_META_APP_SECRET';
const META_REDIRECT_URI = process.env.META_REDIRECT_REDIRECT_URI || 'https://getpropelx.com/api/auth/meta-ads/callback';
const REDIRECT_TO_UI = 'https://getpropelx.com/connections';
// -------------------------------

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const statePayload = url.searchParams.get('state'); // 'accountId:nonce'
  
  // 1. BASIC VALIDATION
  if (!code || !statePayload) {
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=missing_meta_params`, { status: 302 });
  }

  // 2. NONCE VERIFICATION
  const [accountIdStr, receivedNonce] = statePayload.split(':');
  const accountId = parseInt(accountIdStr, 10);
  const cookieStore = cookies();
  const expectedNonce = cookieStore.get('meta_auth_nonce')?.value;

  if (!expectedNonce || receivedNonce !== expectedNonce) {
    console.error(`Nonce mismatch for account ${accountId}.`);
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=security_fail`, { status: 302 });
  }
  
  cookieStore.delete('meta_auth_nonce');
  
  // 3. CODE EXCHANGE for SHORT-LIVED TOKEN
  const shortLivedTokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `client_id=${META_APP_ID}&` +
    `redirect_uri=${META_REDIRECT_URI}&` +
    `client_secret=${META_APP_SECRET}&` +
    `code=${code}`;

  try {
    let response = await fetch(shortLivedTokenUrl);
    let data = await response.json();

    if (!response.ok || data.error) {
      console.error('Short-lived token exchange failed:', data);
      return NextResponse.redirect(`${REDIRECT_TO_UI}?error=meta_token_fail`, { status: 302 });
    }

    const shortLivedToken = data.access_token;

    // 4. EXCHANGE for LONG-LIVED TOKEN (BEST PRACTICE for server-side apps)
    const longLivedTokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${META_APP_ID}&` +
      `client_secret=${META_APP_SECRET}&` +
      `fb_exchange_token=${shortLivedToken}`;

    response = await fetch(longLivedTokenUrl);
    data = await response.json();

    if (!response.ok || data.error) {
      console.error('Long-lived token exchange failed:', data);
      return NextResponse.redirect(`${REDIRECT_TO_UI}?error=meta_long_token_fail`, { status: 302 });
    }

    const { access_token: longLivedToken, scope: grantedScope } = data;

    // 5. GET USER ID and AD ACCOUNTS (MANDATORY STEP for Meta Ads)
    // The access token is for the user. We need their Ad Account ID.
    const profileUrl = `https://graph.facebook.com/v19.0/me?` +
      `fields=id,name,adaccounts{id,name}&` + // Request user ID and associated Ad Accounts
      `access_token=${longLivedToken}`;
    
    response = await fetch(profileUrl);
    data = await response.json();

    if (!response.ok || data.error) {
        console.error('Failed to get user profile and ad accounts:', data);
        return NextResponse.redirect(`${REDIRECT_TO_UI}?error=meta_profile_fail`, { status: 302 });
    }

    const { id: metaUserId, name: metaUserName, adaccounts } = data;
    
    // 6. PERSISTENCE: Save the Long-Lived Token and connection details
    // NOTE: Meta typically has multiple ad accounts. You might need an intermediate
    // UI step here to let the user select which ad account PropelX should manage.
    
    // For simplicity, we save the first available Ad Account ID with the token.
    const firstAdAccountId = adaccounts?.data?.[0]?.id;
    
    if (!firstAdAccountId) {
        console.warn('User has no accessible ad accounts.');
        // Still save the token, but redirect with a warning.
    }

    await prisma.connection.upsert({
      where: {
        accountId_platform_shopDomain_platformIdentifier: {
          accountId: accountId,
          platform: 'META_ADS',
          // Meta doesn't use shopDomain, so it remains null
          shopDomain: null, 
          // Store the Ad Account ID as the main identifier
          platformIdentifier: firstAdAccountId || metaUserId, 
        },
      },
      update: {
        accessToken: longLivedToken, // ENCRYPT THIS FIELD
        scope: grantedScope,
        platformData: adaccounts ? { adaccounts: adaccounts.data } : null,
      },
      create: {
        accountId: accountId,
        platform: 'META_ADS',
        accessToken: longLivedToken, // ENCRYPT THIS FIELD
        scope: grantedScope,
        platformIdentifier: firstAdAccountId || metaUserId,
        platformData: adaccounts ? { adaccounts: adaccounts.data } : null,
      },
    });

    // 7. FINAL REDIRECT: Success
    return NextResponse.redirect(`${REDIRECT_TO_UI}?success=true&platformId=meta-ads`, { status: 302 });

  } catch (error) {
    console.error('Error during Meta token flow:', error);
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=internal_server_error`, { status: 302 });
  }
}