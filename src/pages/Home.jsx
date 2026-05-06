import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext.jsx';
import AuthModal from '../components/AuthModal';
import { LuMapPin, LuArrowRight, LuGlobe, LuLeaf, LuTreePalm, LuLandmark, LuWaves, LuCompass, LuUsers, LuFileText, LuHeart, LuNavigation, LuPlay, LuStar, LuChevronRight } from 'react-icons/lu';

/* ── Dynamic High-Res Real Images ── */
const ACCURATE_IMAGES = {
  palawan: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
  bohol: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1200',
  ilocos: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200',
  siargao: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1200',
  batanes: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1200',
  hero1: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1920',
  hero2: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1920',
  hero3: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1920',
};

/* ── System Design Tokens ── */
const T = {
  primary:        '#4A90C2',
  primaryDark:    '#3A75A0',
  primaryLight:   '#6BA9D6',
  primaryPale:    '#E8F1F7',
  primaryBorder:  '#BAD6EA',
  secondary:      '#5A8BA8',
  secondaryAlt:   '#EAF4E8',
  accent:         '#F39C12',
  terracotta:     '#E53935',
  ink:            '#0F1E2D',
  inkSoft:        '#1C2B3A',
  stone:          '#5F6B7A',
  stoneLight:     '#8D9DB0',
  cream:          '#FAFBFC',
  sand:           '#F4F6F9',
  border:         '#DDE3ED',
  borderLight:    '#EBF0F7',
  bgSurface:      '#FFFFFF',
  ffDisplay:      "'Manrope', sans-serif",
  ffBody:         "'Inter', sans-serif",
  shadowXs:       '0 1px 4px rgba(15, 30, 45, 0.06)',
  shadowSm:       '0 4px 16px rgba(15, 30, 45, 0.06)',
  shadow:         '0 12px 32px rgba(15, 30, 45, 0.08)',
  shadowLg:       '0 24px 64px rgba(15, 30, 45, 0.12)',
};

/* ── Core Scroll Hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.wl-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('wl-revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Home() {
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);
  const { t } = useLang(); // ← translation hook
  const [authModal, setAuthModal] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  useReveal();

  const heroImages = [ACCURATE_IMAGES.hero1, ACCURATE_IMAGES.hero2, ACCURATE_IMAGES.hero3];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Destination data uses t() so text swaps reactively
  const destinations = [
    { name: 'Palawan',  tag: t('Paradise'),     icon: <LuWaves />,    desc: t('Turquoise lagoons and towering limestone cliffs.'),               img: ACCURATE_IMAGES.palawan },
    { name: 'Bohol',    tag: t('Nature'),        icon: <LuLeaf />,     desc: t('Rolling chocolate-colored hills and pristine coastlines.'),        img: ACCURATE_IMAGES.bohol   },
    { name: 'Ilocos',   tag: t('Heritage'),      icon: <LuLandmark />, desc: t('Wander through historical Spanish colonial streets.'),             img: ACCURATE_IMAGES.ilocos  },
    { name: 'Siargao',  tag: t('Adventure'),     icon: <LuTreePalm />, desc: t('Lush palm tree forests and world-class surfing waves.'),           img: ACCURATE_IMAGES.siargao },
    { name: 'Batanes',  tag: t('Breathtaking'),  icon: <LuCompass />,  desc: t('Rolling hills, rugged cliffs, and traditional stone houses.'),     img: ACCURATE_IMAGES.batanes },
  ];

  return (
    <div style={{ fontFamily: T.ffBody, color: T.ink, background: T.bgSurface, overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .wl-reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .wl-revealed { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.35s; }
        .delay-4 { transition-delay: 0.5s; }
        
        .wl-feature-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; border: 1px solid transparent; background: ${T.sand}; }
        .wl-feature-card:hover { transform: translateY(-10px); background: ${T.bgSurface}; box-shadow: ${T.shadowLg}; border-color: ${T.borderLight}; }
        .wl-feature-card .icon-wrapper { transition: all 0.4s ease; }
        .wl-feature-card:hover .icon-wrapper { transform: scale(1.1) rotate(5deg); background: ${T.primary}; color: #fff; }
        
        .wl-dest-card { border-radius: 20px; overflow: hidden; position: relative; transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); box-shadow: ${T.shadow}; cursor: pointer; isolation: isolate; }
        .wl-dest-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .wl-dest-card:hover img { transform: scale(1.08); }
        .wl-dest-card:hover { transform: translateY(-12px); box-shadow: ${T.shadowLg}; }
        .wl-dest-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,30,45,0.85) 0%, rgba(15,30,45,0.2) 50%, transparent 100%); z-index: 1; pointer-events: none; }
        .wl-dest-card-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 2.5rem 2rem; z-index: 2; transition: transform 0.4s ease; }
        .wl-dest-card:hover .wl-dest-card-content { transform: translateY(-10px); }
        
        @keyframes kenBurns { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
        .bg-animate { animation: kenBurns 15s ease-out infinite alternate; }
        
        .wl-glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.2); }
        .editorial-heading { font-family: ${T.ffDisplay}; font-weight: 800; letter-spacing: -0.035em; line-height: 1; }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, #E8F1F7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* ── 1. HERO ── */}
      <section style={{ height: '100vh', minHeight: '800px', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: T.ink }}>
        {heroImages.map((img, idx) => (
          <div key={idx} style={{ position: 'absolute', inset: 0, opacity: activeHeroIdx === idx ? 1 : 0, transition: 'opacity 2s ease-in-out', zIndex: 0 }}>
            <img src={img} alt="Hero Background" className={activeHeroIdx === idx ? 'bg-animate' : ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,30,45,0.9) 0%, rgba(15,30,45,0.4) 50%, rgba(15,30,45,0.1) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(15,30,45,0.8) 0%, transparent 40%)', zIndex: 1 }} />

        <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 4vw', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px', marginTop: '6rem' }}>
            
            <div className="wl-reveal wl-glass" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.25rem', borderRadius: '999px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent, boxShadow: `0 0 10px ${T.accent}` }} /> {t('Authentic Experiences')}
            </div>

            <h1 className="wl-reveal delay-1 editorial-heading" style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', color: '#fff', marginBottom: '1.5rem' }}>
              {t('Redefining')} <br/>
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.9)' }}>{t('the way you')}</span> {t('travel.')}
            </h1>

            <p className="wl-reveal delay-2" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '600px', fontWeight: 400 }}>
              {t('Curate breathtaking journeys across the Philippines. Support local communities while experiencing unparalleled beauty and hidden wonders.')}
            </p>

            <div className="wl-reveal delay-3" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => setAuthModal('register')}
                onMouseEnter={() => setHoveredBtn(true)}
                onMouseLeave={() => setHoveredBtn(false)}
                style={{ background: hoveredBtn ? '#fff' : T.primary, color: hoveredBtn ? T.primaryDark : '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700, fontFamily: T.ffDisplay, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.2,0.8,0.2,1)', boxShadow: hoveredBtn ? '0 12px 32px rgba(255,255,255,0.2)' : T.shadowLg, transform: hoveredBtn ? 'translateY(-4px)' : 'none' }}
              >
                {t('Plan Your Journey')} <LuArrowRight />
              </button>

              <button
                onClick={() => document.getElementById('destinations').scrollIntoView()}
                style={{ background: 'transparent', color: '#fff', border: 'none', padding: '1.2rem 2rem', fontSize: '1rem', fontWeight: 600, fontFamily: T.ffBody, display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'opacity 0.3s', opacity: 0.8 }}
                onMouseEnter={e => e.target.style.opacity = '1'}
                onMouseLeave={e => e.target.style.opacity = '0.8'}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuPlay size={20} fill="#fff" />
                </div>
                {t('Watch Trailer')}
              </button>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '3rem', right: '4vw', zIndex: 2, display: 'flex', gap: '0.5rem' }}>
          {heroImages.map((_, idx) => (
            <div key={idx} onClick={() => setActiveHeroIdx(idx)} style={{ width: activeHeroIdx === idx ? 32 : 8, height: 8, borderRadius: 4, background: activeHeroIdx === idx ? '#fff' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
      </section>

      {/* ── 2. METRICS ── */}
      <section style={{ position: 'relative', marginTop: '-60px', zIndex: 10 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 4vw' }}>
          <div className="wl-reveal wl-glass" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)', borderRadius: '24px', padding: '3rem', boxShadow: '0 24px 48px rgba(15,30,45,0.08)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', border: '1px solid rgba(255,255,255,0.5)' }}>
            {[
              { label: t('Local Communities Supported'), value: '45+',  icon: <LuUsers color={T.primary} /> },
              { label: t('Curated Destinations'),        value: '120',  icon: <LuMapPin color={T.terracotta} /> },
              { label: t('Journeys Created'),            value: '15k+', icon: <LuFileText color={T.secondary} /> },
              { label: t('Average App Rating'),          value: '4.9',  sub: '/ 5.0', icon: <LuStar color={T.accent} fill={T.accent} /> },
            ].map((stat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: T.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontFamily: T.ffDisplay, fontWeight: 800, fontSize: '2rem', color: T.ink, lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {stat.value}
                    {stat.sub && <span style={{ fontSize: '1rem', color: T.stone, fontWeight: 600, marginLeft: '4px' }}>{stat.sub}</span>}
                  </div>
                  <div style={{ color: T.stone, fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500, lineHeight: 1.4 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES ── */}
      <section style={{ padding: '10rem 0 6rem', background: T.bgSurface }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 4vw' }}>

          <div className="wl-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '600px' }}>
              <span style={{ color: T.primary, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>{t('The WanderLocal Way')}</span>
              <h2 className="editorial-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: T.ink }}>
                {t('Travel differently.')} <br/> <span style={{ color: T.stone }}>{t('Plan seamlessly.')}</span>
              </h2>
            </div>
            <p style={{ color: T.stone, fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '400px', margin: 0, fontWeight: 400 }}>
              {t("We've combined powerful trip planning tools with deep local insights to give you an experience that goes far beyond the typical tourist path.")}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <LuCompass />, title: t('Intelligent Builder'), desc: t('Drag, drop, and visualize your entire routing on interactive maps that update in real-time.') },
              { icon: <LuGlobe />,   title: t('Hidden Gems'),         desc: t('Unlock exclusive recommendations sourced directly from lifelong locals and community experts.') },
              { icon: <LuNavigation />, title: t('Offline Ready'),    desc: t('Export responsive, offline-ready PDFs of your itineraries. Never get lost without a signal again.') }
            ].map((f, i) => (
              <div key={f.title} className={`wl-reveal delay-${i+1} wl-feature-card`} style={{ padding: '3.5rem 2.5rem', borderRadius: '32px' }}>
                <div className="icon-wrapper" style={{ width: '72px', height: '72px', borderRadius: '24px', background: T.primaryPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: T.primary, marginBottom: '2rem' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: T.ffDisplay, fontSize: '1.5rem', fontWeight: 800, color: T.ink, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{f.title}</h3>
                <p style={{ color: T.stone, lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. DESTINATIONS ── */}
      <section id="destinations" style={{ padding: '8rem 0', background: T.ink }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 4vw' }}>

          <div className="wl-reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ color: T.primaryLight, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>{t('Curated Escapes')}</span>
            <h2 className="editorial-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#fff' }}>{t('Where to next?')}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', gridAutoFlow: 'dense' }}>
            {destinations.map((d, i) => {
              let colSpan = 'span 4';
              let height = '450px';
              if (i === 0) { colSpan = 'span 8'; height = '550px'; }
              if (window.innerWidth < 1024) { colSpan = 'span 6'; }
              if (window.innerWidth < 768) { colSpan = 'span 12'; height = '400px'; }

              return (
                <div key={d.name} className={`wl-reveal delay-${i%3} wl-dest-card`} style={{ gridColumn: colSpan, height }}>
                  <img src={d.img} alt={d.name} />
                  <div className="wl-dest-card-content">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.4rem 1rem', borderRadius: '999px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                      {d.icon} {d.tag}
                    </div>
                    <h3 style={{ fontFamily: T.ffDisplay, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#fff', margin: '0 0 0.75rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{d.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0, maxWidth: '90%' }}>{d.desc}</p>
                  </div>
                </div>
              );
            })}

            <div className="wl-reveal delay-3" style={{ gridColumn: window.innerWidth < 768 ? 'span 12' : 'span 4', height: '450px', background: T.inkSoft, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
                <LuGlobe />
              </div>
              <h3 style={{ fontFamily: T.ffDisplay, fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>{t('See All Destinations')}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>{t('Discover over 50+ handpicked local experiences.')}</p>
              <button onClick={() => userRole ? navigate('/directory') : setAuthModal('register')} style={{ background: '#fff', color: T.ink, border: 'none', padding: '1rem 2rem', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                {t('Explore Directory')} <LuArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA ── */}
      <section style={{ padding: '8rem 0', background: T.bgSurface, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(74,144,194,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(95,174,75,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 4vw', position: 'relative', zIndex: 2 }}>
          <div className="wl-reveal" style={{ background: 'linear-gradient(135deg, #0F1E2D 0%, #1C2B3A 100%)', borderRadius: '40px', padding: '6rem 4vw', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 32px 64px rgba(15,30,45,0.2)' }}>
            <div style={{ position: 'absolute', top: 0, left: '20%', width: '300px', height: '200px', background: T.primary, filter: 'blur(120px)', opacity: 0.4 }} />
            <div style={{ position: 'absolute', bottom: 0, right: '20%', width: '300px', height: '200px', background: T.secondary, filter: 'blur(120px)', opacity: 0.3 }} />

            <h2 className="editorial-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', margin: '0 0 1.5rem', position: 'relative', zIndex: 2 }}>
              {t('Your journey')} <br/> {t('starts here.')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '540px', position: 'relative', zIndex: 2, lineHeight: 1.6 }}>
              {t('Join thousands of sustainable travelers mapping out pristine routes and supporting authentic local businesses.')}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              <button
                onClick={() => setAuthModal('register')}
                style={{ background: '#fff', color: T.ink, border: 'none', padding: '1.25rem 3.5rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 800, fontFamily: T.ffDisplay, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 12px 24px rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(255,255,255,0.1)'; }}
              >
                {t('Create Free Account')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER ── */}
      <footer style={{ background: T.bgSurface, padding: '5rem 4vw 2rem', borderTop: `1px solid ${T.borderLight}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>
            <div style={{ maxWidth: '320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: T.primary, fontWeight: 800, fontFamily: T.ffDisplay, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
                <LuGlobe size={32} /> WanderLocal
              </div>
              <p style={{ color: T.stone, fontSize: '1rem', lineHeight: 1.7 }}>
                {t('Elevating travel through purposeful, community-driven experiences across the Philippine archipelago.')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontFamily: T.ffDisplay, fontWeight: 800, color: T.ink, marginBottom: '2rem', fontSize: '1.1rem' }}>{t('Platform')}</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: 0 }}>
                  <li><a href="#" style={{ color: T.stone, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.primary} onMouseLeave={e => e.currentTarget.style.color = T.stone}>{t('Destination Directory')}</a></li>
                  <li><a href="#" style={{ color: T.stone, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.primary} onMouseLeave={e => e.currentTarget.style.color = T.stone}>{t('Intelligent Itinerary')}</a></li>
                  <li><a href="#" style={{ color: T.stone, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.primary} onMouseLeave={e => e.currentTarget.style.color = T.stone}>{t('Traveler Gallery')}</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontFamily: T.ffDisplay, fontWeight: 800, color: T.ink, marginBottom: '2rem', fontSize: '1.1rem' }}>{t('Community')}</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: 0 }}>
                  <li><a href="#" style={{ color: T.stone, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.primary} onMouseLeave={e => e.currentTarget.style.color = T.stone}>{t('Nominate a Business')}</a></li>
                  <li><a href="#" style={{ color: T.stone, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.primary} onMouseLeave={e => e.currentTarget.style.color = T.stone}>{t('Claim your Listing')}</a></li>
                  <li><a href="#" style={{ color: T.stone, textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.primary} onMouseLeave={e => e.currentTarget.style.color = T.stone}>{t('Help Center')}</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${T.borderLight}`, paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', color: T.stoneLight, fontSize: '0.9rem', gap: '1rem' }}>
            <div>© {new Date().getFullYear()} WanderLocal Platform. {t('All rights reserved.')}</div>
            <div style={{ display: 'flex', gap: '2rem', fontWeight: 500 }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.primary} onMouseLeave={e => e.currentTarget.style.color = T.stoneLight}>{t('Privacy Policy')}</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = T.primary} onMouseLeave={e => e.currentTarget.style.color = T.stoneLight}>{t('Terms of Service')}</a>
            </div>
          </div>
        </div>
      </footer>

      {authModal && (
        <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />
      )}
    </div>
  );
}
