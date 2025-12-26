"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import {
  User as SupabaseUser,
  Session,
  AuthError,
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { ProfileData } from "@/types/student";

interface AuthContextType {
  profile: ProfileData | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData | null>>;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
  supabase: typeof supabase;
  debounce: <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ) => (...args: Parameters<T>) => void;
  deleteFileFromSupabase: (
    fileUrl: string,
    bucketName: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add debounce utility function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabaseRef = useRef(supabase);
  const initializedRef = useRef(false); // Prevent double initialization

  const fetchUserRole = useCallback(async (supabaseUser: SupabaseUser) => {
    try {
      const { data, error } = await supabaseRef.current
        .from("users_profile")
        .select("*")
        .eq("id", supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user role:", error.message);

        if (
          error.code?.includes("AUTH") ||
          error.message?.includes("Invalid") ||
          error.code === "400"
        ) {
          await supabaseRef.current.auth.signOut();
        }
        return;
      }

      if (!data) {
        console.warn("No user found with that ID.");
        return;
      }

      const profileData: ProfileData = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        country_code: data.country_code,
        county_code: data.county_code,
        postal_address: data.postal_address,
        phone_number: data.phone_number || "",
        avatar_url: data.avatar_url,
        language: data.language,
        gender: data.gender,
        admission_no: data.admission_no,
        belt_level: data.belt_level,
        role: data.role,
        referred_by: data.referred_by,
      };

      setProfile(profileData);
    } catch (err) {
      console.error("Unexpected error in fetchUserRole:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = debounce(async () => {
      console.log("🔄 Initializing auth...");

      // Use the ref instance
      const {
        data: { session },
        error,
      } = await supabaseRef.current.auth.getSession();

      if (error) {
        console.error("Error getting session:", error.message);
        if (mounted) setLoading(false);
        return;
      }

      if (mounted) {
        if (session?.user) {
          await fetchUserRole(session.user);
        } else {
          setLoading(false);
        }
      }
    }, 1000);

    initializeAuth();

    // Set up auth state change listener - only ONE
    const {
      data: { subscription },
    } = supabaseRef.current.auth.onAuthStateChange(
      async (event: Event, session: Session) => {
        if (!mounted) return;

        console.log("Auth state changed:", event);

        if (session?.user) {
          await fetchUserRole(session.user);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    authSubscription = subscription;

    return () => {
      console.log("🧹 Cleaning up auth listener");
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      initializedRef.current = false; // Reset for next mount
    };
  }, [fetchUserRole]); // Only fetchUserRole in dependencies

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | null }> => {
    const { data, error } = await supabaseRef.current.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    // CRITICAL: Don't manually setSession - this causes token refresh
    // The session is already set by signInWithPassword
    // await supabase.auth.setSession({ access_token, refresh_token });

    return { error: null };
  };

  // Login with magic link
  const signInWithMagicLink = async (email: string) => {
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || data.message || "Magic link failed");
  };

  const signInWithGoogle = async (): Promise<void> => {
    const { error } = await supabaseRef.current.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signInWithTwitter = async (): Promise<void> => {
    const { error } = await supabaseRef.current.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabaseRef.current.auth.signOut();
    if (error) throw error;
  };

  // Wrap deleteFileFromSupabase in useCallback
  const deleteFileFromSupabase = useCallback(
    async (
      fileUrl: string | null,
      bucketName: string | null
    ): Promise<boolean> => {
      if (!fileUrl || !bucketName) {
        console.warn("Missing URL or bucket name.");
        return false;
      }

      try {
        const prefix = "/storage/v1/object/public/";
        const [_, path] = fileUrl.split(prefix);

        if (!path) {
          console.warn("Invalid Supabase URL format:", fileUrl);
          return false;
        }

        const { error } = await supabaseRef.current.storage
          .from(bucketName)
          .remove([path]);

        if (error) {
          console.error("Supabase delete error:", error.message);
          return false;
        }

        console.log("Deleted from Supabase:", path);
        return true;
      } catch (err) {
        console.error("Unexpected delete error:", err);
        return false;
      }
    },
    []
  ); // Empty deps since it uses supabaseRef

  const value = useMemo<AuthContextType>(() => {
    return {
      profile,
      setProfile,
      loading,
      signIn,
      signInWithMagicLink,
      signInWithGoogle,
      signInWithTwitter,
      signOut,
      deleteFileFromSupabase,
      supabase,
      debounce,
    };
  }, [
    profile,
    loading,
    supabase,
    deleteFileFromSupabase,
    signIn,
    signInWithGoogle,
    signInWithMagicLink,
    signInWithTwitter,
    signOut,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
