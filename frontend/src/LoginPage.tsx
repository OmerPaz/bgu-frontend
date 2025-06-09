import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { username, password });
      const { token, name, email, username: un } = res.data;
      login(token, { name, email, username: un });
      navigate('/');
    } catch (err: any) {
      setError('Login failed');
    }
  };

  return (
    <form data-testid="login_form" onSubmit={submit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>
          Username:
          <input
            data-testid="login_form_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            data-testid="login_form_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button data-testid="login_form_login" type="submit">
        Login
      </button>
    </form>
  );
} 