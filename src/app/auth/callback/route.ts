import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ProfileWithUser = {
  role: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // app/auth/callback/route.ts

  if (error) {
    const params = new URLSearchParams({
      error,
      error_description: errorDescription || "",
    });
    return NextResponse.redirect(new URL(`error?${params}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createClient();

  try {
    // Exchange the code for a session
    console.log("Attempting to exchange code for session...");
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("Session established successfully");

    // If session exists, fetch the user profile
    if (session?.user) {
      let profileData: ProfileWithUser | null = null;
      let fetchError: any = null;

      // Try up to 3 times, 1s apart
      for (let i = 0; i < 3; i++) {
        const { data, error } = await supabase
          .from("users")
          .select(`role`)
          .eq("id", session.user.id)
          .maybeSingle<ProfileWithUser>();

        if (data) {
          profileData = data;
          break;
        }

        fetchError = error;

        // Wait 1s before retrying (skip after last try)
        if (i < 2) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      if (!profileData) {
        console.error("Error fetching user role:", fetchError);
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const role = profileData.role;

      const redirectPath = role === "admin" ? `/admin` : `/products`;

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Show loading UI while waiting for session
  return new Response(
    `
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-4 text-gray-700">Completing sign in...</p>
      </div>
    </div>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
