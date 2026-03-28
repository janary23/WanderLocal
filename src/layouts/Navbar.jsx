import React, { useContext, useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext.jsx';
import LanguageSwitcher from '../context/LanguageSwitcher';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import logoImg from '../assets/WanderLocalLogo.png';
import { LuArrowRight } from 'react-icons/lu';

/* ── Inline Style Objects ── */
const navbarBase = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  padding: '1.2rem 0',
  transition: 'background 0.35s, box-shadow 0.35s, backdropFilter 0.35s',
};

const navbarScrolled = {
  ...navbarBase,
  background: 'rgba(255, 255, 255, 0.96)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 1px 0 #EBF0F7, 0 2px 12px rgba(15, 30, 45, 0.08)',
};

const containerStyle = {
  width: '100%',
  maxWidth: '1180px',
  margin: '0 auto',
  padding: '0 2rem',
};

const navContentStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const navBrandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  cursor: 'pointer',
  height: '60px',
};

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.2rem',
};

const navActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const navLinkBase = {
  padding: '0.48rem 1rem',
  borderRadius: '10px',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#5F6B7A',
  transition: 'color 0.18s, background 0.18s',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  fontFamily: 'inherit',
  textDecoration: 'none',
  display: 'inline-block',
};

const navLinkHovered = {
  ...navLinkBase,
  color: '#4A90C2',
  background: '#E8F1F7',
};

const btnNavGhostBase = {
  padding: '0.5rem 1.1rem',
  borderRadius: '10px',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#5F6B7A',
  background: 'transparent',
  borderWidth: '1.5px',
  borderStyle: 'solid',
  borderColor: '#DDE3ED',
  transition: 'all 0.18s',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const btnNavGhostHovered = {
  ...btnNavGhostBase,
  borderColor: '#BAD6EA',
  color: '#4A90C2',
  background: '#E8F1F7',
};

const btnNavPrimaryBase = {
  padding: '0.55rem 1.3rem',
  borderRadius: '10px',
  fontSize: '0.875rem',
  fontWeight: 600,
  background: '#4A90C2',
  color: '#fff',
  border: 'none',
  transition: 'all 0.2s',
  cursor: 'pointer',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
};

const btnNavPrimaryHovered = {
  ...btnNavPrimaryBase,
  background: '#3A75A0',
  transform: 'translateY(-1px)',
};

/* ── NavLink with hover ── */
function NavLinkBtn({ children, onClick, to }) {
  const [hovered, setHovered] = useState(false);
  const style = hovered ? navLinkHovered : navLinkBase;

  if (to) {
    return (
      <Link
        to={to}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}



const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const isDashboard = ['/dashboard', '/business-dashboard', '/admin'].includes(pathname);
  const [modal, setModal] = useState(null); // null | 'login' | 'register'
  const [scrolled, setScrolled] = useState(pathname !== '/');
  const [ghostHovered, setGhostHovered] = useState(false);
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40 || pathname !== '/');
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [pathname]);

  const navStyle = scrolled ? navbarScrolled : navbarBase;

  return (
    <>
      <nav style={navStyle} id="wl-navbar">
        <div style={containerStyle}>
          <div style={navContentStyle}>
            {/* Brand */}
            <div
              style={navBrandStyle}
              onClick={() => navigate('/')}
            >
              <img
                src={logoImg}
                alt="WanderLocal"
                style={{ height: '80%', width: 'auto', transform: 'scale(1.1)', transformOrigin: 'left center' }}
              />
            </div>

            {/* Links */}
            {!['/admin', '/business-dashboard'].includes(pathname) && (
              <div style={navLinksStyle}>
                {isAuthenticated ? (
                  <>
                    <NavLinkBtn to="/directory">{t('directory', 'Directory')}</NavLinkBtn>
                    <NavLinkBtn to="/gallery">{t('gallery', 'Gallery')}</NavLinkBtn>
                    <NavLinkBtn to="/itinerary">{t('itinerary', 'Itinerary')}</NavLinkBtn>
                    <NavLinkBtn to="/dashboard">{t('dashboard', 'My Dashboard')}</NavLinkBtn>
                  </>
                ) : (
                  pathname === '/'
                    ? [
                        { key: 'features', fallback: 'Features' },
                        { key: 'destinations', fallback: 'Destinations' },
                        { key: 'howItWorks', fallback: 'How It Works' },
                        { key: 'stories', fallback: 'Stories' },
                      ].map(({ key, fallback }) => (
                        <NavLinkBtn key={key} onClick={() => {
                          const sectionId = fallback.toLowerCase().replace(/\s+/g, '-');
                          const element = document.getElementById(sectionId);
                          if (element) {
                            const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
                            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                          }
                        }}>
                          {t(key, fallback)}
                        </NavLinkBtn>
                      ))
                    : <NavLinkBtn to="/">{t('home', 'Home')}</NavLinkBtn>
                )}
              </div>
            )}

            {/* Actions */}

            <div style={navActionsStyle}>
              {/* Language Switcher Dropdown */}
              <LanguageSwitcher />

              {isAuthenticated || isDashboard ? (
                <>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F1F8F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5FAE4B', fontWeight: 'bold' }}>
                    U
                  </div>
                  <button
                    onClick={logout}
                    style={logoutHovered ? btnNavGhostHovered : btnNavGhostBase}
                    onMouseEnter={() => setLogoutHovered(true)}
                    onMouseLeave={() => setLogoutHovered(false)}
                  >
                    {t('logOut', 'Log Out')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setModal('login')}
                    style={ghostHovered ? btnNavGhostHovered : btnNavGhostBase}
                    onMouseEnter={() => setGhostHovered(true)}
                    onMouseLeave={() => setGhostHovered(false)}
                  >
                    {t('signIn', 'Sign In')}
                  </button>
                  <button
                    onClick={() => setModal('register')}
                    style={primaryHovered ? btnNavPrimaryHovered : btnNavPrimaryBase}
                    onMouseEnter={() => setPrimaryHovered(true)}
                    onMouseLeave={() => setPrimaryHovered(false)}
                  >
                    {t('startPlanning', 'Start Planning')} <LuArrowRight style={{ marginLeft: '0.25rem' }} />
                  </button>
                </>
              )}
            </div>
          </div>
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
