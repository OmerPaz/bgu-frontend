import React from 'react';
import { NotesProvider } from './NotesContext';
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import CreateUserPage from './CreateUserPage';
import { SanitizerProvider } from './SanitizerContext';

export default function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <SanitizerProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-user" element={<CreateUserPage />} />
            </Routes>
          </Router>
        </SanitizerProvider>
      </NotesProvider>
    </AuthProvider>
  );
}