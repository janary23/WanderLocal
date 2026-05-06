import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import { glassCardStyle, glassCardHover, btnPrimaryStyle, btnPrimaryHover, btnSecondaryStyle, btnSecondaryHover, btnGhostStyle, btnGhostHover, applyHover, removeHover } from '../inlineStyles';
//  from '../context/AuthContext';
import { getItineraries, getWishlist, getNotifications, markNotifRead, getProfileStats } from '../services/api';
import {
  LuMapPin, LuBookmark, LuBell, LuPlus, LuShare2, LuGlobe, LuCircle, LuCopy,
  LuLock, LuCompass, LuMap, LuLoader, LuArrowRight, LuCalendar, LuStar
} from 'react-icons/lu';

// Removed hardcoded C object, using CSS variables from index.css

const STATUS_STYLE = {
  draft:     { bg: '#EDF4F8', color: '#5A8BA8', label: 'Draft' },
  active:    { bg: '#E8F1F7', color: '#3A75A0', label: 'Active' },
  completed: { bg: '#FFEBEE', color: '#E53935', label: 'Completed' },
};
const VIS_ICON = { private: <LuLock size={14} />, public: <LuGlobe size={14} />, link: <LuShare2 size={14} /> };

const TravelerDashboard = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout activeTabId="overview">
      <MainDashboardContent navigate={navigate} />
    </DashboardLayout>
  );
};

const MainDashboardContent = ({ navigate }) => {
  const { userId, userName } = useContext(AuthContext);
  const [itineraries, setItineraries] = useState([]);
  const [wishlist,    setWishlist]    = useState([]);
  const [notifs,      setNotifs]      = useState([]);
  const [stats,       setStats]       = useState(null);
  const [loading,     setLoading]     = useState(true);

  const firstName = (userName || 'Traveler').split(' ')[0];

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      try {
        const [itinRes, wishRes, notifRes, statsRes] = await Promise.all([
          getItineraries(userId),
          getWishlist(userId),
          getNotifications(userId),
          getProfileStats(userId),
        ]);
        if (itinRes.status === 'success')   setItineraries(itinRes.itineraries);
        if (wishRes.status === 'success')   setWishlist(wishRes.listings);
        if (notifRes.status === 'success')  setNotifs(notifRes.notifications);
        if (statsRes.status === 'success')  setStats(statsRes.stats);
      } catch (e) { console.error('Dashboard load error:', e); }
      setLoading(false);
    };
    load();
  }, [userId]);

  const handleMarkRead = async (nid) => {
    await markNotifRead(nid);
    setNotifs(prev => prev.map(n => n.id === nid ? { ...n, is_read: true } : n));
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 24, color: 'var(--color-stone)' }}>
      <div style={{ padding: '20px', background: 'var(--color-surface)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
        <LuLoader size={32} color="var(--color-primary)" style={{ animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
      </div>
      <p style={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '1rem' }}>Preparing your journey...</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ 
      maxWidth: 1400, margin: '0 auto', width: '100%', padding: '2rem 3rem 6rem',
      display: 'flex', flexDirection: 'column', gap: '3rem'
    }}>
      
      {/* ── Ultra Premium Hero Section ── */}
      <div style={{ 
        position: 'relative', overflow: 'hidden', borderRadius: '32px', 
        background: 'var(--color-ink)',
        color: 'var(--color-cream)',
        padding: '5rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Dynamic Glowing Orbs */}
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 60%)', opacity: 0.5, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)', opacity: 0.4, filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 60%)', opacity: 0.15, filter: 'blur(60px)', pointerEvents: 'none' }} />
        
        {/* Glass Overlay Pattern */}
        <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")', mixBlendMode: 'overlay', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '65%' }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
            Traveler Dashboard
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 1.5rem', lineHeight: 1.05 }}>
            Welcome back,<br/><span style={{ background: 'linear-gradient(90deg, #fff, var(--color-primary-border))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{firstName}.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1.25rem', fontWeight: 400, maxWidth: '500px', lineHeight: 1.6 }}>
            Ready for your next breathtaking Philippine adventure? The islands are calling.
          </p>
        </div>
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <button
            onClick={() => navigate('/itinerary')}
            style={{ 
              background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.4)',
              padding: '1.25rem 2.5rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backdropFilter: 'blur(20px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', fontFamily: 'inherit'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-ink)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.4)'; }}
          >
            <LuPlus size={22} /> Plan a New Trip
          </button>
        </div>
      </div>

      {/* ── Bento Grid: Actions & Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) repeat(3, 1fr)', gap: '1.5rem' }}>
        
        {/* Ultra-Rich Discover Card */}
        <div 
          onClick={() => navigate('/directory')}
          style={{ ...glassCardStyle, background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', 
            padding: '2rem', color: '#fff', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden', minHeight: '220px', border: 'none'
          }}
          onMouseOver={e => { e.currentTarget.querySelector('.orb').style.transform = 'scale(1.2) translate(-10%, -10%)'; }}
          onMouseOut={e => { e.currentTarget.querySelector('.orb').style.transform = 'scale(1) translate(0, 0)'; }}
        >
          {/* Animated decorative orb */}
          <div className="orb" style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)', borderRadius: '50%', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          
          <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: 56, height: 56, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', marginBottom: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <LuCompass size={28} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: 8, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>Discover</div>
            <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 6 }}>
              Explore the local directory <LuArrowRight size={16} />
            </div>
          </div>
        </div>

        {/* Dynamic Glass Stats Cards */}
        {stats && [
          { label: 'Planned Trips', value: stats.trips, icon: <LuMap />, color: 'var(--color-secondary)' },
          { label: 'Saved Gems', value: stats.saved, icon: <LuBookmark />, color: 'var(--color-accent)' },
          { label: 'Contributions', value: stats.nominations, icon: <LuStar />, color: 'var(--color-primary)' },
        ].map((s, i) => (
          <div key={i} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)} style={{ ...glassCardStyle, 
            padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            background: 'var(--glass-bg)', position: 'relative', overflow: 'hidden'
          }}>
            {/* Subtle top border glow based on color */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            
            <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
              {s.icon}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-ink)', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-stone)', fontWeight: 600, marginTop: 12 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '3rem', marginTop: '1rem' }}>
        
        {/* Left Column - Core Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          
          {/* Active Itineraries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0, letterSpacing: '-0.02em' }}>
                My Journeys
              </h2>
              <Link to="/trips" style={{ ...btnGhostStyle,  padding: '0.6rem 1.25rem', fontSize: '0.9rem'  }} onMouseOver={e => applyHover(e, btnGhostHover)} onMouseOut={e => removeHover(e, btnGhostStyle)}>View all</Link>
            </div>
            
            {itineraries.length === 0 ? (
              <div style={{ ...glassCardStyle,  padding: '5rem 2rem', textAlign: 'center', borderStyle: 'dashed', background: 'rgba(255,255,255,0.4)'  }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
                <div style={{ width: 80, height: 80, margin: '0 auto 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-stone)', boxShadow: 'var(--shadow-sm)' }}>
                  <LuMap size={32} />
                </div>
                <h3 style={{ margin: '0 0 8px', color: 'var(--color-ink)', fontSize: '1.25rem', fontWeight: 800 }}>No journeys planned</h3>
                <p style={{ margin: '0 0 24px', fontSize: '1rem', color: 'var(--color-stone)' }}>Your itinerary list is empty. Start crafting your dream trip!</p>
                <button onClick={() => navigate('/itinerary')} style={btnPrimaryStyle} onMouseOver={e => applyHover(e, btnPrimaryHover)} onMouseOut={e => removeHover(e, btnPrimaryStyle)}>Create Itinerary</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {itineraries.slice(0, 4).map((trip, idx) => {
                  const ss = STATUS_STYLE[trip.status] || STATUS_STYLE.draft;
                  // Generate an abstract gradient based on index for a premium visual touch
                  const gradients = [
                    'linear-gradient(120deg, #E8F4F8 0%, #D1EAF5 100%)',
                    'linear-gradient(120deg, #FCF8EE 0%, #F5ECD3 100%)',
                    'linear-gradient(120deg, #E6F3EC 0%, #CDE7DA 100%)',
                    'linear-gradient(120deg, #FDF1ED 0%, #FAD7CC 100%)',
                  ];
                  const tripBg = gradients[idx % gradients.length];
                  
                  return (
                    <div key={trip.id} style={{ ...glassCardStyle,  cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 0  }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)} onClick={() => navigate('/itinerary')}>
                      <div style={{ height: 160, background: tripBg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LuMap size={60} color="var(--color-ink)" style={{ opacity: 0.05 }} />
                        <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--color-surface)', color: 'var(--color-ink)', border: '1px solid var(--color-border)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, boxShadow: 'var(--shadow-xs)' }}>
                          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ss.color, marginRight: 6 }}></span>
                          {ss.label}
                        </div>
                        <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--color-surface)', width: 32, height: 32, borderRadius: '8px', color: 'var(--color-stone)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>
                          {VIS_ICON[trip.visibility]}
                        </div>
                      </div>
                      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--glass-bg)' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-ink)', marginBottom: 8, lineHeight: 1.3 }}>{trip.title}</div>
                          {trip.destination && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-stone)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                              <LuMapPin color="var(--color-secondary)" size={16} /> {trip.destination}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-stone-light)', marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                           <LuCalendar size={14} /> Updated {trip.updated_at ? new Date(trip.updated_at).toLocaleDateString() : '—'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Curated Saved Gems */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0, letterSpacing: '-0.02em' }}>
                Saved Gems
              </h2>
              <Link to="/wishlists" style={{ ...btnGhostStyle,  padding: '0.6rem 1.25rem', fontSize: '0.9rem'  }} onMouseOver={e => applyHover(e, btnGhostHover)} onMouseOut={e => removeHover(e, btnGhostStyle)}>View all</Link>
            </div>
            
            {wishlist.length === 0 ? (
              <div style={{ ...glassCardStyle,  padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed', background: 'rgba(255,255,255,0.4)'  }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
                <div style={{ width: 80, height: 80, margin: '0 auto 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-stone)', boxShadow: 'var(--shadow-sm)' }}>
                  <LuBookmark size={32} style={{ opacity: 0.6 }} />
                </div>
                <h3 style={{ margin: '0 0 8px', color: 'var(--color-ink)', fontSize: '1.25rem', fontWeight: 800 }}>No saved places yet</h3>
                <p style={{ margin: '0 0 24px', fontSize: '1rem', color: 'var(--color-stone)' }}><Link to="/directory" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'underline' }}>Explore the directory</Link> to find inspiration.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {wishlist.slice(0, 3).map(place => (
                  <Link key={place.id} to={`/listing/${place.id}`} style={{ ...glassCardStyle,  padding: 0, display: 'block', overflow: 'hidden'  }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
                    <div style={{ height: 200, position: 'relative' }}>
                      {place.cover_img
                        ? <img src={place.cover_img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={place.name} />
                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-sand) 0%, var(--color-border) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.6 }}>🏙️</div>
                      }
                      {/* Gradient overlay for text legibility if we were to put text inside, but here we just use it for a sleek vignette */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(11,22,33,0.8) 100%)' }} />
                      
                      <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.4)', width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                         <LuBookmark size={16} fill="currentColor" />
                      </div>
                      
                      <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{place.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}><LuMapPin size={14} /> {place.city}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Updates & Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ ...glassCardStyle,  position: 'sticky', top: 100  }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
            <div style={{ 
              borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', 
              justifyContent: 'space-between', padding: '1.5rem',
              background: 'transparent'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-ink)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LuBell color="#fff" size={16} />
                </div>
                Updates
                {notifs.filter(n => !n.is_read).length > 0 && (
                  <span style={{ background: 'var(--color-terracotta)', color: '#fff', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', marginLeft: 6, boxShadow: '0 4px 12px rgba(211,97,53,0.3)' }}>
                    {notifs.filter(n => !n.is_read).length} new
                  </span>
                )}
              </h3>
            </div>
            
            <div style={{ padding: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
              {notifs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-stone)', padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: 'var(--shadow-xs)' }}>
                    <LuBell size={24} color="var(--color-stone-light)" />
                  </div>
                  <h4 style={{ margin: '0 0 6px', color: 'var(--color-ink)', fontSize: '1.1rem', fontWeight: 800 }}>All caught up!</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>No new notifications right now.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {notifs.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && handleMarkRead(n.id)}
                      style={{ 
                        display: 'flex', gap: '1.25rem', padding: '1.25rem', borderRadius: 'var(--radius-md)',
                        background: n.is_read ? 'transparent' : 'var(--color-surface)',
                        border: '1px solid', borderColor: n.is_read ? 'transparent' : 'var(--color-border)',
                        opacity: n.is_read ? 0.7 : 1, cursor: n.is_read ? 'default' : 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: n.is_read ? 'none' : 'var(--shadow-sm)'
                      }}
                      onMouseOver={e => { if (!n.is_read) { e.currentTarget.style.borderColor = 'var(--color-primary-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; } }}
                      onMouseOut={e => { if (!n.is_read) { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; } }}
                    >
                      <div style={{ 
                        width: 44, height: 44, borderRadius: '12px', 
                        background: n.is_read ? 'var(--color-sand)' : 'var(--color-primary-pale)', 
                        color: n.is_read ? 'var(--color-stone-light)' : 'var(--color-primary)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {n.title.toLowerCase().includes('itinerary') ? <LuMap size={20} /> : <LuBell size={20} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-ink)', marginBottom: 6 }}>{n.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-stone)', lineHeight: 1.5, marginBottom: 8 }}>{n.message}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-stone-light)', fontWeight: 600 }}>{new Date(n.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerDashboard;
