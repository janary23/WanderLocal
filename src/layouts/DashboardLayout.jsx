import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LuHouse, LuMap, LuBookmark, LuBell, LuCompass, LuCamera, LuCircle, LuUsers, LuPackage, LuSettings, LuSearch, LuUser, LuLogOut, LuHeart, LuMessageSquare, LuStore, LuGlobe, LuInfo
} from 'react-icons/lu';
import logoImg from '../assets/WanderLocalLogo.png';
import LanguageCurrencyModal from '../components/LanguageCurrencyModal';

const MENUS = {
  traveler: [
    { id: 'overview', label: 'Overview', icon: <LuHouse />, path: '/dashboard' },
    { id: 'itineraries', label: 'Trips', icon: <LuMap />, path: '/trips' },
    { id: 'shortlist', label: 'Wishlists', icon: <LuBookmark />, path: '/wishlists' },
    { id: 'profile', label: 'Profile', icon: <LuUser />, path: '/profile' },
    { id: 'divider-1', divider: true },
    { id: 'settings', label: 'Account settings', icon: <LuSettings />, path: '/account-settings' },
    { id: 'language', label: 'Languages & currency', icon: <LuGlobe />, isModal: true },
    { id: 'help', label: 'Help Center', icon: <LuInfo />, path: '#' },
    { id: 'divider-2', divider: true },
    { id: 'host-banner', isBanner: true, title: 'List a business', desc: 'Own a local gem? Claim it or list a new one today.', path: '/nominate-business' },
  ],
  business: [
    { id: 'overview',   label: 'Overview',              icon: <LuHouse />,         path: '/business' },
    { id: 'listings',   label: 'My Listings',           icon: <LuStore />,         path: '/business/listings' },
    { id: 'bookings',   label: 'Manage Bookings',       icon: <LuCircle />,        path: '/business/bookings' },
    { id: 'reviews',    label: 'Reviews',               icon: <LuMessageSquare />, path: '/business/reviews' },
    { id: 'divider-1',  divider: true },
    { id: 'settings',   label: 'Business Settings',     icon: <LuSettings />,      path: '/business/settings' },
  ],
  admin: [
    { id: 'queue',       label: 'Queue',                icon: <LuCircle />,       path: '/admin' },
    { id: 'nominations', label: 'Nominations',          icon: <LuCircle />,path: '/admin?tab=nominations' },
    { id: 'integrity',   label: 'Directory',            icon: <LuPackage />,           path: '/admin?tab=integrity' },
    { id: 'users',       label: 'Users',                icon: <LuUsers />,             path: '/admin?tab=users' },
    { id: 'settings',    label: 'Settings',             icon: <LuSettings />,               path: '/admin?tab=settings' },
  ],
};

const DashboardLayout = ({ children, activeTabId }) => {
  const { userRole, userName, logout, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  
  const menu = MENUS[userRole] || MENUS.traveler;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = userName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Top Main Navigation */}
      <header style={{ position: 'sticky', top: 0, zIndex: 200, background: '#fff', borderBottom: '1px solid #EBF0F7', padding: '0 2rem', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '100%' }} onClick={() => navigate('/')}>
          <img src={logoImg} alt="WanderLocal" style={{ height: '36px', width: 'auto' }} />
        </div>

        {/* Center Nav / Search Pill (Airbnb style) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 2rem' }}>
          <div 
            onClick={() => navigate('/directory')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', border: '1px solid #DDE3ED', 
              borderRadius: '999px', padding: '0.5rem 0.5rem 0.5rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              cursor: 'pointer', transition: 'all 0.2s ease', maxWidth: '480px', width: '100%'
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F1E2D' }}>Discover</span>
              </div>
              <div style={{ background: '#EBF0F7', width: '1px', height: '24px' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', color: '#8D9DB0' }}>Any destination</span>
              </div>
            </div>
            <div style={{ background: '#4A90C2', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <LuSearch size={18} />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          
          {/* Switch Role Button */}
          {userRole === 'traveler' && (
            <button 
              onClick={() => { switchRole('business'); navigate('/business'); }}
              style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F1E2D', background: 'transparent', border: 'none', padding: '0.6rem 1rem', borderRadius: '999px', cursor: 'pointer', transition: 'background 0.2s', fontFamily: 'inherit', marginRight: '0.5rem' }} 
              onMouseOver={e => e.currentTarget.style.background = '#F4F6F9'} 
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              Switch to hosting
            </button>
          )}
          {userRole === 'business' && (
            <button 
              onClick={() => { switchRole('traveler'); navigate('/dashboard'); }}
              style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F1E2D', background: 'transparent', border: 'none', padding: '0.6rem 1rem', borderRadius: '999px', cursor: 'pointer', transition: 'background 0.2s', fontFamily: 'inherit', marginRight: '0.5rem' }} 
              onMouseOver={e => e.currentTarget.style.background = '#F4F6F9'} 
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              Switch to traveling
            </button>
          )}

          {userRole === 'traveler' && (
            <>
              <Link to="/directory" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#5F6B7A', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '999px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F4F6F9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Directory</Link>
              <Link to="/gallery" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#5F6B7A', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '999px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F4F6F9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Gallery</Link>
            </>
          )}

          <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
            <div 
              onClick={() => setProfileOpen(!profileOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ffffff', border: '1px solid #DDE3ED', borderRadius: '999px', padding: '0.25rem 0.25rem 0.25rem 0.75rem', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative' }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <LuBell size={18} color="#5F6B7A" />
              <div style={{ position: 'absolute', top: 4, right: 38, width: 8, height: 8, background: '#E53935', borderRadius: '50%', border: '2px solid #fff' }}></div>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#4A90C2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                {initials}
              </div>
            </div>
            
            {profileOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '260px', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #EBF0F7', overflow: 'hidden', zIndex: 300 }}>
                <div style={{ padding: '1.2rem', borderBottom: '1px solid #EBF0F7', background: '#F8FAFC' }}>
                  <div style={{ fontWeight: 700, color: '#0F1E2D', fontSize: '1rem' }}>{userName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#8D9DB0', textTransform: 'capitalize', marginTop: '0.1rem' }}>{userRole} Account</div>
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                  {menu.map(item => {
                    if (item.divider) return <div key={item.id} style={{ height: '1px', background: '#EBF0F7', margin: '0.5rem 0' }} />;
                    
                    if (item.isBanner) {
                      return (
                        <Link key={item.id} to={item.path} style={{ display: 'block', textDecoration: 'none', padding: '1rem', margin: '0.5rem 1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #EBF0F7', transition: 'box-shadow 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                             <div style={{ fontWeight: 600, color: '#0F1E2D', fontSize: '0.95rem' }}>{item.title}</div>
                             <LuStore color="#4A90C2" size={18} />
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#5F6B7A', lineHeight: 1.4 }}>{item.desc}</div>
                        </Link>
                      );
                    }

                    if (item.isModal) {
                      return (
                        <button key={item.id} onClick={() => { setLangModalOpen(true); setProfileOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.2rem', color: '#222222', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 400, textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#F7F7F7'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>
                          {React.cloneElement(item.icon, { size: 18, style: { opacity: 0.8 } })} {item.label}
                        </button>
                      );
                    }

                    return (
                      <Link key={item.id} to={item.path} onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.2rem', color: '#222222', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 400, transition: 'background 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#F7F7F7'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>
                        {React.cloneElement(item.icon, { size: 18, style: { opacity: 0.8 } })} {item.label}
                      </Link>
                    );
                  })}
                  <div style={{ height: '1px', background: '#EBF0F7', margin: '0.5rem 0' }} />
                  <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.2rem', color: '#E53935', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#FFEBEE'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <LuLogOut size={18} style={{ opacity: 0.8 }} /> Log out
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
