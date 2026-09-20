import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

/*
  Paddle webhook placeholder.
  Production step: verify the Paddle signature, map the Paddle customer to
  the Supabase user, then call the grant_credits RPC. Never trust a browser
  request to grant credits.
*/
export async function POST(request) {
  const payload = await request.json();
  // TODO: verify signature with PADDLE_WEBHOOK_SECRET.
  // TODO: map transaction/subscription to user.
  // TODO: await adminClient().rpc("grant_credits", {...});
  return NextResponse.json({ received: true, configured: Boolean(process.env.PADDLE_WEBHOOK_SECRET), payload_type: payload?.event_type || null });
}
