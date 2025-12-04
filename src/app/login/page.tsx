// app/login/page.tsx - FOR shop.worldsamma.org
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
  CreditCard,
  Video,
  Users,
  Award,
  ExternalLink,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-orange-950 py-8">
      <div className="container max-w-6xl mx-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-lg border-0 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center items-center space-x-3">
                  <img
                    src="/android-chrome-192x192.png"
                    alt="WSF Logo"
                    className="w-12 h-12 dark:invert"
                  />
                  <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <ShoppingBag className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Uniform Shop
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Access your account to purchase school uniforms and supplies
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
                      className="data-[state=active]:bg-white data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-orange-400"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      disabled
                      className="data-[state=active]:bg-white data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-orange-400"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4">
                    <LoginForm />
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                        <ExternalLink className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Create Federation Account
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        All student accounts are created through our main
                        federation portal
                      </p>

                      <Button
                        asChild
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Link
                          href="https://worldsamma.org/onboarding"
                          target="_blank"
                        >
                          Go to Federation Onboarding
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-xs text-blue-800 dark:text-blue-200">
                          After creating your account, return here to login and
                          purchase products
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Support Links */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    By signing in, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Need help?{" "}
                    <Link
                      href="mailto:shop@worldsamma.org"
                      className="text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      Contact Shop Support
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Shop Benefits */}
          {/* <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <ShoppingBag className="w-4 h-4" />
                <span>Official WSF Shop</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Access Your Samma Training
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Login to continue your martial arts journey
              </p>
            </div>

            {/* Shop Features Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Course Access
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Stream all your purchased courses and training videos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Progress Tracking
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Track your belt progression and certification status
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Order History
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    View your purchase history and download receipts
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Family Management
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage family package members and their course access
                  </p>
                </div>
              </div>
            </div>

            {/* Cross-Platform Note */}
          {/* <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Single Sign-On
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your WSF account works across all platforms: federation portal,
                shop, and mobile apps. One login, everywhere.
              </p>
            </div> */}

          {/* Quick Steps */}
          {/* <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">
                New to WSF?
              </h4>
              <div className="space-y-2 text-sm text-orange-800 dark:text-orange-300">
                <p className="flex items-center">
                  1. Create account at{" "}
                  <Link
                    href={"https://worldsamma.org/onboarding"}
                    target="_blank"
                  >
                    worldsamma.org/onboarding
                  </Link>
                </p>
                <p>2. Verify email and complete registration</p>
                <p>3. Return here to login and shop</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
