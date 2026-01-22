"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: "TECH" | "COMMERCIAL";
}

const PROFILE_CACHE_KEY = "user_profile_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedProfile {
  profile: UserProfile;
  timestamp: number;
  userId: string;
}

function getCachedProfile(userId: string): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(PROFILE_CACHE_KEY);
    if (!cached) return null;

    const parsed: CachedProfile = JSON.parse(cached);
    const isValid =
      parsed.userId === userId &&
      Date.now() - parsed.timestamp < CACHE_TTL;

    return isValid ? parsed.profile : null;
  } catch {
    return null;
  }
}

function setCachedProfile(userId: string, profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    const cached: CachedProfile = {
      profile,
      timestamp: Date.now(),
      userId,
    };
    sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Ignore storage errors
  }
}

function clearCachedProfile(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchingRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function loadUserProfile() {
      // Prevent concurrent fetches
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      try {
        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          if (mounted) {
            setUser(null);
            setProfile(null);
            clearCachedProfile();
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUser(session.user);
        }

        // Check cache first
        const cachedProfile = getCachedProfile(session.user.id);
        if (cachedProfile) {
          if (mounted) {
            setProfile(cachedProfile);
            setLoading(false);
          }
          return;
        }

        // Fetch user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, name, role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        const typedProfile = profileData as UserProfile;

        if (mounted) {
          setProfile(typedProfile);
          setCachedProfile(session.user.id, typedProfile);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        if (mounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load user profile"),
          );
          setLoading(false);
        }
      } finally {
        fetchingRef.current = false;
      }
    }

    loadUserProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Clear cache on sign out
      if (event === "SIGNED_OUT") {
        clearCachedProfile();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!session?.user) {
        clearCachedProfile();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      // On sign in, always fetch fresh profile
      if (event === "SIGNED_IN") {
        clearCachedProfile();
      }

      // Check cache for other events
      const cachedProfile = getCachedProfile(session.user.id);
      if (cachedProfile && event !== "SIGNED_IN") {
        setProfile(cachedProfile);
        setLoading(false);
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, name, role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        const typedProfile = profileData as UserProfile;

        if (mounted) {
          setProfile(typedProfile);
          setCachedProfile(session.user.id, typedProfile);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        if (mounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load user profile"),
          );
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
