"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/AuthContext";
import { useStore } from "@/lib/context/StoreContext";
import { toast } from "sonner";

// Payment status types
type PaymentStatus = "idle" | "processing" | "success" | "error";

export default function PaymentPage() {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user } = useAuth(); // Assuming useAuth is defined in your context
  const { state } = useStore(); // Assuming useStore is defined in your context
  const orderData = state.pendingOrder[0];

  // M-Pesa payment
  const handleMPesaPayment = async () => {
    setPaymentStatus("processing");

    try {
      if (!user) {
        toast.info("Haven't logged in yet, redirecting to login...");
        return router.push("/login");
      }

      if (!state.pendingOrder.length) return router.push("/products");
      if (!phoneNumber) {
        setPaymentStatus("error");
        setErrorMessage("Please enter your phone number.");
        toast.error("Please enter your phone number.");
        return;
      }

      const res = await fetch("/api/checkout/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: state.pendingOrder, phoneNumber }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setPaymentStatus("error");
        setErrorMessage(data.message || "Failed to initiate M-Pesa payment.");
        toast.error(data.message || "Failed to initiate M-Pesa payment.");
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

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/checkout"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Checkout
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Options */}
        <div className="lg:col-span-2">
          <div className="bg-background rounded-lg border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Complete Your Payment</h2>
            </div>

            <div className="p-6">
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

              {/* PayPal Payment Option */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  Pay with PayPal or Credit Card
                </h3>

                {/* In a real app, this would be the PayPal button */}
                <div className="border rounded-lg p-6 bg-gray-50">
                  <p className="text-center text-muted-foreground mb-4">
                    In a real implementation, the PayPal button would appear
                    here.
                  </p>

                  {/* Simulated PayPal button */}
                  <Button
                    onClick={() => {
                      router.push("/checkout/cart");
                    }}
                    className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
                    disabled={
                      paymentStatus === "processing" ||
                      paymentStatus === "success"
                    }
                  >
                    Pay with PayPal
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By clicking the button, you agree to the terms of service
                    and privacy policy.
                  </p>
                </div>
              </div>

              {/* M-Pesa Payment Option */}
              <div>
                <h3 className="text-lg font-medium mb-4">Pay with M-Pesa</h3>

                <div className="border rounded-lg p-6 bg-gray-50">
                  <p className="text-center text-muted-foreground mb-4">
                    Enter your phone number to receive an M-Pesa payment prompt.
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., 254712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Button
                    onClick={handleMPesaPayment}
                    className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                    disabled={
                      paymentStatus === "processing" ||
                      paymentStatus === "success"
                    }
                  >
                    Pay with M-Pesa
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    You will receive an STK push notification on your phone to
                    complete the payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-background rounded-lg border overflow-hidden sticky top-20">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="font-medium">Order #{orderData.id}</p>
              </div>

              <ul className="divide-y mb-4">
                {orderData.items.map((item: any) => (
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

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${orderData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <address className="not-italic text-sm text-muted-foreground">
                  <p>
                    {orderData.shipping.firstName} {orderData.shipping.lastName}
                  </p>
                  <p>{orderData.shipping.address}</p>
                  <p>
                    {orderData.shipping.city}, {orderData.shipping.state}{" "}
                    {orderData.shipping.postalCode}
                  </p>
                  <p>{orderData.shipping.country}</p>
                  {/* {shipping fee} */}
                  <p className="mt-2">
                    Shipping Fee:{" "}
                    {orderData.total > 100 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$10.00`
                    )}
                  </p>
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
