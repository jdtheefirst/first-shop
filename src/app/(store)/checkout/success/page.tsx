"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  ArrowRight,
  FileDown,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { PaymentStatus } from "../payment/page";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";
import { useStore } from "@/lib/context/StoreContext";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-12345";
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  // M-Pesa payment
  const handleMPesaPayment = async () => {
    setPaymentStatus("processing");

    try {
      if (!user) {
        toast.info("Haven't logged in yet, redirecting to login...");
        return router.push("/login");
      }

      if (!phoneNumber) {
        setPaymentStatus("error");
        setErrorMessage("Please enter your phone number.");
        toast.error("Please enter your phone number.");
        return;
      }

      const res = await fetch("/api/checkout/mpesa/retrial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderDetails.id, phoneNumber }),
      });

      const data = await res.json();
      console.log("Data:", data);

      if (!res.ok || data.error) {
        setPaymentStatus("error");
        setErrorMessage(data.error || "Failed to initiate M-Pesa payment.");
        toast.error(data.error || "Failed to initiate M-Pesa payment.");
        console.error("M-Pesa payment error:", data);
        return;
      }

      // Simulate successful payment
      setPaymentStatus("success");

      // they have received an STK push notification
      toast.success(
        "M-Pesa payment initiated successfully! Please complete the payment on your phone."
      );

      const { orderId: confirmedOrderId, data: mpesaResponse } = data;

      if (mpesaResponse?.CustomerMessage) {
        toast.info(mpesaResponse.CustomerMessage);
      }

      router.push(`/checkout/success?orderId=${confirmedOrderId}`);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setErrorMessage(
        "There was an error processing your M-Pesa payment. Please try again."
      );
      toast.error(
        "There was an error processing your M-Pesa payment. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-red-500 font-medium">Order not found.</p>
        <Button asChild className="mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-2 max-w-4xl mx-auto">
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
                value={new Date(orderDetails.created_at).toLocaleDateString()}
              />
              <Info label="Email" value={orderDetails.shipping_info?.email} />
              <Info label="phone" value={orderDetails.shipping_info?.phone} />
              <Info
                label="Payment_method"
                value={orderDetails.shipping_info?.paymentMethod}
              />
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
                {orderDetails.items?.map((item: any) => (
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
                  {orderDetails.shipping_info.firstName}{" "}
                  {orderDetails.shipping_info.lastName}
                </p>
                <p>{orderDetails.shipping_info.address}</p>
                <p>
                  {orderDetails.shipping_info.city},{" "}
                  {orderDetails.shipping_info.state}{" "}
                  {orderDetails.shipping_info.postalCode}
                </p>
                <p>{orderDetails.shipping_info.country}</p>
              </address>
            </div>
          </div>
        </div>

        {/* 🚚 Sidebar Next Steps */}
        <div className="bg-background rounded-lg border p-6 space-y-6 h-fit md:sticky md:top-20">
          {/* Payment Status Messages */}
          {paymentStatus === "processing" && (
            <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center">
              <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-700 border-t-transparent rounded-full"></div>
              <p>Processing your payment...</p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              <p>Payment successful! Redirecting to confirmation page...</p>
            </div>
          )}

          {paymentStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              <p>{errorMessage}</p>
            </div>
          )}
          {orderDetails.status === "pending" ? (
            <>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Payment Pending</h3>
                  <p className="text-muted-foreground text-sm">
                    Your order was placed, but payment hasn’t been completed.
                    Please finish your payment below.
                  </p>
                </div>
              </div>

              {/* Payment retry component */}
              {orderDetails.shipping_info?.paymentMethod === "paypal" && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Button
                    type="button"
                    onClick={() => {
                      // 🚀 redirect back to PayPal checkout flow
                      router.push(
                        `/checkout/processing/retrial?orderId=${orderDetails.id}`
                      );
                    }}
                    className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
                  >
                    Retry with PayPal
                  </Button>
                </div>
              )}

              {orderDetails.shipping_info?.paymentMethod === "mpesa" && (
                <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                  <input
                    type="tel"
                    placeholder="e.g., 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                  <Button
                    type="button"
                    onClick={handleMPesaPayment}
                    className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                    disabled={phoneNumber.length !== 12}
                  >
                    Retry with M-Pesa
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">What’s next?</h3>
                  <p className="text-muted-foreground text-sm">
                    We’re packing your items. You’ll get an email once your
                    order ships, with tracking info included.
                  </p>
                </div>
              </div>

              <Button asChild className="w-full" variant="outline">
                <Link href={`/orders/${orderDetails.id}/invoice`}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Download Invoice
                </Link>
              </Button>
            </>
          )}
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
