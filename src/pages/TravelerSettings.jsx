import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuUser, LuShield, LuBell, LuGlobe } from 'react-icons/lu';

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

const TravelerSettings = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <AccountSettingsView navigate={navigate} />
    </DashboardLayout>
  );
};

const AccountSettingsView = ({ navigate }) => {
  const ObjectTab = new URLSearchParams(useLocation().search).get('sub') || 'personal';

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '5rem' }}>
        
        {/* Settings Sidebar */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: C.inkDark, marginBottom: '2.5rem', fontFamily: C.ffBody }}>Account settings</h1>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { id: 'personal', label: 'Personal information', icon: <LuUser /> },
              { id: 'security', label: 'Login & security', icon: <LuShield /> },
              { id: 'notifications', label: 'Notifications', icon: <LuBell /> },
              { id: 'language', label: 'Languages & currency', icon: <LuGlobe /> },
            ].map(item => {
              const isActive = ObjectTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/account-settings?sub=${item.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'left',
                    padding: '0.85rem 1.25rem',
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
                  {React.cloneElement(item.icon, { size: 20 })} {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content Area */}
        <div style={{ paddingTop: '1rem' }}>
          
          {ObjectTab === 'personal' && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: C.inkDark, margin: '0 0 2rem', fontFamily: C.ffBody }}>Personal information</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Row 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Legal name</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem' }}>Alex Traveler</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Edit</button>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Preferred first name</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem' }}>Not provided</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Add</button>
                </div>

                {/* Row 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Email address</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem' }}>alex***@wanderlocal.ph</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Edit</button>
                </div>

                {/* Row 4 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ paddingRight: '2rem' }}>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Phone numbers</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem', lineHeight: 1.5 }}>Add a number so confirmed locals and WanderLocal can get in touch. You can add other numbers and choose how they're used.</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Add</button>
                </div>

                {/* Row 5 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Residential address</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem' }}>Not provided</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Add</button>
                </div>

                {/* Row 6 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0' }}>
                  <div>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Emergency contact</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem' }}>Not provided</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Add</button>
                </div>

              </div>
            </div>
          )}

          {ObjectTab !== 'personal' && (
             <div>
               <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: C.inkDark, margin: '0 0 2rem', fontFamily: C.ffBody }}>
                 {ObjectTab === 'security' && 'Login & security'}
                 {ObjectTab === 'notifications' && 'Notifications'}
                 {ObjectTab === 'language' && 'Languages & currency'}
               </h2>
               <p style={{ color: C.stone }}>These settings are not yet fully configured in this view.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TravelerSettings;
