import { useState } from 'react';
import { supabase } from '../supabase';

export default function Login() {
  const [error, setError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState('');

  const signIn = async (provider) => {
    setError('');
    setLoadingProvider(provider);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
    });
    if (err) {
      setError(err.message);
      setLoadingProvider('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-description">Continue with your preferred account.</p>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button
          className="btn btn-oauth"
          onClick={() => signIn('google')}
          disabled={!!loadingProvider}
        >
          <GoogleIcon />
          {loadingProvider === 'google' ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <button
          className="btn btn-oauth btn-github"
          onClick={() => signIn('github')}
          disabled={!!loadingProvider}
        >
          <GitHubIcon />
          {loadingProvider === 'github' ? 'Redirecting…' : 'Continue with GitHub'}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.1-6.1C34.36 3.03 29.47 1 24 1 14.82 1 7.07 6.48 3.64 14.28l7.1 5.52C12.48 13.65 17.76 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.68c-.55 2.95-2.2 5.45-4.68 7.13l7.18 5.57C43.34 37.3 46.52 31.36 46.52 24.5z"/>
      <path fill="#FBBC05" d="M10.74 28.2A14.6 14.6 0 0 1 9.5 24c0-1.46.25-2.88.7-4.2l-7.1-5.52A23.9 23.9 0 0 0 .5 24c0 3.87.93 7.52 2.56 10.74l7.68-6.54z"/>
      <path fill="#34A853" d="M24 46.5c5.47 0 10.06-1.81 13.41-4.92l-7.18-5.57c-1.87 1.25-4.26 1.99-6.23 1.99-6.24 0-11.52-4.15-13.26-9.8l-7.68 6.54C7.07 41.52 14.82 46.5 24 46.5z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
