import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuSearch, LuCircle, LuStore
} from 'react-icons/lu';

/* ── Shared button styles ── */
const btnPrimary = {
  background: '#4A90C2',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '1rem',
};

const btnOutline = {
  background: 'transparent',
  color: '#4A90C2',
  border: '1.5px solid #BAD6EA',
  borderRadius: '10px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '1rem',
};

const BusinessClaim = () => {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if(search) setStep(2);
  };

  const submitRegistry = (e) => {
    e.preventDefault();
    alert('Submission received! Waiting for admin verification (48-72 hrs).');
    navigate('/business-dashboard');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: '#F4F6F9', padding: '4rem 1rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '24px', boxShadow: '0 8px 32px rgba(15,30,45,0.10)' }}>
        
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#E8F1F7', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <LuStore size="2rem" color="#4A90C2" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#3A75A0', marginBottom: '0.5rem' }}>List Your Business</h2>
            <p style={{ color: '#5F6B7A', marginBottom: '2.5rem' }}>First, let's check if your business is already listed in our directory as an unclaimed place.</p>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <LuSearch style={{ position: 'absolute', top: '1rem', left: '1rem', color: '#8D9DB0' }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  required
                  placeholder="Search your business name..."
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '8px', border: '1px solid #DDE3ED', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <button type="submit" style={{ ...btnPrimary, padding: '0.8rem 1.5rem' }}>Search</button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
              <hr style={{ flex: 1, borderTop: '1px solid #DDE3ED', border: 'none', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#DDE3ED' }} />
              <span style={{ color: '#8D9DB0', fontSize: '0.9rem', fontWeight: 600 }}>OR</span>
              <hr style={{ flex: 1, borderTop: '1px solid #DDE3ED', border: 'none', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#DDE3ED' }} />
            </div>

            <button
              onClick={() => setStep(2)}
              style={{ ...btnOutline, width: '100%', padding: '1rem', fontSize: '1rem' }}
            >
              I want to register a new business
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3A75A0', marginBottom: '0.5rem' }}>Verification Submission</h2>
            <p style={{ color: '#5F6B7A', marginBottom: '2rem' }}>Please provide proof of business to claim and verify your listing.</p>

            <form onSubmit={submitRegistry} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>Business Name</label>
                  <input type="text" defaultValue={search} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #DDE3ED', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>Category</label>
                  <select required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #DDE3ED', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit' }}>
                    <option>Food & Beverage</option>
                    <option>Attraction & Heritage</option>
                    <option>Shopping & Artisan</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>Full Address</label>
                <input type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #DDE3ED', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem' }}>Upload Proof of Legitimacy (DTI / Mayor's Permit)</label>
                <div style={{ border: '2px dashed #DDE3ED', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#F4F6F9', cursor: 'pointer' }}>
                  <p style={{ color: '#4A90C2', fontWeight: 600, marginBottom: '0.5rem' }}>Click to upload document</p>
                  <p style={{ fontSize: '0.8rem', color: '#5F6B7A', margin: 0 }}>PDF, JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div style={{ background: '#FEF5E7', padding: '1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <LuCircle color="#F39C12" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: '#0F1E2D', margin: 0 }}>
                  <strong>Why verify?</strong> Verified listings rank higher, can be added to user itineraries, get richer profiles, and appear in community exports. We manually review all submissions to ensure community quality.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setStep(1)} style={{ ...btnOutline, flex: 1, padding: '1rem' }}>Back</button>
                <button type="submit" style={{ ...btnPrimary, flex: 2, padding: '1rem', fontSize: '1.05rem' }}>Submit for Approval</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessClaim;
