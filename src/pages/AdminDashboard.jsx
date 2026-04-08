import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LuUsers, LuPackage, LuCircle, LuSettings, LuShieldCheck, LuTrash2, LuEye, LuCheck, LuX, LuFilter, LuSearch
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
  { id: 'queue', label: 'Verifications', icon: <LuShieldCheck /> },
  { id: 'nominations', label: 'Nominations', icon: <LuCircle /> },
  { id: 'integrity', label: 'Directory', icon: <LuPackage /> },
  { id: 'users', label: 'Users', icon: <LuUsers /> },
  { id: 'settings', label: 'Platform', icon: <LuSettings /> },
];

/* ── Common Styles ── */
const cardStyle = { background: C.bgSurface, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden' };
const cardHeaderStyle = { background: 'transparent', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' };
const headingStyle = { fontSize: '1.1rem', fontWeight: 700, color: C.ink, display: 'flex', alignItems: 'center', gap: 10, margin: 0 };

/* ── Stats Bar ── */
function StatsBar() {
  const stats = [
    { label: 'Pending Verifications', value: '14', icon: <LuShieldCheck />, color: C.accent, bg: '#FFF7ED', border: '#FDE68A' },
    { label: 'New Nominations', value: '38', icon: <LuCircle />, color: C.primary, bg: '#E8F1F7', border: '#BAD6EA' },
    { label: 'Total Listings', value: '1,204', icon: <LuPackage />, color: C.secondary, bg: '#F1F8F1', border: '#C3E2BC' },
    { label: 'Registered Users', value: '5.2k', icon: <LuUsers />, color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
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

/* ── Verifications Queue Tab ── */
function VerificationsTab() {
  const MOCK_QUEUE = [
    { id: 1, name: 'Palawan Dive Shop', type: 'Experience', location: 'El Nido', date: '2 hours ago', status: 'Pending Review' },
    { id: 2, name: 'Baguio Highland Beans', type: 'Food', location: 'Baguio City', date: '5 hours ago', status: 'Docs Uploaded' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={headingStyle}><LuShieldCheck color={C.accent} /> Verification Queue</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F4F6F9', borderRadius: 8, padding: '0.25rem 0.5rem', border: `1px solid ${C.border}` }}>
              <LuSearch color={C.stone} size={14} style={{ margin: '0 0.5rem' }} />
              <input type="text" placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: 120, fontFamily: 'inherit' }} />
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}`, background: '#F8FAFC' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: C.stone, fontSize: '0.85rem' }}>Business Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: C.stone, fontSize: '0.85rem' }}>Type & Location</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: C.stone, fontSize: '0.85rem' }}>Submitted</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: C.stone, fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: C.stone, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_QUEUE.map((item, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.95rem' }}>{item.name}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: C.stone, fontSize: '0.85rem' }}>{item.type} • {item.location}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: C.stone, fontSize: '0.85rem' }}>{item.date}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ background: '#FFF7ED', color: C.accent, padding: '4px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>{item.status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, padding: '0.4rem 0.75rem', color: C.ink, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>Review Auth</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Generic Placeholder ── */
function PlaceholderTab({ title, icon: Icon }) {
  return (
    <div style={cardStyle}>
      <div style={{ padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textCenter: 'center', minHeight: 400, background: '#F8FAFC' }}>
        <Icon style={{ fontSize: '4rem', color: C.stoneLight, marginBottom: '1.5rem' }} />
        <h3 style={{ fontWeight: 700, color: C.ink, fontSize: '1.5rem', marginBottom: 8 }}>{title} Management</h3>
        <p style={{ color: C.stone, fontSize: '1rem' }}>This section is currently under construction.</p>
      </div>
    </div>
  );
}

/* ─── Main AdminDashboard ── */
const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = new URLSearchParams(location.search).get('tab') || 'queue';
  
  const handleTabChange = (tabId) => {
    navigate(`/admin${tabId === 'queue' ? '' : `?tab=${tabId}`}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'queue':       return <VerificationsTab />;
      case 'nominations': return <PlaceholderTab title="Nominations" icon={LuCircle} />;
      case 'integrity':   return <PlaceholderTab title="Directory Integrity" icon={LuPackage} />;
      case 'users':       return <PlaceholderTab title="User" icon={LuUsers} />;
      case 'settings':    return <PlaceholderTab title="Platform Settings" icon={LuSettings} />;
      default:            return <VerificationsTab />;
    }
  };

  return (
    <DashboardLayout activeTabId={activeTab}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '3rem 2rem' }}>

        {/* Modern Header Section */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', margin: '0 0 0.5rem' }}>
              System Command
            </h1>
            <p style={{ color: C.stone, margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              Admin Moderation & Quality Control
              <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <LuShieldCheck size={12} /> Root Access
              </span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: `1px solid ${C.border}`, marginBottom: '2.5rem', overflowX: 'auto' }}>
          {TABS_ARRAY.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  background: 'transparent', border: 'none', padding: '0 0 1rem 0',
                  color: isActive ? C.ink : C.stone, fontWeight: isActive ? 700 : 500,
                  fontSize: '1rem', cursor: 'pointer', transition: 'color 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  borderBottom: isActive ? `3px solid ${C.ink}` : '3px solid transparent',
                  fontFamily: 'inherit'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stats Bar */}
        <StatsBar />

        {/* Content Tabs */}
        <div>
          {renderContent()}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
