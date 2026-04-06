import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

/**
 * ProtectedRoute – renders `children` only when a Supabase session exists.
 * Otherwise redirects to /login.  The `replace` prop prevents a spurious
 * back-navigation entry in the browser history.
 */
function ProtectedRoute({ session, children }) {
  if (session === undefined) {
    // Session is still being loaded from localStorage; show nothing to avoid flash
    return null;
  }
  return session ? children : <Navigate to="/login" replace />;
}

/**
 * PublicRoute – redirects already-authenticated users away from auth pages
 * (login, register) straight to /dashboard.
 */
function PublicRoute({ session, children }) {
  if (session === undefined) return null;
  return session ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  /**
   * `session` state:
   *   - `undefined`  → still loading the persisted session from localStorage
   *   - `null`       → loaded, no active session (user is logged out)
   *   - Session obj  → loaded, user is authenticated
   *
   * supabase.auth.onAuthStateChange fires:
   *   1. Immediately on mount with the current session (from localStorage)
   *   2. Whenever the user signs in, signs out, or the token is refreshed
   *
   * This single listener drives all routing decisions in the app.
   */
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession ?? null);
      }
    );

    // Clean up the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default: redirect root to /dashboard (ProtectedRoute handles the rest) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/login"
          element={
            <PublicRoute session={session}>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <Dashboard session={session} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
