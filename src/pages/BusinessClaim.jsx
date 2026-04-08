import React from 'react';
import { LuCheck, LuShield, LuFileText, LuUserCheck } from 'react-icons/lu';

const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  ffDisplay: "'Manrope', sans-serif",
};

const BusinessClaim = () => {
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
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: C.border }}></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: C.ink }}>Joe's Diner</div>
              <div style={{ color: C.stone, fontSize: '0.9rem' }}>Manila • Food & Beverage</div>
            </div>
            <div style={{ marginLeft: 'auto', background: C.ink, color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>Unclaimed</div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Your Full Name</label>
            <input type="text" style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Business Email Address</label>
            <input type="email" style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, color: C.ink, marginBottom: 8, fontSize: '0.95rem' }}>Role at Business</label>
            <select style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: `1px solid ${C.border}`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: '#F8FAFC', color: C.ink, appearance: 'none' }}>
              <option>Owner / Founder</option>
              <option>Manager</option>
              <option>Authorized Representative</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: '#eaf4e8', borderRadius: 16, border: '1px solid #c3e2bc' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', color: C.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><LuFileText /></div>
            <div>
              <div style={{ fontWeight: 700, color: C.ink }}>Verification Document</div>
              <div style={{ fontSize: '0.85rem', color: C.stone }}>Please attach a business permit or utility bill.</div>
            </div>
            <button style={{ marginLeft: 'auto', background: '#fff', border: `1px solid ${C.secondary}`, color: C.secondary, padding: '0.75rem 1.5rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Upload</button>
          </div>

          <button style={{ background: C.secondary, color: '#fff', border: 'none', padding: '1.25rem', borderRadius: 16, fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginTop: '1rem', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(95, 174, 75, 0.25)' }}>
            Submit Claim Request
          </button>
        </div>

      </div>

    </div>
  );
};

export default BusinessClaim;
