import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';

/**
 * Registration page
 *
 * Calls supabase.auth.signUp which:
 *  - Creates a new user in Supabase Auth
 *  - Sends a confirmation email (unless email confirmation is disabled in the dashboard)
 *  - Returns a session immediately if "Confirm email" is turned off
 *
 * Validation performed client-side:
 *  - Email format check
 *  - Minimum 8-character password
 *  - Password confirmation match
 */
export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    // If email confirmation is enabled, data.session will be null and the user
    // must click the link in the confirmation email before they can log in.
    if (data.session) {
      navigate('/dashboard');
    } else {
      setMessage('Registration successful! Check your email for a confirmation link.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>

        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}

        <form onSubmit={handleRegister} noValidate>
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
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
