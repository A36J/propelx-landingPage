// /app/api/auth/shopify/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; 
import crypto from 'crypto';
import { PrismaClient } from '@/lib/generated/prisma'; // Make sure this path is correct



const prisma = new PrismaClient();
// --- Configuration Constants ---
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || 'YOUR_API_KEY';
// The scopes you previously selected
const SHOPIFY_SCOPES = 'write_marketing_events,read_marketing_events,read_reports,read_orders,read_products';
const SHOPIFY_REDIRECT_URI = process.env.SHOPIFY_REDIRECT_URI || 'https://getpropelx.com/shopify/callback';
// -------------------------------

const generateNonce = () => crypto.randomBytes(16).toString('hex');

export async function GET(req: Request) {
  const { userId: clerkId } = await auth(); 
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized: User not logged in.' }, { status: 401 });
  }

  const url = new URL(req.url);
  const shop = url.searchParams.get('shop');

  if (!shop || !shop.endsWith('.myshopify.com')) {
    return NextResponse.json({ error: 'Missing or invalid shop domain.' }, { status: 400 });
  }

  // 1. Get the internal Account ID linked to the Clerk user
  const account = await prisma.account.findUnique({
    where: { clerkId },
    select: { id: true }
  });

  if (!account) {
     return NextResponse.json({ error: 'Internal account not found. Please relog.' }, { status: 500 });
  }
  
  // 2. Generate Nonce/State: Payload includes internal account ID for secure callback
  const nonce = generateNonce();
  const statePayload = `${account.id}:${nonce}`; 

  // 3. Secure Storage: Store the nonce (ideally in a session, Redis, or signed cookie)
  // NOTE: For this simple example, we use a Headers object to set a cookie.
  const headers = new Headers();
  headers.append('Set-Cookie', `shopify_auth_nonce=${nonce}; Path=/; HttpOnly; Secure; Max-Age=300`);
  
  // 4. Construct the Authorization URL
  const installUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_API_KEY}&` +
    `scope=${SHOPIFY_SCOPES}&` +
    `redirect_uri=${SHOPIFY_REDIRECT_URI}&` +
    `state=${statePayload}`; 

  // 5. Redirect the merchant
  return NextResponse.redirect(installUrl, { headers });
}