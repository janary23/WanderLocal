import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LuCopy, LuHeart, LuEye, LuMap, LuStar, LuClock, LuMapPin, LuSearch, LuCheck, LuArrowRight, LuImage
} from 'react-icons/lu';

/* ── Color tokens ── */
const C = {
  secondary: '#5FAE4B', accent: '#F39C12',
  ink: '#0F1E2D', stone: '#5F6B7A', stoneLight: '#8D9DB0',
  border: '#DDE3ED', bg: '#F4F6F9', bgSurface: '#FFFFFF',
  ffDisplay: "'Manrope', sans-serif",
};

/* ── Mock data ── */
const ITINERARIES = [
  { id: 1, title: 'Baguio Foodie Run',         dest: 'Baguio City',             days: 3, stops: 18, likes: 243, views: '1.2k', tags: ['Food', 'Casual'],   focus: 'Food',    authorBg: C.secondary, author: 'Maria S.', img: 'https://picsum.photos/seed/15967078/800/600', preview: [{ day: 1, stops: ['Cafe Amore', 'Baguio Night Market', 'Minesview Pines Resto'] }, { day: 2, stops: ['Good Taste Restaurant', 'Burnham Park Boathouse', 'Session Road Eats'] }] },
  { id: 2, title: 'Historical Vigan Heritage',  dest: 'Vigan, Ilocos Sur',       days: 2, stops: 9,  likes: 189, views: '870', tags: ['Culture', 'Walking'], focus: 'Heritage', authorBg: C.accent,    author: 'Juan D.',  img: 'https://picsum.photos/seed/15632007/800/600', preview: [{ day: 1, stops: ['Calle Crisologo', 'Bantay Church', 'Plaza Salcedo'] }, { day: 2, stops: ['Vigan Cathedral', 'Pagburnayan Pottery', "Grandpa's Inn"] }] },
  { id: 3, title: 'Batangas Dive & Relax',      dest: 'Batangas',                days: 4, stops: 12, likes: 310, views: '2.5k', tags: ['Nature', 'Active'],  focus: 'Nature',  authorBg: '#3A75A0',   author: 'Pedro R.', img: 'https://picsum.photos/seed/15181821/800/600', preview: [{ day: 1, stops: ['Anilao Dive Center', 'Secret Beach Cove', 'Sombrero Island'] }] },
  { id: 4, title: 'Baler Surf Weekend',          dest: 'Aurora',                  days: 2, stops: 5,  likes: 450, views: '3.1k', tags: ['Beach', 'Chill'],   focus: 'Nature',  authorBg: '#8B5CF6',   author: 'Ana G.',   img: 'https://picsum.photos/seed/15026803/800/600', preview: [{ day: 1, stops: ['Sabang Beach Surf Spot', 'Bistro Arenos', 'Cemento Beach'] }] },
  { id: 5, title: 'Palawan Island Hop',          dest: 'Puerto Princesa, Palawan',days: 5, stops: 14, likes: 527, views: '4.8k', tags: ['Nature', 'Island'], focus: 'Nature',  authorBg: '#0EA5E9',   author: 'Carla M.', img: 'https://picsum.photos/seed/14330869/800/600', preview: [{ day: 1, stops: ['Underground River Tour', 'Nami Restaurant', 'Iwahig Firefly'] }] },
  { id: 6, title: 'Metro Manila Food Crawl',     dest: 'Manila',                  days: 2, stops: 10, likes: 192, views: '1.1k', tags: ['Food', 'Urban'],    focus: 'Food',    authorBg: '#F43F5E',   author: 'Raffy T.', img: 'https://picsum.photos/seed/15433629/800/600', preview: [{ day: 1, stops: ['Binondo Food Walk', 'Casa Roces', 'Café Adriatico'] }] },
];

const DEST_FILTERS = ['All Destinations', 'Baguio', 'Vigan', 'Batangas', 'Palawan', 'Manila', 'Aurora'];
const DUR_FILTERS  = ['Any Duration', '1-2 Days', '3-5 Days', '6+ Days'];
const CAT_FILTERS  = ['All Categories', 'Food', 'Heritage', 'Nature'];

/* ── Itinerary Card ── */
function ItineraryCard({ it, onClone }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(it.likes);

  const handleLike = e => { e.stopPropagation(); setLiked(!liked); setLikes(prev => liked ? prev - 1 : prev + 1); };

  return (
    <div
      style={{ borderRadius: 18, background: C.bgSurface, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease, box-shadow 0.3s ease', height: '100%' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
    >
      {/* Image */}
      <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
        <img src={it.img} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem' }}>
          <h4 style={{ color: '#fff', fontWeight: 700, margin: '0 0 4px', textShadow: '0 2px 6px rgba(0,0,0,0.5)', fontSize: '1.1rem' }}>{it.title}</h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}><LuMapPin /> {it.dest}</p>
        </div>
        <button onClick={handleLike} style={{ position: 'absolute', top: 12, right: 12, background: liked ? '#E53935' : 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: liked ? '#fff' : C.ink, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'all 0.2s ease', fontFamily: 'inherit' }}>
          <LuHeart />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
        {/* Author & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: it.authorBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{it.author[0]}</div>
            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: C.stone }}>by {it.author}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', color: C.stone, fontSize: '0.82rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LuHeart style={{ color: '#E53935' }} /> {likes}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LuEye /> {it.views}</span>
          </div>
        </div>

        {/* Stats Pills */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, padding: '0.5rem', background: '#F1F8F1', fontSize: '0.85rem', color: C.stone }}>
            <LuClock style={{ color: C.secondary }} /> <strong>{it.days}</strong> Days
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, padding: '0.5rem', background: '#E8F1F7', fontSize: '0.85rem', color: C.stone }}>
            <LuMapPin style={{ color: '#3A75A0' }} /> <strong>{it.stops}</strong> Stops
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {it.tags.map(t => <span key={t} style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.72rem', padding: '4px 10px', borderRadius: 999, fontWeight: 600 }}>{t}</span>)}
        </div>

        {/* Expandable Preview */}
        {it.preview && (
          <div>
            <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: C.secondary, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: expanded ? '0.75rem' : 0, fontFamily: 'inherit' }}>
              {expanded ? '▲ Hide Preview' : '▼ Show Schedule Preview'}
            </button>
            {expanded && (
              <div style={{ animation: 'slideDown 0.2s ease-out' }}>
                {it.preview.map(dayPlan => (
                  <div key={dayPlan.day} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.stoneLight, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Day {dayPlan.day}</div>
                    {dayPlan.stops.map((s, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.35rem 0', borderBottom: `1px solid #F3F4F6` }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: C.secondary, color: '#fff', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{si + 1}</span>
                        <span style={{ fontSize: '0.82rem', color: C.stoneLight }}>{s}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ paddingTop: '0.75rem', borderTop: `1px solid ${C.border}`, marginTop: 'auto' }}>
          <button onClick={() => onClone(it)}
            style={{ width: '100%', background: 'linear-gradient(135deg, #2D5016, #3D6B1F)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem', padding: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(45,80,22,0.25)', transition: 'all 0.2s ease', fontFamily: 'inherit' }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <LuCopy /> Clone This Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Clone Modal ── */
function CloneModal({ itinerary, onClose, onGo }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 420, padding: '2.5rem', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #22C55E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '2rem' }}>
          <LuCheck color="#fff" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.ink, marginBottom: '0.5rem' }}>Itinerary Cloned!</h2>
        <p style={{ color: C.stone, fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          <strong style={{ color: C.ink }}>{itinerary?.title}</strong> has been saved to your drafts. You can now customize it freely!
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.9rem', borderRadius: 12, border: '2px solid #E7E5E4', background: '#fff', fontWeight: 600, cursor: 'pointer', color: C.stoneLight, fontFamily: 'inherit' }}>Continue Browsing</button>
          <button onClick={onGo} style={{ flex: 1.5, padding: '0.9rem', borderRadius: 12, background: 'linear-gradient(135deg, #2D5016, #3D6B1F)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,80,22,0.3)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            Open in Builder <LuArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main CommunityGallery ── */
const CommunityGallery = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [destFilter, setDestFilter] = useState('All Destinations');
  const [durFilter, setDurFilter] = useState('Any Duration');
  const [catFilter, setCatFilter] = useState('All Categories');
  const [clonedItem, setClonedItem] = useState(null);

  const filtered = ITINERARIES.filter(it => {
    const q = search.toLowerCase();
    const mQ   = !q || it.title.toLowerCase().includes(q) || it.dest.toLowerCase().includes(q);
    const mD   = destFilter === 'All Destinations' || it.dest.toLowerCase().includes(destFilter.toLowerCase());
    const mDur = durFilter === 'Any Duration' || (durFilter === '1-2 Days' && it.days <= 2) || (durFilter === '3-5 Days' && it.days >= 3 && it.days <= 5) || (durFilter === '6+ Days' && it.days >= 6);
    const mC   = catFilter === 'All Categories' || it.focus === catFilter || it.tags.includes(catFilter);
    return mQ && mD && mDur && mC;
  });

  return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingBottom: '4rem' }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Clone Modal */}
      {clonedItem && <CloneModal itinerary={clonedItem} onClose={() => setClonedItem(null)} onGo={() => { setClonedItem(null); navigate('/itinerary'); }} />}

      {/* ── Page Header Banner ── */}
      <div style={{ background: '#fff', borderBottom: `1px solid #EBF0F7`, boxShadow: '0 1px 4px rgba(28,25,23,0.04)', marginBottom: '2rem', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ fontFamily: C.ffDisplay, fontSize: '2.25rem', fontWeight: 700, color: C.ink, letterSpacing: '-0.02em', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <LuImage style={{ color: C.secondary }} /> Community Gallery
          </h1>
          <p style={{ color: C.stone, margin: 0, fontSize: '1.05rem' }}>Itineraries by real travelers — clone one to kick-start your own adventure.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* ── Search + Filters ── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: C.stone, marginBottom: '1.5rem', maxWidth: 600, margin: '0 auto 1.5rem', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Get inspired by routes crafted by fellow adventurers. Clone any itinerary to start your own journey with a head start.
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{ maxWidth: 500, width: '100%', borderRadius: 12, overflow: 'hidden', border: '2px solid #E7E5E4', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(15,30,45,0.06)' }}>
              <span style={{ padding: '0 1rem', color: C.stoneLight, display: 'flex', alignItems: 'center' }}><LuSearch /></span>
              <input
                type="text"
                style={{ flex: 1, border: 'none', padding: '0.75rem 0', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
                placeholder="Search destinations or trip names…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Selects */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            {[
              { val: destFilter, opts: DEST_FILTERS, set: setDestFilter, minWidth: 170 },
              { val: durFilter,  opts: DUR_FILTERS,  set: setDurFilter,  minWidth: 150 },
              { val: catFilter,  opts: CAT_FILTERS,  set: setCatFilter,  minWidth: 170 },
            ].map(({ val, opts, set, minWidth }, i) => (
              <select key={i} value={val} onChange={e => set(e.target.value)}
                style={{ minWidth, borderRadius: 10, border: `1px solid ${C.border}`, padding: '0.55rem 1rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', background: '#fff', fontFamily: 'inherit', color: C.ink }}>
                {opts.map(f => <option key={f}>{f}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <p style={{ color: C.stone, margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>
            Showing <strong style={{ color: C.ink }}>{filtered.length}</strong> itineraries
          </p>
          <div style={{ display: 'flex', gap: '1rem', color: C.stoneLight, fontSize: '0.82rem' }}>
            <span>🗺️ {ITINERARIES.reduce((a, i) => a + i.stops, 0)} total stops</span>
            <span>❤️ {ITINERARIES.reduce((a, i) => a + i.likes, 0)} likes</span>
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {filtered.map(it => <ItineraryCard key={it.id} it={it} onClone={setClonedItem} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h4 style={{ fontWeight: 700, color: C.ink, marginBottom: '0.5rem' }}>No itineraries match your filters</h4>
            <p style={{ color: C.stoneLight, marginBottom: '1.5rem' }}>Try adjusting your search or filter criteria.</p>
            <button
              style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.stone, borderRadius: 999, padding: '0.65rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => { setSearch(''); setDestFilter('All Destinations'); setDurFilter('Any Duration'); setCatFilter('All Categories'); }}>
              Clear All Filters
            </button>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: '3rem', padding: '3.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #1C1917, #2D5016)', borderRadius: 24, color: '#fff' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '0.75rem', fontFamily: C.ffDisplay, fontSize: '2rem' }}>Ready to build your own?</h2>
          <p style={{ marginBottom: '1.5rem', maxWidth: 520, margin: '0 auto 1.5rem', opacity: 0.85, lineHeight: 1.7 }}>
            Create a custom itinerary from scratch or clone one of these as your starting point.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/itinerary" style={{ fontWeight: 700, padding: '0.85rem 2.5rem', color: '#fff', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 12, backdropFilter: 'blur(4px)', textDecoration: 'none' }}>🗺️ Build from Scratch</Link>
            <Link to="/" style={{ fontWeight: 700, padding: '0.85rem 2.5rem', color: '#fff', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 12, textDecoration: 'none' }}>🌿 Create Free Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGallery;
