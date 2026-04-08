import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LuMapPin, LuBookmark, LuBell, LuPlus, LuShare2, LuGlobe, LuCircle, LuCopy, LuPen, LuLock, LuCompass, LuMap, LuMessageCircle, LuUser, LuShield
} from 'react-icons/lu';

/* ── Color tokens ── */
const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  accent: '#F39C12',
  terracotta: '#E53935',
  ink: '#0F1E2D',
  inkDark: '#222222',
  stone: '#5F6B7A',
  stoneLight: '#8D9DB0',
  border: '#DDE3ED',
  bgSurface: '#FFFFFF',
  ffBody: "'Inter', sans-serif",
  ffDisplay: "'Manrope', sans-serif",
};

/* ── Mock data ── */
const MOCK_ITINERARIES = [
  { id: 1, title: 'Baguio Weekend Escape', dest: 'Baguio City', days: 3, stops: 12, status: 'draft', visibility: 'private', img: 'https://picsum.photos/seed/15967078/800/600', updatedAt: '2 hours ago' },
  { id: 2, title: 'Vigan Heritage Tour', dest: 'Vigan, Ilocos Sur', days: 2, stops: 8, status: 'completed', visibility: 'public', img: 'https://picsum.photos/seed/15632007/800/600', updatedAt: '3 days ago', clonedBy: 5 },
];

const MOCK_SHORTLIST = [
  { id: 1, name: 'Cafe Amore', city: 'Baguio City', type: 'Food & Beverage', img: 'https://picsum.photos/seed/15541188/800/600' },
  { id: 2, name: 'Vigan Heritage Walk', city: 'Vigan, Ilocos Sur', type: 'Attraction', img: 'https://picsum.photos/seed/15967078/800/600' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: <LuCircle />, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', title: 'Nomination Verified!', desc: 'The business "Joe\'s Diner" you nominated is now officially on WanderLocal.', time: '2 hours ago', unread: true },
  { id: 2, icon: <LuCopy />, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', title: 'Itinerary Cloned', desc: 'A traveler cloned your "Vigan Heritage Tour". Happy planning!', time: 'Yesterday', unread: true },
];

const STATUS_STYLE = {
  draft: { bg: '#F1F8F1', color: '#5FAE4B', label: 'Draft' },
  active: { bg: '#E8F1F7', color: '#3A75A0', label: 'Active' },
  completed: { bg: '#FFEBEE', color: '#E53935', label: 'Completed' },
};
const VIS_ICON = { private: <LuLock />, public: <LuGlobe />, link: <LuShare2 /> };

/* ── Main TravelerDashboard router ── */
const TravelerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = new URLSearchParams(location.search).get('tab') || 'overview';

  // Just render the awesome full-page Dashboard with modules stacked!
  return (
    <DashboardLayout>
      <MainDashboardContent navigate={navigate} />
    </DashboardLayout>
  );
};


const MainDashboardContent = ({ navigate }) => {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '3rem 2rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', margin: '0 0 0.5rem' }}>
            Welcome back, Alex.
          </h1>
          <p style={{ color: C.stone, margin: 0, fontSize: '1.1rem' }}>Plan your next breathtaking Philippine adventure.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/itinerary')} style={{ borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', padding: '0.75rem 1.5rem', background: C.secondary, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 12px rgba(95, 174, 75, 0.25)', transition: 'transform 0.2s', fontFamily: 'inherit' }}>
            <LuPlus /> New Itinerary
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2.5rem' }}>
        {/* Left Column (Main Modules Stacked) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Quick Actions Base Module */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {[
              { icon: <LuCompass size={24} />, title: 'Find Places', desc: 'Browse the directory', path: '/directory', color: C.primary, bg: '#E8F1F7' },
              { icon: <LuMap size={24} />, title: 'Itineraries', desc: 'Manage your trips', path: '#itineraries', color: C.secondary, bg: '#EAF4E8' },
              { icon: <LuBookmark size={24} />, title: 'Saved', desc: 'View your shortlist', path: '#shortlist', color: C.accent, bg: '#FFF7ED' }
            ].map((item, i) => (
              <div key={i} onClick={() => document.getElementById(item.path.substring(1))?.scrollIntoView({ behavior: 'smooth' })} style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {item.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: C.ink, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: '0.85rem', color: C.stone }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* My Itineraries Module Stacked */}
          <div id="itineraries" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', scrollMarginTop: '100px' }}>
            <h2 style={{ fontFamily: C.ffDisplay, fontSize: '1.75rem', fontWeight: 800, color: C.ink, margin: 0 }}>My Trips</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {MOCK_ITINERARIES.map((trip, i) => (
                <div key={i} style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, cursor: 'pointer', background: '#fff', transition: 'box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 200, position: 'relative' }}>
                    <img src={trip.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.title} />
                    <div style={{ position: 'absolute', top: 16, left: 16, background: STATUS_STYLE[trip.status].bg, color: STATUS_STYLE[trip.status].color, padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>{STATUS_STYLE[trip.status].label}</div>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: C.ink, marginBottom: 8 }}>{trip.title}</div>
                    <div style={{ fontSize: '0.9rem', color: C.stone, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}><LuMapPin color={C.secondary} /> {trip.dest}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Places Module Stacked */}
          <div id="shortlist" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', scrollMarginTop: '100px' }}>
            <h2 style={{ fontFamily: C.ffDisplay, fontSize: '1.75rem', fontWeight: 800, color: C.ink, margin: 0 }}>Saved Places</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {MOCK_SHORTLIST.map((place, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, background: '#fff' }}>
                  <div style={{ height: 160 }}>
                    <img src={place.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={place.name} />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: C.ink, marginBottom: 4 }}>{place.name}</div>
                    <div style={{ fontSize: '0.85rem', color: C.stone, marginBottom: 16 }}>{place.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Notifications + Side Widgets) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ background: C.bgSurface, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ background: 'transparent', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.ink, margin: 0 }}><LuBell style={{ color: C.primary, marginRight: 8 }} /> Notifications</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {MOCK_NOTIFICATIONS.map(n => (
                <div key={n.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: n.bg, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: C.ink, marginBottom: 4 }}>{n.title}</div>
                    <div style={{ fontSize: '0.85rem', color: C.stone, lineHeight: 1.5, marginBottom: 4 }}>{n.desc}</div>
                    <div style={{ fontSize: '0.75rem', color: C.stoneLight }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};



export default TravelerDashboard;
