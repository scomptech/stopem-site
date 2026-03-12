import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary hardcoded authentication
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin/dashboard');
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
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
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
