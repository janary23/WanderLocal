import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuPlus, LuMapPin, LuLock, LuGlobe, LuShare2, LuMap } from 'react-icons/lu';
import { glassCardStyle, glassCardHover, btnPrimaryStyle, btnPrimaryHover, btnGhostStyle, btnGhostHover, applyHover, removeHover } from '../inlineStyles';

const STATUS_STYLE = {
  draft: { bg: 'var(--color-primary-pale)', color: 'var(--color-primary)', label: 'Draft' },
  active: { bg: 'var(--color-secondary-alt)', color: 'var(--color-secondary)', label: 'Active' },
  completed: { bg: 'var(--color-accent-pale)', color: 'var(--color-accent)', label: 'Completed' },
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
      <div className="animate-fade-in" style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
             <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--color-primary-pale)', color: 'var(--color-primary)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
               Your Journeys
             </div>
             <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Trips</h1>
          </div>
          <button 
            onClick={() => navigate('/itinerary')} 
            style={btnPrimaryStyle}
            onMouseOver={e => applyHover(e, btnPrimaryHover)} 
            onMouseOut={e => removeHover(e, btnPrimaryStyle)}
          >
            <LuPlus size={20} /> Plan a new trip
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {MOCK_ITINERARIES.map((trip, i) => (
            <div 
              key={i} 
              style={{ ...glassCardStyle, padding: 0, display: 'flex', flexDirection: 'column', cursor: 'pointer', overflow: 'hidden' }} 
              onMouseOver={e => applyHover(e, glassCardHover)} 
              onMouseOut={e => removeHover(e, glassCardStyle)}
              onClick={() => navigate('/itinerary')}
            >
              <div style={{ height: 220, position: 'relative' }}>
                <img src={trip.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.title} />
                <div style={{ position: 'absolute', top: 16, left: 16, background: STATUS_STYLE[trip.status].bg, color: STATUS_STYLE[trip.status].color, padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, boxShadow: 'var(--shadow-xs)' }}>
                   {STATUS_STYLE[trip.status].label}
                </div>
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--color-surface)', width: 36, height: 36, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-stone)', boxShadow: 'var(--shadow-xs)' }}>
                   {VIS_ICON[trip.visibility]}
                </div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--glass-bg)' }}>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-ink)', marginBottom: 8, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{trip.title}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-stone)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontWeight: 500 }}>
                  <LuMapPin color="var(--color-secondary)" size={16} /> {trip.dest}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-stone-light)', marginBottom: 24, fontWeight: 600 }}>
                   <LuMap size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                   {trip.days} Days • {trip.stops} Stops
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate('/itinerary'); }} 
                    style={{ ...btnGhostStyle, flex: 1, padding: '0.6rem', fontSize: '0.9rem', background: 'var(--color-surface)' }}
                    onMouseOver={e => applyHover(e, btnGhostHover)}
                    onMouseOut={e => { removeHover(e, btnGhostStyle); e.currentTarget.style.background = 'var(--color-surface)'; }}
                  >
                    View itinerary
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    style={{ ...btnGhostStyle, padding: '0.6rem 1rem', background: 'var(--color-surface)' }}
                    onMouseOver={e => applyHover(e, btnGhostHover)}
                    onMouseOut={e => { removeHover(e, btnGhostStyle); e.currentTarget.style.background = 'var(--color-surface)'; }}
                  >
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
