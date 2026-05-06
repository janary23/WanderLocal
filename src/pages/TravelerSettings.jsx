import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { LuUser, LuShield, LuBell, LuGlobe, LuCheck, LuX } from 'react-icons/lu';
import { glassCardStyle, glassCardHover, applyHover, removeHover } from '../inlineStyles';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

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
  const { userId } = useAuth();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userId) {
      api.getProfile(userId).then(data => {
        if (data.status === 'success') {
          setProfile(data.user);
        }
        setLoading(false);
      }).catch(err => {
        console.error('Failed to fetch profile', err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveEdit = async () => {
    if (!userId) return;
    setUpdating(true);
    try {
      const res = await api.updateProfile(userId, { [editingField]: editValue });
      if (res.status === 'success') {
        setProfile(prev => ({ ...prev, [editingField]: editValue }));
      } else {
        alert(res.message || 'Update failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating profile');
    }
    setUpdating(false);
    setEditingField(null);
  };

  const personalInfoItems = [
    { key: 'name', label: 'Legal name', value: profile.name || 'Not provided', action: 'Edit', editable: true },
    { key: 'bio', label: 'Preferred first name / Bio', value: profile.bio || 'Not provided', action: profile.bio ? 'Edit' : 'Add', editable: true },
    { key: 'email', label: 'Email address', value: profile.email || 'Not provided', action: 'Contact Support', editable: false },
    { key: 'phone', label: 'Phone numbers', value: profile.phone || 'Add a number so confirmed locals and WanderLocal can get in touch.', action: profile.phone ? 'Edit' : 'Add', editable: true },
    { key: 'address', label: 'Residential address', value: profile.address || 'Not provided', action: profile.address ? 'Edit' : 'Add', editable: true },
    { key: 'emergency', label: 'Emergency contact', value: 'Not provided', action: 'Add', editable: false }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '5rem' }}>
        
        {/* Settings Sidebar */}
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-ink)', marginBottom: '2.5rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Settings</h1>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'personal', label: 'Personal info', icon: <LuUser /> },
              { id: 'security', label: 'Login & security', icon: <LuShield /> },
              { id: 'notifications', label: 'Notifications', icon: <LuBell /> },
              { id: 'language', label: 'Preferences', icon: <LuGlobe /> },
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
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 2rem', fontFamily: 'var(--font-display)' }}>Personal information</h2>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-stone)' }}>Loading your information...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {personalInfoItems.map((item, idx) => (
                    <div key={idx} style={{ ...glassCardStyle, padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.2s' }} onMouseOver={e => !editingField && applyHover(e, glassCardHover)} onMouseOut={e => !editingField && removeHover(e, glassCardStyle)}>
                      {editingField === item.key ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ color: 'var(--color-ink)', fontWeight: 700, fontSize: '1.05rem' }}>Edit {item.label}</div>
                          <input 
                            type="text" 
                            value={editValue} 
                            onChange={e => setEditValue(e.target.value)} 
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', width: '100%', fontSize: '1rem', outline: 'none' }} 
                            disabled={updating}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button 
                              onClick={handleSaveEdit} 
                              disabled={updating}
                              style={{ background: 'var(--color-ink)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <LuCheck size={18} /> {updating ? 'Saving...' : 'Save'}
                            </button>
                            <button 
                              onClick={handleCancelEdit} 
                              disabled={updating}
                              style={{ background: 'transparent', color: 'var(--color-ink)', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, border: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <LuX size={18} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ paddingRight: '2rem' }}>
                            <div style={{ color: 'var(--color-ink)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{item.label}</div>
                            <div style={{ color: 'var(--color-stone)', fontSize: '0.95rem', lineHeight: 1.5 }}>{item.value}</div>
                          </div>
                          {item.editable ? (
                            <button 
                              onClick={() => handleEditClick(item.key, profile[item.key])}
                              style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}
                              onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                              onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                            >
                              {item.action}
                            </button>
                          ) : (
                            <span style={{ color: 'var(--color-stone)', fontSize: '0.9rem' }}>{item.action}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {ObjectTab !== 'personal' && (
             <div>
               <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 2rem', fontFamily: 'var(--font-display)' }}>
                 {ObjectTab === 'security' && 'Login & security'}
                 {ObjectTab === 'notifications' && 'Notifications'}
                 {ObjectTab === 'language' && 'Preferences'}
               </h2>
               <div style={{ ...glassCardStyle, padding: '3rem', textAlign: 'center', borderStyle: 'dashed' }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
                  <p style={{ color: 'var(--color-stone)' }}>These settings are not yet fully configured in this view.</p>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TravelerSettings;

