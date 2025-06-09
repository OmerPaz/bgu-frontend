import React from 'react';
import { NotesProvider } from './NotesContext';
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import CreateUserPage from './CreateUserPage';

export default function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-user" element={<CreateUserPage />} />
          </Routes>
        </Router>
      </NotesProvider>
    </AuthProvider>
  );
}