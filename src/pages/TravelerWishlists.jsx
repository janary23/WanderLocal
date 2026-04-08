import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  accent: '#F39C12',
  terracotta: '#E53935',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  bgSurface: '#FFFFFF',
  ffBody: "'Inter', sans-serif",
  ffDisplay: "'Manrope', sans-serif",
};

const MOCK_SHORTLIST = [
  { id: 1, name: 'Cafe Amore', city: 'Baguio City', type: 'Food & Beverage', img: 'https://picsum.photos/seed/15541188/800/600' },
  { id: 2, name: 'Vigan Heritage Walk', city: 'Vigan, Ilocos Sur', type: 'Attraction', img: 'https://picsum.photos/seed/15967078/800/600' },
  { id: 3, name: 'Cloud 9 Surf Tower', city: 'Siargao, Surigao', type: 'Attraction', img: 'https://picsum.photos/seed/151231/800/600' },
  { id: 4, name: 'Calle Crisologo', city: 'Vigan, Ilocos Sur', type: 'Historical', img: 'https://picsum.photos/seed/89080/800/600' },
];

const TravelerWishlists = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout activeTabId="shortlist">
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: C.ink, margin: '0 0 3rem', fontFamily: C.ffDisplay }}>Wishlists</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {MOCK_SHORTLIST.map((place, i) => (
            <div 
              key={i} 
              onClick={() => navigate('/listing/1')}
              style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'box-shadow 0.2s', display: 'flex', flexDirection: 'column' }} 
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'} 
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ height: 200 }}>
                <img src={place.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={place.name} />
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: C.ink, marginBottom: 4 }}>{place.name}</div>
                <div style={{ fontSize: '0.85rem', color: C.stone, marginBottom: 12 }}>{place.city} • {place.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TravelerWishlists;
