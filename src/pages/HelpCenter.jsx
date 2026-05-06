import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import DashboardLayout from '../layouts/DashboardLayout';
import { tokens, glassCardStyle, applyHover, removeHover, glassCardHover } from '../inlineStyles';
import { LuSearch, LuChevronRight, LuBook, LuShieldCheck, LuFileText } from 'react-icons/lu';

export default function HelpCenter() {
  const { isAuthenticated, userName } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Guest');

  const firstName = userName ? userName.split(' ')[0] : 'Traveler';

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

      <div style={{ position: 'relative', zIndex: 1, paddingTop: isAuthenticated ? '3rem' : '120px', maxWidth: '1080px', margin: '0 auto', paddingBottom: '5rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
        
        {/* Premium Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: isAuthenticated ? '0' : '2rem' }}>
          <h1 style={{ fontFamily: tokens.fontDisplay, fontSize: '3.5rem', fontWeight: 800, color: tokens.colorInk, letterSpacing: '-0.03em', marginBottom: '2.5rem' }}>
            Hi {firstName}, how can we help?
          </h1>
          
          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: '1.5rem', color: tokens.colorStone }}>
              <LuSearch size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search how-tos and more" 
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem 1.25rem 3.5rem',
                fontSize: '1.1rem',
                borderRadius: tokens.radiusPill,
                border: tokens.glassBorder,
                background: tokens.glassBg,
                boxShadow: tokens.shadowSm,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: tokens.fontBody,
                color: tokens.colorInk,
                transition: 'all 0.3s'
              }}
              onFocus={e => { e.target.style.boxShadow = tokens.shadowMd; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.boxShadow = tokens.shadowSm; e.target.style.background = tokens.glassBg; }}
            />
            <button style={{
              position: 'absolute',
              right: '8px',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${tokens.colorPrimary} 0%, ${tokens.colorPrimaryDark} 100%)`,
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${tokens.colorPrimary}40`
            }}>
              <LuChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: `1px solid ${tokens.colorBorder}`, display: 'flex', gap: '2.5rem', marginBottom: '3rem', overflowX: 'auto' }}>
          {['Guest', 'Home host', 'Experience host', 'Service host', 'Travel admin'].map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: '0 0 1rem 0',
                color: activeTab === tab ? tokens.colorInk : tokens.colorStone,
                fontWeight: activeTab === tab ? 700 : 600,
                fontSize: '1rem',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? `3px solid ${tokens.colorPrimary}` : '3px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: tokens.fontDisplay
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Recommended for you */}
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.75rem', fontWeight: 800, color: tokens.colorInk, marginBottom: '2rem', letterSpacing: '-0.02em' }}>
            Recommended for you
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Action Required Card */}
            <div style={{ ...glassCardStyle, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: 0 }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
              <div style={{ padding: '2rem', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: tokens.colorAccent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LuShieldCheck size={16} /> ACTION REQUIRED
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.25rem', fontWeight: 800, color: tokens.colorInk, margin: '0 0 0.75rem 0', letterSpacing: '-0.01em' }}>
                  Your identity is not fully verified
                </h3>
                <p style={{ color: tokens.colorStone, fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
                  Identity verification helps us check that you're really you. It's one of the ways we keep WanderLocal secure.
                </p>
              </div>
              <div style={{ borderTop: `1px solid ${tokens.colorBorder}`, background: 'rgba(255,255,255,0.4)', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: tokens.colorInk }}>Check verification status</span>
                <LuChevronRight size={20} color={tokens.colorStone} />
              </div>
            </div>

            {/* Quick Link Card */}
            <div style={{ ...glassCardStyle, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: 0 }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
              <div style={{ padding: '2rem', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: tokens.colorSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LuBook size={16} /> QUICK LINK
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.25rem', fontWeight: 800, color: tokens.colorInk, margin: '0 0 0.75rem 0', letterSpacing: '-0.01em' }}>
                  Finding reservation details
                </h3>
                <p style={{ color: tokens.colorStone, fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
                  Your Trips tab has full details, receipts, and Host contact info for each of your reservations.
                </p>
              </div>
              <div style={{ borderTop: `1px solid ${tokens.colorBorder}`, background: 'rgba(255,255,255,0.4)', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: tokens.colorInk }}>Go to Trips</span>
                <LuChevronRight size={20} color={tokens.colorStone} />
              </div>
            </div>
            
            {/* Legal Terms Card */}
            <div style={{ ...glassCardStyle, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: 0 }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)} onClick={() => window.location.href='/help/terms'}>
              <div style={{ padding: '2rem', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: tokens.colorPrimary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LuFileText size={16} /> ARTICLE
                </div>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.25rem', fontWeight: 800, color: tokens.colorInk, margin: '0 0 0.75rem 0', letterSpacing: '-0.01em' }}>
                  Legal Terms & Conditions
                </h3>
                <p style={{ color: tokens.colorStone, fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
                  Review our Terms of Service, Nondiscrimination Policy, and other legal documents to understand your rights.
                </p>
              </div>
              <div style={{ borderTop: `1px solid ${tokens.colorBorder}`, background: 'rgba(255,255,255,0.4)', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: tokens.colorInk }}>Read Terms of Service</span>
                <LuChevronRight size={20} color={tokens.colorStone} />
              </div>
            </div>

          </div>
        </div>

        {/* Guides Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.75rem', fontWeight: 800, color: tokens.colorInk, margin: 0, letterSpacing: '-0.02em' }}>
              Guides for getting started
            </h2>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: tokens.colorPrimary, cursor: 'pointer' }}>
              Browse all topics <LuChevronRight style={{ verticalAlign: 'middle' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {/* Guide 1 */}
            <div style={{ minWidth: '280px', width: '280px', borderRadius: tokens.radiusMd, overflow: 'hidden', border: `1px solid ${tokens.colorBorder}`, cursor: 'pointer', background: tokens.colorSurface, boxShadow: tokens.shadowXs, transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ height: '180px', background: '#f0f0f0', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400" alt="Guide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.1rem', fontWeight: 800, color: tokens.colorInk, margin: '0' }}>Getting started on WanderLocal</h3>
              </div>
            </div>

            {/* Guide 2 */}
            <div style={{ minWidth: '280px', width: '280px', borderRadius: tokens.radiusMd, overflow: 'hidden', border: `1px solid ${tokens.colorBorder}`, cursor: 'pointer', background: tokens.colorSurface, boxShadow: tokens.shadowXs, transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ height: '180px', background: `linear-gradient(135deg, ${tokens.colorInk} 0%, #1A2530 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ color: '#fff', fontSize: '2.5rem', fontFamily: tokens.fontDisplay, fontWeight: 800, margin: 0 }}>
                  <span style={{ color: tokens.colorAccent }}>Wander</span>Cover
                </h1>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontFamily: tokens.fontDisplay, fontSize: '1.1rem', fontWeight: 800, color: tokens.colorInk, margin: '0' }}>Top protection for Guests & Hosts</h3>
              </div>
            </div>
          </div>
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
