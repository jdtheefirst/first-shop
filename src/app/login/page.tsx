"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function AuthPanel({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParam = use(searchParams);
  const { tab } = searchParam;
  const [panel, setPanel] = useState<"signin" | "signup">("signin");
  const fanSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const redirectPath = user.role === "admin" ? `/admin` : "/products";
      router.push(redirectPath);
    }
  }, [user, router]);

  const handleTabChange = (value: string) => {
    if (value === "signin" || value === "signup") {
      setPanel(value);
    }

    // Maintain scroll position when switching tabs
    if (fanSectionRef.current) {
      const el = document.getElementById(fanSectionRef.current.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to World Samma Academy Store
            <span className="text-blue-600 dark:text-blue-400">Base</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join our community of martial arts and self-defense enthusiasts
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm">
          <Tabs
            value={panel}
            onValueChange={handleTabChange}
            defaultValue={panel}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-4">
          {panel === "signin" ? (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Don’t have an account?{" "}
                <button
                  onClick={() => handleTabChange("signup")}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing up, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => handleTabChange("signin")}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Log in here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
