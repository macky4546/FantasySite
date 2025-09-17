import React, { useEffect, useState } from 'react';
import { login, logout, getUser } from '../utils/auth';

const providers = [
  { id: 'github', name: 'GitHub' },
  { id: 'azureactiveDirectory', name: 'Azure AD' },
  { id: 'google', name: 'Google' },
];

const Login = ({ onLogin }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getUser()
      .then(u => {
        if (mounted) setUser(u);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    if (user && onLogin) onLogin(user);
  }, [user, onLogin]);

  if (loading) return <div>Loading authentication status...</div>;

  if (user) {
    return (
      <div>
        <h2>Signed in</h2>
        <p>{user.userDetails}</p>
        <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(user, null, 2)}</pre>
        <button onClick={() => logout()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Sign in</h2>
      <p>Choose a provider to sign in with:</p>
      <div style={{display: 'flex', gap: 8}}>
        {providers.map(p => (
          <button key={p.id} onClick={() => login(p.id)}>{p.name}</button>
        ))}
      </div>
    </div>
  );
};

export default Login;
