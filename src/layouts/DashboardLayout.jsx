import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LuHouse, LuMap, LuBookmark, LuBell, LuCompass, LuCamera, LuCircle, LuUsers, LuPackage, LuSettings, LuSearch, LuUser, LuLogOut, LuHeart, LuMessageSquare, LuStore, LuGlobe, LuInfo, LuChevronDown, LuStar, LuZap
} from 'react-icons/lu';
import logoImg from '../assets/WanderLocalLogo.png';
import LanguageCurrencyModal from '../components/LanguageCurrencyModal';
import { tokens } from '../inlineStyles';

const MENUS = {
  traveler: [
    { id: 'overview', label: 'Overview', icon: <LuHouse />, path: '/dashboard' },
    { id: 'itineraries', label: 'Trips', icon: <LuMap />, path: '/trips' },
    { id: 'shortlist', label: 'Wishlists', icon: <LuBookmark />, path: '/wishlists' },
    { id: 'profile', label: 'Profile', icon: <LuUser />, path: '/profile' },
    { id: 'divider-1', divider: true },
    { id: 'settings', label: 'Account Settings', icon: <LuSettings />, path: '/account-settings' },
    { id: 'language', label: 'Languages & Currency', icon: <LuGlobe />, isModal: true },
    { id: 'help', label: 'Help Center', icon: <LuInfo />, path: '/help' },
    { id: 'divider-2', divider: true },
    { id: 'host-banner', isBanner: true, title: 'List a business', desc: 'Own a local gem? Claim it or list a new one today.', path: '/onboarding' },
  ],
  business: [
    { id: 'overview',   label: 'Overview',              icon: <LuHouse />,         path: '/business' },
    { id: 'listings',   label: 'My Listings',           icon: <LuStore />,         path: '/business/listings' },
    { id: 'bookings',   label: 'Manage Bookings',       icon: <LuCircle />,        path: '/business/bookings' },
    { id: 'reviews',    label: 'Reviews',               icon: <LuMessageSquare />, path: '/business/reviews' },
    { id: 'divider-1',  divider: true },
    { id: 'settings',   label: 'Business Settings',     icon: <LuSettings />,      path: '/business/settings' },
    { id: 'help',       label: 'Help Center',           icon: <LuInfo />,          path: '/help' },
    { id: 'divider-2',  divider: true },
    { id: 'host-banner', isBanner: true, title: 'Add new business', desc: 'Expand your portfolio by registering another listing.', path: '/onboarding' }
  ],
  admin: [
    { id: 'queue',       label: 'Queue',                icon: <LuCircle />,       path: '/admin' },
    { id: 'nominations', label: 'Nominations',          icon: <LuStar />,         path: '/admin?tab=nominations' },
    { id: 'integrity',   label: 'Directory',            icon: <LuPackage />,      path: '/admin?tab=integrity' },
    { id: 'users',       label: 'Users',                icon: <LuUsers />,        path: '/admin?tab=users' },
    { id: 'settings',    label: 'Settings',             icon: <LuSettings />,     path: '/admin?tab=settings' },
    { id: 'help',        label: 'Help Center',          icon: <LuInfo />,         path: '/help' },
  ],
};

const DashboardLayout = ({ children, activeTabId }) => {
  const { userRole, userName, logout, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menu = MENUS[userRole] || MENUS.traveler;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e) => {
      if (!e.target.closest('#profile-dropdown-root')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = userName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const roleColor = userRole === 'business' ? '#5A8BA8' : userRole === 'admin' ? '#6B4C9A' : '#1A5F7A';
  const roleGrad  = userRole === 'business'
    ? 'linear-gradient(135deg, #5A8BA8 0%, #3C5D70 100%)'
    : userRole === 'admin'
    ? 'linear-gradient(135deg, #6B4C9A 0%, #402863 100%)'
    : 'linear-gradient(135deg, #1A5F7A 0%, #0F3847 100%)';

  return (
    <div style={{ 
      minHeight: '100vh', background: '#FDFBF7', fontFamily: '"Inter", sans-serif', display: 'flex', flexDirection: 'column', position: 'relative',
      '--color-primary': tokens.colorPrimary,
      '--color-primary-pale': tokens.colorPrimaryPale,
      '--color-secondary': tokens.colorSecondary,
      '--color-secondary-alt': tokens.colorSecondaryAlt,
      '--color-accent': tokens.colorAccent,
      '--color-accent-pale': tokens.colorAccentPale,
      '--color-ink': tokens.colorInk,
      '--color-stone': tokens.colorStone,
      '--color-stone-light': tokens.colorStoneLight,
      '--color-sand': tokens.colorSand,
      '--color-surface': tokens.colorSurface,
      '--color-border': tokens.colorBorder,
      '--glass-bg': tokens.glassBg,
      '--glass-blur': tokens.glassBlur,
      '--glass-border': tokens.glassBorder,
      '--radius-sm': tokens.radiusSm,
      '--radius-md': tokens.radiusMd,
      '--radius-lg': tokens.radiusLg,
      '--radius-pill': tokens.radiusPill,
      '--shadow-xs': tokens.shadowXs,
      '--shadow-sm': tokens.shadowSm,
      '--shadow-md': tokens.shadowMd,
      '--shadow-float': tokens.shadowFloat,
      '--font-display': tokens.fontDisplay,
      '--font-body': tokens.fontBody,
      '--mesh-ocean': 'radial-gradient(at 0% 100%, hsla(197,65%,29%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(197,40%,49%,1) 0, transparent 50%), radial-gradient(at 50% 50%, hsla(150,53%,28%,1) 0, transparent 50%)',
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1, mixBlendMode: 'multiply', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E\")" }}></div>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -2, background: 'radial-gradient(circle at 15% 10%, rgba(74, 144, 194, 0.08) 0%, transparent 40%), radial-gradient(circle at 85% 20%, rgba(90, 139, 168, 0.05) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(211, 97, 53, 0.04) 0%, transparent 50%)' }}></div>
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      
      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: scrolled ? 'var(--glass-bg)' : 'rgba(255,255,255,0.4)',
        backdropFilter: scrolled ? 'var(--glass-blur)' : 'blur(12px)',
        WebkitBackdropFilter: scrolled ? 'var(--glass-blur)' : 'blur(12px)',
        borderBottom: scrolled ? 'var(--glass-border)' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        padding: '0 2rem', height: '100px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.75rem', transition: 'opacity 0.2s' }}
          onClick={() => navigate('/')}
          onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          <img src={logoImg} alt="WanderLocal" style={{ height: '86px', width: 'auto', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
        </div>

        {/* Search Pill */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 2rem' }}>
          <div
            onClick={() => navigate('/directory')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'var(--glass-bg)',
              border: 'var(--glass-border)',
              borderRadius: 'var(--radius-pill)', padding: '0.4rem 0.4rem 0.4rem 1.25rem',
              boxShadow: 'var(--shadow-sm), var(--shadow-inner-glow)',
              cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              maxWidth: '440px', width: '100%',
              backdropFilter: 'var(--glass-blur)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = 'var(--shadow-md), var(--shadow-inner-glow)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm), var(--shadow-inner-glow)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>Discover</span>
              <div style={{ background: 'var(--color-border)', width: '1px', height: '16px' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-stone)', fontWeight: 400 }}>Any destination</span>
            </div>
            <div style={{
              background: roleGrad,
              width: '38px', height: '38px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', flexShrink: 0,
              boxShadow: `0 4px 12px ${roleColor}40`,
            }}>
              <LuSearch size={18} />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>

          {/* Role Switch */}
          {userRole === 'traveler' && (
            <button
              onClick={() => { switchRole('business'); navigate('/business'); }}
              style={{
                fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-stone)',
                background: 'transparent', border: 'none',
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                marginRight: '0.25rem',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--color-sand)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-stone)'; }}
            >
              Switch to hosting
            </button>
          )}
          {userRole === 'business' && (
            <button
              onClick={() => { switchRole('traveler'); navigate('/dashboard'); }}
              style={{
                fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-stone)',
                background: 'transparent', border: 'none',
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                marginRight: '0.25rem',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--color-sand)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-stone)'; }}
            >
              Switch to traveling
            </button>
          )}

          {userRole === 'traveler' && (
            <>
              <Link
                to="/directory"
                style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-stone)', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--color-sand)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-stone)'; }}
              >Directory</Link>
              <Link
                to="/gallery"
                style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-stone)', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--color-sand)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-stone)'; }}
              >Gallery</Link>
            </>
          )}

          {/* Profile Pill */}
          <div id="profile-dropdown-root" style={{ position: 'relative', marginLeft: '0.5rem' }}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                background: 'var(--glass-bg)',
                border: profileOpen ? `1px solid ${roleColor}80` : 'var(--glass-border)',
                borderRadius: 'var(--radius-pill)', padding: '0.35rem 0.85rem 0.35rem 0.5rem',
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: profileOpen ? `0 8px 24px ${roleColor}25, var(--shadow-inner-glow)` : 'var(--shadow-xs), var(--shadow-inner-glow)',
                backdropFilter: 'var(--glass-blur)',
              }}
              onMouseOver={e => { if (!profileOpen) e.currentTarget.style.boxShadow = 'var(--shadow-sm), var(--shadow-inner-glow)'; }}
              onMouseOut={e => { if (!profileOpen) e.currentTarget.style.boxShadow = 'var(--shadow-xs), var(--shadow-inner-glow)'; }}
            >
              {/* Bell */}
              <div style={{ position: 'relative', paddingLeft: '4px' }}>
                <LuBell size={18} color="var(--color-stone)" />
                <div style={{ position: 'absolute', top: -1, right: -2, width: 8, height: 8, background: '#E53935', borderRadius: '50%', border: '2px solid #fff' }} />
              </div>
              {/* Avatar */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: roleGrad,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.02em',
                boxShadow: `0 4px 12px ${roleColor}40`,
                border: '2px solid rgba(255,255,255,0.8)',
              }}>
                {initials}
              </div>
              <LuChevronDown size={16} color="var(--color-stone)" style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} />
            </div>

            {/* Dropdown */}
            {profileOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                width: '280px',
                background: 'rgba(253, 251, 247, 0.95)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(255,255,255,0.6) inset',
                border: '1px solid rgba(226, 228, 232, 0.5)',
                overflow: 'hidden', zIndex: 300,
                animation: 'dropdownIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                <style>{`
                  @keyframes dropdownIn {
                    from { opacity: 0; transform: translateY(-12px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                  }
                `}</style>

                {/* User Header */}
                <div style={{
                  padding: '1.5rem 1.25rem 1.25rem',
                  background: `linear-gradient(180deg, ${roleColor}0A 0%, rgba(253,251,247,0) 100%)`,
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: roleGrad, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: 700,
                      boxShadow: `0 8px 16px ${roleColor}30`,
                      border: '2px solid rgba(255,255,255,0.9)',
                      flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: '1rem', letterSpacing: '-0.01em', marginBottom: '2px' }}>{userName}</div>
                      <div style={{ fontSize: '0.8rem', color: roleColor, fontWeight: 600, textTransform: 'capitalize', opacity: 0.9 }}>
                        {userRole} Account
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '0.5rem 0.5rem' }}>
                  {menu.map(item => {
                    if (item.divider) return <div key={item.id} style={{ height: '1px', background: 'var(--color-border)', margin: '0.5rem 0.75rem' }} />;

                    if (item.isBanner) {
                      return (
                        <Link key={item.id} to={item.path}
                          style={{
                            display: 'block', textDecoration: 'none',
                            padding: '1rem', margin: '0.5rem 0.25rem',
                            background: `linear-gradient(135deg, ${roleColor}08, ${roleColor}03)`,
                            borderRadius: '12px',
                            border: `1px solid ${roleColor}20`,
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative', overflow: 'hidden',
                          }}
                          onMouseOver={e => { 
                            e.currentTarget.style.background = `linear-gradient(135deg, ${roleColor}12, ${roleColor}06)`; 
                            e.currentTarget.style.transform = 'translateY(-2px)'; 
                            e.currentTarget.style.boxShadow = `0 8px 24px ${roleColor}15`;
                            e.currentTarget.style.borderColor = `${roleColor}40`;
                          }}
                          onMouseOut={e => { 
                            e.currentTarget.style.background = `linear-gradient(135deg, ${roleColor}08, ${roleColor}03)`; 
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = `${roleColor}20`;
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: '0.9rem', letterSpacing: '-0.01em' }}>{item.title}</div>
                            <LuZap color={roleColor} size={16} />
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-stone)', lineHeight: 1.4 }}>{item.desc}</div>
                        </Link>
                      );
                    }

                    if (item.isModal) {
                      return (
                        <button key={item.id}
                          onClick={() => { setLangModalOpen(true); setProfileOpen(false); }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.65rem 0.75rem', color: 'var(--color-ink-soft)',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            fontSize: '0.875rem', fontWeight: 500, textAlign: 'left',
                            fontFamily: 'inherit', borderRadius: '10px', transition: 'all 0.2s',
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = 'var(--color-sand)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
                          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-ink-soft)'; }}
                        >
                          {React.cloneElement(item.icon, { size: 18, color: 'var(--color-stone-light)' })} {item.label}
                        </button>
                      );
                    }

                    return (
                      <Link key={item.id} to={item.path} onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.65rem 0.75rem', color: 'var(--color-ink-soft)',
                          textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                          transition: 'all 0.2s', borderRadius: '10px',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--color-sand)'; e.currentTarget.style.color = 'var(--color-ink)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-ink-soft)'; }}
                      >
                        {React.cloneElement(item.icon, { size: 18, color: 'var(--color-stone-light)' })} {item.label}
                      </Link>
                    );
                  })}
                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.5rem 0.75rem' }} />
                  <button onClick={handleLogout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.65rem 0.75rem', color: '#D36135',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontSize: '0.875rem', fontWeight: 600, textAlign: 'left',
                      fontFamily: 'inherit', transition: 'all 0.2s', borderRadius: '10px',
                      marginBottom: '0.25rem',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#FDF1ED'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LuLogOut size={18} color="#D36135" /> Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      <LanguageCurrencyModal isOpen={langModalOpen} onClose={() => setLangModalOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
