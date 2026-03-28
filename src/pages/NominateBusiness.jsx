import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LuMapPin, LuTag, LuMessageSquare, LuPhone, LuCircle, LuArrowRight, LuArrowLeft, LuStar, LuInfo
} from 'react-icons/lu';

const CATEGORIES = [
  { val: 'food', label: 'Food & Beverage', icon: '' },
  { val: 'attraction', label: 'Attraction & Heritage', icon: '️' },
  { val: 'shopping', label: 'Shopping & Artisan', icon: '️' },
  { val: 'nature', label: 'Nature & Outdoors', icon: '' },
  { val: 'accommodation', label: 'Accommodation', icon: '' },
  { val: 'other', label: 'Other', icon: '' },
];

const NominateBusiness = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    category: '',
    reason: '',
    contact: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isStep1Valid = form.name && form.location && form.category;

  /* ── Success State ── */
  if (submitted) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 72px)',
        background: 'linear-gradient(135deg, #F3F8EF 0%, #E8F5E0 50%, #F9FAFB 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem'
      }}>
        <div style={{
          background: '#fff', padding: '3rem', borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)', maxWidth: 480, width: '100%', textAlign: 'center',
          animation: 'slideUp 0.4s ease-out'
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', fontSize: '2rem'
          }}>
            
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.75rem' }}>
            Nomination Submitted!
          </h2>
          <p style={{ color: 'var(--stone)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.95rem' }}>
            Thank you for nominating <strong style={{ color: 'var(--ink)' }}>{form.name}</strong>!
            Our team will review it and reach out to the owner to invite them to verify.
          </p>
          <div style={{ background: 'rgba(45,80,22,0.07)', border: '1px solid #C6E0B0', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left' }}>
            <LuInfo style={{ color: 'var(--secondary)', marginTop: 2, flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--stone-light)', lineHeight: 1.6 }}>
              If this business receives multiple nominations, we'll prioritize verification. You'll be notified once it goes live on WanderLocal!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => navigate('/directory')}
              style={{
                padding: '0.85rem 2rem', borderRadius: 12, fontWeight: 700,
                background: 'linear-gradient(135deg, #2D5016, #3D6B1F)',
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(45,80,22,0.3)'
              }}>
              Browse Directory
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', location: '', category: '', reason: '', contact: '' }); setStep(1); }}
              style={{ padding: '0.85rem 2rem', borderRadius: 12, fontWeight: 700, background: '#fff', border: '2px solid #E7E5E4', cursor: 'pointer', color: 'var(--stone-light)' }}>
              Submit Another
            </button>
          </div>
        </div>
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      background: 'linear-gradient(135deg, #F3F8EF 0%, #E8F5E0 50%, #F9FAFB 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem'
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', maxWidth: 560, width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C9964A, #E0AE5C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', fontSize: '1.6rem'
          }}></div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.4rem' }}>
            Nominate a Local Business
          </h2>
          <p style={{ color: 'var(--stone)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Know a hidden gem that deserves to be on WanderLocal? Tell us about it!
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '2rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: s <= step ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.4s ease'
            }} />
          ))}
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); if (isStep1Valid) setStep(2); }}>
          {/* ── Step 1 ── */}
          {step === 1 && (
            <div style={{ animation: 'slideUp 0.3s ease-out', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--stone-light)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                Step 1 of 2 · Basic Info
              </p>

              {/* Business Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#44403C', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Business Name *</label>
                <div style={{ position: 'relative' }}>
                  <LuStar style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)' }} />
                  <input
                    style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.9rem', borderRadius: 10, border: '2px solid #E7E5E4', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }} required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={e => { e.target.style.borderColor='#2D5016'; e.target.style.background='#FAFFF8'; }}
                    onBlur={e  => { e.target.style.borderColor='#E7E5E4'; e.target.style.background=''; }}
                    placeholder="e.g. Aling Nena's Eatery"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#44403C', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Approximate Location *</label>
                <div style={{ position: 'relative' }}>
                  <LuMapPin style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-light)' }} />
                  <input
                    style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.9rem', borderRadius: 10, border: '2px solid #E7E5E4', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }} required
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    onFocus={e => { e.target.style.borderColor='#2D5016'; e.target.style.background='#FAFFF8'; }}
                    onBlur={e  => { e.target.style.borderColor='#E7E5E4'; e.target.style.background=''; }}
                    placeholder="e.g. Near Baguio Public Market"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#44403C', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Business Category *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {CATEGORIES.map(cat => (
                    <label key={cat.val}
                      style={{
                        border: `2px solid ${form.category === cat.val ? 'var(--accent)' : 'var(--border)'}`,
                        padding: '0.75rem 1rem',
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: form.category === cat.val ? 'rgba(201,150,74,0.08)' : '#fff',
                        display: 'flex', alignItems: 'center', gap: 8,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => setForm({ ...form, category: cat.val })}>
                      <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: form.category === cat.val ? 'var(--accent)' : 'var(--stone-light)' }}>
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit"
                disabled={!isStep1Valid}
                style={{
                  width: '100%', padding: '1rem', borderRadius: 12,
                  background: isStep1Valid ? 'linear-gradient(135deg, #C9964A, #E0AE5C)' : 'var(--border)',
                  color: isStep1Valid ? '#fff' : 'var(--stone-light)',
                  border: 'none', fontWeight: 700, fontSize: '1rem', cursor: isStep1Valid ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: isStep1Valid ? '0 4px 16px rgba(201,150,74,0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}>
                Continue <LuArrowRight />
              </button>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div style={{ animation: 'slideUp 0.3s ease-out', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--stone-light)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                Step 2 of 2 · Optional Details
              </p>

              {/* Summary Chip */}
              <div style={{ background: 'rgba(201,150,74,0.08)', border: '1px solid #F5E9D3', borderRadius: 12, padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.5rem' }}>{CATEGORIES.find(c => c.val === form.category)?.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.9rem' }}>{form.name}</div>
                  <div style={{ color: 'var(--stone)', fontSize: '0.8rem' }}>{form.location}</div>
                </div>
              </div>

              {/* Recommend Reason */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#44403C', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Why do you recommend it? <span style={{ color: 'var(--stone-light)', textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>(Optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <LuMessageSquare style={{ position: 'absolute', left: 14, top: 16, color: 'var(--stone-light)' }} />
                  <textarea
                    style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.9rem', borderRadius: 10, border: '2px solid #E7E5E4', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit', paddingLeft: '2.8rem', minHeight: 100, resize: 'vertical' }}
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    onFocus={e => { e.target.style.borderColor='#2D5016'; e.target.style.background='#FAFFF8'; }}
                    onBlur={e  => { e.target.style.borderColor='#E7E5E4'; e.target.style.background=''; }}
                    placeholder="They have the best halo-halo I've ever tasted, run by a wonderful family..."
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#44403C', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Contact info you know? <span style={{ color: 'var(--stone-light)', textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>(Optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <LuPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-light)' }} />
                  <input
                    style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.9rem', borderRadius: 10, border: '2px solid #E7E5E4', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                    value={form.contact}
                    onChange={e => setForm({ ...form, contact: e.target.value })}
                    onFocus={e => { e.target.style.borderColor='#2D5016'; e.target.style.background='#FAFFF8'; }}
                    onBlur={e  => { e.target.style.borderColor='#E7E5E4'; e.target.style.background=''; }}
                    placeholder="Phone number, Facebook page, etc."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '1rem', borderRadius: 12, border: '2px solid #E7E5E4', background: '#fff', fontWeight: 700, cursor: 'pointer', color: 'var(--stone-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <LuArrowLeft /> Back
                </button>
                <button type="submit"
                  style={{
                    flex: 2, padding: '1rem', borderRadius: 12,
                    background: 'linear-gradient(135deg, #2D5016, #3D6B1F)',
                    color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 16px rgba(45,80,22,0.3)'
                  }}>
                  <LuCircle /> Submit Nomination
                </button>
              </div>
            </div>
          )}
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--stone-light)' }}>
          <Link to="/directory" style={{ color: 'var(--secondary)', fontWeight: 700 }}>← Back to Directory</Link>
        </p>
      </div>
    </div>
  );
};

export default NominateBusiness;
