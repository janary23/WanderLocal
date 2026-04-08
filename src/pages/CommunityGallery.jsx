import React, { useState } from 'react';
import { LuCamera, LuHeart, LuMapPin, LuUpload, LuSearch } from 'react-icons/lu';

/* ── Color Tokens ── */
const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  ffDisplay: "'Manrope', sans-serif",
};

const MOCK_PHOTOS = [
  { id: 1, url: 'https://picsum.photos/seed/15197101/800/1000', author: 'Alex T.', likes: 124, loc: 'Baguio Craft Market' },
  { id: 2, url: 'https://picsum.photos/seed/14979355/800/600', author: 'Maria S.', likes: 89, loc: 'Vigan Heritage' },
  { id: 3, url: 'https://picsum.photos/seed/14451165/800/1200', author: 'John D.', likes: 256, loc: 'Palawan Islands' },
  { id: 4, url: 'https://picsum.photos/seed/15541188/800/800', author: 'Sarah W.', likes: 45, loc: 'Cafe Amore' },
  { id: 5, url: 'https://picsum.photos/seed/999/800/1000', author: 'Mike K.', likes: 102, loc: 'Batanes' },
  { id: 6, url: 'https://picsum.photos/seed/777/800/600', author: 'Anna L.', likes: 67, loc: 'Banaue' },
];

const CommunityGallery = () => {
  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '3rem 2rem', width: '100%' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3.5rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <LuCamera color={C.secondary} size={48} /> Traveler Gallery
          </h1>
          <p style={{ color: C.stone, fontSize: '1.25rem', margin: 0 }}>Get inspired by the community's discoveries across the Philippines.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F4F6F9', borderRadius: 999, padding: '0.75rem 1.5rem', border: `1px solid ${C.border}` }}>
            <LuSearch size={18} color={C.stone} />
            <input type="text" placeholder="Search locations..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', width: 220, marginLeft: '0.75rem', color: C.ink, fontFamily: 'inherit' }} />
          </div>
          <button style={{ background: C.ink, color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 999, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#333'} onMouseOut={e => e.currentTarget.style.background = C.ink}>
            <LuUpload /> Upload Photo
          </button>
        </div>
      </div>

      {/* ── Masonry Grid (CSS columns) ── */}
      <div style={{ columnCount: 3, columnGap: '1.5rem' }}>
        {MOCK_PHOTOS.map(p => (
          <div key={p.id} style={{ breakInside: 'avoid', marginBottom: '1.5rem', position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }} 
            onMouseOver={e => e.currentTarget.querySelector('.overlay').style.opacity = 1}
            onMouseOut={e => e.currentTarget.querySelector('.overlay').style.opacity = 0}>
            
            <img src={p.url} style={{ width: '100%', display: 'block' }} alt={p.loc} />
            
            <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,30,45,0.8), transparent 50%)', opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
              <div style={{ color: '#fff' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>{p.loc}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>by {p.author}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                    <LuHeart fill="#fff" /> {p.likes}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
};

export default CommunityGallery;
