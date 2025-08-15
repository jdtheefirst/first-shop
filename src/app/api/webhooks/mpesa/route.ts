import { NextResponse } from "next/server";

// Mpesa callback webhook listener;
export async function POST(request: Request, res: Response) {
  const { pathname } = new URL(request.url);
  const searchParams = new URLSearchParams(pathname.split("?")[1]);
  const userId = searchParams.get("userId");
  const body = await request.json();
  const { Body } = body;
  if (!Body || !Body.stkCallback) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    if (!Body.stkCallback.CallbackMetadata) {
      return NextResponse.json(
        { message: "Invalid callback data" },
        { status: 400 }
      );
    }

    const amount = Body.stkCallback.CallbackMetadata.Item[0].Value;

    // Update transaction status to 'Completed' and update the amount

    // Update user subscription or other details
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
