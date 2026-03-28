import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LuPen, LuEye, LuBookmark, LuPlus, LuBell, LuMegaphone, LuCamera, LuStore, LuClock, LuCircle, LuMap, LuChevronRight
} from 'react-icons/lu';

/* ── Tab metadata ── */
const TABS = {
  overview:      { label: 'Overview',       icon: <LuStore /> },
  engagement:    { label: 'Analytics',      icon: <LuCircle /> },
  announcements: { label: 'Announcements',  icon: <LuMegaphone /> },
  profile:       { label: 'Edit Profile',   icon: <LuPen /> },
};

/* ── Stats Bar ── */
function StatsBar() {
  const stats = [
    { label: 'Profile Views',   value: '1,245', icon: <LuEye />,      color: 'var(--secondary)', bg: 'var(--primary-alt-pale)', border: 'var(--primary-alt-border)' },
    { label: 'Shortlist Saves', value: '312',   icon: <LuBookmark />, color: 'var(--accent)',    bg: '#FFF7ED',                 border: '#FDE68A' },
    { label: 'Itinerary Adds',  value: '89',    icon: <LuMap />,      color: 'var(--primary)',   bg: 'var(--primary-pale)',     border: 'var(--primary-border)' },
    { label: 'Verified Status', value: 'Active',icon: <LuCircle />,   color: 'var(--terracotta)',bg: 'var(--terra-pale)',       border: 'var(--terra-border)' },
  ];
  return (
    <div className="row g-3 mb-4">
      {stats.map((s, i) => (
        <div className="col-6 col-xl-3" key={i}>
          <div className="card border-0 h-100" style={{ borderRadius: 16, border: `1px solid ${s.border}` || 'transparent', background: s.bg, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="card-body d-flex align-items-center gap-3">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', color: s.color, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div className="fw-bold lh-1" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--ink)' }}>{s.value}</div>
                <div className="mt-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, color: s.color }}>{s.label}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Overview Tab ── */
function Overview({ navigate }) {
  return (
    <div className="row g-4">
      {/* ── Left: Profile & Gallery ── */}
      <div className="col-lg-7 d-flex flex-column gap-4">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3 px-4">
            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <LuStore style={{ color: 'var(--secondary)' }} /> Profile Details
            </h6>
            <button className="btn btn-sm btn-light border fw-semibold" style={{ borderRadius: 8, fontSize: '0.78rem' }}>
               <LuPen className="me-1" /> Edit
            </button>
          </div>
          <div className="card-body p-4">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}><LuStore className="me-1"/> Category</span>
                <span className="fw-semibold" style={{ color: 'var(--ink)', fontSize: '0.9rem' }}>Food & Beverage</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted fw-bold" style={{ fontSize: '0.85rem' }}><LuClock className="me-1"/> Hours</span>
                <span className="fw-semibold text-end" style={{ color: 'var(--ink)', fontSize: '0.9rem' }}>Mon-Fri: 8AM–8PM<br/>Sat-Sun: 9AM–9PM</span>
              </div>
              <div>
                <span className="text-muted fw-bold mb-2 d-block" style={{ fontSize: '0.85rem' }}>Tags</span>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge" style={{ background: 'var(--bg-sand)', color: 'var(--stone)', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600 }}>Eco-friendly</span>
                  <span className="badge" style={{ background: 'var(--bg-sand)', color: 'var(--stone)', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600 }}>Family-owned</span>
                  <span className="badge" style={{ background: 'var(--bg-sand)', color: 'var(--stone)', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 600 }}>Local Heritage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3 px-4">
            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <LuCamera style={{ color: 'var(--secondary)' }} /> Photo Gallery
            </h6>
          </div>
          <div className="card-body p-4">
             <div className="row g-2">
                {[
                  'https://picsum.photos/seed/15541188/800/600',
                  'https://picsum.photos/seed/14979355/800/600',
                  'https://picsum.photos/seed/14451165/800/600',
                ].map((url, i) => (
                  <div className="col-4" key={i}>
                    <img src={url} alt={`Gallery ${i + 1}`} className="img-fluid rounded-3 w-100" style={{ height: '90px', objectFit: 'cover' }} />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── Right: Highlights & Alerts ── */}
      <div className="col-lg-5 d-flex flex-column gap-4">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3 px-4">
            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <LuBell style={{ color: 'var(--primary-mid)' }} /> Highlights & Alerts
            </h6>
          </div>
          <div className="card-body p-0">
            <div className="d-flex align-items-start gap-3 p-3 border-bottom" style={{ background: 'rgba(59,130,246,0.03)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: 'var(--primary-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                <LuMap />
              </div>
              <div>
                <h6 className="mb-1 fw-bold" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>Itinerary Feature</h6>
                <p className="mb-0 text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>You were added to "Vigan Weekend" public itinerary.</p>
                <span style={{ fontSize: '0.72rem', color: 'var(--stone-light)', marginTop: 4, display: 'block' }}>2 hours ago</span>
              </div>
            </div>
            <div className="d-flex align-items-start gap-3 p-3 border-bottom">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>
                <LuMegaphone />
              </div>
              <div>
                <h6 className="mb-1 fw-bold" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>New Nomination!</h6>
                <p className="mb-0 text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>A traveler nominated you: "Best hot chocolate in town!"</p>
                <span style={{ fontSize: '0.72rem', color: 'var(--stone-light)', marginTop: 4, display: 'block' }}>Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Analytics Tab ── */
function Analytics() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom py-3 px-4 d-flex align-items-center gap-2">
             <LuCircle style={{ color: 'var(--primary-mid)' }} />
             <h6 className="mb-0 fw-bold" style={{ color: 'var(--ink)' }}>Engagement Over 30 Days</h6>
          </div>
          <div className="card-body p-5 d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight: 400, background: 'var(--bg-sand)' }}>
             <LuCircle style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--border)' }} />
             <p className="fw-semibold mb-0">Chart Visualization Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Announcements Tab ── */
function Announcements() {
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom py-3 px-4 d-flex align-items-center gap-2">
            <LuMegaphone style={{ color: 'var(--primary-mid)' }} />
            <h6 className="mb-0 fw-bold">Post an Announcement</h6>
          </div>
          <div className="card-body p-4">
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Post seasonal promos, holiday hours, or temporary closure notices directly to your profile page.</p>
            <textarea
              className="form-control fw-semibold"
              rows={5}
              placeholder="E.g., We will be closed on December 25th for the holidays…"
              style={{ borderRadius: 8, border: '1px solid var(--border)', padding: '0.75rem', color: 'var(--ink)' }}
            />
            <button className="btn fw-bold text-white w-100 mt-4" style={{ borderRadius: 8, background: 'var(--secondary)', padding: '0.75rem' }}>
              Publish Announcement
            </button>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
         <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom py-3 px-4 d-flex align-items-center gap-2">
            <h6 className="mb-0 fw-bold">Active Announcements</h6>
          </div>
          <div className="card-body p-4">
            <div className="p-3 border rounded-3 mb-3" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
              <p className="mb-2 fw-semibold" style={{ color: '#92400E', fontSize: '0.9rem', fontStyle: 'italic' }}>
                "Try our new local tablea hot chocolate available this rainy season only!"
              </p>
              <div className="text-end" style={{ fontSize: '0.72rem', color: '#B45309' }}>Posted 2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Profile Placeholder ── */
function ProfilePlaceholder() {
  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
      <div className="card-body p-5 d-flex flex-column align-items-center justify-content-center text-center text-muted" style={{ minHeight: 400 }}>
        <h5 className="fw-bold mb-2">Edit Profile</h5>
        <p className="mb-0">This section is coming soon.</p>
      </div>
    </div>
  );
}

/* ─── Main BusinessDashboard ── */
const BusinessDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = new URLSearchParams(location.search).get('tab') || 'overview';
  const currentTab = TABS[activeTab] || TABS.overview;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':      return <Overview navigate={navigate} />;
      case 'engagement':    return <Analytics />;
      case 'announcements': return <Announcements />;
      case 'profile':       return <ProfilePlaceholder />;
      default:              return <Overview navigate={navigate} />;
    }
  };

  return (
    <DashboardLayout activeTabId={activeTab}>
      <div className="db-page" style={{ maxWidth: 1140 }}>

        {/* ── Page Header ── */}
        <div className="d-flex align-items-start align-items-sm-center justify-content-between gap-3 flex-wrap mb-2">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.75rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              {currentTab.label}
            </h1>
            <p className="text-muted mb-0 d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
              Managing profile for <strong className="text-dark">Cafe Amore</strong>
              <span className="badge rounded-pill fw-bold" style={{ background: '#D1FAE5', color: '#10B981', fontSize: '0.7rem' }}>
                <LuCircle style={{ fontSize: '0.6rem', marginRight: 4 }} /> Verified
              </span>
            </p>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              style={{ borderRadius: 10, fontWeight: 600 }}>
              <LuEye /> View Public Profile
            </button>
            <button className="btn btn-sm d-flex align-items-center gap-2 text-white"
              style={{ borderRadius: 10, fontWeight: 600, background: 'var(--secondary)' }}>
              <LuPen /> Edit Profile
            </button>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <StatsBar />

        {/* ── Tab Content ── */}
        {renderContent()}

      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;
