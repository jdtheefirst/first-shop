import { banIfInvalid } from "@/lib/limit";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const body = JSON.parse(rawBody);

  // Validate required PayPal headers
  const requiredHeaders = [
    "paypal-auth-algo",
    "paypal-cert-url",
    "paypal-transmission-id",
    "paypal-transmission-sig",
    "paypal-transmission-time",
  ];

  const missingHeaders = requiredHeaders.filter((h) => !req.headers.get(h));

  const headersMissing = missingHeaders.length > 0;

  const earlyBan = await banIfInvalid(
    req,
    headersMissing,
    "Missing PayPal headers"
  );
  if (earlyBan) {
    return new Response("OK", { status: 200 });
  }

  const authString = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const { access_token } = await tokenRes.json();

  // Before trusting
  const verifyRes = await fetch(
    `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        auth_algo: req.headers.get("paypal-auth-algo"),
        cert_url: req.headers.get("paypal-cert-url"),
        transmission_id: req.headers.get("paypal-transmission-id"),
        transmission_sig: req.headers.get("paypal-transmission-sig"),
        transmission_time: req.headers.get("paypal-transmission-time"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID, // you get this from their dashboard
        webhook_event: body,
      }),
    }
  );

  const verifyData = await verifyRes.json();
  const isInvalid = verifyData.verification_status !== "SUCCESS";
  const isBanned = await banIfInvalid(
    req,
    isInvalid,
    "Missing Stripe signature"
  );

  if (isBanned) {
    return NextResponse.json({ message: "Success" }, { status: 201 }); // acting cool
  }

  const eventType = body.event_type;
  const resource = body.resource;

  try {
    console.log("📩 PayPal Webhook received:", eventType);

    if (
      eventType === "CHECKOUT.ORDER.APPROVED" ||
      eventType === "PAYMENT.CAPTURE.COMPLETED"
    ) {
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error: any) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
