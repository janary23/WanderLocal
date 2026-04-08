import React from 'react';
import { LuStar, LuMapPin, LuInfo, LuUpload, LuCheck } from 'react-icons/lu';

const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  accent: '#F39C12',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  ffDisplay: "'Manrope', sans-serif",
};

const NominateBusiness = () => {
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
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Business Name</label>
            <input type="text" placeholder="e.g. Lola Ines' Carenderia" style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>City / Location</label>
              <div style={{ position: 'relative' }}>
                <LuMapPin style={{ position: 'absolute', top: 20, left: 20, color: C.stone }} size={18} />
                <input type="text" placeholder="e.g. Cebu City" style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Category</label>
              <select style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: C.ink, appearance: 'none' }}>
                <option>Food & Beverage</option>
                <option>Accommodation</option>
                <option>Experiences</option>
                <option>Shopping</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Why are you nominating them?</label>
            <textarea rows={5} placeholder="Tell us what makes this place special..." style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: '#F4F6F9', borderRadius: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><LuUpload /></div>
            <div>
              <div style={{ fontWeight: 700, color: C.ink }}>Optional: Add a photo</div>
              <div style={{ fontSize: '0.85rem', color: C.stone }}>Helps us verify the location faster.</div>
            </div>
            <button style={{ marginLeft: 'auto', background: '#fff', border: `1px solid ${C.border}`, padding: '0.75rem 1.5rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Browse</button>
          </div>

          <button style={{ background: C.ink, color: '#fff', border: 'none', padding: '1.25rem', borderRadius: 16, fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginTop: '1rem', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#333'} onMouseOut={e => e.currentTarget.style.background = C.ink}>
            Submit Nomination
          </button>
        </div>

      </div>

    </div>
  );
};

export default NominateBusiness;
