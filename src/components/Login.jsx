import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { SSO_DOMAIN } from '../saml';

/**
 * Login page – supports:
 *  1. Email + password login (supabase.auth.signInWithPassword)
 *  2. Google SAML SSO (supabase.auth.signInWithSSO)
 *
 * After a successful password login Supabase returns a session object that
 * contains an access_token (JWT) and a refresh_token.  The client library
 * automatically persists both in localStorage and refreshes the access token
 * before it expires – no manual token management is required.
 *
 * For SAML SSO, signInWithSSO returns a { data: { url } } redirect URL.
 * We navigate the browser to that URL; Google authenticates the user and
 * then redirects back to the configured ACS (Assertion Consumer Service) URL
 * on your Supabase project.  Supabase then redirects to the URL specified in
 * VITE_SITE_URL (or the dashboard "Site URL" setting).
 */

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Basic email format validation
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSSOLogin = async () => {
    setError('');

    if (!SSO_DOMAIN) {
      setError('SSO domain is not configured. Set VITE_SSO_DOMAIN in your .env.local file.');
      return;
    }

    setLoading(true);
    // signInWithSSO looks up the SAML IdP registered in your Supabase project
    // for this domain, then returns a URL to redirect the user to.
    const { data, error: err } = await supabase.auth.signInWithSSO({ domain: SSO_DOMAIN });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    if (data?.url) {
      // Full-page redirect to the Google SAML IdP
      window.location.href = data.url;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign in</h1>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <form onSubmit={handleLogin} noValidate>
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-footer-link">
            <Link to="/reset-password">Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        {/* Google SAML SSO button */}
        <button
          type="button"
          className="btn btn-sso"
          onClick={handleSSOLogin}
          disabled={loading}
        >
          <svg className="sso-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google SSO
        </button>

        <p className="auth-switch">
          Don&rsquo;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
