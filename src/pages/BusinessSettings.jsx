import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuStore, LuCreditCard, LuUsers, LuBell } from 'react-icons/lu';

const C = {
  inkDark: '#222222',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  ffBody: "'Inter', sans-serif",
};

const BusinessSettings = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout activeTabId="settings">
      <BusinessSettingsView navigate={navigate} />
    </DashboardLayout>
  );
};

const BusinessSettingsView = ({ navigate }) => {
  const ObjectTab = new URLSearchParams(useLocation().search).get('sub') || 'profile';

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '5rem' }}>
        
        {/* Sidebar */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: C.inkDark, marginBottom: '2.5rem', fontFamily: C.ffBody }}>Business settings</h1>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { id: 'profile', label: 'Business Profile', icon: <LuStore /> },
              { id: 'payouts', label: 'Payments & Payouts', icon: <LuCreditCard /> },
              { id: 'team', label: 'Team Management', icon: <LuUsers /> },
              { id: 'notifications', label: 'Notifications', icon: <LuBell /> },
            ].map(item => {
              const isActive = ObjectTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/business/settings?sub=${item.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left',
                    padding: '0.85rem 1.25rem', background: isActive ? '#F7F7F7' : 'transparent',
                    color: isActive ? C.inkDark : C.stone, fontWeight: isActive ? 600 : 400,
                    borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem',
                    fontFamily: C.ffBody, transition: 'background 0.2s',
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

        {/* Content Area */}
        <div style={{ paddingTop: '1rem' }}>
          {ObjectTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: C.inkDark, margin: '0 0 2rem', fontFamily: C.ffBody }}>Business Profile</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Legal Business Name</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem' }}>Cafe Amore Inc.</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Edit</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Registration Number (TIN/SEC)</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem' }}>123-456-789-000</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Edit</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Business Contact Email</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem' }}>hello@cafeamore.ph</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: C.inkDark, textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', fontFamily: C.ffBody }}>Edit</button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0' }}>
                  <div style={{ paddingRight: '2rem' }}>
                    <div style={{ color: C.inkDark, fontWeight: 400, fontSize: '1rem', marginBottom: '0.25rem' }}>Public Verification Badge</div>
                    <div style={{ color: C.stone, fontSize: '0.9rem', lineHeight: 1.5 }}>Display that you are a verified WandereLocal host.</div>
                  </div>
                  <div style={{ fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center' }}>Verified</div>
                </div>

              </div>
            </div>
          )}

          {ObjectTab !== 'profile' && (
             <div>
               <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: C.inkDark, margin: '0 0 2rem', fontFamily: C.ffBody }}>
                 {ObjectTab === 'payouts' && 'Payments & Payouts'}
                 {ObjectTab === 'team' && 'Team Management'}
                 {ObjectTab === 'notifications' && 'Notifications'}
               </h2>
               <p style={{ color: C.stone }}>These settings are currently under development.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;
