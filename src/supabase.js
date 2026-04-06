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

const supabaseUrl = 'https://qjvwjszfpuimpmagpzqy.supabase.co';
const supabaseAnonKey = 'sb_publishable_TXwOY3NKr8xVGLzJGATrFA_1AV4ujQ5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
