// app/login/page.tsx - FOR uniforms shop
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingBag,
  Package,
  Percent,
  Clock,
  Users,
  Award,
  Star,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useStore } from "@/lib/context/StoreContext";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; message?: string }>;
}) {
  const { profile } = useAuth();
  const router = useRouter();
  const searchParam = use(searchParams);
  const { redirect, message } = searchParam;
  const [panel, setPanel] = useState<"signin" | "signup">("signin");
  const { state } = useStore();
  const orderData = state.pendingOrder;

  useEffect(() => {
    if (profile) {
      const redirectPath =
        redirect || profile.role === "admin"
          ? `/admin`
          : orderData
          ? "/checkout/payment"
          : "/products";
      router.push(redirectPath);
    }
  }, [profile, router, orderData]);

  const handleTabChange = (value: string) => {
    if (value === "signin" || value === "signup") {
      setPanel(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-blue-950 py-8">
      <div className="container max-w-6xl mx-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Uniforms Shop Account
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Login for faster reorders, exclusive discounts, and order
                  tracking
                </CardDescription>

                {message && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {message}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs
                  value={panel}
                  onValueChange={handleTabChange}
                  defaultValue={panel}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                    <TabsTrigger
                      value="signin"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-blue-400"
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4">
                    <LoginForm />
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Create Your Account
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sign up for exclusive benefits and faster reordering
                      </p>

                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                            Account Benefits:
                          </h4>
                          <ul className="text-xs text-green-700 dark:text-green-300 space-y-1 text-left">
                            <li className="flex items-center gap-2">
                              <Percent className="w-3 h-3" />
                              Exclusive discounts for returning customers
                            </li>
                            <li className="flex items-center gap-2">
                              <RotateCcw className="w-3 h-3" />
                              One-click reorders from your history
                            </li>
                            <li className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              Save shopping lists for repeat purchases
                            </li>
                            <li className="flex items-center gap-2">
                              <Award className="w-3 h-3" />
                              Loyalty points on every purchase
                            </li>
                          </ul>
                        </div>

                        <Button
                          asChild
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Link href="/register">
                            Create Free Account
                            <Users className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Guest Checkout Option */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-3">
                    Want to shop without an account?
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600"
                  >
                    <Link href="/products">
                      Continue as Guest
                      <ShoppingBag className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    You can create an account later to save your order history
                  </p>
                </div>

                {/* Support Links */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    By signing in, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Need help?{" "}
                    <Link
                      href="mailto:support@uniforms-shop.com"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Benefits & Features */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                <span>Trusted Uniform Supplier</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Create an Account?
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Unlock exclusive benefits for school uniform purchases
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                  <Percent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Reorder Discounts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Get 10-15% off on repeat purchases for your school
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Quick Reorder
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    One-click reorders from your previous purchase history
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Save Shopping Lists
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Save uniform lists for different classes or years
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Loyalty Points
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Earn points on every purchase redeemable for discounts
                  </p>
                </div>
              </div>
            </div>

            {/* For Schools Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    For Schools & Bulk Purchases
                  </h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-500" />
                      Dedicated account manager for schools
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-500" />
                      Special pricing for bulk orders
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-500" />
                      Custom embroidery and branding services
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-500" />
                      Consolidated billing and invoicing
                    </li>
                  </ul>
                  <Button
                    asChild
                    variant="link"
                    className="text-blue-600 dark:text-blue-400 p-0 h-auto mt-3"
                  >
                    <Link href="/school-partnerships">
                      Learn about school partnerships →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    James M., School Administrator
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Green Valley High School
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                "Creating an account has saved us hours each semester. The quick
                reorder feature and saved uniform lists make outfitting 300+
                students incredibly efficient."
              </p>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
