import React, { useState } from 'react';
import { LuX, LuLanguages } from 'react-icons/lu';

const LANGUAGES = [
  { lang: 'English', region: 'United States', active: true },
  { lang: 'Azərbaycan dili', region: 'Azərbaycan' },
  { lang: 'Bahasa Indonesia', region: 'Indonesia' },
  { lang: 'Bosanski', region: 'Bosna i Hercegovina' },
  { lang: 'Català', region: 'Espanya' },
  { lang: 'Čeština', region: 'Česká republika' },
  { lang: 'Crnogorski', region: 'Crna Gora' },
  { lang: 'Dansk', region: 'Danmark' },
  { lang: 'Deutsch', region: 'Deutschland' },
  { lang: 'Deutsch', region: 'Österreich' },
  { lang: 'Deutsch', region: 'Schweiz' },
  { lang: 'Deutsch', region: 'Luxemburg' },
  { lang: 'Eesti', region: 'Eesti' },
  { lang: 'English', region: 'Australia' },
  { lang: 'English', region: 'Canada' },
  { lang: 'English', region: 'Guyana' },
  { lang: 'English', region: 'India' },
  { lang: 'English', region: 'Ireland' },
  { lang: 'English', region: 'New Zealand' },
  { lang: 'English', region: 'Singapore' },
  { lang: 'English', region: 'United Arab Emirates' },
  { lang: 'Español', region: 'Argentina' },
  { lang: 'Español', region: 'Belice' },
  { lang: 'Español', region: 'Bolivia' },
  { lang: 'Español', region: 'Chile' },
];

const LanguageCurrencyModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('language');
  const [translationEnabled, setTranslationEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '2rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1000px',
        height: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column' }}>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', border: 'none', cursor: 'pointer', 
              width: 32, height: 32, borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              alignSelf: 'flex-start',
              marginLeft: '-8px',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#F7F7F7'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <LuX size={20} color="#222" />
          </button>

          <div style={{ display: 'flex', gap: '24px', marginTop: '16px', borderBottom: '1px solid #EBEBEB' }}>
            <button 
              onClick={() => setActiveTab('language')}
              style={{
                padding: '0 0 16px 0', background: 'transparent', border: 'none', 
                borderBottom: activeTab === 'language' ? '2px solid #222' : '2px solid transparent',
                color: activeTab === 'language' ? '#222' : '#717171',
                fontWeight: activeTab === 'language' ? 600 : 500,
                fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Language and region
            </button>
            <button 
              onClick={() => setActiveTab('currency')}
              style={{
                padding: '0 0 16px 0', background: 'transparent', border: 'none', 
                borderBottom: activeTab === 'currency' ? '2px solid #222' : '2px solid transparent',
                color: activeTab === 'currency' ? '#222' : '#717171',
                fontWeight: activeTab === 'currency' ? 600 : 500,
                fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Currency
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'language' ? (
            <>
              {/* Translation Toggle Block */}
              <div style={{ background: '#F7F7F7', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: '#222', marginBottom: '4px' }}>
                    Translation <LuLanguages size={20} />
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#717171' }}>
                    Automatically translate descriptions and reviews to English.
                  </div>
                </div>
                <button 
                  onClick={() => setTranslationEnabled(!translationEnabled)}
                  style={{
                    width: 48, height: 32, borderRadius: '32px',
                    background: translationEnabled ? '#222' : '#B0B0B0',
                    border: 'none', position: 'relative', cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 2,
                    left: translationEnabled ? 18 : 2,
                    transition: 'left 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>

              {/* Suggested */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#222', margin: '0 0 20px', fontFamily: "'Manrope', sans-serif" }}>Suggested language and region</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                  <button style={{
                    textAlign: 'left', padding: '12px', borderRadius: '8px',
                    border: '1px solid transparent', background: 'transparent',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#F7F7F7'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontSize: '0.9rem', color: '#222', marginBottom: '4px' }}>English</div>
                    <div style={{ fontSize: '0.85rem', color: '#717171' }}>United Kingdom</div>
                  </button>
                </div>
              </div>

              {/* Choose */}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#222', margin: '0 0 20px', fontFamily: "'Manrope', sans-serif" }}>Choose a language and region</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                  {LANGUAGES.map((item, idx) => (
                    <button 
                      key={idx}
                      style={{
                        textAlign: 'left', padding: '12px', borderRadius: '8px',
                        border: item.active ? '1px solid #222' : '1px solid transparent', 
                        background: 'transparent',
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={e => !item.active && (e.currentTarget.style.background = '#F7F7F7')}
                      onMouseOut={e => !item.active && (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ fontSize: '0.9rem', color: '#222', marginBottom: '4px' }}>{item.lang}</div>
                      <div style={{ fontSize: '0.85rem', color: '#717171' }}>{item.region}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#222', margin: '0 0 20px', fontFamily: "'Manrope', sans-serif" }}>Choose a currency</h3>
              <p style={{ color: '#717171' }}>Currency configuration is under development.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LanguageCurrencyModal;
