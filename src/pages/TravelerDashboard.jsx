import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LuMap, LuBookmark, LuBell, LuHistory, LuPlus, LuShare2, LuLock, LuGlobe, LuCompass, LuCircle, LuStar, LuChevronRight, LuMapPin, LuDownload, LuCopy, LuEye, LuPen, LuTrash2, LuClock, LuCamera
} from 'react-icons/lu';

/* ── Color tokens ── */
const C = {
  secondary:  '#5FAE4B',
  accent:     '#F39C12',
  terracotta: '#E53935',
  ink:        '#0F1E2D',
  stone:      '#5F6B7A',
  stoneLight: '#8D9DB0',
  border:     '#DDE3ED',
  bg:         '#F4F6F9',
  bgSurface:  '#FFFFFF',
  ffDisplay:  "'Manrope', sans-serif",
};

/* ── Tab metadata ── */
const TABS = {
  overview:    { label: 'Overview',       icon: <LuGlobe /> },
  itineraries: { label: 'My Itineraries', icon: <LuMap /> },
  shortlist:   { label: 'My Shortlist',   icon: <LuBookmark /> },
  profile:     { label: 'Manage Profile', icon: <LuPen /> },
};

/* ── Mock data ── */
const MOCK_ITINERARIES = [
  { id: 1, title: 'Baguio Weekend Escape', dest: 'Baguio City',       days: 3, stops: 12, status: 'draft',     visibility: 'private', img: 'https://picsum.photos/seed/15967078/800/600', updatedAt: '2 hours ago' },
  { id: 2, title: 'Vigan Heritage Tour',   dest: 'Vigan, Ilocos Sur', days: 2, stops: 8,  status: 'completed', visibility: 'public',  img: 'https://picsum.photos/seed/15632007/800/600', updatedAt: '3 days ago', clonedBy: 5 },
  { id: 3, title: 'Palawan Island Hop',    dest: 'Palawan',           days: 5, stops: 14, status: 'active',    visibility: 'link',    img: 'https://picsum.photos/seed/14330869/800/600', updatedAt: 'yesterday' },
];

const MOCK_SHORTLIST = [
  { id: 1, name: 'Cafe Amore',          city: 'Baguio City',      type: 'Food & Beverage', img: 'https://picsum.photos/seed/15541188/800/600' },
  { id: 2, name: 'Vigan Heritage Walk', city: 'Vigan, Ilocos Sur', type: 'Attraction',      img: 'https://picsum.photos/seed/15967078/800/600' },
  { id: 5, name: 'Batanes Homestead',   city: 'Basco, Batanes',    type: 'Accommodation',   img: 'https://picsum.photos/seed/15660737/800/600' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: <LuCircle />, color: '#22C55E', bg: 'rgba(34,197,94,0.1)',    title: 'Nomination Verified!',       desc: 'The business "Joe\'s Diner" you nominated is now officially on WanderLocal.', time: '2 hours ago',  unread: true  },
  { id: 2, icon: <LuCopy />,   color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',   title: 'Itinerary Cloned',           desc: 'A traveler cloned your "Vigan Heritage Tour". Happy planning!',              time: 'Yesterday',    unread: true  },
  { id: 3, icon: <LuMap />,    color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',   title: 'New Itinerary Suggestion',   desc: 'Check out "Batanes in a Weekend" — curated based on your interests.',         time: '2 days ago',   unread: false },
  { id: 4, icon: <LuCircle />, color: '#22C55E', bg: 'rgba(34,197,94,0.1)',    title: 'New Business Listed',        desc: '"Baguio Craft Market" you nominated has gone through verification.',          time: '5 days ago',   unread: false },
];

/* ── Shared card shell ── */
const cardStyle = { background: C.bgSurface, borderRadius: 16, boxShadow: '0 2px 8px rgba(15,30,45,0.07)', border: `1px solid ${C.border}`, overflow: 'hidden' };
const cardHeaderStyle = { background: 'transparent', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' };
const cardBodyStyle = (padding = '1.5rem') => ({ padding });
const headingStyle = { fontSize: '0.95rem', fontWeight: 700, color: C.ink, display: 'flex', alignItems: 'center', gap: 8, margin: 0 };

/* ── Status helpers ── */
const STATUS_STYLE = {
  draft:     { bg: '#F1F8F1', color: C.secondary,  label: 'Draft' },
  active:    { bg: '#E8F1F7', color: '#3A75A0',     label: 'Active' },
  completed: { bg: '#FFEBEE', color: C.terracotta,  label: 'Completed' },
};

const VIS_ICON = { private: <LuLock />, public: <LuGlobe />, link: <LuShare2 /> };
const VIS_LABEL = { private: 'Private', public: 'Public', link: 'Shareable Link' };

/* ── StatsBar ── */
function StatsBar() {
  const stats = [
    { label: 'Total Itineraries', value: '3', icon: <LuMap />,     color: C.secondary,  bg: '#F1F8F1',     border: '#C3E2BC' },
    { label: 'Saved Places',      value: '3', icon: <LuBookmark />, color: C.accent,     bg: '#FFF7ED',     border: '#FDE68A' },
    { label: 'Nominations',       value: '2', icon: <LuStar />,     color: '#8B5CF6',    bg: '#F5F3FF',     border: '#DDD6FE' },
    { label: 'Trips Completed',   value: '1', icon: <LuCircle />,   color: C.terracotta, bg: '#FFEBEE',     border: '#FECDD3' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ borderRadius: 14, border: `1px solid ${s.border}`, background: s.bg, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', color: s.color, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
            {s.icon}
          </div>
          <div>
            <div style={{ fontFamily: C.ffDisplay, fontSize: '1.8rem', fontWeight: 800, color: C.ink, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, color: s.color, marginTop: 4 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── ItineraryMiniCard ── */
function ItineraryMiniCard({ trip }) {
  const s = STATUS_STYLE[trip.status] || STATUS_STYLE.draft;
  return (
    <div
      style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: 12, border: `1px solid ${C.border}`, background: C.bgSurface, transition: 'border-color 0.2s ease', cursor: 'default' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#A8D08D'}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
    >
      <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
        <img src={trip.img} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
          <span style={{ background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>{s.label}</span>
          <span style={{ color: C.stoneLight, fontSize: '0.75rem' }} title={`Visibility: ${trip.visibility}`}>{VIS_ICON[trip.visibility]}</span>
        </div>
        <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trip.title}</div>
        <p style={{ color: C.stone, fontSize: '0.78rem', margin: '2px 0 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <LuMapPin style={{ fontSize: '0.7rem' }} /> {trip.dest} · {trip.days} Days · {trip.stops} Stops
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/itinerary" style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, background: '#F1F8F1', color: C.secondary, border: `1px solid #C3E2BC`, padding: '4px 12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <LuPen style={{ fontSize: '0.7rem' }} /> Edit
          </Link>
          <button style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            <LuDownload style={{ fontSize: '0.7rem' }} /> PDF
          </button>
          {trip.clonedBy && (
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: C.stoneLight, display: 'flex', alignItems: 'center', gap: 4 }}>
              <LuCopy style={{ fontSize: '0.7rem', color: '#3A75A0' }} /> {trip.clonedBy} clones
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Overview Tab ── */
function Overview({ navigate }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Left: Itineraries */}
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
        <div style={cardHeaderStyle}>
          <h6 style={headingStyle}><LuMap style={{ color: C.secondary }} /> My Itineraries</h6>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/dashboard?tab=itineraries" style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, padding: '4px 12px', background: '#F4F6F9', color: C.stone, border: `1px solid ${C.border}`, textDecoration: 'none' }}>View All</Link>
            <button onClick={() => navigate('/itinerary')} style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px', background: C.secondary, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
              <LuPlus /> New
            </button>
          </div>
        </div>
        <div style={{ ...cardBodyStyle(), display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {MOCK_ITINERARIES.slice(0, 2).map(trip => <ItineraryMiniCard key={trip.id} trip={trip} />)}
        </div>
      </div>

      {/* Right: Notifications + Recently Viewed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Notifications */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h6 style={headingStyle}><LuBell style={{ color: '#3A75A0' }} /> Notifications</h6>
            <span style={{ background: '#E8F1F7', color: '#3A75A0', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>2 New</span>
          </div>
          <div>
            {MOCK_NOTIFICATIONS.slice(0, 2).map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem 1.5rem', borderBottom: `1px solid ${C.border}`, background: n.unread ? 'rgba(59,130,246,0.03)' : '#fff' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: n.bg, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>{n.icon}</div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: C.ink, marginBottom: 2 }}>{n.title}</div>
                  <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: C.stone, margin: 0 }}>{n.desc}</p>
                  <span style={{ fontSize: '0.72rem', color: C.stoneLight, marginTop: 4, display: 'block' }}>{n.time}</span>
                </div>
              </div>
            ))}
            <Link to="/dashboard?tab=notifications" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', fontSize: '0.8rem', color: C.stoneLight, fontWeight: 600, textDecoration: 'none', borderRadius: '0 0 16px 16px' }}>
              View All Notifications <LuChevronRight style={{ fontSize: '0.65em' }} />
            </Link>
          </div>
        </div>

        {/* Recently Viewed */}
        <div style={cardStyle}>
          <div style={{ ...cardHeaderStyle, justifyContent: 'flex-start', gap: 8 }}>
            <LuHistory style={{ color: C.stone }} />
            <h6 style={headingStyle}>Recently Viewed</h6>
          </div>
          <div style={{ padding: '0 1.5rem' }}>
            {[
              { name: 'Baguio Craft Market', path: '/listing/3', type: 'Shopping' },
              { name: 'Vigan Heritage Walk', path: '/listing/2', type: 'Attraction' },
              { name: 'Cafe Amore',          path: '/listing/1', type: 'Food & Beverage' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.secondary, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: C.ink }}>{item.name}</div>
                    <div style={{ fontSize: '0.72rem', color: C.stoneLight }}>{item.type}</div>
                  </div>
                </div>
                <Link to={item.path} style={{ fontSize: '0.78rem', color: C.secondary, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  View <LuChevronRight style={{ fontSize: '0.65em' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Row — full width */}
      <div style={{ gridColumn: '1 / -1', ...cardStyle, background: 'linear-gradient(135deg, #F3F8EF, #EBF5E3)', border: '1px solid #C6E0B0' }}>
        <div style={cardBodyStyle()}>
          <h6 style={{ fontWeight: 700, color: C.secondary, marginBottom: '1rem' }}>Quick Actions</h6>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Browse Directory',   icon: <LuCompass />, path: '/directory', color: C.secondary,  bg: '#fff' },
              { label: 'New Itinerary',      icon: <LuPlus />,    path: '/itinerary', color: '#fff',        bg: C.secondary },
              { label: 'Community Gallery',  icon: <LuCamera />,  path: '/gallery',   color: C.secondary,  bg: '#fff' },
              { label: 'Nominate a Business',icon: <LuStar />,    path: '/nominate',  color: C.accent,     bg: '#FFF7ED' },
            ].map((action, i) => (
              <Link key={i} to={action.path}
                style={{ borderRadius: 12, padding: '0.85rem', background: action.bg, color: action.color, border: `1px solid ${action.bg === '#fff' ? C.border : action.bg}`, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s ease' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {action.icon} {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── My Itineraries Tab ── */
function MyItineraries({ navigate }) {
  const [visFilter, setVisFilter] = useState('all');
  const filtered = MOCK_ITINERARIES.filter(t => visFilter === 'all' || t.visibility === visFilter || t.status === visFilter);
  const VIS_OPTS = [{ val: 'all', label: 'All' }, { val: 'private', label: '🔒 Private' }, { val: 'link', label: '🔗 Link Only' }, { val: 'public', label: '🌐 Public' }];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {VIS_OPTS.map(o => (
            <button key={o.val} onClick={() => setVisFilter(o.val)}
              style={{ borderRadius: 999, fontSize: '0.82rem', fontWeight: 600, padding: '5px 14px', background: visFilter === o.val ? C.ink : '#fff', color: visFilter === o.val ? '#fff' : C.stoneLight, border: `1px solid ${visFilter === o.val ? C.ink : C.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
              {o.label}
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/itinerary')}
          style={{ borderRadius: 10, background: C.secondary, color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.875rem', padding: '0.6rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 4px 12px rgba(45,80,22,0.3)`, fontFamily: 'inherit' }}>
          <LuPlus /> New Itinerary
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {filtered.map(trip => {
          const s = STATUS_STYLE[trip.status];
          return (
            <div key={trip.id} style={{ ...cardStyle }}>
              <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                <img src={trip.img} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <span style={{ background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>{s.label}</span>
                </div>
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.stoneLight, fontSize: '0.8rem' }}>
                  {VIS_ICON[trip.visibility]}
                </div>
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.95rem', marginBottom: 4 }}>{trip.title}</div>
                <p style={{ color: C.stone, fontSize: '0.78rem', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <LuMapPin style={{ color: C.secondary, fontSize: '0.7rem' }} /> {trip.dest}
                </p>
                <p style={{ color: C.stone, fontSize: '0.78rem', margin: '0 0 4px' }}>{trip.days} Days · {trip.stops} Stops · {VIS_LABEL[trip.visibility]}</p>
                <p style={{ fontSize: '0.72rem', color: C.stoneLight, marginBottom: '0.75rem' }}>Updated {trip.updatedAt}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to="/itinerary" style={{ flex: 1, textAlign: 'center', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, background: '#F1F8F1', color: C.secondary, border: `1px solid #C3E2BC`, padding: '5px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <LuPen /> Edit
                  </Link>
                  <button style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}><LuDownload /></button>
                  <button style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, background: '#FFEBEE', color: C.terracotta, border: '1px solid #FECDD3', padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}><LuTrash2 /></button>
                </div>
              </div>
            </div>
          );
        })}

        {/* New Itinerary CTA */}
        <div onClick={() => navigate('/itinerary')}
          style={{ borderRadius: 16, minHeight: 260, cursor: 'pointer', border: '2px dashed #C6E0B0', background: '#F1F8F1', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E0'; e.currentTarget.style.borderColor = C.secondary; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F1F8F1'; e.currentTarget.style.borderColor = '#C6E0B0'; }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: C.secondary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', margin: '0 auto 1rem' }}><LuPlus /></div>
            <div style={{ fontWeight: 700, color: C.secondary, marginBottom: 4 }}>New Itinerary</div>
            <p style={{ color: C.stoneLight, margin: 0, fontSize: '0.8rem' }}>Plan your next adventure</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── My Shortlist Tab ── */
function MyShortlist({ navigate }) {
  const [items, setItems] = useState(MOCK_SHORTLIST);
  const handleRemove = id => setItems(prev => prev.filter(x => x.id !== id));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <p style={{ color: C.stone, fontSize: '0.9rem', margin: 0 }}>Your saved businesses — the staging area before building itineraries.</p>
        <button onClick={() => navigate('/directory')} style={{ borderRadius: 10, background: '#fff', border: `1px solid ${C.border}`, fontWeight: 600, fontSize: '0.875rem', padding: '0.55rem 1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', color: C.stone }}>
          <LuCompass /> Browse More
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <div style={{ fontWeight: 700, color: C.ink, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your shortlist is empty</div>
          <p style={{ color: C.stoneLight, marginBottom: '1.5rem', fontSize: '0.9rem' }}>Save places while browsing the directory to add them here.</p>
          <Link to="/directory" style={{ background: C.secondary, color: '#fff', borderRadius: 12, fontWeight: 700, padding: '0.75rem 2rem', textDecoration: 'none' }}>Browse Directory</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {items.map(place => (
            <div key={place.id} style={{ ...cardStyle }}>
              <div style={{ height: 160, overflow: 'hidden' }}>
                <img src={place.img} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ fontWeight: 700, color: C.ink, marginBottom: 4 }}>{place.name}</div>
                <p style={{ color: C.stone, fontSize: '0.8rem', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <LuMapPin style={{ color: C.secondary }} /> {place.city} · {place.type}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/listing/${place.id}`} style={{ flex: 1, textAlign: 'center', borderRadius: 8, background: '#F1F8F1', color: C.secondary, border: `1px solid #C3E2BC`, fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <LuEye /> View
                  </Link>
                  <Link to="/itinerary" style={{ flex: 1, textAlign: 'center', borderRadius: 8, background: C.secondary, color: '#fff', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <LuPlus /> Add to Trip
                  </Link>
                  <button onClick={() => handleRemove(place.id)} style={{ borderRadius: 8, background: '#FFEBEE', color: C.terracotta, border: '1px solid #FECDD3', padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add More */}
          <div onClick={() => navigate('/directory')}
            style={{ borderRadius: 16, minHeight: 260, cursor: 'pointer', border: '2px dashed #C6E0B0', background: '#F1F8F1', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E0'; e.currentTarget.style.borderColor = C.secondary; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F1F8F1'; e.currentTarget.style.borderColor = '#C6E0B0'; }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
              <div style={{ fontWeight: 700, color: C.secondary }}>Discover More Places</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Manage Profile Tab ── */
const inpStyle = { width: '100%', padding: '0.65rem 1rem', borderRadius: 8, border: `1px solid #DDE3ED`, fontSize: '0.9rem', fontWeight: 600, color: '#0F1E2D', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const lblStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6B7A', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

function ManageProfile() {
  return (
    <div style={cardStyle}>
      <div style={{ ...cardHeaderStyle, gap: 8 }}>
        <LuPen style={{ color: '#3A75A0' }} />
        <h6 style={{ ...headingStyle }}>Profile Details</h6>
      </div>
      <div style={cardBodyStyle()}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
          <form>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div><label style={lblStyle}>First Name</label><input type="text" style={inpStyle} defaultValue="Alex" /></div>
              <div><label style={lblStyle}>Last Name</label><input type="text" style={inpStyle} defaultValue="Traveler" /></div>
            </div>
            <div style={{ marginBottom: '1rem' }}><label style={lblStyle}>Email Address</label><input type="email" style={inpStyle} defaultValue="alex@wanderlocal.ph" /></div>
            <div style={{ marginBottom: '1.5rem' }}><label style={lblStyle}>Short Bio</label><textarea style={{ ...inpStyle, minHeight: 84, resize: 'vertical' }} rows="3" defaultValue="I love exploring hidden islands and trying out new delicacies!" /></div>
            <button type="button" style={{ background: '#5FAE4B', color: '#fff', borderRadius: 10, fontWeight: 700, padding: '0.65rem 1.75rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Save Changes</button>
          </form>

          <div style={{ padding: '2rem', background: '#F8FAFC', borderRadius: 16, border: `1px dashed ${C.border}`, textAlign: 'center', minWidth: 200 }}>
            <label style={{ ...lblStyle, display: 'block', marginBottom: '0.75rem' }}>Profile Avatar</label>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#F1F8F1', color: C.secondary, fontSize: '2.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>AT</div>
            <button style={{ borderRadius: 8, background: '#fff', color: C.stone, border: `1px solid ${C.border}`, padding: '0.5rem 1rem', width: '100%', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
              <LuCamera /> Change Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main TravelerDashboard ── */
const TravelerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = new URLSearchParams(location.search).get('tab') || 'overview';
  const currentTab = TABS[activeTab] || TABS.overview;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':    return <Overview navigate={navigate} />;
      case 'itineraries': return <MyItineraries navigate={navigate} />;
      case 'shortlist':   return <MyShortlist navigate={navigate} />;
      case 'profile':     return <ManageProfile />;
      default:            return <Overview navigate={navigate} />;
    }
  };

  const TAB_META = {
    overview:    { icon: <LuGlobe />,    subtitle: 'Ready for your next Philippine adventure?' },
    itineraries: { icon: <LuMap />,      subtitle: 'Plan, edit, and export your Philippine adventures.' },
    shortlist:   { icon: <LuBookmark />, subtitle: 'Your saved businesses — the staging area before building itineraries.' },
    profile:     { icon: <LuPen />,      subtitle: 'Update your personal info and travel preferences.' },
  };
  const tabMeta = TAB_META[activeTab] || TAB_META.overview;
  const tabTitle = activeTab === 'overview' ? 'Welcome back!' : currentTab.label;

  return (
    <DashboardLayout activeTabId={activeTab}>
      {/* ── Page Header Banner ── */}
      <div style={{ background: '#fff', borderBottom: `1px solid #EBF0F7`, boxShadow: '0 1px 4px rgba(28,25,23,0.04)', marginBottom: '1.5rem', padding: '1.5rem 2rem', margin: '-2rem -2rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: C.ffDisplay, fontSize: '2.25rem', fontWeight: 700, color: C.ink, letterSpacing: '-0.02em', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '2rem', color: C.secondary, verticalAlign: 'middle' }}>{tabMeta.icon}</span>
              {tabTitle}
            </h1>
            <p style={{ color: C.stoneLight, margin: 0, fontSize: '1rem' }}>{tabMeta.subtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {activeTab === 'overview' && <>
              <button onClick={() => navigate('/directory')} style={{ borderRadius: 10, fontWeight: 600, padding: '0.55rem 1.1rem', background: '#fff', border: `1px solid ${C.border}`, color: C.stone, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit' }}><LuCompass /> Browse Directory</button>
              <button onClick={() => navigate('/itinerary')} style={{ borderRadius: 10, fontWeight: 600, padding: '0.55rem 1.1rem', background: C.secondary, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit' }}><LuPlus /> New Itinerary</button>
            </>}
            {activeTab === 'shortlist' && <button onClick={() => navigate('/directory')} style={{ borderRadius: 10, fontWeight: 600, padding: '0.55rem 1.1rem', background: '#fff', border: `1px solid ${C.border}`, color: C.stone, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit' }}><LuCompass /> Browse More</button>}
            {activeTab === 'itineraries' && <button onClick={() => navigate('/itinerary')} style={{ borderRadius: 10, fontWeight: 600, padding: '0.55rem 1.1rem', background: C.secondary, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit' }}><LuPlus /> New Itinerary</button>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1140 }}>
        <StatsBar />
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default TravelerDashboard;
