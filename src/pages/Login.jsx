import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    login(email);
    if (email.includes('admin')) {
      navigate('/admin');
    } else if (email.includes('business')) {
      navigate('/business-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ background: '#fff', padding: '3rem', borderRadius: '24px', boxShadow: '0 8px 32px rgba(15,30,45,0.10)', maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#3A75A0', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: '#5F6B7A', fontSize: '0.9rem' }}>Tip: Use "admin@wl.com" to test admin flow, or "business@wl.com" to test business flow.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #DDE3ED', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>Password</label>
            <input
              type="password"
              required
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #DDE3ED', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1.05rem', background: '#4A90C2', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Log In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#5F6B7A' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4A90C2', fontWeight: 600 }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
