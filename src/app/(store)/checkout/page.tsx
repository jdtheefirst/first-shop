"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronLeft, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { buildOrderData, useCart, useStore } from "@/lib/context/StoreContext";
import {
  calculateOrderTotals,
  calculateShipping,
  formatCurrency,
} from "@/lib/utils";

// Form schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  state: z.string().min(2, "State must be at least 2 characters."),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters."),
  country: z.string().min(2, "Country must be at least 2 characters."),
  paymentMethod: z.enum(["paypal", "mpesa"], {
    message: "Please select a payment method.",
  }),
});

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state, dispatch } = useStore();
  const { cartItems } = useCart();

  // If cart is empty, redirect to products
  // Redirect safely inside useEffect
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/products");
    }
  }, [cartItems, router]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      paymentMethod: "mpesa", // Default payment method
    },
    mode: "onBlur",
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Simulate order creation
      const orderData = buildOrderData(state, values);

      // Store in context so payment page can access
      dispatch({ type: "SET_PENDING_ORDER", payload: orderData });

      // Redirect to payment page
      router.push("/checkout/payment");
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch form values for country and city
  const country = form.watch("country");
  const city = form.watch("city");

  // Calculate order totals
  const { shippingCost, orderTotal, totalWeight } = calculateOrderTotals(
    cartItems,
    country,
    city
  );

  // Sync order total into store when it changes
  useEffect(() => {
    dispatch({ type: "SET_TOTAL", payload: orderTotal });
  }, [orderTotal, state.total, dispatch]);

  return (
    <div className="container mx-auto py-8 px-2">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-background rounded-lg border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>

            <div className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <input
                              type="email"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <input
                              type="tel"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address Fields */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Payment Method */}
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="paypal"
                                checked={field.value === "paypal"}
                                onChange={field.onChange}
                                disabled
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <Label className="text-sm">
                                PayPal{" "}
                                <span className="text-muted-foreground text-xs text-line-through">
                                  (credit/debit card or PayPal account)
                                </span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="mpesa"
                                checked={field.value === "mpesa"}
                                onChange={field.onChange}
                                className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                              />
                              <Label className="text-sm">M-Pesa</Label>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Continue to Payment"}
                  </Button>
                </form>
              </Form>
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
              <ul className="divide-y mb-4">
                {cartItems.map((item) => (
                  <li
                    key={item.product.id}
                    className="py-3 flex justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(
                        item.product.price * item.quantity,
                        item.product.currency
                      )}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Shipping to: {city}, {country}
                  </span>
                  <span>Weight: {totalWeight.toFixed(2)} kg</span>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(orderTotal, "KES")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
