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
          name
        )
      ),
      users (
        id,
        email
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

  // 🔥 build a simple invoice payload
  const invoice = {
    invoiceId: `INV-${order.id}`,
    customer: {
      email: order.users?.[0]?.email ?? "Unknown",
    },
    date: order.created_at,
    items: order.order_items.map((item: any) => ({
      product: item.products?.name ?? "Unknown product",
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    })),
    total: order.total,
    currency: order.currency,
    status: order.status,
  };

  return NextResponse.json(invoice);
}
