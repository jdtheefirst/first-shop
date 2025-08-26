"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-12345";
  const router = useRouter();

  useEffect(() => {
    const checkout = async () => {
      if (!user) {
        toast.info("Haven't logged in yet, redirecting to login...");
        return router.push("/login");
      }

      if (!orderId) return router.push("/products");

      const res = await fetch("/api/checkout/paypal/retrial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create session:", data);
      }
    };

    checkout();
  }, [orderId, router, user]);

  return (
    <div className="p-8 text-center">
      <p>Redirecting to payment...</p>
    </div>
  );
}
