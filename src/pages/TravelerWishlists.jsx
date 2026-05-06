import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuBookmark, LuMapPin } from 'react-icons/lu';
import { glassCardStyle, glassCardHover, applyHover, removeHover } from '../inlineStyles';

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
      <div className="animate-fade-in" style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
           <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--color-accent-pale)', color: 'var(--color-accent)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
             Saved Gems
           </div>
           <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Wishlists</h1>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {MOCK_SHORTLIST.map((place, i) => (
            <div 
              key={i} 
              onClick={() => navigate(`/listing/${place.id}`)}
              style={{ ...glassCardStyle, padding: 0, display: 'flex', flexDirection: 'column', cursor: 'pointer', overflow: 'hidden' }} 
              onMouseOver={e => applyHover(e, glassCardHover)} 
              onMouseOut={e => removeHover(e, glassCardStyle)}
            >
              <div style={{ height: 200, position: 'relative' }}>
                <img src={place.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={place.name} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(11,22,33,0.8) 100%)' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.4)', width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                   <LuBookmark size={16} fill="currentColor" />
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{place.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}><LuMapPin size={14} /> {place.city}</div>
                </div>
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-stone)', fontWeight: 600 }}>{place.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TravelerWishlists;
