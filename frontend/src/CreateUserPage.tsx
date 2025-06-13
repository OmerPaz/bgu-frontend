import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', { name, email, username, password });
      navigate('/');
    } catch (err: any) {
      setError('User creation failed');
    }
  };

  return (
    <form data-testid="create_user_form" onSubmit={submit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>
          Name:
          <input
            data-testid="create_user_form_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            data-testid="create_user_form_email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Username:
          <input
            data-testid="create_user_form_username"
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
            data-testid="create_user_form_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <button data-testid="create_user_form_create_user" type="submit">
        Create User
      </button>
    </form>
  );
} 