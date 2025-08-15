"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import {
  User as SupabaseUser,
  Session,
  AuthError,
} from "@supabase/supabase-js";
import { getSupabaseClient } from "../supabase/client";

export interface CustomUser extends SupabaseUser {
  role: string;
  email: string;
  metadata: {};
  created_at: string; // when the user was created (ISO string)
  updated_at: string; // when the user was last updated (ISO string)
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  supabase: ReturnType<typeof getSupabaseClient>;
  debouncePromise: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay: number
  ) => (...args: Parameters<T>) => Promise<ReturnType<T>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [supabase] = useState(() => getSupabaseClient());

  const fetchUserRole = useCallback(
    async (supabaseUser: SupabaseUser) => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*") // join + alias
          .eq("id", supabaseUser.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user role:", error.message);
          return;
        }

        if (!data) {
          console.warn("No user found with that ID.");
          return;
        }

        setUser(data as CustomUser); // consider zod here
      } catch (err) {
        console.error("Unexpected error in fetchUserRole:", err);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error.message);
        setLoading(false);
        return;
      }

      if (mounted) {
        if (session?.user) {
          await fetchUserRole(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    }: {
      data: { subscription: { unsubscribe: () => void } };
    } = supabase.auth.onAuthStateChange((_event: string, session: Session) => {
      if (!mounted) return;

      (async () => {
        if (session?.user) {
          await fetchUserRole(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      })(); // wrapped in IIFE
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserRole, supabase]);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: AuthError | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { access_token, refresh_token } = data.session!;
    await supabase.auth.setSession({ access_token, refresh_token });

    return { error };
  };

  const signInWithMagicLink = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true, // Automatically create user if they don't exist
      },
    });
    if (error) throw error;
  };

  const signInWithGoogle = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signInWithTwitter = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  function debouncePromise<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay: number
  ) {
    let timer: NodeJS.Timeout | null = null;
    let lastCall: Promise<any> | null = null;

    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
      if (timer) clearTimeout(timer);
      return new Promise((resolve) => {
        timer = setTimeout(() => {
          lastCall = fn(...args).then(resolve);
        }, delay);
      });
    };
  }

  const value = useMemo<AuthContextType>(() => {
    return {
      user,
      loading,
      signIn,
      signInWithMagicLink,
      signInWithGoogle,
      signInWithTwitter,
      signUp,
      signOut,
      debouncePromise,
      isAdmin: user?.role === "admin",
      supabase,
    };
  }, [
    user,
    loading,
    supabase,
    signIn,
    signInWithGoogle,
    signInWithMagicLink,
    signInWithTwitter,
    signOut,
    signUp,
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
