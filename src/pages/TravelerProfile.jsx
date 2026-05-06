import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuMessageCircle, LuMapPin, LuMap } from 'react-icons/lu';
import { glassCardStyle, glassCardHover, applyHover, removeHover, btnPrimaryStyle, btnPrimaryHover, btnGhostStyle, btnGhostHover } from '../inlineStyles';

const MOCK_ITINERARIES = [
  { id: 1, title: 'Baguio Weekend Escape', dest: 'Baguio City', days: 3, stops: 12, status: 'draft', visibility: 'private', img: 'https://picsum.photos/seed/15967078/800/600' },
  { id: 2, title: 'Vigan Heritage Tour', dest: 'Vigan, Ilocos Sur', days: 2, stops: 8, status: 'completed', visibility: 'public', img: 'https://picsum.photos/seed/15632007/800/600' },
];

const TravelerProfile = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <ProfileSidebarView navigate={navigate} />
    </DashboardLayout>
  );
};

const ProfileSidebarView = ({ navigate }) => {
  const ObjectTab = new URLSearchParams(useLocation().search).get('sub') || 'about';

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)', gap: '6rem' }}>
        
        {/* Profile Sidebar */}
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-ink)', marginBottom: '2.5rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Profile</h1>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'about', label: 'About me' },
              { id: 'trips', label: 'Past trips' },
              { id: 'connections', label: 'Connections' },
            ].map(item => {
              const isActive = ObjectTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/profile?sub=${item.id}`)}
                  style={{
                    textAlign: 'left',
                    padding: '0.85rem 1.25rem',
                    background: isActive ? 'var(--color-surface)' : 'transparent',
                    color: isActive ? 'var(--color-ink)' : 'var(--color-stone)',
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: '12px',
                    border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
                    boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => !isActive && (e.currentTarget.style.background = 'var(--color-sand)')}
                  onMouseOut={e => !isActive && (e.currentTarget.style.background = 'transparent')}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Content */}
        <div style={{ paddingTop: '1rem' }}>
          {ObjectTab === 'about' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0, fontFamily: 'var(--font-display)' }}>About me</h2>
                <button 
                  style={{ ...btnGhostStyle, padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                  onMouseOver={e => applyHover(e, btnGhostHover)}
                  onMouseOut={e => removeHover(e, btnGhostStyle)}
                >
                  Edit
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '3rem' }}>
                <div style={{ ...glassCardStyle, padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
                  <div style={{ width: 104, height: 104, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', color: '#fff', fontSize: '3rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
                    AL
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Alex</h3>
                  <p style={{ color: 'var(--color-stone)', fontSize: '1rem', margin: 0, fontWeight: 500, background: 'var(--color-sand)', padding: '4px 12px', borderRadius: '8px' }}>Traveler</p>
                </div>

                <div style={{ alignSelf: 'center', paddingRight: '2rem' }}>
                  <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--color-accent-pale)', color: 'var(--color-accent)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Profile Setup
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-ink)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>Complete your profile</h3>
                  <p style={{ color: 'var(--color-stone)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Your WanderLocal profile is an important part of every journey. Complete yours to help others get to know you.
                  </p>
                  <button 
                    style={btnPrimaryStyle}
                    onMouseOver={e => applyHover(e, btnPrimaryHover)}
                    onMouseOut={e => removeHover(e, btnPrimaryStyle)}
                  >
                    Get started
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-ink)', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
                  <LuMessageCircle size={24} color="var(--color-primary)" /> Reviews I've written
                </div>
                <div style={{ padding: '2rem 0', color: 'var(--color-stone)' }}>
                   No reviews written yet.
                </div>
              </div>
            </div>
          )}

          {ObjectTab === 'trips' && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 2rem', fontFamily: 'var(--font-display)' }}>Past trips</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {MOCK_ITINERARIES.map((trip, i) => (
                  <div key={i} style={{ ...glassCardStyle, padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex' }} onClick={() => navigate('/itinerary')} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
                    <div style={{ width: 140, position: 'relative' }}>
                      <img src={trip.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.title} />
                    </div>
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--glass-bg)' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-ink)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>{trip.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-stone)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <LuMapPin color="var(--color-secondary)" size={14} /> {trip.dest} • {trip.days} Days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {ObjectTab === 'connections' && (
             <div>
               <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 2rem', fontFamily: 'var(--font-display)' }}>Connections</h2>
               <div style={{ ...glassCardStyle, padding: '3rem', textAlign: 'center', borderStyle: 'dashed' }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
                  <p style={{ color: 'var(--color-stone)', fontSize: '1rem', margin: 0 }}>No connections yet. Connect with verified hosts and travelers.</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelerProfile;
