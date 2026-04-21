/**
 * lib/supabase.ts
 *
 * Exports two Supabase clients:
 * 1. createBrowserClient — used in Client Components
 * 2. createServerClient — used in Server Components / Route Handlers
 *
 * We use @supabase/ssr which handles cookies correctly for Next.js App Router.
 */

import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { createServerClient as _createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Browser client (Client Components) ──────────────────────────────────
export function createBrowserClient() {
  return _createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
}

// ─── Server client (Server Components, Route Handlers, Server Actions) ───
export async function createServerClient() {
  const cookieStore = await cookies();

  return _createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll called from a Server Component — cookies can't be set.
          // Middleware handles session refresh so this is safe to ignore.
        }
      },
    },
  });
}

// ─── Admin client (for seed scripts, bypasses RLS) ───────────────────────
// Only use server-side, never expose to client
export function createAdminClient() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
