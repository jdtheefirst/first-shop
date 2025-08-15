import { secureRatelimit } from "@/lib/limit";
import { createClient } from "@/lib/supabase/server";
import axios from "axios";
import { NextResponse } from "next/server";

const generateToken = async () => {
  const secret = process.env.CUSTOMER_SECRET;
  const key = process.env.CUSTOMER_KEY;
  const auth = Buffer.from(key + ":" + secret).toString("base64");
  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
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
  const { amount, userId, phoneNumber } = body;

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

  const phone = parseInt(phoneNumber.slice(1));

  const current_time = new Date();
  const year = current_time.getFullYear();
  const month = String(current_time.getMonth() + 1).padStart(2, "0");
  const day = String(current_time.getDate()).padStart(2, "0");
  const hours = String(current_time.getHours()).padStart(2, "0");
  const minutes = String(current_time.getMinutes()).padStart(2, "0");
  const seconds = String(current_time.getSeconds()).padStart(2, "0");

  const Shortcode = "6549717";
  const Passkey =
    "9101847e14f66f93ffdec5faeceb315e8918b0bcf4940443dc64b8acd94fd9dd";
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const password = Buffer.from(Shortcode + Passkey + timestamp).toString(
    "base64"
  );

  try {
    const token = await generateToken();

    const { data } = await axios.post(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: "6549717",
        Password: `${password}`,
        Timestamp: `${timestamp}`,
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: "8863150",
        PhoneNumber: `254${phone}`,
        CallBackURL: `https://worldsamma.org/api/paycheck/callback/${userId}`,
        AccountReference: "World Samma Federation",
        TransactionDesc: "Subcription",
      },
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    NextResponse.json(data);
  } catch (error) {
    console.log("My Error", error);
  }
}
