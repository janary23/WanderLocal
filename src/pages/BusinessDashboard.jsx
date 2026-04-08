import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LuPen, LuEye, LuBookmark, LuBell, LuMegaphone, LuCamera, LuStore, LuClock, LuCircle, LuMap, LuPlus, LuActivity
} from 'react-icons/lu';

/* ── Color tokens ── */
const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  accent: '#F39C12',
  terracotta: '#E53935',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  stoneLight: '#8D9DB0',
  border: '#DDE3ED',
  bg: '#F7F9FC',
  bgSurface: '#FFFFFF',
  ffDisplay: "'Manrope', sans-serif",
};

/* ── Tab Layout Metadata ── */
const TABS_ARRAY = [
  { id: 'overview', label: 'Overview', icon: <LuStore /> },
  { id: 'engagement', label: 'Analytics', icon: <LuActivity /> },
  { id: 'announcements', label: 'Announcements', icon: <LuMegaphone /> },
  { id: 'profile', label: 'Edit Profile', icon: <LuPen /> },
];

/* ── Common Styles ── */
const cardStyle = { background: C.bgSurface, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden' };
const cardHeaderStyle = { background: 'transparent', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' };
const cardBodyStyle = { padding: '1.5rem' };
const headingStyle = { fontSize: '1.1rem', fontWeight: 700, color: C.ink, display: 'flex', alignItems: 'center', gap: 10, margin: 0 };

/* ── Stats Bar ── */
function StatsBar() {
  const stats = [
    { label: 'Profile Views', value: '1,245', icon: <LuEye />, color: C.secondary, bg: '#F1F8F1', border: '#C3E2BC' },
    { label: 'Shortlist Saves', value: '312', icon: <LuBookmark />, color: C.accent, bg: '#FFF7ED', border: '#FDE68A' },
    { label: 'Itinerary Adds', value: '89', icon: <LuMap />, color: C.primary, bg: '#E8F1F7', border: '#BAD6EA' },
    { label: 'Active Status', value: 'Verified', icon: <LuCircle />, color: C.secondary, bg: '#F1F8F1', border: '#C3E2BC' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ borderRadius: 20, border: `1px solid ${s.border}`, background: s.bg, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: s.color, boxShadow: '0 4px 12px rgba(0,0,0,0.06)', flexShrink: 0 }}>
            {s.icon}
          </div>
          <div>
            <div style={{ fontFamily: C.ffDisplay, fontSize: '1.75rem', fontWeight: 800, color: C.ink, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: s.color, marginTop: 6 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Overview Tab ── */
function OverviewTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '2.5rem' }}>
      {/* ── Left Column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Profile Details Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={headingStyle}><LuStore color={C.secondary} /> Profile Details</h3>
            <button style={{ borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, padding: '0.5rem 1rem', background: '#fff', color: C.ink, border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
               Edit Details
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: '1rem' }}>
                <span style={{ color: C.stone, fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}><LuStore /> Category</span>
                <span style={{ fontWeight: 600, color: C.ink, fontSize: '1rem' }}>Food & Beverage</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: '1rem' }}>
                <span style={{ color: C.stone, fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}><LuClock /> Hours</span>
                <span style={{ fontWeight: 600, color: C.ink, fontSize: '1rem', textAlign: 'right' }}>Mon-Fri: 8AM–8PM<br/>Sat-Sun: 9AM–9PM</span>
              </div>
              <div>
                <span style={{ color: C.stone, fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'block' }}>Highlights & Tags</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Eco-friendly', 'Family-owned', 'Local Heritage'].map(tag => (
                    <span key={tag} style={{ background: '#F4F6F9', color: C.stone, border: `1px solid ${C.border}`, borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={headingStyle}><LuCamera color={C.secondary} /> Photo Gallery</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  'https://picsum.photos/seed/15541188/800/600',
                  'https://picsum.photos/seed/14979355/800/600',
                  'https://picsum.photos/seed/14451165/800/600',
                ].map((url, i) => (
                  <div key={i} style={{ borderRadius: 12, overflow: 'hidden', height: 120 }}>
                    <img src={url} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── Right Column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={headingStyle}><LuBell color={C.primary} /> Highlights & Alerts</h3>
          </div>
          <div>
            <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem', borderBottom: `1px solid ${C.border}`, background: 'rgba(59,130,246,0.03)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>
                <LuMap />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: C.ink, marginBottom: 4 }}>Itinerary Feature</h4>
                <p style={{ color: C.stone, fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>You were added to "Vigan Weekend" public itinerary by a verified traveler.</p>
                <div style={{ fontSize: '0.75rem', color: C.stoneLight, marginTop: 6 }}>2 hours ago</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(243,156,18,0.1)', color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>
                <LuMegaphone />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: C.ink, marginBottom: 4 }}>New Nomination!</h4>
                <p style={{ color: C.stone, fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>A traveler nominated you: "Best hot chocolate in town!" You gained 1 reputation point.</p>
                <div style={{ fontSize: '0.75rem', color: C.stoneLight, marginTop: 6 }}>Yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Analytics Tab ── */
function AnalyticsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
           <h3 style={headingStyle}><LuActivity color={C.primary} /> Engagement Over 30 Days</h3>
        </div>
        <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, background: '#F8FAFC' }}>
           <LuActivity style={{ fontSize: '4rem', color: C.stoneLight, marginBottom: '1.5rem' }} />
           <h4 style={{ fontWeight: 700, color: C.ink, marginBottom: 8, fontSize: '1.25rem' }}>No data visualization available yet</h4>
           <p style={{ color: C.stone, fontSize: '1rem' }}>Check back soon for detailed insights and charts.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Announcements Tab ── */
function AnnouncementsTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={headingStyle}><LuMegaphone color={C.primary} /> Post an Announcement</h3>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: C.stone, fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>Post seasonal promos, holiday hours, or temporary closure notices directly to your profile page.</p>
          <textarea
            rows={6}
            placeholder="E.g., We will be closed on December 25th for the holidays…"
            style={{ width: '100%', borderRadius: 12, border: `1px solid ${C.border}`, padding: '1rem', color: C.ink, outline: 'none', fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical' }}
          />
          <button style={{ width: '100%', fontWeight: 700, color: '#fff', background: C.secondary, border: 'none', borderRadius: 12, padding: '1rem', marginTop: '1.5rem', fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            Publish Announcement
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.25rem', color: C.ink, margin: 0 }}>Active Announcements</h3>
        <div style={{ borderRadius: 16, border: '1px solid #FDE68A', background: '#FFFBEB', padding: '1.5rem' }}>
          <p style={{ color: '#92400E', fontSize: '1.05rem', fontStyle: 'italic', margin: '0 0 1rem', lineHeight: 1.6, fontWeight: 500 }}>
            "Try our new local tablea hot chocolate available this rainy season only! Ask our staff for the hidden menu."
          </p>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#B45309', fontWeight: 600 }}>Posted 2 days ago</div>
        </div>
      </div>
    </div>
  );
}

/* ── Profile Placeholder ── */
function ProfilePlaceholder() {
  return (
    <div style={cardStyle}>
      <div style={{ padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textCenter: 'center', minHeight: 400, background: '#F8FAFC' }}>
        <LuPen style={{ fontSize: '3rem', color: C.stoneLight, marginBottom: '1rem' }} />
        <h3 style={{ fontWeight: 700, color: C.ink, fontSize: '1.5rem', marginBottom: 8 }}>Edit Profile</h3>
        <p style={{ color: C.stone, fontSize: '1rem' }}>The profile editing tools are currently under maintenance.</p>
      </div>
    </div>
  );
}

const BusinessDashboard = () => {
  return (
    <DashboardLayout activeTabId="overview">
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '3rem 2rem' }}>

        {/* Modern Header Section */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', margin: '0 0 0.5rem' }}>
              Cafe Amore Hub
            </h1>
            <p style={{ color: C.stone, margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              Business Overview Dashboard
              <span style={{ background: '#D1FAE5', color: '#10B981', padding: '4px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <LuCircle size={10} /> Verified
              </span>
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <StatsBar />

        {/* Stack the actual Overview Content */}
        <OverviewTab />

      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;
