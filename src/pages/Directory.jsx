import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LuMapPin, LuCircle, LuStar, LuSearch, LuBookmark, LuBookmarkMinus, LuClock, LuCompass, LuLoader
} from 'react-icons/lu';
import { AuthContext } from '../context/AuthContext';
import { getListings, toggleSave, getWishlist } from '../services/api';
import { glassCardStyle, glassCardHover, btnPrimaryStyle, btnPrimaryHover, btnSecondaryStyle, btnSecondaryHover, btnGhostStyle, btnGhostHover, applyHover, removeHover } from '../inlineStyles';

const CATEGORIES = ['All', 'Food', 'Heritage', 'Nature', 'Shopping'];
const TIERS = ['All', 'Verified', 'Community', 'Other'];

// Utility to clean up encoding issues from DB (e.g., â€“ to -)
const fixText = (text) => {
  if (!text) return '';
  return text.replace(/â€“/g, '–').replace(/Ã±/g, 'ñ');
};

/* ── Verified Card ── */
function VerifiedCard({ l, saved, onSave }) {
  return (
    <div style={{ ...glassCardStyle, padding: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
      <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: 'var(--color-surface)', backdropFilter: 'var(--glass-blur)', borderRadius: 'var(--radius-pill)', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.75rem', color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-primary-border)' }}>
          <LuCircle /> Verified
        </div>
        <button onClick={() => onSave(l.id)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: saved ? 'var(--color-primary)' : 'var(--color-surface)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--color-border)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: saved ? '#fff' : 'var(--color-stone)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease', fontFamily: 'inherit' }}>
          {saved ? <LuBookmark /> : <LuBookmarkMinus />}
        </button>
        {l.cover_img
          ? <img src={l.cover_img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.3 }}>🏙️</div>
        }
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, background: 'var(--glass-bg)' }}>
        <h4 style={{ fontWeight: 800, color: 'var(--color-ink)', fontSize: '1.25rem', margin: '0 0 4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{fixText(l.name)}</h4>
        <p style={{ color: 'var(--color-stone)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', fontWeight: 600 }}>
          <LuMapPin color="var(--color-primary)" /> {l.city} <span style={{ color: 'var(--color-stone-light)' }}>• {l.type}</span>
        </p>
        {l.hours && (
          <p style={{ color: 'var(--color-stone)', fontSize: '0.85rem', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
            <LuClock size={14} color="var(--color-stone-light)" /> {fixText(l.hours)}
          </p>
        )}
        <p style={{ color: 'var(--color-ink)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, margin: '0 0 16px' }}>{fixText(l.description)}</p>
        {l.tags && l.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {l.tags.map(tag => (
              <span key={tag} style={{ background: 'var(--color-surface)', color: 'var(--color-stone)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>{tag}</span>
            ))}
          </div>
        )}
        <Link to={`/listing/${l.id}`} style={{ ...btnPrimaryStyle, width: '100%', padding: '0.85rem' }} onMouseOver={e => applyHover(e, btnPrimaryHover)} onMouseOut={e => removeHover(e, btnPrimaryStyle)}>
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ── Community Card ── */
function CommunityCard({ l, saved, onSave }) {
  return (
    <div style={{ ...glassCardStyle, padding: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
      <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: 'var(--color-accent-pale)' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: 'var(--color-surface)', backdropFilter: 'var(--glass-blur)', border: '1px solid rgba(227, 178, 60, 0.5)', borderRadius: 'var(--radius-pill)', padding: '4px 10px', fontWeight: 800, fontSize: '0.75rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: 4, boxShadow: 'var(--shadow-sm)' }}>
          <LuStar /> Community Choice
        </div>
        <button onClick={() => onSave(l.id)} style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: saved ? 'var(--color-accent)' : 'var(--color-surface)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--color-border)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: saved ? '#fff' : 'var(--color-stone)', boxShadow: 'var(--shadow-sm)', fontFamily: 'inherit', transition: 'all 0.2s' }}>
          {saved ? <LuBookmark /> : <LuBookmarkMinus />}
        </button>
        {l.cover_img
          ? <img src={l.cover_img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.2 }}>🏙️</div>
        }
      </div>
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--glass-bg)' }}>
        <h4 style={{ fontWeight: 800, margin: '0 0 4px', color: 'var(--color-ink)', fontSize: '1.15rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{fixText(l.name)}</h4>
        <p style={{ color: 'var(--color-stone)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600 }}>
          <LuMapPin color="var(--color-accent)" /> {l.city} <span style={{ color: 'var(--color-stone-light)' }}>• {l.type}</span>
        </p>
        <Link to={`/listing/${l.id}`} style={{ ...btnSecondaryStyle, width: '100%', marginTop: 'auto', padding: '0.75rem' }} onMouseOver={e => applyHover(e, btnSecondaryHover)} onMouseOut={e => removeHover(e, btnSecondaryStyle)}>
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ── Fallback Card ── */
function FallbackCard({ l }) {
  return (
    <div style={{ ...glassCardStyle, padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-sand)' }}>
      <h4 style={{ fontWeight: 800, margin: '0 0 4px', color: 'var(--color-ink)', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{fixText(l.name)}</h4>
      <p style={{ color: 'var(--color-stone-light)', margin: '0 0 16px', fontSize: '0.85rem', fontWeight: 600 }}>{l.city} • {l.type}</p>
      <div style={{ display: 'grid', gap: '0.5rem', marginTop: 'auto' }}>
        <Link to="/claim" style={{ ...btnSecondaryStyle, width: '100%', padding: '0.5rem', fontSize: '0.85rem' }} onMouseOver={e => applyHover(e, btnSecondaryHover)} onMouseOut={e => removeHover(e, btnSecondaryStyle)}>Claim</Link>
        <Link to="/nominate" style={{ ...btnGhostStyle, width: '100%', padding: '0.5rem', fontSize: '0.85rem', color: 'var(--color-accent)', borderColor: 'rgba(227, 178, 60, 0.5)' }} onMouseOver={e => applyHover(e, { background: 'var(--color-accent-pale)', borderColor: 'var(--color-accent)' })} onMouseOut={e => removeHover(e, { background: 'transparent', borderColor: 'rgba(227, 178, 60, 0.5)' })}>Nominate</Link>
      </div>
    </div>
  );
}

/* ── Main Directory ── */
const Directory = () => {
  const { userId } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [listings, setListings] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load listings
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getListings({ category: catFilter, tier: tierFilter, q: search });
        if (data.status === 'success') setListings(data.listings);
      } catch (e) {
        console.error('Failed to load listings:', e);
      }
      setLoading(false);
    };
    const timer = setTimeout(fetchData, 300); // debounce search
    return () => clearTimeout(timer);
  }, [catFilter, tierFilter, search]);

  // Load user's wishlist
  useEffect(() => {
    if (!userId) return;
    getWishlist(userId).then(data => {
      if (data.status === 'success') {
        setSavedIds(data.listings.map(l => l.id));
      }
    });
  }, [userId]);

  const handleSave = async (id) => {
    if (!userId) return;
    // Optimistic UI update
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    await toggleSave(id, userId);
  };

  const verified  = listings.filter(l => l.tier === 'verified');
  const community = listings.filter(l => l.tier === 'community');
  const fallback  = listings.filter(l => l.tier === 'fallback');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Top Banner / Search Section */}
      <div style={{ background: '#fff', padding: '4rem 2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.03em', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            Find the unnoted.
          </h1>
          <div style={{ display: 'flex', width: '100%', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 300, display: 'flex', alignItems: 'center', background: 'var(--color-surface)', backdropFilter: 'var(--glass-blur)', borderRadius: 'var(--radius-pill)', padding: '1rem 1.5rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <LuSearch size={22} color="var(--color-primary)" />
              <input
                type="text"
                placeholder="Search by name or city (Baguio, Vigan)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', width: '100%', marginLeft: '1rem', color: 'var(--color-ink)', fontFamily: 'inherit', fontWeight: 600 }}
              />
            </div>
            {/* Category Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '4px 0' }} className="no-scrollbar">
              <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              {CATEGORIES.map(c => (
                <button key={c} 
                  onClick={() => setCatFilter(c)} 
                  style={{ 
                    whiteSpace: 'nowrap', borderRadius: 'var(--radius-pill)', padding: '0.85rem 1.75rem', 
                    background: catFilter === c ? 'var(--color-ink)' : '#fff', 
                    color: catFilter === c ? '#fff' : 'var(--color-stone)', 
                    border: `1px solid ${catFilter === c ? 'var(--color-ink)' : 'var(--color-border)'}`, 
                    fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit', 
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: catFilter === c ? 'var(--shadow-sm)' : 'none'
                  }}
                  onMouseOver={e => catFilter !== c && applyHover(e, { background: 'var(--color-sand)' })}
                  onMouseOut={e => catFilter !== c && removeHover(e, { background: '#fff' })}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {TIERS.map(t => (
            <button key={t} 
              onClick={() => setTierFilter(t)} 
              style={{ 
                borderRadius: 'var(--radius-md)', padding: '0.75rem 1.5rem', 
                background: tierFilter === t ? 'var(--color-primary-pale)' : 'transparent', 
                color: tierFilter === t ? 'var(--color-primary)' : 'var(--color-stone)', 
                border: tierFilter === t ? '1px solid var(--color-primary-border)' : '1px solid transparent', 
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' 
              }}
              onMouseOver={e => tierFilter !== t && applyHover(e, { background: 'var(--color-surface)', border: '1px solid var(--color-border)' })}
              onMouseOut={e => tierFilter !== t && removeHover(e, { background: 'transparent', border: '1px solid transparent' })}
            >
              {t === 'All' ? 'All Tiers' : t === 'Verified' ? 'Premium Verified' : t === 'Community' ? 'Community Favorites' : 'Other'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-primary)' }}>
            <LuLoader size={48} style={{ animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite', marginBottom: '1.5rem' }} />
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Loading amazing places...</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ padding: '6rem 0', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow-sm)' }}>
              <LuCompass size={40} style={{ color: 'var(--color-stone-light)' }} />
            </div>
            <h2 style={{ fontWeight: 800, color: 'var(--color-ink)', fontSize: '2.5rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>No adventures found</h2>
            <p style={{ color: 'var(--color-stone)', fontSize: '1.15rem' }}>Adjust your filters or try a different search term.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {/* Verified Tier */}
            {(tierFilter === 'All' || tierFilter === 'Verified') && verified.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--color-ink)', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: 12, letterSpacing: '-0.02em' }}>
                  <LuCircle color="var(--color-primary)" size={28} /> Premium Selection
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                  {verified.map(l => <VerifiedCard key={l.id} l={l} saved={savedIds.includes(l.id)} onSave={handleSave} />)}
                </div>
              </div>
            )}
            
            {/* Community Tier */}
            {(tierFilter === 'All' || tierFilter === 'Community') && community.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--color-ink)', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: 12, letterSpacing: '-0.02em' }}>
                  <LuStar color="var(--color-accent)" size={28} /> Community Favorites
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {community.map(l => <CommunityCard key={l.id} l={l} saved={savedIds.includes(l.id)} onSave={handleSave} />)}
                </div>
              </div>
            )}

            {/* Fallback Tier */}
            {(tierFilter === 'All' || tierFilter === 'Other') && fallback.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-stone)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 12, letterSpacing: '-0.01em' }}>
                  <LuMapPin /> Unverified Map Data
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  {fallback.map(l => <FallbackCard key={l.id} l={l} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Directory;
