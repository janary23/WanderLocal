import React, { useState } from 'react';
import { LuStar, LuMapPin, LuInfo, LuUpload, LuCheck, LuLoader } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { submitNomination } from '../services/api';

const C = {
  primary: '#4A90C2',
  secondary: '#5A8BA8',
  accent: '#F39C12',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  ffDisplay: "'Manrope', sans-serif",
};

const NominateBusiness = () => {
  const { userId } = useAuth();
  const [form, setForm] = useState({
    business_name: '', city: '', category: 'Food & Beverage', reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // 'success' | 'error' | null

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.business_name.trim()) {
      setResult({ type: 'error', msg: 'Business name is required.' });
      return;
    }
    setLoading(true);
    try {
      const data = await submitNomination({ ...form, user_id: userId });
      if (data.status === 'success') {
        setResult({ type: 'success', msg: 'Your nomination has been submitted! Thank you.' });
        setForm({ business_name: '', city: '', category: 'Food & Beverage', reason: '' });
      } else {
        setResult({ type: 'error', msg: data.message || 'Submission failed.' });
      }
    } catch (e) {
      setResult({ type: 'error', msg: 'Network error. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFF7ED', color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
          <LuStar />
        </div>
        <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>Know a hidden gem?</h1>
        <p style={{ fontSize: '1.1rem', color: C.stone, lineHeight: 1.6 }}>Help fellow travelers discover the best local experiences. Nominate a business and our team will verify it for the community.</p>
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
          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Business Name *</label>
            <input
              type="text"
              placeholder="e.g. Lola Ines' Carenderia"
              value={form.business_name}
              onChange={e => handleChange('business_name', e.target.value)}
              style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>City / Location</label>
              <div style={{ position: 'relative' }}>
                <LuMapPin style={{ position: 'absolute', top: 20, left: 20, color: C.stone }} size={18} />
                <input
                  type="text"
                  placeholder="e.g. Cebu City"
                  value={form.city}
                  onChange={e => handleChange('city', e.target.value)}
                  style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Category</label>
              <select
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
                style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: C.ink, appearance: 'none', boxSizing: 'border-box' }}
              >
                <option>Food & Beverage</option>
                <option>Accommodation</option>
                <option>Experiences</option>
                <option>Shopping</option>
                <option>Heritage</option>
                <option>Nature</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Why are you nominating them?</label>
            <textarea
              rows={5}
              placeholder="Tell us what makes this place special..."
              value={form.reason}
              onChange={e => handleChange('reason', e.target.value)}
              style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? C.stone : C.ink, color: '#fff', border: 'none',
              padding: '1.25rem', borderRadius: 16, fontSize: '1.1rem', fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              marginTop: '1rem', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            {loading ? <><LuLoader style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : 'Submit Nomination'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NominateBusiness;
