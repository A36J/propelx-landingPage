// /app/api/webhooks/clerk/route.ts

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';
const prisma = new PrismaClient();

// Secret from your Clerk Dashboard -> Webhooks -> [Your Endpoint] -> Secret
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // 1. Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // 2. If there are no required headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: No Svix headers', { status: 400 });
  }

  // 3. Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 4. Verify the payload signature
  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set.');
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Invalid signature', { status: 400 });
  }

  // 5. Handle the event
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const clerkId = id; // The Clerk User ID
    const primaryEmail = evt.data.email_addresses?.[0]?.email_address;
    
    if (!clerkId) {
        return new Response('Error: Missing Clerk ID in payload', { status: 400 });
    }

    try {
      // Create the corresponding Account record in your database
      await prisma.account.create({
        data: {
          clerkId: clerkId,
          email: primaryEmail,
          // You can add other default fields here
        },
      });
      console.log(`Account created in DB for Clerk ID: ${clerkId}`);
      return new Response('Account Created', { status: 201 });
    } catch (e) {
      console.error('Database Error creating account:', e);
      return new Response('Error writing to DB', { status: 500 });
    }
  }

  // Optionally handle other events like 'user.deleted'
  if (eventType === 'user.deleted') {
    // Note: Clerk sometimes sends a null ID for a deleted user, use the previous ID
    const clerkId = evt.data.id; 
    
    if(clerkId) {
        await prisma.account.delete({
            where: { clerkId: clerkId },
        });
        console.log(`Account deleted from DB for Clerk ID: ${clerkId}`);
    }
  }

  return new Response('OK', { status: 200 });
}