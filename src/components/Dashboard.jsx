import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

/**
 * Dashboard – only reachable when the user is authenticated.
 * App.jsx's ProtectedRoute component enforces that guard; this component
 * receives the current `session` object as a prop for convenience.
 *
 * The user's email is extracted from session.user.email (populated by
 * Supabase from the JWT claims).
 *
 * supabase.auth.signOut() clears the JWT and refresh token from localStorage,
 * ending the session both locally and on the Supabase server.
 */
export default function Dashboard({ session }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // onAuthStateChange in App.jsx will set session to null and redirect to /login
    navigate('/login');
  };

  if (!session) return null;

  const email = session.user?.email ?? 'Unknown user';
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <span className="dashboard-logo">MyApp</span>
        <div className="dashboard-nav-right">
          <div className="avatar" aria-hidden="true">{initials}</div>
          <button
            className="btn btn-outline"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h1>Welcome back! 👋</h1>
          <p className="welcome-email">{email}</p>
        </div>
      </main>
    </div>
  );
}
