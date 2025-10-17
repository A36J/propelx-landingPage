// /app/api/auth/shopify/callback/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Use Next.js built-in cookies for App Router
import crypto from 'crypto';
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();

// --- Configuration Constants ---
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || 'YOUR_API_KEY';
const SHOPIFY_SECRET_KEY = process.env.SHOPIFY_SECRET_KEY || 'YOUR_SECRET_KEY';
const REDIRECT_TO_UI = 'https://getpropelx.com/connections'; 
// -------------------------------

/**
 * NOTE: The hmac verification function must be implemented robustly for production.
 * This is a placeholder that will fail without full implementation.
 */
function verifyHmac(query: URLSearchParams, secret: string): boolean {
    const hmac = query.get('hmac');
    if (!hmac) return false;
    
    // 1. Filter out the HMAC and signature parameters
    const params = new URLSearchParams(query);
    params.delete('hmac');
    params.delete('signature');
    
    // 2. Sort parameters alphabetically and join them
    const orderedParams = Array.from(params.keys()).sort().map(key => {
        const value = params.get(key);
        // Important: Replace '&', '%', and '=' with escape sequences
        return `${key}=${value}`.replace(/&/g, '%26').replace(/%/g, '%25').replace(/=/g, '%3D');
    }).join('&');
    
    // 3. Create the hash using the secret key
    const calculatedHmac = crypto
        .createHmac('sha256', secret)
        .update(orderedParams)
        .digest('hex');

    // 4. Compare the calculated hash with the received hmac
    return crypto.timingSafeEqual(Buffer.from(hmac, 'utf-8'), Buffer.from(calculatedHmac, 'utf-8'));
}


export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams;
  const shop = query.get('shop');
  const code = query.get('code');
  const statePayload = query.get('state'); // 'accountId:nonce'
  
  // 1. BASIC VALIDATION
  if (!shop || !code || !statePayload) {
    console.error('Callback error: Missing shop, code, or state.');
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=missing_params`, { status: 302 });
  }

  // 2. SECURITY VERIFICATION (HMAC and Nonce)
  // A. HMAC Verification: Recommended for data integrity
  // if (!verifyHmac(query, SHOPIFY_SECRET_KEY)) {
  //   console.error('HMAC verification failed for shop:', shop);
  //   return NextResponse.redirect(`${REDIRECT_TO_UI}?error=hmac_fail`, { status: 302 });
  // }
  
  // B. Nonce Verification: CSRF protection
  const [accountIdStr, receivedNonce] = statePayload.split(':');
  const accountId = parseInt(accountIdStr, 10);
  const cookieStore = cookies();
  const expectedNonce = cookieStore.get('shopify_auth_nonce')?.value; 

  if (!expectedNonce || receivedNonce !== expectedNonce) {
    console.error(`Nonce mismatch for account ${accountId}. Received: ${receivedNonce}, Expected: ${expectedNonce}`);
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=security_fail`, { status: 302 });
  }
  
  // Clean up the cookie after successful verification
  cookieStore.delete('shopify_auth_nonce');
  
  // 3. TOKEN EXCHANGE
  const accessTokenUrl = `https://${shop}/admin/oauth/access_token`;
  
  try {
    const response = await fetch(accessTokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_SECRET_KEY,
        code: code,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      console.error('Token exchange failed:', data);
      return NextResponse.redirect(`${REDIRECT_TO_UI}?error=token_exchange_fail`, { status: 302 });
    }

    const { access_token, scope } = data; 
    
    // 4. PERSISTENCE: Save the permanent token
    await prisma.connection.upsert({
      where: {
        accountId_platform_shopDomain_platformIdentifier: {
          accountId: accountId,
          platform: 'SHOPIFY',
          shopDomain: shop,
          platformIdentifier: null,
        },
      },
      update: {
        accessToken: access_token, // MUST BE ENCRYPTED IN PRODUCTION
        scope: scope,
      },
      create: {
        accountId: accountId,
        platform: 'SHOPIFY',
        shopDomain: shop,
        accessToken: access_token, // MUST BE ENCRYPTED IN PRODUCTION
        scope: scope,
      },
    });

    // 5. FINAL REDIRECT: Success, redirect to the UI to update state
    return NextResponse.redirect(`${REDIRECT_TO_UI}?success=true&platformId=shopify`, { status: 302 });

  } catch (error) {
    console.error('Error during token exchange:', error);
    return NextResponse.redirect(`${REDIRECT_TO_UI}?error=internal_server_error`, { status: 302 });
  }
}