import React, { useContext, useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext.jsx';
import LanguageSwitcher from '../context/LanguageSwitcher';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import logoImg from '../assets/WanderLocalLogo.png';
import { LuArrowRight, LuUser, LuSearch, LuGlobe } from 'react-icons/lu';

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userRole, userName, logout, switchRole } = useContext(AuthContext);
  const [modal, setModal] = useState(null); // null | 'login' | 'register'
  const [scrolled, setScrolled] = useState(pathname !== '/');
  const [profileOpen, setProfileOpen] = useState(false);
  const { t } = useLang();

  // If in a dashboard page, don't render this Navbar (DashboardLayout handles it)
  const isDashboard = ['/dashboard', '/business-dashboard', '/admin'].includes(pathname);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40 || pathname !== '/');
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [pathname]);

  if (isDashboard) return null;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const navStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, zIndex: 1000,
    background: scrolled ? '#fff' : 'transparent',
    borderBottom: scrolled ? '1px solid #EBF0F7' : '1px solid transparent',
    transition: 'all 0.3s ease',
    padding: '0 2rem',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const initials = userName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      <nav style={navStyle}>
        
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '100%', flex: 1 }} onClick={() => navigate('/')}>
          <img src={logoImg} alt="WanderLocal" style={{ height: '36px', width: 'auto', filter: !scrolled && pathname === '/' ? 'brightness(0) invert(1)' : 'none', transition: 'filter 0.3s ease' }} />
        </div>

        {/* Center: Search / Links */}
        <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
          {pathname === '/' ? (
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', color: scrolled ? '#0F1E2D' : '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
              <span onClick={() => {
                const el = document.getElementById('features');
                if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
              }} style={{ cursor: 'pointer', opacity: 0.9 }}>{t('features', 'Features')}</span>
              <span onClick={() => {
                const el = document.getElementById('destinations');
                if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
              }} style={{ cursor: 'pointer', opacity: 0.9 }}>{t('destinations', 'Destinations')}</span>
              <span onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
              }} style={{ cursor: 'pointer', opacity: 0.9 }}>{t('howItWorks', 'How It Works')}</span>
            </div>
          ) : (
            <div 
              onClick={() => navigate('/directory')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', border: '1px solid #DDE3ED', 
                borderRadius: '999px', padding: '0.5rem 0.5rem 0.5rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer', maxWidth: '400px', width: '100%'
              }}
            >
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F1E2D' }}>Anywhere</span>
                <div style={{ background: '#EBF0F7', width: '1px', height: '24px' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#8D9DB0' }}>Experiences</span>
              </div>
              <div style={{ background: '#5FAE4B', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <LuSearch size={16} />
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
          
          {isAuthenticated && userRole === 'traveler' && (
            <div 
              onClick={() => { switchRole('business'); navigate('/business'); }}
              style={{ fontSize: '0.9rem', fontWeight: 600, color: scrolled ? '#0F1E2D' : '#fff', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '999px', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = scrolled ? '#F4F6F9' : 'rgba(255,255,255,0.1)'} 
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              Switch to hosting
            </div>
          )}
          {isAuthenticated && userRole === 'business' && (
            <div 
              onClick={() => { switchRole('traveler'); navigate('/dashboard'); }}
              style={{ fontSize: '0.9rem', fontWeight: 600, color: scrolled ? '#0F1E2D' : '#fff', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '999px', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = scrolled ? '#F4F6F9' : 'rgba(255,255,255,0.1)'} 
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              Switch to traveling
            </div>
          )}

          <div style={{ ...(scrolled ? { color: '#0F1E2D' } : { color: '#fff' }) }}>
             <LanguageSwitcher />
          </div>

          <Link to="/directory" style={{ fontSize: '0.9rem', fontWeight: 600, color: scrolled ? '#0F1E2D' : '#fff', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '999px' }} onMouseOver={e => e.currentTarget.style.background = scrolled ? '#F4F6F9' : 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>{t('directory', 'Directory')}</Link>
          
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setProfileOpen(!profileOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', border: '1px solid #DDE3ED', borderRadius: '999px', padding: '0.25rem 0.25rem 0.25rem 0.75rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ width: 14, height: 2, background: '#5F6B7A', borderRadius: 2 }}></div>
                  <div style={{ width: 14, height: 2, background: '#5F6B7A', borderRadius: 2 }}></div>
                  <div style={{ width: 14, height: 2, background: '#5F6B7A', borderRadius: 2 }}></div>
                </div>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#5FAE4B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                  {initials}
                </div>
              </div>
              
              {profileOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '240px', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #EBF0F7', overflow: 'hidden', padding: '0.5rem 0' }}>
                  {!isDashboard && (
                    <Link to={userRole === 'admin' ? '/admin' : userRole === 'business' ? '/business-dashboard' : '/dashboard'} style={{ display: 'block', padding: '0.75rem 1.25rem', color: '#0F1E2D', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }} onMouseOver={e => e.currentTarget.style.background = '#F4F6F9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      {userRole === 'admin' ? 'Admin Dashboard' : userRole === 'business' ? 'Business Portal' : 'My Dashboard'}
                    </Link>
                  )}
                  <Link to="/itinerary" style={{ display: 'block', padding: '0.75rem 1.25rem', color: '#0F1E2D', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.background = '#F4F6F9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Trip Planner</Link>
                  <Link to="/gallery" style={{ display: 'block', padding: '0.75rem 1.25rem', color: '#0F1E2D', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.background = '#F4F6F9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>Community Gallery</Link>
                  <div style={{ height: '1px', background: '#EBF0F7', margin: '0.5rem 0' }} />
                  <div onClick={handleLogout} style={{ display: 'block', padding: '0.75rem 1.25rem', color: '#0F1E2D', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#F4F6F9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    Log Out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setModal('login')}
              style={{ background: scrolled ? '#0F1E2D' : '#fff', color: scrolled ? '#fff' : '#0F1E2D', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              {t('signIn', 'Sign In')}
            </button>
          )}
        </div>

      </nav>

      {/* Auth Modal */}
      {modal && (
        <AuthModal
          defaultTab={modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
};

export default Navbar;
