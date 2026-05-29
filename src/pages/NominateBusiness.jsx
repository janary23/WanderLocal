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

  const HOW_IT_WORKS = [
    { num: '01', icon: <LuStar size={20} />, title: 'You Nominate', desc: 'Fill in the business name, location, and why it deserves a spot on WandereLocal.' },
    { num: '02', icon: <LuCheck size={20} />, title: 'We Verify', desc: 'Our team reviews your nomination and reaches out to the business owner within 5–7 days.' },
    { num: '03', icon: <LuMapPin size={20} />, title: 'It Gets Listed', desc: 'Once verified, the business appears in our directory and can be added to traveler itineraries.' },
  ];

  if (result?.type === 'success') {
    return (
      <div style={{ maxWidth: 600, margin: '6rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #bbf7d0', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 2rem' }}>
          <LuCheck size={36} />
        </div>
        <h2 style={{ fontFamily: C.ffDisplay, fontSize: '2.5rem', fontWeight: 800, color: C.ink, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>Nomination Sent!</h2>
        <p style={{ fontSize: '1.1rem', color: C.stone, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Thank you for helping us discover local gems! Here's what happens next:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginBottom: '2.5rem' }}>
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#F8FAFC', borderRadius: 16, padding: '1.25rem 1.5rem', border: `1px solid ${C.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 800 }}>{s.num}</div>
              <div>
                <div style={{ fontWeight: 800, color: C.ink, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '0.9rem', color: C.stone, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setResult(null)}
          style={{ background: C.ink, color: '#fff', border: 'none', padding: '1rem 2.5rem', borderRadius: 16, fontSize: '1rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Nominate Another Business
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: '3rem auto', padding: '0 2rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFF7ED', color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
          <LuStar />
        </div>
        <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>Know a hidden gem?</h1>
        <p style={{ fontSize: '1.1rem', color: C.stone, lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
          WandereLocal is built by travelers, for travelers. Nominate a local business and help others discover authentic Philippine experiences.
        </p>
      </div>

      {/* How it works strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
        {HOW_IT_WORKS.map((s, i) => (
          <div key={i} style={{ background: '#F8FAFC', borderRadius: 20, border: `1px solid ${C.border}`, padding: '1.75rem 1.5rem', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 800, color: C.ink, fontSize: '1rem', marginBottom: '0.4rem' }}>{s.title}</div>
            <div style={{ fontSize: '0.875rem', color: C.stone, lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: '3rem', boxShadow: '0 12px 48px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontFamily: C.ffDisplay, fontSize: '1.5rem', fontWeight: 800, color: C.ink, margin: '0 0 2rem', letterSpacing: '-0.01em' }}>Tell us about the business</h2>

        {result?.type === 'error' && (
          <div style={{ padding: '1rem 1.5rem', borderRadius: 12, marginBottom: '2rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontWeight: 600 }}>
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
                <input type="text" placeholder="e.g. Cebu City" value={form.city} onChange={e => handleChange('city', e.target.value)}
                  style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Category</label>
              <select value={form.category} onChange={e => handleChange('category', e.target.value)}
                style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: C.ink, appearance: 'none', boxSizing: 'border-box' }}>
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
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Why are you nominating them? <span style={{ color: C.stone, fontWeight: 500 }}>(optional but helpful)</span></label>
            <textarea rows={5} placeholder="Tell us what makes this place special — a dish they're known for, a memorable experience, something unique about them..."
              value={form.reason} onChange={e => handleChange('reason', e.target.value)}
              style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ background: loading ? C.stone : C.ink, color: '#fff', border: 'none', padding: '1.25rem', borderRadius: 16, fontSize: '1.1rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: '0.5rem', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><LuLoader style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : 'Submit Nomination →'}
          </button>
          <p style={{ color: C.stone, fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
            Your nomination is reviewed by our team within 5–7 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NominateBusiness;
