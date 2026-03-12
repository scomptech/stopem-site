import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic for authentication
    if (email === 'admin@stopem.org' && password === 'admin') {
      alert('Login successful! Redirecting to dashboard...');
      // Navigation to dashboard would happen here
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} /> Back to Site
          </Link>
          <div className="logo login-logo">
            <ShieldAlert className="logo-icon text-dark" />
            <span className="text-dark">StopEm<span className="logo-accent">.org</span></span>
          </div>
          <h2>Site Manager Login</h2>
          <p>Sign in to manage petitions and content.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@stopem.org"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            <Lock size={18} /> Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}
