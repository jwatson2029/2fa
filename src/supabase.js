/**
 * Supabase client setup
 *
 * SUPABASE_URL  – the "Project URL" shown in your Supabase project settings.
 * SUPABASE_ANON_KEY – the "anon / public" API key shown in the same settings page.
 *
 * Both values are safe to expose in the browser; the Row-Level Security (RLS)
 * policies on your Supabase project tables control what data each user can
 * read or write.
 *
 * Session / JWT storage:
 *   By default, @supabase/supabase-js persists the user's JWT access token and
 *   refresh token in localStorage under the key "sb-<project-ref>-auth-token".
 *   On every page load the client automatically reads that token, validates it,
 *   and (if expired) exchanges the refresh token for a new access token – so the
 *   user stays logged in across browser restarts without any extra work on your
 *   part.
 *
 * To change storage to sessionStorage (tab-only sessions) pass:
 *   auth: { storage: window.sessionStorage }
 * to createClient options.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.\n' +
    'Copy .env.example to .env.local and fill in your project credentials.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
