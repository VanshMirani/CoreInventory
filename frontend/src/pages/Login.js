import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(name.trim(), email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmail = async () => {
    setForgotLoading(true);
    setForgotError('');
    try {
    await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setForgotLoading(true);
    setForgotError('');
    try {
    await api.post('/auth/verify-otp', { email: forgotEmail, otp: forgotOtp });
      setForgotStep(3);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
    await api.post('/auth/reset-password', { email: forgotEmail, password: forgotNewPassword });
      setShowForgot(false);
      setForgotStep(1);
      alert('Password reset successful!');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Reset failed');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Electrostock</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Inventory system</p>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={isRegister ? 'new-password' : 'current-password'} />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
            {loading ? (isRegister ? 'Creating account…' : 'Signing in…') : (isRegister ? 'Register' : 'Sign in')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>
        {!isRegister && (
          <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <button 
              type="button" 
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }} 
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          </p>
        )}
      </div>

      {showForgot && (
        <div className="modal-overlay" onClick={() => setShowForgot(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button type="button" className="btn-secondary" onClick={() => setShowForgot(false)}>×</button>
            </div>
            {forgotStep === 1 && (
              <div className="modal-body">
                <p>Enter your email to receive OTP.</p>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)} 
                  />
                </div>
                {forgotError && <p style={{ color: 'var(--danger)' }}>{forgotError}</p>}
                <div className="modal-footer">
                  <button className="btn-secondary" onClick={() => setShowForgot(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleForgotEmail} disabled={!forgotEmail || forgotLoading}>
                    {forgotLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </div>
            )}
            {forgotStep === 2 && (
              <div className="modal-body">
                <p>Enter OTP sent to {forgotEmail}</p>
                <div className="form-group">
                  <label>OTP (6 digits)</label>
                  <input 
                    type="text" 
                    maxLength={6} 
                    value={forgotOtp} 
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\\D/g, ''))} 
                  />
                </div>
                {forgotError && <p style={{ color: 'var(--danger)' }}>{forgotError}</p>}
                <div className="modal-footer">
                  <button className="btn-secondary" onClick={() => setForgotStep(1)}>Back</button>
                  <button className="btn-primary" onClick={handleVerifyOtp} disabled={forgotLoading || forgotOtp.length < 6}>
                    {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            )}
            {forgotStep === 3 && (
              <div className="modal-body">
                <p>Set new password for {forgotEmail}</p>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={forgotNewPassword} 
                    onChange={(e) => setForgotNewPassword(e.target.value)} 
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input 
                    type="password" 
                    value={forgotConfirmPassword} 
                    onChange={(e) => setForgotConfirmPassword(e.target.value)} 
                    minLength={6}
                  />
                </div>
                {forgotError && <p style={{ color: 'var(--danger)' }}>{forgotError}</p>}
                <div className="modal-footer">
                  <button className="btn-secondary" onClick={() => setForgotStep(2)}>Back</button>
                  <button className="btn-primary" onClick={handleResetPassword} disabled={forgotLoading || forgotNewPassword !== forgotConfirmPassword || forgotNewPassword.length < 6}>
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

