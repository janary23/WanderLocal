import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LuPen, LuEye, LuBookmark, LuBell, LuMegaphone, LuCamera, LuStore, LuClock, LuCircle, LuMap, LuPlus, LuActivity, LuArrowUpRight, LuUsers, LuTrendingUp, LuMapPin, LuCheck
} from 'react-icons/lu';

/* ── Color tokens ── */
import { glassCardStyle, glassCardHover, btnPrimaryStyle, btnPrimaryHover, btnSecondaryStyle, btnSecondaryHover, btnGhostStyle, btnGhostHover, applyHover, removeHover } from '../inlineStyles';

/* ── Common Styles ── */
const cardStyle = { 
  background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', 
  overflow: 'hidden', boxShadow: 'var(--shadow-xs)', backdropFilter: 'var(--glass-blur)',
  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
};
const cardHeaderStyle = { background: 'transparent', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' };
const cardBodyStyle = { padding: '1.5rem' };
const headingStyle = { fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: 10, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' };

/* ── Stats Bar ── */
function StatsBar() {
  const stats = [
    { label: 'Profile Views', value: '1,245', trend: '+12%', icon: <LuEye />, color: 'var(--color-primary)' },
    { label: 'Shortlist Saves', value: '312', trend: '+5%', icon: <LuBookmark />, color: 'var(--color-accent)' },
    { label: 'Itinerary Adds', value: '89', trend: '+24%', icon: <LuMap />, color: 'var(--color-stone)' },
    { label: 'Active Status', value: 'Verified', trend: null, icon: <LuCircle />, color: 'var(--color-secondary)' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
      {stats.map((s, i) => (
        <div key={i} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)} style={{ ...glassCardStyle, 
          padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: 'var(--glass-bg)', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
              {s.icon}
            </div>
            {s.trend && (
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: s.trend.startsWith('+') ? 'var(--color-secondary)' : 'var(--color-stone)', background: s.trend.startsWith('+') ? 'rgba(90,139,168,0.1)' : 'var(--color-sand)', padding: '4px 10px', borderRadius: '8px' }}>
                <LuTrendingUp size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> {s.trend}
              </div>
            )}
          </div>
          <div style={{ marginTop: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-ink)', lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-stone)', fontWeight: 600, marginTop: 12 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Overview Tab ── */
function OverviewTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
      {/* ── Left Column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Profile Details Card */}
        <div style={glassCardStyle} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
          <div style={cardHeaderStyle}>
            <h3 style={headingStyle}>
               <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <LuStore color="var(--color-primary)" size={18} />
               </div>
               Profile Details
            </h3>
            <button style={{ ...btnGhostStyle,  padding: '0.6rem 1.25rem', fontSize: '0.9rem'  }} onMouseOver={e => applyHover(e, btnGhostHover)} onMouseOut={e => removeHover(e, btnGhostStyle)}>
               Edit Details
            </button>
          </div>
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.5rem' }}>
                <span style={{ color: 'var(--color-stone)', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}><LuStore size={20} /> Category</span>
                <span style={{ fontWeight: 800, color: 'var(--color-ink)', fontSize: '1rem', background: 'var(--color-sand)', padding: '4px 12px', borderRadius: 8 }}>Food & Beverage</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.5rem' }}>
                <span style={{ color: 'var(--color-stone)', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}><LuClock size={20} /> Hours</span>
                <span style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: '1rem', textAlign: 'right', lineHeight: 1.6 }}>Mon-Fri: 8AM–8PM<br/><span style={{ color: 'var(--color-stone-light)' }}>Sat-Sun: 9AM–9PM</span></span>
              </div>
              <div>
                <span style={{ color: 'var(--color-stone)', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', display: 'block' }}>Highlights & Tags</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {['Eco-friendly', 'Family-owned', 'Local Heritage'].map(tag => (
                    <span key={tag} style={{ 
                      background: 'var(--color-surface)', color: 'var(--color-ink)', border: '1px solid rgba(0,0,0,0.1)', 
                      borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 700,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      {tag}
                    </span>
                  ))}
                  <button style={{ ...btnGhostStyle,  padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px', borderStyle: 'dashed'  }} onMouseOver={e => applyHover(e, btnGhostHover)} onMouseOut={e => removeHover(e, btnGhostStyle)}>
                      <LuPlus size={16} /> Add Tag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Card */}
        <div style={glassCardStyle} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
          <div style={cardHeaderStyle}>
            <h3 style={headingStyle}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-accent-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LuCamera color="var(--color-accent)" size={18} />
              </div>
              Photo Gallery
            </h3>
            <button style={{ color: 'var(--color-primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>Manage</button>
          </div>
          <div style={{ padding: '2rem' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800&h=600',
                  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800&h=600',
                  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=800&h=600',
                ].map((url, i) => (
                  <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', height: 160, position: 'relative', cursor: 'pointer', boxShadow: 'var(--shadow-xs)' }}
                       onMouseOver={e => e.currentTarget.querySelector('.overlay').style.opacity = 1}
                       onMouseOut={e => e.currentTarget.querySelector('.overlay').style.opacity = 0}>
                    <img src={url} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }} 
                         onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                         onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                    <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(11,22,33,0.5)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', backdropFilter: 'blur(2px)' }}>
                      <LuEye size={24} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── Right Column ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ ...glassCardStyle,  position: 'sticky', top: 100  }} onMouseOver={e => applyHover(e, glassCardHover)} onMouseOut={e => removeHover(e, glassCardStyle)}>
          <div style={cardHeaderStyle}>
            <h3 style={headingStyle}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LuBell color="#fff" size={18} />
              </div>
              Highlights & Alerts
            </h3>
          </div>
          <div>
            <div style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background='var(--color-surface)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--color-primary-pale)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>
                <LuMap />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-ink)', margin: '0 0 6px' }}>Itinerary Feature</h4>
                <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>You were added to "Vigan Weekend" public itinerary by a verified traveler.</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-stone-light)', marginTop: 8, fontWeight: 700 }}>2 hours ago</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem 2rem', transition: 'background 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background='var(--color-surface)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--color-accent-pale)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>
                <LuMegaphone />
              </div>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-ink)', margin: '0 0 6px' }}>New Nomination!</h4>
                <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>A traveler nominated you: "Best hot chocolate in town!" You gained 1 reputation point.</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-stone-light)', marginTop: 8, fontWeight: 700 }}>Yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BusinessDashboard = () => {
  return (
    <DashboardLayout activeTabId="overview">
      <div className="animate-fade-in" style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '2rem 3rem 6rem' }}>

        {/* Premium Header Section */}
        <div style={{ 
          marginBottom: '4rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '3rem'
        }}>
          <div>
            <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--color-primary-pale)', color: 'var(--color-primary)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Business Dashboard
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-ink)', letterSpacing: '-0.03em', margin: '0 0 1rem', lineHeight: 1.05 }}>
              Cafe Amore Hub
            </h1>
            <p style={{ color: 'var(--color-stone)', margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}>
              Business Overview & Analytics
              <span style={{ 
                background: 'var(--color-secondary-alt)', 
                color: 'var(--color-secondary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800, 
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
                <LuCheck size={14} color="var(--color-secondary)" /> Verified Partner
              </span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
             <button style={btnSecondaryStyle} onMouseOver={e => applyHover(e, btnSecondaryHover)} onMouseOut={e => removeHover(e, btnSecondaryStyle)}>
               <LuArrowUpRight size={18} /> View Public Profile
             </button>
             <button style={btnPrimaryStyle} onMouseOver={e => applyHover(e, btnPrimaryHover)} onMouseOut={e => removeHover(e, btnPrimaryStyle)}>
               <LuPlus size={18} /> New Update
             </button>
          </div>
        </div>

        {/* Stats Bar */}
        <StatsBar />

        {/* Overview Content */}
        <OverviewTab />

      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;
