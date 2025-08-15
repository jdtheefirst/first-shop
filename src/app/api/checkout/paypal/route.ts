// /app/api/paypal/checkout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { secureRatelimit } from "@/lib/limit";

const PAYPAL_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function POST(req: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const body = await req.json();

  const { cart } = body;

  const { success } = await secureRatelimit(req);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: "Unauthorized", redirect: "/login" },
      { status: 401 }
    );
  }

  try {
    // 1. Get PayPal access token
    const basicAuth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Create order
    const orderRes = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: cart,
        application_context: {
          brand_name: "WSF Shop",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${siteUrl}/checkout/success`,
          cancel_url: `${siteUrl}/checkout/failed`,
        },
      }),
    });

    const orderData = await orderRes.json();

    const approveUrl = orderData.links?.find(
      (link: any) => link.rel === "approve"
    )?.href;

    if (!approveUrl) {
      throw new Error("PayPal approval link not found");
    }

    return NextResponse.json({ url: approveUrl });
  } catch (err: any) {
    console.error("PayPal session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
