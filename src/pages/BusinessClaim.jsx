import React, { useState } from 'react';
import { LuCheck, LuShield, LuFileText, LuUserCheck, LuLoader } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { submitClaim } from '../services/api';

const C = {
  primary: '#4A90C2',
  secondary: '#5A8BA8',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  ffDisplay: "'Manrope', sans-serif",
};

const BusinessClaim = () => {
  const { userId, userEmail, userName } = useAuth();
  const [form, setForm] = useState({
    full_name: userName || '',
    email: userEmail || '',
    role_at_biz: 'Owner / Founder',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.email.trim()) {
      setResult({ type: 'error', msg: 'Full name and email are required.' });
      return;
    }
    setLoading(true);
    try {
      const data = await submitClaim({ ...form, user_id: userId, listing_id: 4 }); // listing_id=4 = Joe's Diner (demo)
      if (data.status === 'success') {
        setResult({ type: 'success', msg: "Your claim request has been submitted! We'll review it within 2 business days." });
      } else {
        setResult({ type: 'error', msg: data.message || 'Submission failed.' });
      }
    } catch {
      setResult({ type: 'error', msg: 'Network error. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EAF4E8', color: C.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
          <LuShield />
        </div>
        <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>Claim your business</h1>
        <p style={{ fontSize: '1.1rem', color: C.stone, lineHeight: 1.6 }}>Take control of your directory listing. Manage your photos, update opening hours, and respond to traveler reviews.</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: '3rem', boxShadow: '0 12px 48px rgba(0,0,0,0.06)' }}>
        
        {result && (
          <div style={{
            padding: '1rem 1.5rem', borderRadius: 12, marginBottom: '2rem',
            background: result.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${result.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: result.type === 'success' ? '#166534' : '#991b1b',
            fontWeight: 600,
          }}>
            {result.msg}
          </div>
        )}

        <div style={{ display: 'grid', gap: '2rem' }}>
          
          <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LuUserCheck size={24} color={C.stone} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: C.ink }}>Joe's Diner</div>
              <div style={{ color: C.stone, fontSize: '0.9rem' }}>Manila • Food & Beverage</div>
            </div>
            <div style={{ marginLeft: 'auto', background: C.ink, color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>Unclaimed</div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Your Full Name *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => handleChange('full_name', e.target.value)}
              style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Business Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Role at Business</label>
            <select
              value={form.role_at_biz}
              onChange={e => handleChange('role_at_biz', e.target.value)}
              style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: C.ink, appearance: 'none', boxSizing: 'border-box' }}
            >
              <option>Owner / Founder</option>
              <option>Manager</option>
              <option>Authorized Representative</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: '#eaf4e8', borderRadius: 16, border: '1px solid #c3e2bc' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', color: C.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <LuFileText />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: C.ink }}>Verification Document</div>
              <div style={{ fontSize: '0.85rem', color: C.stone }}>Please attach a business permit or utility bill.</div>
            </div>
            <button style={{ marginLeft: 'auto', background: '#fff', border: `1px solid ${C.secondary}`, color: C.secondary, padding: '0.75rem 1.5rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Upload</button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? C.stone : C.secondary, color: '#fff', border: 'none',
              padding: '1.25rem', borderRadius: 16, fontSize: '1.1rem', fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              marginTop: '1rem', transition: 'background 0.2s',
              boxShadow: '0 4px 12px rgba(95, 174, 75, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            {loading ? <><LuLoader /> Submitting...</> : 'Submit Claim Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessClaim;
