import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

/**
 * Password reset via Supabase "magic link" / recovery email.
 *
 * supabase.auth.resetPasswordForEmail sends the user an email containing a
 * link that, when clicked, redirects them back to VITE_SITE_URL/reset-password
 * with a recovery token in the URL fragment.  Supabase's client library
 * automatically exchanges that token for a session so the user can then call
 * supabase.auth.updateUser({ password: '...' }) to set a new password.
 *
 * The redirectTo option must be an allow-listed URL in your Supabase project
 * under Authentication → URL Configuration → Redirect URLs.
 */
export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Check your inbox</h1>
          <p className="auth-success">
            A password reset link has been sent to <strong>{email}</strong>.
          </p>
          <p className="auth-switch">
            <Link to="/login">Back to sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-description">
          Enter your email and we&rsquo;ll send you a reset link.
        </p>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <form onSubmit={handleReset} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
