import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import {
  LuMapPin, LuCircle, LuStar, LuSearch, LuPlus, LuFilter, LuBookmark, LuBookmarkMinus, LuClock, LuTag, LuExternalLink, LuDot, LuCompass
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
  secondary:   '#5FAE4B',
  accent:      '#F39C12',
  ink:         '#0F1E2D',
  stone:       '#5F6B7A',
  stoneLight:  '#8D9DB0',
  border:      '#DDE3ED',
  borderLight: '#EBF0F7',
  bg:          '#F4F6F9',
  bgSurface:   '#FFFFFF',
  ffDisplay:   "'Manrope', sans-serif",
};

/* ── Verified Card ── */
function VerifiedCard({ l, saved, onSave }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    borderRadius: 18,
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: C.bgSurface,
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.07)',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          background: '#fff', borderRadius: 999, padding: '5px 12px',
          display: 'flex', alignItems: 'center', gap: 5,
          fontWeight: 700, fontSize: '0.75rem', color: C.secondary,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}>
          <LuCircle style={{ color: C.secondary }} /> Verified
        </div>
        <button
          onClick={() => onSave(l.id)}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 2,
            background: saved ? C.secondary : 'rgba(255,255,255,0.9)',
            border: 'none', borderRadius: '50%', width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: saved ? '#fff' : C.stoneLight,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          {saved ? <LuBookmark /> : <LuBookmarkMinus />}
        </button>
        <img
          src={l.img} alt={l.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s ease' }}
        />
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.25rem' }}>
        <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', color: C.ink, fontSize: '1.1rem', margin: '0 0 0.25rem' }}>{l.name}</h4>
        <p style={{ color: C.stone, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
          <LuMapPin style={{ color: C.secondary }} /> {l.city}
        </p>
        {l.hours && (
          <p style={{ color: C.stone, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
            <LuClock style={{ color: C.accent }} /> {l.hours}
          </p>
        )}
        <p style={{ color: C.stone, marginBottom: '0.75rem', flex: 1, fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>{l.desc}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {l.tags.map(tag => (
            <span key={tag} style={{ background: 'rgba(95,174,75,0.1)', color: C.secondary, fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
              <LuTag style={{ marginRight: 4 }} />{tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <Link to={`/listing/${l.id}`}
            style={{ flex: 1, textAlign: 'center', padding: '0.6rem 0', borderRadius: 10, fontSize: '0.875rem', fontWeight: 700, border: `1px solid ${C.secondary}`, color: C.secondary, background: 'transparent', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Details
          </Link>
          <Link to="/itinerary"
            style={{ flex: 1, textAlign: 'center', padding: '0.6rem 0', borderRadius: 10, fontSize: '0.875rem', fontWeight: 700, background: 'linear-gradient(135deg, #2D5016, #3D6B1F)', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <LuPlus /> Plan
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Community Card ── */
function CommunityCard({ l, saved, onSave }) {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', background: C.bgSurface, border: `1px solid #F5E9D3`, boxShadow: '0 1px 4px rgba(15,30,45,0.06)' }}>
      {/* Image */}
      <div style={{ height: 180, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #FFF7ED, #FEF3E2)' }}>
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          background: 'rgba(255,247,237,0.95)', border: '1px solid #F5E9D3',
          borderRadius: 999, padding: '4px 10px',
          fontWeight: 700, fontSize: '0.72rem', color: C.accent,
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          <LuStar /> Not Yet Verified
        </div>
        <button
          onClick={() => onSave(l.id)}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 2,
            background: saved ? C.accent : 'rgba(255,255,255,0.9)',
            border: 'none', borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: saved ? '#fff' : C.stoneLight,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          {saved ? <LuBookmark /> : <LuBookmarkMinus />}
        </button>
        {l.img && (
          <img src={l.img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, filter: 'saturate(0.8)', display: 'block' }} />
        )}
        {!l.img && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.3 }}>
            🏪
          </div>
        )}
      </div>

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h5 style={{ fontWeight: 700, marginBottom: '0.25rem', color: C.ink, margin: '0 0 0.25rem' }}>{l.name}</h5>
        <p style={{ color: C.stone, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
          <LuMapPin /> {l.city}
        </p>
        <p style={{ color: C.stone, marginBottom: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
          Nominated by the community. Basic info available. Awaiting verification.
        </p>
        <Link to={`/listing/${l.id}`}
          style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.6rem', background: '#FFF7ED', color: C.accent, border: '1px solid #F5E9D3', borderRadius: 10, fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', marginTop: 'auto' }}>
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ── Fallback Card ── */
function FallbackCard({ l }) {
  return (
    <div style={{ borderRadius: 14, background: '#F8FAFC', borderColor: C.border, border: `1px solid ${C.border}`, height: '100%' }}>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div>
            <h6 style={{ fontWeight: 700, marginBottom: '0.25rem', color: C.ink, margin: '0 0 0.25rem', fontSize: '1rem' }}>{l.name}</h6>
            <p style={{ color: C.stone, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', margin: 0 }}>
              <LuMapPin /> {l.type} <LuDot /> {l.city}
            </p>
          </div>
          <span style={{ background: '#F1F5F9', color: C.stone, fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', fontWeight: 600, whiteSpace: 'nowrap' }}>Google Data</span>
        </div>
        <hr style={{ borderColor: C.border, margin: '0.75rem 0', border: 'none', borderTop: `1px solid ${C.border}` }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/claim"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem', borderRadius: 8, fontWeight: 600, background: '#F1F8F1', color: C.secondary, border: `1px solid #C3E2BC`, fontSize: '0.82rem', textDecoration: 'none' }}>
            <LuCircle style={{ color: C.secondary }} /> Is this your business? Claim it
          </Link>
          <Link to="/nominate"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem', borderRadius: 8, fontWeight: 600, background: '#FFF7ED', color: C.accent, border: '1px solid #FDE68A', fontSize: '0.82rem', textDecoration: 'none' }}>
            <LuStar style={{ color: C.accent }} /> Know this place? Nominate it
          </Link>
        </div>
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
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [savedName, setSavedName] = useState('');
  const [authModal, setAuthModal] = useState(null);

  const handleSave = (id) => {
    const listing = ALL_LISTINGS.find(l => l.id === id);
    if (!savedIds.includes(id)) {
      setSavedIds(prev => [...prev, id]);
      setSavedName(listing?.name || '');
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2500);
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
    <div style={{ background: C.bg, minHeight: '100vh', paddingBottom: '4rem', position: 'relative' }}>

      {/* Toast Notification */}
      <div style={{
        position: 'fixed', top: 90, right: 24, zIndex: 9999,
        background: C.secondary, color: '#fff',
        padding: '1rem 1.5rem', borderRadius: 14,
        boxShadow: '0 8px 32px rgba(45,80,22,0.4)',
        transform: showSavedToast ? 'translateX(0)' : 'translateX(120%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', alignItems: 'center', gap: 10, minWidth: 260, fontWeight: 600
      }}>
        <LuBookmark /> Saved to Shortlist: {savedName}
      </div>

      {/* ── Page Header Banner ── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${C.borderLight}`, boxShadow: '0 1px 4px rgba(15,30,45,0.06)', marginBottom: '2rem', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h1 style={{ fontFamily: C.ffDisplay, fontSize: '2.25rem', color: C.ink, letterSpacing: '-0.02em', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LuCompass style={{ color: C.secondary }} /> Directory
            </h1>
            <p style={{ color: C.stone, fontSize: '1.1rem', margin: 0 }}>Find local gems — verified businesses, hidden spots, and community favorites.</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* ── Search + Filters ── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: C.stone, fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: 600, margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
            Find verified businesses, community favorites, and hidden spots — curated by locals and travelers alike.
          </p>

          {/* Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ maxWidth: 640, width: '100%', borderRadius: 14, overflow: 'hidden', border: '2px solid #E7E5E4', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(15,30,45,0.06)', background: '#fff' }}>
              <span style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', color: C.stone }}>
                <LuSearch />
              </span>
              <input
                type="text"
                style={{ flex: 1, border: 'none', padding: '0.9rem 0', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', background: 'transparent' }}
                placeholder="Search by destination (e.g. Baguio, Vigan, Palawan)…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                style={{ padding: '0 1.5rem', height: '100%', minHeight: 50, background: 'linear-gradient(135deg, #2D5016, #3D6B1F)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem' }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
            {/* Category */}
            {CATEGORIES.map(c => (
              <button key={c}
                onClick={() => setCatFilter(c)}
                style={{
                  borderRadius: 999, padding: '6px 16px',
                  background: catFilter === c ? C.ink : '#fff',
                  color: catFilter === c ? '#fff' : C.stoneLight,
                  border: `1px solid ${catFilter === c ? C.ink : C.border}`,
                  transition: 'all 0.2s ease', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                }}>
                {c}
              </button>
            ))}
            <span style={{ width: 1, background: C.border, alignSelf: 'stretch' }} />
            {/* Tier Filter */}
            {TIERS.map(t => (
              <button key={t}
                onClick={() => setTierFilter(t)}
                style={{
                  borderRadius: 999, padding: '6px 16px',
                  background: tierFilter === t ? C.secondary : 'rgba(95,174,75,0.07)',
                  color: tierFilter === t ? '#fff' : C.secondary,
                  border: `1px solid ${tierFilter === t ? C.secondary : '#C6E0B0'}`,
                  transition: 'all 0.2s ease', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                }}>
                {t === 'Verified' ? '✓ ' : t === 'Community' ? '★ ' : t === 'Other' ? '📍 ' : ''}{t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

          {/* ── Tier 1: Verified ── */}
          {(tierFilter === 'All' || tierFilter === 'Verified') && verified.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #E8F5E0' }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, color: C.secondary, fontFamily: C.ffDisplay, fontSize: '1.5rem', margin: 0 }}>
                    <LuCircle /> Verified WanderLocal Listings
                  </h3>
                  <p style={{ color: C.stone, marginBottom: 0, marginTop: '0.25rem', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                    Fully verified · Rich profiles · Bookmarkable · Itinerary-ready
                  </p>
                </div>
                <span style={{ background: 'rgba(95,174,75,0.1)', color: C.secondary, fontSize: '0.85rem', padding: '4px 14px', borderRadius: '999px', fontWeight: 700 }}>
                  {verified.length} listings
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {verified.map(l => (
                  <div key={l.id}>
                    <VerifiedCard l={l} saved={savedIds.includes(l.id)} onSave={handleSave} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Tier 2: Community ── */}
          {(tierFilter === 'All' || tierFilter === 'Community') && community.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid #FEF3E2' }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, color: C.accent, fontFamily: C.ffDisplay, fontSize: '1.5rem', margin: 0 }}>
                    <LuStar /> Community Suggested
                  </h3>
                  <p style={{ color: C.stone, marginBottom: 0, marginTop: '0.25rem', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                    Nominated by travelers · Basic info · Awaiting verification
                  </p>
                </div>
                <span style={{ background: 'rgba(243,156,18,0.12)', color: C.accent, fontSize: '0.85rem', padding: '4px 14px', borderRadius: '999px', fontWeight: 700 }}>
                  {community.length} listings
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {community.map(l => (
                  <div key={l.id}>
                    <CommunityCard l={l} saved={savedIds.includes(l.id)} onSave={handleSave} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Tier 3: Fallback ── */}
          {(tierFilter === 'All' || tierFilter === 'Other') && fallback.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: `2px solid ${C.border}` }}>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, color: C.stone, fontFamily: C.ffDisplay, margin: 0 }}>
                    <LuMapPin /> Other Places Nearby
                  </h4>
                  <p style={{ color: C.stone, marginBottom: 0, marginTop: '0.25rem', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                    Via Google Places & OpenStreetMap · Minimal info only · Cannot be added to itineraries
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {fallback.map(l => (
                  <div key={l.id}>
                    <FallbackCard l={l} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: C.ink }}>No listings found</h4>
              <p style={{ color: C.stone, marginBottom: '1.5rem' }}>Try a different search term or clear your filters.</p>
              <button
                style={{ background: 'transparent', border: `1px solid ${C.secondary}`, color: C.secondary, borderRadius: '999px', padding: '0.65rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                onClick={() => { setSearch(''); setCatFilter('All'); setTierFilter('All'); }}
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: '3rem', padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, #F3F8EF 0%, #E8F5E0 100%)', borderRadius: 24, border: '1px solid #C6E0B0' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '0.75rem', color: C.secondary, fontFamily: C.ffDisplay }}>Know a hidden gem?</h2>
          <p style={{ fontSize: '1.1rem', color: C.stone, marginBottom: '1.5rem', maxWidth: 520, margin: '0 auto 1.5rem' }}>
            Help fellow travelers discover it. Submit a quick nomination and we'll reach out to the owner.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/nominate"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #2D5016, #3D6B1F)', color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 8px rgba(45,80,22,0.25)' }}>
              <LuPlus /> Nominate a Business
            </Link>
            <button
              onClick={() => setAuthModal('register')}
              style={{ padding: '0.9rem 2rem', background: 'transparent', border: `1px solid ${C.secondary}`, color: C.secondary, borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Create Free Account
            </button>
          </div>
        </div>

        {/* Auth Modal via Create Account button */}
        {authModal && (
          <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />
        )}
      </div>
    </div>
  );
};

export default Directory;
