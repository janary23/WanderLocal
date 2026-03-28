import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LuHouse, LuMap, LuBookmark, LuBell, LuCompass, LuCamera, LuCircle, LuUsers, LuPackage, LuStore, LuMegaphone, LuEye, LuPen, LuLogOut, LuMenu, LuX, LuChevronRight, LuSettings, LuSearch
} from 'react-icons/lu';
import logoImg from '../assets/WanderLocalLogo.png';

// ─── Role-specific menu configs ─────────────────────────────
const MENUS = {
  traveler: [
    { id: 'overview',    label: 'Overview',        icon: <LuHouse />,     path: '/dashboard' },
    { id: 'itineraries', label: 'My Itineraries',  icon: <LuMap />,      path: '/itinerary' },
    { id: 'shortlist',   label: 'My Shortlist',    icon: <LuBookmark />, path: '/dashboard?tab=shortlist' },
    { id: 'profile',     label: 'Manage Profile',  icon: <LuPen />,      path: '/dashboard?tab=profile' },
    { id: 'directory',   label: 'Directory',       icon: <LuCompass />,  path: '/directory' },
    { id: 'gallery',     label: 'Community Gallery',icon: <LuCamera />,  path: '/gallery' },
  ],
  business: [
    { id: 'overview',     label: 'Overview',        icon: <LuHouse />,        path: '/business-dashboard' },
    { id: 'engagement',   label: 'Analytics',       icon: <LuCircle />,   path: '/business-dashboard?tab=engagement' },
    { id: 'announcements',label: 'Announcements',   icon: <LuMegaphone />,    path: '/business-dashboard?tab=announcements' },
    { id: 'profile',      label: 'Edit Profile',    icon: <LuPen />,        path: '/business-dashboard?tab=profile' },
    { id: 'highlights',   label: 'Alerts',          icon: <LuBell />,        path: '/business-dashboard?tab=highlights' },
    { id: 'view',         label: 'View Listing',    icon: <LuEye />,         path: '/directory' },
  ],
  admin: [
    { id: 'queue',       label: 'Verification Queue',   icon: <LuCircle />,       path: '/admin' },
    { id: 'nominations', label: 'Nominations',          icon: <LuCircle />,path: '/admin?tab=nominations' },
    { id: 'integrity',   label: 'Directory Integrity',  icon: <LuPackage />,           path: '/admin?tab=integrity' },
    { id: 'users',       label: 'User Management',      icon: <LuUsers />,             path: '/admin?tab=users' },
    { id: 'analytics',   label: 'Analytics',            icon: <LuCircle />,         path: '/admin?tab=analytics' },
    { id: 'settings',    label: 'Settings',             icon: <LuSettings />,               path: '/admin?tab=settings' },
  ],
};

const ROLE_META = {
  traveler: { label: 'Traveler', color: 'var(--secondary)', bg: 'var(--primary-alt-pale)', badge: '' },
  business: { label: 'Business Owner', color: 'var(--accent)', bg: 'var(--accent-pale)', badge: '' },
  admin: { label: 'Administrator', color: 'var(--terracotta)', bg: 'var(--terra-pale)', badge: '️' },
};

// ─── Inline Styles ───────────────────────────────────────────

const shellStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: '#F2F5F9',
  fontFamily: "'Inter', sans-serif",
  position: 'relative',
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(28, 25, 23, 0.45)',
  zIndex: 199,
};

const sidebarBase = {
  width: '260px',
  minHeight: '100vh',
  background: '#ffffff',
  borderRight: '1px solid #DDE3ED',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 200,
  transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
  overflowY: 'auto',
  overflowX: 'hidden',
  boxShadow: '4px 0 24px rgba(15, 30, 45, 0.15)',
};

const sidebarNavStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0.5rem 0.75rem',
  flex: 1,
  gap: '0.2rem',
};

const sidebarNavLabelStyle = {
  fontSize: '0.62rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#8D9DB0',
  fontWeight: 700,
  padding: '0.5rem 0.75rem 0.25rem',
};

const navItemBase = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  width: '100%',
  padding: '0.72rem 0.85rem',
  borderRadius: '10px',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#5F6B7A',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.18s',
  position: 'relative',
  fontFamily: 'inherit',
};

const navItemActive = {
  ...navItemBase,
  background: '#4A90C2',
  color: '#fff',
  fontWeight: 600,
};

const navItemHovered = {
  ...navItemBase,
  background: '#E8F1F7',
  color: '#3A75A0',
};

const navItemIconStyle = {
  fontSize: '0.95rem',
  flexShrink: 0,
  opacity: 0.75,
};

const navItemIconActiveStyle = {
  ...navItemIconStyle,
  opacity: 1,
};

const mainStyle = {
  flex: 1,
  marginLeft: '260px',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const headerStyle = {
  height: '64px',
  background: '#fff',
  borderBottom: '1px solid #EBF0F7',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0 2rem',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: '0 1px 4px rgba(28,25,23,0.04)',
};

const hamburgerBase = {
  width: '38px',
  height: '38px',
  borderRadius: '6px',
  border: '1.5px solid #DDE3ED',
  background: 'transparent',
  color: '#5F6B7A',
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.18s',
  flexShrink: 0,
  fontFamily: 'inherit',
};

const headerActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginLeft: 'auto',
};

const iconBtnBase = {
  width: '38px',
  height: '38px',
  borderRadius: '6px',
  border: '1.5px solid #DDE3ED',
  background: 'transparent',
  color: '#5F6B7A',
  fontSize: '0.9rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.18s',
  position: 'relative',
  fontFamily: 'inherit',
};

const iconBtnBadgeStyle = {
  position: 'absolute',
  top: '-4px',
  right: '-4px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: '#E53935',
  color: '#fff',
  fontSize: '0.6rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const userChipBase = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.3rem 0.75rem 0.3rem 0.3rem',
  borderRadius: '999px',
  background: '#E8F1F7',
  border: '1.5px solid #BAD6EA',
  cursor: 'pointer',
  transition: 'all 0.18s',
};

const userAvatarStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  background: '#F39C12',
  color: '#fff',
  fontSize: '0.65rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  letterSpacing: '0.04em',
};

const userNameStyle = {
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '#4A90C2',
};

const contentStyle = {
  flex: 1,
  padding: '2rem',
  minWidth: 0,
};

// ─── DashboardLayout ────────────────────────────────────────
const DashboardLayout = ({ children, activeTabId, hideSearch }) => {
  const { userRole, userName, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menu = MENUS[userRole] || MENUS.traveler;
  const meta = ROLE_META[userRole] || ROLE_META.traveler;

  const isActive = (item) => {
    if (activeTabId) return item.id === activeTabId;
    return false;
  };

  const handleNav = (item) => {
    navigate(item.path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sidebarStyle = {
    ...sidebarBase,
    transform: sidebarOpen ? 'translateX(0)' : undefined,
  };

  return (
    <div style={shellStyle}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div style={overlayStyle} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside style={sidebarStyle}>
        {/* Brand */}
        <div
          style={{ justifyContent: 'center', padding: '1.5rem 1rem 0.5rem', height: '100px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img src={logoImg} alt="WanderLocal" style={{ width: '150px', height: 'auto', transform: 'scale(1.1)', transformOrigin: 'center' }} />
        </div>

        {/* Navigation */}
        <nav style={sidebarNavStyle}>
          <p style={sidebarNavLabelStyle}>Navigation</p>
          {menu.map(item => {
            const active = isActive(item);
            const hovered = hoveredItem === item.id && !active;
            const itemStyle = active ? navItemActive : hovered ? navItemHovered : navItemBase;
            return (
              <button
                key={item.id}
                style={itemStyle}
                onClick={() => handleNav(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={active ? navItemIconActiveStyle : navItemIconStyle}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && <LuChevronRight style={{ fontSize: '0.75rem', opacity: 0.5 }} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main area ─────────────────────────────────────── */}
      <div style={mainStyle}>
        {/* Top Header */}
        <header style={headerStyle}>
          <button
            style={hamburgerBase}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <LuX /> : <LuMenu />}
          </button>

          <div style={headerActionsStyle}>
            <div style={{ position: 'relative' }}>
              <button
                style={iconBtnBase}
                title="Notifications"
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              >
                <LuBell />
                <span style={iconBtnBadgeStyle}>3</span>
              </button>
              {notifOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, width: 320, background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #DDE3ED', zIndex: 100, marginTop: 12, padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h6 style={{ fontSize: '0.9rem', color: '#0F1E2D', fontWeight: 700, margin: 0 }}>Notifications</h6>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#5F6B7A', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid #EBF0F7' }}>
                      <strong style={{ color: '#0F1E2D' }}>Nomination Verified!</strong><br />The business "Joe's Diner" you nominated is now officially on WanderLocal.
                    </div>
                    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid #EBF0F7' }}>
                      <strong style={{ color: '#0F1E2D' }}>Itinerary Cloned</strong><br />A traveler cloned your "Vigan Heritage Tour".
                    </div>
                    <div style={{ padding: '0.75rem 0' }}>
                      <strong style={{ color: '#0F1E2D' }}>New Suggestion</strong><br />Check out "Batanes in a Weekend".
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={userChipBase}
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              >
                <div style={userAvatarStyle}>{initials}</div>
                <span style={userNameStyle}>{userName}</span>
              </div>
              {profileOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, width: 220, background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #DDE3ED', zIndex: 100, marginTop: 12, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button onClick={() => { setProfileOpen(false); navigate(`${menu[0].path.split('?')[0]}?tab=profile`); }} style={{ background: 'transparent', border: 'none', textAlign: 'left', padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#0F1E2D', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit' }}>
                    <LuPen style={{ fontSize: '1rem', color: '#5F6B7A' }} /> Manage Profile
                  </button>
                  <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', textAlign: 'left', padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#E53935', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit' }}>
                    <LuLogOut style={{ fontSize: '1rem' }} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={contentStyle}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
