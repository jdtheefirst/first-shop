"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-12345";
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        // 🎯 Replace with real API call to Supabase
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        setOrderDetails(data);
        // 🎉 Launch confetti on success
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container py-12 text-center">
        <p className="text-red-500 font-medium">Order not found.</p>
        <Button asChild className="mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* ✅ Confirmation Header */}
      <div className="text-center mb-8">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thanks for shopping with us. Your order is now being processed.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 📦 Order Details */}
        <div className="md:col-span-2 bg-background rounded-lg border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>
          <div className="p-6">
            {/* Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Info label="Order Number" value={orderDetails.id} />
              <Info
                label="Date"
                value={new Date(orderDetails.date).toLocaleDateString()}
              />
              <Info label="Email" value={orderDetails.shipping.email} />
              <Info
                label="Status"
                value={
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {orderDetails.status}
                  </span>
                }
              />
            </div>

            {/* Items */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Items</h3>
              <ul className="divide-y mb-6">
                {orderDetails.items.map((item: any) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium mb-4">Shipping Address</h3>
              <address className="not-italic text-muted-foreground">
                <p>
                  {orderDetails.shipping.firstName}{" "}
                  {orderDetails.shipping.lastName}
                </p>
                <p>{orderDetails.shipping.address}</p>
                <p>
                  {orderDetails.shipping.city}, {orderDetails.shipping.state}{" "}
                  {orderDetails.shipping.postalCode}
                </p>
                <p>{orderDetails.shipping.country}</p>
              </address>
            </div>
          </div>
        </div>

        {/* 🚚 Sidebar Next Steps */}
        <div className="bg-background rounded-lg border p-6 space-y-4 h-fit md:sticky md:top-20">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium mb-1">What’s next?</h3>
              <p className="text-muted-foreground text-sm">
                We’re packing your items. You’ll get an email once your order
                ships, with tracking info included.
              </p>
            </div>
          </div>

          <Button asChild className="w-full" variant="outline">
            <Link href={`/orders/${orderDetails.id}/invoice`}>
              <FileDown className="h-4 w-4 mr-2" />
              Download Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* 🚀 Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>

        <Button asChild>
          <Link href="/products" className="flex items-center gap-2">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
