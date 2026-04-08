import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuMessageCircle } from 'react-icons/lu';

const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  accent: '#F39C12',
  terracotta: '#E53935',
  ink: '#0F1E2D',
  inkDark: '#222222',
  stone: '#5F6B7A',
  stoneLight: '#8D9DB0',
  border: '#DDE3ED',
  bgSurface: '#FFFFFF',
  ffBody: "'Inter', sans-serif",
  ffDisplay: "'Manrope', sans-serif",
};

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
    <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)', gap: '6rem' }}>
        
        {/* Profile Sidebar */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: C.inkDark, marginBottom: '2.5rem', fontFamily: C.ffDisplay }}>Profile</h1>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
                    padding: '0.75rem 1rem',
                    background: isActive ? '#F7F7F7' : 'transparent',
                    color: isActive ? C.inkDark : C.stone,
                    fontWeight: isActive ? 600 : 400,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontFamily: C.ffBody,
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => !isActive && (e.currentTarget.style.background = '#F7F7F7')}
                  onMouseOut={e => !isActive && (e.currentTarget.style.background = 'transparent')}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Content */}
        <div>
          {ObjectTab === 'about' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: C.inkDark, margin: 0 }}>About me</h2>
                <button style={{ borderRadius: '8px', border: `1px solid ${C.inkDark}`, background: 'transparent', padding: '0.5rem 1rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: C.ffBody }}>Edit</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem' }}>
                <div style={{ borderRadius: '24px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', border: `1px solid ${C.border}` }}>
                  <div style={{ width: 104, height: 104, borderRadius: '50%', background: C.inkDark, color: '#fff', fontSize: '3rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    AL
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: C.inkDark, margin: '0 0 0.5rem' }}>Alex</h3>
                  <p style={{ color: C.stone, fontSize: '1rem', margin: 0 }}>Guest</p>
                </div>

                <div style={{ alignSelf: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: C.inkDark, marginBottom: '0.5rem' }}>Complete your profile</h3>
                  <p style={{ color: C.stone, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Your WanderLocal profile is an important part of every journey. Complete yours to help others get to know you.
                  </p>
                  <button style={{ background: '#E61E4D', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: C.ffBody }}>
                    Get started
                  </button>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '3rem', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: C.inkDark, fontWeight: 600 }}>
                  <LuMessageCircle size={20} /> Reviews I've written
                </div>
              </div>
            </div>
          )}

          {ObjectTab === 'trips' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: C.inkDark, margin: '0 0 2rem' }}>Past trips</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {MOCK_ITINERARIES.map((trip, i) => (
                  <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, cursor: 'pointer', background: '#fff', display: 'flex' }} onClick={() => navigate('/itinerary')}>
                    <div style={{ width: 140, height: 120, position: 'relative' }}>
                      <img src={trip.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.title} />
                    </div>
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: C.ink, marginBottom: 6 }}>{trip.title}</div>
                      <div style={{ fontSize: '0.85rem', color: C.stone }}>{trip.dest} • {trip.days} Days</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {ObjectTab === 'connections' && (
             <div>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: C.inkDark, margin: '0 0 2rem' }}>Connections</h2>
               <p style={{ color: C.stone }}>No connections yet. Connect with verified hosts and travelers.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelerProfile;
