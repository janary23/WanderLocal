import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { getAdminStats, getQueue, updateQueueItem, getNominations, updateNomination, getAllUsers } from '../services/api';
import { LuUsers, LuPackage, LuCircle, LuSettings, LuShieldCheck, LuCheck, LuX, LuSearch, LuLoader } from 'react-icons/lu';

const C = {
  primary: '#4A90C2', secondary: '#5A8BA8', accent: '#F39C12', terracotta: '#E53935',
  ink: '#0F1E2D', stone: '#5F6B7A', stoneLight: '#8D9DB0', border: '#DDE3ED',
  bg: '#F7F9FC', bgSurface: '#FFFFFF', ffDisplay: "'Manrope', sans-serif",
};
const cardStyle = { background: C.bgSurface, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden' };
const cardHeaderStyle = { background: 'transparent', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' };
const headingStyle = { fontSize: '1.1rem', fontWeight: 700, color: C.ink, display: 'flex', alignItems: 'center', gap: 10, margin: 0 };

const TABS = [
  { id: 'queue', label: 'Verifications', icon: <LuShieldCheck /> },
  { id: 'nominations', label: 'Nominations', icon: <LuCircle /> },
  { id: 'users', label: 'Users', icon: <LuUsers /> },
  { id: 'settings', label: 'Platform', icon: <LuSettings /> },
];

function StatsBar({ stats }) {
  if (!stats) return null;
  const items = [
    { label: 'Pending Verifications', value: stats.pending_verifications, icon: <LuShieldCheck />, color: C.accent, bg: '#FFF7ED', border: '#FDE68A' },
    { label: 'New Nominations', value: stats.pending_nominations, icon: <LuCircle />, color: C.primary, bg: '#E8F1F7', border: '#BAD6EA' },
    { label: 'Total Listings', value: stats.active_listings, icon: <LuPackage />, color: C.secondary, bg: '#EDF4F8', border: '#C3E2BC' },
    { label: 'Registered Users', value: stats.total_users, icon: <LuUsers />, color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
      {items.map((s, i) => (
        <div key={i} style={{ borderRadius: 20, border: `1px solid ${s.border}`, background: s.bg, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: s.color, flexShrink: 0 }}>{s.icon}</div>
          <div>
            <div style={{ fontFamily: C.ffDisplay, fontSize: '1.75rem', fontWeight: 800, color: C.ink, lineHeight: 1 }}>{s.value ?? '—'}</div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: s.color, marginTop: 6 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VerificationsTab() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getQueue().then(d => { if (d.status === 'success') setQueue(d.queue); setLoading(false); });
  }, []);

  const handle = async (lid, action) => {
    await updateQueueItem(lid, action, 'verified');
    setQueue(prev => prev.filter(i => i.id !== lid));
  };

  const filtered = queue.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <h3 style={headingStyle}><LuShieldCheck color={C.accent} /> Verification Queue</h3>
        <div style={{ display: 'flex', alignItems: 'center', background: '#F4F6F9', borderRadius: 8, padding: '0.25rem 0.5rem', border: `1px solid ${C.border}` }}>
          <LuSearch color={C.stone} size={14} style={{ margin: '0 0.5rem' }} />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: 120, fontFamily: 'inherit' }} />
        </div>
      </div>
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: C.stone }}><LuLoader style={{ animation: 'spin 1s linear infinite' }} /> Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: C.stone }}>No pending verifications.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}`, background: '#F8FAFC' }}>
                {['Business Name', 'Type & Location', 'Submitted', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', fontWeight: 600, color: C.stone, fontSize: '0.85rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '1rem 1.5rem' }}><div style={{ fontWeight: 700, color: C.ink }}>{item.name}</div><div style={{ fontSize: '0.8rem', color: C.stone }}>{item.owner || '—'}</div></td>
                  <td style={{ padding: '1rem 1.5rem', color: C.stone, fontSize: '0.85rem' }}>{item.type} • {item.city}</td>
                  <td style={{ padding: '1rem 1.5rem', color: C.stone, fontSize: '0.85rem' }}>{new Date(item.submitted).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: 8 }}>
                    <button onClick={() => handle(item.id, 'approve')} style={{ background: '#D1FAE5', color: '#10B981', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}><LuCheck size={14} /> Approve</button>
                    <button onClick={() => handle(item.id, 'reject')} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 8, padding: '0.4rem 0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}><LuX size={14} /> Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NominationsTab() {
  const [noms, setNoms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNominations().then(d => { if (d.status === 'success') setNoms(d.nominations); setLoading(false); });
  }, []);

  const handle = async (id, status) => {
    await updateNomination(id, status);
    setNoms(prev => prev.map(n => n.id === id ? { ...n, status } : n));
  };

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}><h3 style={headingStyle}><LuCircle color={C.primary} /> Community Nominations</h3></div>
      {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: C.stone }}>Loading...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}`, background: '#F8FAFC' }}>
                {['Business', 'Location', 'Category', 'Submitted by', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', fontWeight: 600, color: C.stone, fontSize: '0.85rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noms.map(n => (
                <tr key={n.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: C.ink }}>{n.business_name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: C.stone, fontSize: '0.85rem' }}>{n.city || '—'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: C.stone, fontSize: '0.85rem' }}>{n.category || '—'}</td>
                  <td style={{ padding: '1rem 1.5rem', color: C.stone, fontSize: '0.85rem' }}>{n.nominator}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ background: n.status === 'approved' ? '#D1FAE5' : n.status === 'rejected' ? '#FEE2E2' : '#FFF7ED', color: n.status === 'approved' ? '#10B981' : n.status === 'rejected' ? '#DC2626' : C.accent, padding: '4px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>{n.status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: 8 }}>
                    {n.status === 'pending' && <>
                      <button onClick={() => handle(n.id, 'approved')} style={{ background: '#D1FAE5', color: '#10B981', border: 'none', borderRadius: 8, padding: '0.35rem 0.65rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' }}>Approve</button>
                      <button onClick={() => handle(n.id, 'rejected')} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 8, padding: '0.35rem 0.65rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem' }}>Reject</button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then(d => { if (d.status === 'success') setUsers(d.users); setLoading(false); });
  }, []);

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}><h3 style={headingStyle}><LuUsers color={C.primary} /> Registered Users</h3></div>
      {loading ? <div style={{ padding: '3rem', textAlign: 'center', color: C.stone }}>Loading...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, background: '#F8FAFC' }}>
              {['Name', 'Email', 'Role', 'Joined'].map(h => (
                <th key={h} style={{ padding: '1rem 1.5rem', fontWeight: 600, color: C.stone, fontSize: '0.85rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: C.ink }}>{u.name}</td>
                <td style={{ padding: '1rem 1.5rem', color: C.stone, fontSize: '0.9rem' }}>{u.email}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ background: u.role === 'admin' ? '#F5F3FF' : u.role === 'business' ? '#E8F1F7' : '#EDF4F8', color: u.role === 'admin' ? '#8B5CF6' : u.role === 'business' ? C.primary : C.secondary, padding: '4px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>{u.role}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: C.stoneLight, fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const activeTab = new URLSearchParams(location.search).get('tab') || 'queue';

  useEffect(() => {
    getAdminStats().then(d => { if (d.status === 'success') setStats(d.stats); });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'queue':       return <VerificationsTab />;
      case 'nominations': return <NominationsTab />;
      case 'users':       return <UsersTab />;
      default:            return <VerificationsTab />;
    }
  };

  return (
    <DashboardLayout activeTabId={activeTab}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', padding: '3rem 2rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: C.ffDisplay, fontSize: '3rem', fontWeight: 800, color: C.ink, letterSpacing: '-0.03em', margin: '0 0 0.5rem' }}>System Command</h1>
          <p style={{ color: C.stone, margin: 0, fontSize: '1.1rem' }}>Admin Moderation & Quality Control</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', borderBottom: `1px solid ${C.border}`, marginBottom: '2.5rem' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => navigate(`/admin${tab.id === 'queue' ? '' : `?tab=${tab.id}`}`)}
                style={{ background: 'transparent', border: 'none', padding: '0 0 1rem 0', color: isActive ? C.ink : C.stone, fontWeight: isActive ? 700 : 500, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: isActive ? `3px solid ${C.ink}` : '3px solid transparent', fontFamily: 'inherit' }}>
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        <StatsBar stats={stats} />
        {renderContent()}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </DashboardLayout>
  );
};

export default AdminDashboard;
