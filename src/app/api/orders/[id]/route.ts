import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      created_at,
      status,
      total,
      currency,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          description
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
