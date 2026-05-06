import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import DashboardLayout from '../layouts/DashboardLayout';
import { tokens, glassCardStyle, applyHover, removeHover, glassCardHover } from '../inlineStyles';
import { LuInfo, LuFileText } from 'react-icons/lu';

export default function TermsOfService() {
  const { isAuthenticated } = useContext(AuthContext);

  const content = (
    <div style={{ 
      minHeight: '100vh', 
      background: isAuthenticated ? 'transparent' : '#FDFBF7',
      fontFamily: tokens.fontBody,
      position: 'relative'
    }}>
      {!isAuthenticated && (
        <>
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, mixBlendMode: 'multiply', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E\")" }}></div>
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1, background: 'radial-gradient(circle at 15% 10%, rgba(74, 144, 194, 0.08) 0%, transparent 40%), radial-gradient(circle at 85% 20%, rgba(90, 139, 168, 0.05) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(211, 97, 53, 0.04) 0%, transparent 50%)' }}></div>
        </>
      )}

      <div style={{ position: 'relative', zIndex: 1, paddingTop: isAuthenticated ? '3rem' : '120px', maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem', display: 'flex', gap: '3rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontSize: '0.85rem', color: tokens.colorStone, display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontWeight: 600 }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = tokens.colorInk} onMouseOut={e => e.target.style.color = tokens.colorStone}>Home</span> <span>&gt;</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = tokens.colorInk} onMouseOut={e => e.target.style.color = tokens.colorStone}>All topics</span> <span>&gt;</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = tokens.colorInk} onMouseOut={e => e.target.style.color = tokens.colorStone}>Legal Terms</span> <span>&gt;</span>
          <span style={{ color: tokens.colorInk }}>Terms of Service</span>
        </div>

        <h3 style={{ color: tokens.colorStone, fontSize: '0.85rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Legal terms</h3>
        <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: '3rem', fontWeight: 800, color: tokens.colorInk, margin: '0.5rem 0 2.5rem 0', letterSpacing: '-0.02em' }}>Terms of Service</h1>

        {/* Warning Box */}
        <div style={{ ...glassCardStyle, padding: '1.5rem', marginBottom: '3rem', borderLeft: `4px solid #3B82F6` }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: '#3B82F6', marginTop: '2px' }}>
              <LuInfo size={24} />
            </div>
            <div style={{ fontSize: '1rem', color: tokens.colorInk, lineHeight: 1.6 }}>
              If your country of residence or establishment is within the European Economic Area ("EEA"), Switzerland or the United Kingdom, the <a href="#" style={{ color: tokens.colorPrimary, textDecoration: 'none', fontWeight: 600 }}>Terms of Service for European Users</a> apply to you.
              <br /><br />
              If your country of residence or establishment is outside of the EEA, Switzerland, Australia, and the United Kingdom, the <a href="#" style={{ color: tokens.colorInk, textDecoration: 'underline', fontWeight: 700 }}>Terms of Service for Users outside of the EEA, UK, and Australia</a> apply to you.
              <br /><br />
              If your country of residence or establishment is in Australia, the <a href="#" style={{ color: tokens.colorPrimary, textDecoration: 'none', fontWeight: 600 }}>Terms of Service for Australian Users</a> apply to you.
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.75rem', fontWeight: 800, color: tokens.colorInk, marginBottom: '1rem', letterSpacing: '-0.01em' }}>
          Terms of Service for Users outside of the EEA, UK, and Australia
        </h2>
        
        <p style={{ fontSize: '1.05rem', color: tokens.colorInk, lineHeight: 1.6, fontWeight: 700, marginBottom: '2.5rem' }}>
          Section 23 of these Terms contains an arbitration agreement and class action waiver that apply to all claims brought against WanderLocal in the United States. Please read them carefully.
        </p>

        <p style={{ fontSize: '1rem', color: tokens.colorStone, marginBottom: '1.5rem', fontWeight: 500 }}>
          Last Updated: February 5, 2026
        </p>
        
        <p style={{ fontSize: '1.05rem', color: tokens.colorInk, marginBottom: '3rem', lineHeight: 1.6 }}>
          Thank you for using WanderLocal!
        </p>

        {/* Links Box */}
        <div style={{ ...glassCardStyle, padding: '1.5rem', borderLeft: `4px solid ${tokens.colorAccent}` }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: tokens.colorAccent, marginTop: '2px' }}>
              <LuFileText size={24} />
            </div>
            <div style={{ fontSize: '1rem', color: tokens.colorInk, lineHeight: 1.6 }}>
              The documents referred to within these Terms include but are not limited to our:
              <ul style={{ margin: '1rem 0 0 0', paddingLeft: '1.2rem', color: tokens.colorStone, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><a href="#" style={{ color: tokens.colorPrimary, textDecoration: 'none', fontWeight: 600 }}>Payments Terms of Service</a>, which govern any payment services provided to Members by the WanderLocal payment entities.</li>
                <li><a href="#" style={{ color: tokens.colorPrimary, textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a> which describes our collection and use of personal data.</li>
                <li><a href="#" style={{ color: tokens.colorPrimary, textDecoration: 'none', fontWeight: 600 }}>Service Fees Policy</a>, which describes how WanderLocal service fees are charged.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Sidebar */}
      <div style={{ width: '340px', flexShrink: 0 }}>
        {!isAuthenticated ? (
          <div style={{ ...glassCardStyle, padding: '2rem', position: 'sticky', top: '120px' }}>
            <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.25rem', fontWeight: 800, color: tokens.colorInk, margin: '0 0 1.5rem 0', lineHeight: 1.4 }}>
              Get help with your reservations, account, and more.
            </h3>
            <button onClick={() => window.location.href = '/'} style={{ width: '100%', padding: '1.1rem', background: `linear-gradient(135deg, ${tokens.colorPrimary} 0%, ${tokens.colorPrimaryDark} 100%)`, color: '#fff', border: 'none', borderRadius: tokens.radiusPill, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: tokens.fontBody, boxShadow: `0 4px 12px ${tokens.colorPrimary}40` }}>
              Log in or sign up
            </button>
          </div>
        ) : (
          <div style={{ ...glassCardStyle, padding: '2rem', position: 'sticky', top: '120px' }}>
            <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.25rem', fontWeight: 800, color: tokens.colorInk, margin: '0 0 1.5rem 0', lineHeight: 1.4 }}>
              Need more help?
            </h3>
            <Link to="/help" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '1.1rem', background: `linear-gradient(135deg, ${tokens.colorInk} 0%, #1A2530 100%)`, color: '#fff', textDecoration: 'none', borderRadius: tokens.radiusPill, fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box', fontFamily: tokens.fontBody, boxShadow: tokens.shadowSm }}>
              Go to Help Center
            </Link>
          </div>
        )}
      </div>
      </div>
    </div>
  );

  if (isAuthenticated) {
    return (
      <DashboardLayout activeTabId="help">
        {content}
      </DashboardLayout>
    );
  }

  return (
    <>
      <Navbar />
      {content}
    </>
  );
}
