'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  status?: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const authError: AuthError = {
          message: signInError.message,
          status: signInError.status,
        };
        setError(authError);
        throw authError;
      }

      router.push('/dashboard');
      router.refresh();
      return data;
    } catch (err) {
      const authError: AuthError = {
        message: err instanceof Error ? err.message : 'Failed to sign in',
      };
      setError(authError);
      throw authError;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      setError(null);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (signUpError) {
        const authError: AuthError = {
          message: signUpError.message,
          status: signUpError.status,
        };
        setError(authError);
        throw authError;
      }

      return data;
    } catch (err) {
      const authError: AuthError = {
        message: err instanceof Error ? err.message : 'Failed to sign up',
      };
      setError(authError);
      throw authError;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        const authError: AuthError = {
          message: signOutError.message,
        };
        setError(authError);
        throw authError;
      }

      router.push('/login');
      router.refresh();
    } catch (err) {
      const authError: AuthError = {
        message: err instanceof Error ? err.message : 'Failed to sign out',
      };
      setError(authError);
      throw authError;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        const authError: AuthError = {
          message: resetError.message,
        };
        setError(authError);
        throw authError;
      }
    } catch (err) {
      const authError: AuthError = {
        message: err instanceof Error ? err.message : 'Failed to reset password',
      };
      setError(authError);
      throw authError;
    }
  };

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signUp,
    logout,
    signOut: logout, // Alias for logout
    resetPassword,
  };
}
