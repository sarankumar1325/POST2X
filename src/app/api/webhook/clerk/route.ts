import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { createUser, getUserByClerkId } from '@/lib/db';

type WebhookEvent = {
  id: string;
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
};

export async function POST(request: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    try {
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      
      // Check if user already exists
      const existingUser = await getUserByClerkId(id);
      if (existingUser) {
        console.log('User already exists:', id);
        return NextResponse.json({ success: true });
      }

      // Get primary email
      const primaryEmail = email_addresses.find(email => 
        email.email_address
      )?.email_address || '';

      // Create user in database
      await createUser({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
        clerk_id: id,
        email: primaryEmail,
        username: username || `${first_name || ''} ${last_name || ''}`.trim() || undefined,
        credits: 100, // Default credits for new users
      });

      console.log('User created successfully:', id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  }

  if (eventType === 'user.updated') {
    try {
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      
      // Get existing user
      const existingUser = await getUserByClerkId(id);
      if (!existingUser) {
        console.log('User not found for update:', id);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update logic can be added here if needed
      console.log('User updated:', id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
  }

  console.log('Unhandled webhook event:', eventType);
  return NextResponse.json({ success: true });
}
