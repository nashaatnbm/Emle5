"use client";

/**
 * components/providers/AuthProvider.tsx
 *
 * Global authentication context.
 * - Fetches current user from /api/auth/me on mount
 * - Exposes user, loading state, login, logout functions
 * - Used by useAuth() hook throughout the app
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ClientUser } from "@/types";

// ─── Types ─────────────────────────────────────────────────────────────────
type AuthState = {
  user:      ClientUser | null;
  loading:   boolean;
  error:     string | null;
};

type AuthContextType = AuthState & {
  /** Call after successful login/register to update context */
  setUser:   (user: ClientUser | null) => void;
  /** Logout: clears server session + context */
  logout:    () => Promise<void>;
  /** Refresh user data from server */
  refresh:   () => Promise<void>;
};

// ─── Context ───────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user:    null,
  loading: true,
  error:   null,
  setUser: () => {},
  logout:  async () => {},
  refresh: async () => {},
});

// ─── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user:    null,
    loading: true,
    error:   null,
  });

  const refresh = useCallback(async () => {
    try {
      const res  = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setState({ user: data.user ?? null, loading: false, error: null });
    } catch {
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  // Fetch user on first mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const setUser = useCallback((user: ClientUser | null) => {
    setState(prev => ({ ...prev, user, loading: false }));
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setState({ user: null, loading: false, error: null });
    window.location.href = "/";
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setUser, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
