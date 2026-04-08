import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import {
  LuMapPin, LuCircle, LuStar, LuSearch, LuBookmark, LuBookmarkMinus, LuClock, LuTag, LuCompass
} from 'react-icons/lu';

/* ── Mock Data ── */
const ALL_LISTINGS = [
  // Verified
  {
    id: 1, name: 'Cafe Amore', type: 'Food & Beverage', tier: 'verified',
    tags: ['Eco-friendly', 'Family-owned'], city: 'Baguio City',
    desc: 'Cozy cafe with locally-sourced highland beans and homemade pastries. Family-run since 2012.',
    img: 'https://picsum.photos/seed/15541188/800/600',
    hours: 'Mon–Sat: 8AM–8PM', category: 'Food',
  },
  {
    id: 2, name: 'Vigan Heritage Walk', type: 'Attraction', tier: 'verified',
    tags: ['Culture', 'UNESCO'], city: 'Vigan, Ilocos Sur',
    desc: 'Guided walking tour around the preserved Spanish colonial cobblestone streets.',
    img: 'https://picsum.photos/seed/15967078/800/600',
    hours: 'Daily: 7AM–6PM', category: 'Heritage',
  },
  {
    id: 5, name: 'Batanes Homestead Inn', type: 'Accommodation', tier: 'verified',
    tags: ['Family-owned', 'Scenic View'], city: 'Basco, Batanes',
    desc: 'Charming stone house inn with breathtaking views of the rolling hills and ocean.',
    img: 'https://picsum.photos/seed/15660737/800/600',
    hours: 'Open 24/7', category: 'Nature',
  },
  // Community
  {
    id: 3, name: 'Baguio Craft Market', type: 'Shopping', tier: 'community',
    tags: ['Artisan', 'Handmade'], city: 'Baguio City',
    desc: 'Handcrafted local goods from Cordillera artisans — woodwork, weavings, and more.',
    img: 'https://picsum.photos/seed/15197101/800/600',
    hours: 'Unknown', category: 'Shopping',
  },
  {
    id: 6, name: "Lola Ines' Kare-Kare House", type: 'Restaurant', tier: 'community',
    tags: ['Local', 'Authentic'], city: 'Pampanga',
    desc: 'Home-cooked kare-kare passed down through three generations. Community favorite.',
    img: 'https://picsum.photos/seed/14730932/800/600',
    hours: 'Unknown', category: 'Food',
  },
  // Fallback
  {
    id: 4, name: "Joe's Diner", type: 'Restaurant', tier: 'fallback',
    tags: [], city: 'Manila',
    desc: 'Local eatery.', img: null, hours: null, category: 'Food',
  },
  {
    id: 7, name: 'Sundown Guesthouse', type: 'Accommodation', tier: 'fallback',
    tags: [], city: 'Palawan',
    desc: 'Budget guesthouse near the port.', img: null, hours: null, category: 'Nature',
  },
];

const CATEGORIES = ['All', 'Food', 'Heritage', 'Nature', 'Shopping'];
const TIERS = ['All', 'Verified', 'Community', 'Other'];

/* ── Color tokens ── */
const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  accent: '#F39C12',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  stoneLight: '#8D9DB0',
  border: '#DDE3ED',
  bgSurface: '#FFFFFF',
  ffDisplay: "'Manrope', sans-serif",
};

/* ── Verified Card ── */
function VerifiedCard({ l, saved, onSave }) {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', background: C.bgSurface, border: `1px solid ${C.border}`, transition: 'box-shadow 0.2s' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: '#fff', borderRadius: 999, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.75rem', color: C.secondary, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <LuCircle /> Verified
        </div>
        <button onClick={() => onSave(l.id)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: saved ? C.secondary : 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: saved ? '#fff' : C.stoneLight, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s ease', fontFamily: 'inherit' }}>
          {saved ? <LuBookmark /> : <LuBookmarkMinus />}
        </button>
        <img src={l.img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h4 style={{ fontWeight: 800, color: C.ink, fontSize: '1.2rem', margin: 0 }}>{l.name}</h4>
        </div>
        <p style={{ color: C.stone, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
          <LuMapPin color={C.secondary} /> {l.city} <span style={{ color: C.stoneLight }}>• {l.type}</span>
        </p>
        
        <p style={{ color: C.stone, fontSize: '0.9rem', lineHeight: 1.6, flex: 1, margin: '0 0 16px' }}>{l.desc}</p>
        
        <Link to={`/listing/${l.id}`} style={{ width: '100%', textAlign: 'center', padding: '0.75rem', borderRadius: 12, fontSize: '0.95rem', fontWeight: 700, background: C.secondary, color: '#fff', textDecoration: 'none', display: 'block', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 0.9} onMouseOut={e => e.currentTarget.style.opacity = 1}>
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ── Community Card ── */
function CommunityCard({ l, saved, onSave }) {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', background: C.bgSurface, border: `1px solid ${C.border}`, transition: 'box-shadow 0.2s' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: '#F8FAFC' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: 'rgba(255,255,255,0.95)', border: '1px solid #FDE68A', borderRadius: 999, padding: '4px 10px', fontWeight: 700, fontSize: '0.75rem', color: C.accent, display: 'flex', alignItems: 'center', gap: 4 }}>
          <LuStar /> Community Choice
        </div>
        <button onClick={() => onSave(l.id)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: saved ? C.accent : 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: saved ? '#fff' : C.stoneLight, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}>
          {saved ? <LuBookmark /> : <LuBookmarkMinus />}
        </button>
        {l.img ? <img src={l.img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.2 }}>🏙️</div>}
      </div>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontWeight: 800, margin: '0 0 4px', color: C.ink, fontSize: '1.1rem' }}>{l.name}</h4>
        <p style={{ color: C.stone, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <LuMapPin /> {l.city} <span style={{ color: C.stoneLight }}>• {l.type}</span>
        </p>
        <Link to={`/listing/${l.id}`} style={{ width: '100%', textAlign: 'center', padding: '0.75rem', borderRadius: 12, fontSize: '0.9rem', fontWeight: 700, border: `1px solid ${C.ink}`, color: C.ink, background: 'transparent', textDecoration: 'none', display: 'block', marginTop: 'auto' }} onMouseOver={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = '#fff'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.ink; }}>
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ── Fallback Card ── */
function FallbackCard({ l }) {
  return (
    <div style={{ borderRadius: 16, background: '#F8FAFC', padding: '1.25rem', border: `1px solid ${C.border}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontWeight: 700, margin: '0 0 4px', color: C.ink, fontSize: '1rem' }}>{l.name}</h4>
      <p style={{ color: C.stoneLight, margin: '0 0 16px', fontSize: '0.85rem' }}>{l.city} • {l.type}</p>
      
      <div style={{ display: 'grid', gap: '0.5rem', marginTop: 'auto' }}>
        <Link to="/claim" style={{ display: 'block', textAlign: 'center', padding: '0.5rem', borderRadius: 8, fontWeight: 700, background: '#fff', color: C.ink, border: `1px solid ${C.border}`, fontSize: '0.85rem', textDecoration: 'none' }}>Claim</Link>
        <Link to="/nominate" style={{ display: 'block', textAlign: 'center', padding: '0.5rem', borderRadius: 8, fontWeight: 700, background: '#fff', color: C.accent, border: `1px solid #FDE68A`, fontSize: '0.85rem', textDecoration: 'none' }}>Nominate</Link>
      </div>
    </div>
  );
}

/* ── Main Directory ── */
const Directory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [savedIds, setSavedIds] = useState([]);
  const [authModal, setAuthModal] = useState(null);

  const handleSave = (id) => {
    if (!savedIds.includes(id)) {
      setSavedIds(prev => [...prev, id]);
    } else {
      setSavedIds(prev => prev.filter(x => x !== id));
    }
  };

  const filtered = ALL_LISTINGS.filter(l => {
    const q = search.toLowerCase();
    const mQ = !q || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q);
    const mC = catFilter === 'All' || l.category === catFilter;
    const mT = tierFilter === 'All'
      || (tierFilter === 'Verified' && l.tier === 'verified')
      || (tierFilter === 'Community' && l.tier === 'community')
      || (tierFilter === 'Other' && l.tier === 'fallback');
    return mQ && mC && mT;
  });

  const verified  = filtered.filter(l => l.tier === 'verified');
  const community = filtered.filter(l => l.tier === 'community');
  const fallback  = filtered.filter(l => l.tier === 'fallback');

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      
      {/* Top Banner / Search Section */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3.5rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
             Find the unnoted.
          </h1>
          
          <div style={{ display: 'flex', width: '100%', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 300, display: 'flex', alignItems: 'center', background: '#F4F6F9', borderRadius: 999, padding: '0.75rem 1.5rem', border: `1px solid ${C.border}` }}>
              <LuSearch size={20} color={C.stone} />
              <input type="text" placeholder="Search by destination (Baguio, Vigan)..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', width: '100%', marginLeft: '1rem', color: C.ink, fontFamily: 'inherit' }} />
            </div>
            
            {/* Category Flters */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '4px 0' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} style={{ whiteSpace: 'nowrap', borderRadius: 999, padding: '0.75rem 1.5rem', background: catFilter === c ? C.ink : '#fff', color: catFilter === c ? '#fff' : C.stone, border: `1px solid ${catFilter === c ? C.ink : C.border}`, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 2rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
           {TIERS.map(t => (
            <button key={t} onClick={() => setTierFilter(t)} style={{ borderRadius: 12, padding: '0.5rem 1rem', background: tierFilter === t ? '#F4F6F9' : 'transparent', color: tierFilter === t ? C.ink : C.stone, border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              {t === 'All' ? 'All Tiers' : t === 'Verified' ? '✓ Premium Verified' : t === 'Community' ? '★ Community Favorites' : 'Google Info'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '6rem 0', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 800, color: C.ink, fontSize: '2rem' }}>No adventures found</h2>
            <p style={{ color: C.stone, fontSize: '1.1rem' }}>Adjust your filters or try a different search term.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {/* Verified Tier */}
            {(tierFilter === 'All' || tierFilter === 'Verified') && verified.length > 0 && (
              <div>
                <h2 style={{ fontFamily: C.ffDisplay, fontWeight: 800, fontSize: '1.75rem', color: C.ink, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 10 }}><LuCircle color={C.secondary} /> Verified Selection</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                  {verified.map(l => <VerifiedCard key={l.id} l={l} saved={savedIds.includes(l.id)} onSave={handleSave} />)}
                </div>
              </div>
            )}
            
            {/* Community Tier */}
            {(tierFilter === 'All' || tierFilter === 'Community') && community.length > 0 && (
              <div>
                <h2 style={{ fontFamily: C.ffDisplay, fontWeight: 800, fontSize: '1.75rem', color: C.ink, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 10 }}><LuStar color={C.accent} /> Community Hidden Gems</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {community.map(l => <CommunityCard key={l.id} l={l} saved={savedIds.includes(l.id)} onSave={handleSave} />)}
                </div>
              </div>
            )}

            {/* Fallback Tier */}
            {(tierFilter === 'All' || tierFilter === 'Other') && fallback.length > 0 && (
              <div>
                <h2 style={{ fontFamily: C.ffDisplay, fontWeight: 800, fontSize: '1.75rem', color: C.stone, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 10 }}><LuMapPin /> Unverified Map Data</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  {fallback.map(l => <FallbackCard key={l.id} l={l} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {authModal && <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />}
    </div>
  );
};

export default Directory;
