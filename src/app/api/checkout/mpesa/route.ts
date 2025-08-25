import { secureRatelimit } from "@/lib/limit";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import axios from "axios";
import { NextResponse } from "next/server";

const generateToken = async () => {
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const key = process.env.MPESA_CONSUMER_KEY;
  const auth = Buffer.from(key + ":" + secret).toString("base64");
  try {
    const response = await axios.get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    const token = response.data.access_token; // No need for await here

    return token;
  } catch (error) {
    console.log("Token Error generated", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const { cart, phoneNumber } = body;
  const { total, items, currency, shipping } = cart;
  console.log(
    "items",
    items,
    "total",
    total,
    "currency",
    currency,
    "shipping",
    shipping
  );

  // IF NO PHONE NUMBER
  if (
    !phoneNumber ||
    phoneNumber.length !== 12 ||
    !phoneNumber.startsWith("254")
  ) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }

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

  // Convert USD → KES with 24h caching
  let amountKES = total;
  if (currency !== "KSH") {
    try {
      const res = await fetch(
        "https://api.exchangerate.host/convert?from=USD&to=KES",
        { next: { revalidate: 3600 * 24 } } // 24h cache
      );
      const json = await res.json();

      console.log("Exchange rate data:", json);

      const rate = json?.info?.rate;

      if (!rate) throw new Error("Rate missing");
      amountKES = Math.round(total * rate);
    } catch (err) {
      console.error(
        "Exchange rate fetch failed, defaulting to hardcoded rate",
        err
      );
      amountKES = Math.round(total * 131); // fallback
    }
  }

  const current_time = new Date();
  const year = current_time.getFullYear();
  const month = String(current_time.getMonth() + 1).padStart(2, "0");
  const day = String(current_time.getDate()).padStart(2, "0");
  const hours = String(current_time.getHours()).padStart(2, "0");
  const minutes = String(current_time.getMinutes()).padStart(2, "0");
  const seconds = String(current_time.getSeconds()).padStart(2, "0");

  const shortCode = process.env.MPESA_SHORTCODE!;
  const passKey = process.env.MPESA_PASSKEY!;
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const password = Buffer.from(shortCode + passKey + timestamp).toString(
    "base64"
  );

  try {
    const token = await generateToken();

    // 📦 1. Create order
    const { data: orderData, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        currency,
        status: "pending", // default
        shipping_info: shipping,
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 📦 2. Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.id,
      qty: item.quantity,
      unit_price: item.price,
    }));
    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);
    if (itemsErr) throw itemsErr;

    const { data } = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: "6549717",
        Password: `${password}`,
        Timestamp: `${timestamp}`,
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amountKES, // Use converted amount in KES
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_TILL!,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.BASE_URL}/api/webhooks/mpesa?orderId=${
          orderData.id
        }&callbackSecret=${process.env.MPESA_CALLBACK_SECRET!}`,
        AccountReference: "World Samma Federation",
        TransactionDesc: "Payment for order",
      },
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.ResponseCode !== "0") {
      throw new Error(`M-Pesa error: ${data.ResponseDescription}`);
    }

    return NextResponse.json(
      { orderId: orderData.id, mpesa: data },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("M-Pesa checkout error:", error);
    if (error.response) {
      // This logs the full M-Pesa response when the request fails
      console.error("M-Pesa API response error:", error.response.data);
      console.error("Status code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else {
      console.error("Unknown M-Pesa error:", error.message);
    }
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
