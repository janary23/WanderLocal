// LanguageSwitcher.jsx
// A floating language-picker button that triggers API-powered live translation.
// Place anywhere in your layout — typically in your Navbar.

import React, { useState, useRef, useEffect } from 'react';
import { useLang } from './LanguageContext.jsx';
import { LuGlobe, LuCheck, LuLoader } from 'react-icons/lu';

// ── All translatable strings from Home.jsx ──────────────────────────────────
// Add or remove strings here as your copy changes.
const HOME_STRINGS = [
  // Pill badge
  'Authentic Experiences',
  // Hero
  'Redefining',
  'the way you',
  'travel.',
  'Curate breathtaking journeys across the Philippines. Support local communities while experiencing unparalleled beauty and hidden wonders.',
  'Plan Your Journey',
  'Watch Trailer',
  // Metrics
  'Local Communities Supported',
  'Curated Destinations',
  'Journeys Created',
  'Average App Rating',
  // Features section
  'The WanderLocal Way',
  'Travel differently.',
  'Plan seamlessly.',
  'We\'ve combined powerful trip planning tools with deep local insights to give you an experience that goes far beyond the typical tourist path.',
  'Intelligent Builder',
  'Drag, drop, and visualize your entire routing on interactive maps that update in real-time.',
  'Hidden Gems',
  'Unlock exclusive recommendations sourced directly from lifelong locals and community experts.',
  'Offline Ready',
  'Export responsive, offline-ready PDFs of your itineraries. Never get lost without a signal again.',
  // Destinations
  'Curated Escapes',
  'Where to next?',
  'Paradise',
  'Turquoise lagoons and towering limestone cliffs.',
  'Nature',
  'Rolling chocolate-colored hills and pristine coastlines.',
  'Heritage',
  'Wander through historical Spanish colonial streets.',
  'Adventure',
  'Lush palm tree forests and world-class surfing waves.',
  'Breathtaking',
  'Rolling hills, rugged cliffs, and traditional stone houses.',
  'See All Destinations',
  'Discover over 50+ handpicked local experiences.',
  'Explore Directory',
  // CTA
  'Your journey',
  'starts here.',
  'Join thousands of sustainable travelers mapping out pristine routes and supporting authentic local businesses.',
  'Create Free Account',
  // Footer
  'Elevating travel through purposeful, community-driven experiences across the Philippine archipelago.',
  'Platform',
  'Destination Directory',
  'Intelligent Itinerary',
  'Traveler Gallery',
  'Community',
  'Nominate a Business',
  'Claim your Listing',
  'Help Center',
  'Privacy Policy',
  'Terms of Service',
  'All rights reserved.',
];

export default function LanguageSwitcher() {
  const { currentLang, translate, isTranslating, SUPPORTED_LANGUAGES } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (langCode) => {
    setOpen(false);
    translate(HOME_STRINGS, langCode);
  };

  const activeLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLang);

  return (
    <div ref={ref} style={{ position: 'relative', zIndex: 1000 }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '999px',
          padding: '0.5rem 1rem',
          color: '#fff',
          fontSize: '0.88rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.25s',
          letterSpacing: '0.02em',
          minWidth: '120px',
          justifyContent: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        {isTranslating ? (
          <>
            <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-flex' }}>
              <LuLoader size={15} />
            </span>
            <span>Translating…</span>
          </>
        ) : (
          <>
            <LuGlobe size={15} />
            <span>{activeLang?.flag} {activeLang?.nativeName}</span>
            <span style={{ opacity: 0.7, fontSize: '0.75rem', marginLeft: '2px' }}>▾</span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.75rem)',
          right: 0,
          background: 'rgba(15,30,45,0.96)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          minWidth: '220px',
          animation: 'dropIn 0.2s cubic-bezier(0.2,0.8,0.2,1)',
        }}>
          <div style={{ padding: '0.75rem 1.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Choose Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1.25rem',
                  background: isActive ? 'rgba(74,144,194,0.2)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 700 : 500,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '3px solid #4A90C2' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ lineHeight: 1.2 }}>{lang.nativeName}</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.5, marginTop: '2px' }}>{lang.label}</div>
                </div>
                {isActive && <LuCheck size={16} color="#4A90C2" />}
              </button>
            );
          })}
          <div style={{ padding: '0.5rem 1.25rem 0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '0.5rem', textAlign: 'center' }}>
            Powered by Langbly API
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}
