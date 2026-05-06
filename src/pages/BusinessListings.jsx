import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuPlus, LuMapPin, LuPen, LuEye } from 'react-icons/lu';

const C = {
  primary: '#4A90C2',
  secondary: '#5A8BA8',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  ffDisplay: "'Manrope', sans-serif",
};

const MOCK_LISTINGS = [
  { id: 1, name: 'Cafe Amore', type: 'Food', location: 'Baguio City', img: 'https://picsum.photos/seed/15541188/800/600', status: 'Active' },
  { id: 2, name: 'Vigan Lodge', type: 'Accommodation', location: 'Vigan, Ilocos Sur', img: 'https://picsum.photos/seed/15967078/800/600', status: 'Draft' },
];

const BusinessListings = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout activeTabId="listings">
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: C.ink, margin: 0, fontFamily: C.ffDisplay }}>My Listings</h1>
          <button 
            onClick={() => navigate('/onboarding')}
            style={{ 
              background: C.secondary, color: '#fff', border: 'none', padding: '0.8rem 1.5rem', 
              borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <LuPlus size={20} /> Create new listing
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {MOCK_LISTINGS.map(list => (
            <div key={list.id} style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 200, position: 'relative' }}>
                <img src={list.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={list.name} />
                <div style={{ position: 'absolute', top: 16, left: 16, background: '#fff', color: C.ink, padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 800 }}>{list.status}</div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: C.ink, marginBottom: 8 }}>{list.name}</div>
                <div style={{ fontSize: '0.9rem', color: C.stone, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}><LuMapPin color={C.secondary} /> {list.location}</div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  <button style={{ flex: 1, padding: '0.75rem', borderRadius: 12, background: '#F4F6F9', color: C.ink, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: 8 }}><LuPen size={16} /> Edit</button>
                  <button style={{ flex: 1, padding: '0.75rem', borderRadius: 12, background: '#F4F6F9', color: C.ink, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: 8 }}><LuEye size={16} /> Preview</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessListings;
