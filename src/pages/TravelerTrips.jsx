import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuPlus, LuMapPin, LuLock, LuGlobe, LuShare2 } from 'react-icons/lu';

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

const STATUS_STYLE = {
  draft: { bg: '#F1F8F1', color: '#5FAE4B', label: 'Draft' },
  active: { bg: '#E8F1F7', color: '#3A75A0', label: 'Active' },
  completed: { bg: '#FFEBEE', color: '#E53935', label: 'Completed' },
};

const VIS_ICON = { private: <LuLock />, public: <LuGlobe />, link: <LuShare2 /> };

const MOCK_ITINERARIES = [
  { id: 1, title: 'Baguio Weekend Escape', dest: 'Baguio City', days: 3, stops: 12, status: 'draft', visibility: 'private', img: 'https://picsum.photos/seed/15967078/800/600', updatedAt: '2 hours ago' },
  { id: 2, title: 'Vigan Heritage Tour', dest: 'Vigan, Ilocos Sur', days: 2, stops: 8, status: 'completed', visibility: 'public', img: 'https://picsum.photos/seed/15632007/800/600', updatedAt: '3 days ago', clonedBy: 5 },
  { id: 3, title: 'Siargao Island Hopping', dest: 'Siargao, Surigao', days: 5, stops: 15, status: 'active', visibility: 'public', img: 'https://picsum.photos/seed/151231/800/600', updatedAt: '1 week ago' },
];

const TravelerTrips = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout activeTabId="itineraries">
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: C.ink, margin: 0, fontFamily: C.ffDisplay }}>Trips</h1>
          <button 
            onClick={() => navigate('/itinerary')} 
            style={{ 
              background: C.secondary, color: '#fff', border: 'none', padding: '0.8rem 1.5rem', 
              borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', 
              fontFamily: C.ffBody, display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 12px rgba(95,174,75,0.2)'
            }}
          >
            <LuPlus size={20} /> Create new trip
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {MOCK_ITINERARIES.map((trip, i) => (
            <div 
              key={i} 
              style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, background: '#fff', transition: 'box-shadow 0.2s', display: 'flex', flexDirection: 'column' }} 
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'} 
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ height: 220, position: 'relative' }}>
                <img src={trip.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.title} />
                <div style={{ position: 'absolute', top: 16, left: 16, background: STATUS_STYLE[trip.status].bg, color: STATUS_STYLE[trip.status].color, padding: '6px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>{STATUS_STYLE[trip.status].label}</div>
                <div style={{ position: 'absolute', top: 16, right: 16, background: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.stone, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{VIS_ICON[trip.visibility]}</div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: C.ink, marginBottom: 8 }}>{trip.title}</div>
                <div style={{ fontSize: '0.95rem', color: C.stone, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <LuMapPin color={C.secondary} /> {trip.dest}
                </div>
                <div style={{ fontSize: '0.9rem', color: C.stone, marginBottom: 24 }}>{trip.days} Days • {trip.stops} Stops</div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  <button 
                    onClick={() => navigate('/itinerary')} 
                    style={{ flex: 1, padding: '0.75rem', borderRadius: 12, background: '#F4F6F9', color: C.ink, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    View itinerary
                  </button>
                  <button style={{ padding: '0.75rem 1rem', borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, color: C.ink, fontWeight: 700, cursor: 'pointer' }}>
                    <LuShare2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TravelerTrips;
