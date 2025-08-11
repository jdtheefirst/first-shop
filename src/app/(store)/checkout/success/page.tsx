"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-12345";
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the order details from the database
    const fetchOrderDetails = async () => {
      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock order data
        setOrderDetails({
          id: orderId,
          date: new Date().toISOString(),
          total: 349.97,
          status: "paid",
          items: [
            {
              id: "1",
              title: "Premium Karate Gi",
              price: 89.99,
              quantity: 1,
            },
            {
              id: "2",
              title: "Competition Sparring Gear Set",
              price: 129.99,
              quantity: 2,
            },
          ],
          shipping: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            address: "123 Main St",
            city: "Nairobi",
            state: "Nairobi",
            postalCode: "00100",
            country: "Kenya",
          },
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

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
      </div>

      <div className="bg-background rounded-lg border overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Order Details</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-medium">{orderDetails.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(orderDetails.date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{orderDetails.shipping.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Order Status</p>
              <p className="font-medium capitalize">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {orderDetails.status}
                </span>
              </p>
            </div>
          </div>

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

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

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

      <div className="bg-background rounded-lg border overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium mb-1">What happens next?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                We're preparing your order for shipment. You will receive an
                email with tracking information once your order has been
                shipped.
              </p>
              <p className="text-muted-foreground text-sm">
                If you have any questions about your order, please contact our
                customer support team.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>

        <Button asChild>
          <Link href="/products" className="flex items-center gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
