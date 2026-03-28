import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LuCircle, LuUsers, LuPackage, LuCheck, LuX, LuUndo, LuEye, LuSearch, LuFilter, LuDownload, LuClock, LuMapPin, LuSettings, LuBell, LuShield, LuDatabase, LuUserCheck, LuChevronRight, LuPlus, LuPen, LuTrash2, LuToggleRight, LuToggleLeft, LuStar, LuCircleDot, LuDot
} from 'react-icons/lu';

/* ─── Tab metadata ─────────────────────────────────────────── */
const TABS = {
  queue:       { label: 'Verification Queue',   icon: <LuCircle /> },
  nominations: { label: 'Nominations',          icon: <LuCircle /> },
  integrity:   { label: 'Directory Integrity',  icon: <LuDatabase /> },
  users:       { label: 'User Management',      icon: <LuUsers /> },
  analytics:   { label: 'Analytics',            icon: <LuCircle /> },
  settings:    { label: 'Settings',             icon: <LuSettings /> },
};

/* ─── Mock data ────────────────────────────────────────────── */
const QUEUE_ITEMS = [
  {
    id: 1, name: "Aling Nena's Eatery", cat: 'Food & Beverage',
    addr: '12 Palengke Rd, Baguio City', time: '2 hrs ago',
    badge: 'Fresh Registration', badgeClass: 'bg-success-subtle text-success',
    docs: 'DTI_Permit.pdf', rating: null,
  },
  {
    id: 2, name: 'Baler Surf Shack', cat: 'Recreation',
    addr: 'Aurora Coastal Rd, Baler', time: '5 hrs ago',
    badge: 'Re-submission', badgeClass: 'bg-warning-subtle text-warning',
    docs: 'Business_Permit.pdf', rating: null,
  },
  {
    id: 3, name: 'Vigan Heritage Inn', cat: 'Accommodation',
    addr: 'Calle Crisologo, Vigan', time: '1 day ago',
    badge: 'First-time', badgeClass: 'bg-info-subtle text-info',
    docs: 'Franchise_Cert.pdf', rating: null,
  },
];

const NOMINATION_ITEMS = [
  { id: 1, name: "Joe's Diner", nominator: 'Maria Santos', count: 15, cat: 'Food & Beverage', location: 'Session Rd, Baguio', status: 'Pending' },
  { id: 2, name: 'Taho Vendor — Session Rd', nominator: 'Juan dela Cruz', count: 8, cat: 'Street Food', location: 'Session Rd, Baguio', status: 'Reviewed' },
  { id: 3, name: 'Baler Surf Shack', nominator: 'Ana Reyes', count: 5, cat: 'Recreation', location: 'Aurora Coastal', status: 'Pending' },
  { id: 4, name: 'Vigan Heritage Walk', nominator: 'Pedro Reyes', count: 4, cat: 'Tourism', location: 'Vigan, Ilocos Sur', status: 'Approved' },
];

const USER_LIST = [
  { id: 1, name: 'Maria Santos',    email: 'maria@example.com',  role: 'Traveler',       status: 'Active',    joined: 'Mar 1, 2026' },
  { id: 2, name: 'Juan dela Cruz',  email: 'juan@example.com',   role: 'Business Owner', status: 'Active',    joined: 'Feb 15, 2026' },
  { id: 3, name: 'Ana Reyes',       email: 'ana@example.com',    role: 'Traveler',       status: 'Suspended', joined: 'Jan 20, 2026' },
  { id: 4, name: 'Pedro Gomez',     email: 'pedro@example.com',  role: 'Business Owner', status: 'Active',    joined: 'Mar 5, 2026' },
  { id: 5, name: 'LuCircle Villanueva',  email: 'luz@example.com',    role: 'Traveler',       status: 'Active',    joined: 'Mar 10, 2026' },
];

const INTEGRITY_ITEMS = [
  { id: 1, name: "Joe's Diner", issue: 'Duplicate listing detected', severity: 'high',   location: 'Baguio City' },
  { id: 2, name: 'Inabel Craft Market', issue: 'Missing category tag', severity: 'low',  location: 'Vigan' },
  { id: 3, name: 'Surf Resort X',       issue: 'Outdated contact info', severity: 'med', location: 'Baler' },
];

/* ─── Sub-components ────────────────────────────────────────── */

/* Stats bar */
function StatsBar() {
  const stats = [
    { label: 'Pending Reviews',      value: '12',   icon: <LuClock />,         color: 'var(--terracotta)', bg: 'var(--terra-pale)', border: 'var(--terra-border)' },
    { label: 'Verified Businesses',  value: '420',  icon: <LuCircle />,        color: 'var(--secondary)', bg: 'var(--primary-alt-pale)', border: 'var(--primary-alt-border)' },
    { label: 'Total Users',          value: '5.2K', icon: <LuUsers />,         color: 'var(--primary)', bg: 'var(--primary-pale)', border: 'var(--primary-border)' },
    { label: 'Nominations This Week',value: '34',   icon: <LuStar />,          color: 'var(--accent)', bg: '#FFF7ED', border: '#FDE68A' },
  ];
  return (
    <div className="row g-3 mb-4">
      {stats.map((s, i) => (
        <div className="col-6 col-xl-3" key={i}>
          <div className="card border-0 h-100" style={{ borderRadius: 16, border: `1px solid ${s.border}` || 'transparent', background: s.bg, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="card-body d-flex align-items-center gap-3">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', color: s.color, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div className="fw-bold lh-1" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', color: 'var(--ink)' }}>{s.value}</div>
                <div className="mt-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, color: s.color }}>{s.label}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Verification Queue ───────────────────────── */
function VerificationQueue() {
  const [items, setItems] = useState(QUEUE_ITEMS);
  const [search, setSearch] = useState('');
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const handleAction = (id, action) => {
    setItems(prev => prev.filter(i => i.id !== id));
    // In production: call API
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-light border-end-0">
            <LuSearch className="text-muted" style={{ fontSize: '0.8rem' }} />
          </span>
          <input
            className="form-control border-start-0 bg-light"
            placeholder="Search submissions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          />
        </div>
        <select className="form-select" style={{ maxWidth: 160, fontSize: '0.875rem' }}>
          <option>All Types</option>
          <option>Fresh Registration</option>
          <option>Re-submission</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-5 text-muted">
          <LuCircle className="fs-1 text-success mb-3" />
          <p className="fw-semibold">Queue is clear! No pending submissions.</p>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {filtered.map(item => (
          <div key={item.id} className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="card-body">
              <div className="row align-items-start g-3">
                {/* Business info */}
                <div className="col-md-7">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <h5 className="mb-0 fw-bold" style={{ color: 'var(--ink)' }}>{item.name}</h5>
                    <span className={`badge rounded-pill ${item.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                      {item.badge}
                    </span>
                  </div>
                  <div className="d-flex flex-column gap-1" style={{ fontSize: '0.85rem', color: 'var(--stone)' }}>
                    <span><strong className="text-dark">Category:</strong> {item.cat}</span>
                    <span><LuMapPin className="me-1" style={{ fontSize: '0.75rem' }} />{item.addr}</span>
                    <span><LuClock className="me-1" style={{ fontSize: '0.75rem' }} />Submitted {item.time}</span>
                  </div>
                  <button className="btn btn-sm btn-light border mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                    <LuEye /> View {item.docs}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="col-md-5">
                  <div className="d-flex flex-column gap-2 align-items-stretch align-items-md-end">
                    <button
                      className="btn btn-success btn-sm d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: 10, fontWeight: 600 }}
                      onClick={() => handleAction(item.id, 'approve')}
                    >
                      <LuCheck /> Approve
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: 10, fontWeight: 600 }}
                      onClick={() => handleAction(item.id, 'revise')}
                    >
                      <LuUndo /> Request Revision
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: 10, fontWeight: 600 }}
                      onClick={() => handleAction(item.id, 'reject')}
                    >
                      <LuX /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Nominations ─────────────────────────────── */
function Nominations() {
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Pending', 'Reviewed', 'Approved'];
  const filtered = filter === 'All' ? NOMINATION_ITEMS : NOMINATION_ITEMS.filter(n => n.status === filter);

  const statusClass = (s) => {
    if (s === 'Approved') return 'bg-success-subtle text-success';
    if (s === 'Reviewed') return 'bg-info-subtle text-info';
    return 'bg-warning-subtle text-warning';
  };

  return (
    <div>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {statuses.map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-dark' : 'btn-outline-secondary'}`}
            style={{ borderRadius: 20, fontWeight: 600, fontSize: '0.8rem' }}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)' }}>Business Name</th>
                <th style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)' }}>Category</th>
                <th style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)' }}>Location</th>
                <th style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)' }}>Nominations</th>
                <th style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)' }}>Status</th>
                <th style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="fw-semibold" style={{ color: 'var(--ink)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--stone-light)' }}>by {item.nominator}</div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--stone)' }}>{item.cat}</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--stone)' }}>
                    <LuMapPin className="me-1" style={{ fontSize: '0.75rem' }} />{item.location}
                  </td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary rounded-pill fw-bold">{item.count}</span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${statusClass(item.status)}`} style={{ fontSize: '0.7rem' }}>{item.status}</span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-success" style={{ borderRadius: 8, fontSize: '0.75rem' }}>
                        <LuCheck /> Invite
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8, fontSize: '0.75rem' }}>
                        <LuEye /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Directory Integrity ─────────────────────── */
function DirectoryIntegrity() {
  const sevBadge = (s) => {
    if (s === 'high') return 'bg-danger-subtle text-danger';
    if (s === 'med')  return 'bg-warning-subtle text-warning';
    return 'bg-secondary-subtle text-secondary';
  };

  return (
    <div>
      <div className="row g-3 mb-4">
        {[
          { label: 'Issues Found',   value: '3',  icon: <LuCircle />, color: 'text-danger',   bg: 'bg-danger-subtle' },
          { label: 'Auto-resolved',  value: '12', icon: <LuCircle />,       color: 'text-success',  bg: 'bg-success-subtle' },
          { label: 'Under Review',   value: '1',  icon: <LuShield />,         color: 'text-warning',  bg: 'bg-warning-subtle' },
        ].map((s, i) => (
          <div className="col-md-4" key={i}>
            <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className={`rounded-3 p-3 fs-4 ${s.bg} ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="fw-bold fs-3 lh-1" style={{ fontFamily: 'var(--ff-display)' }}>{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3">
          <h6 className="mb-0 fw-bold">Flagged Listings</h6>
          <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8 }}>
            <LuDatabase className="me-1" /> Run Integrity Scan
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)', fontWeight: 700 }}>Business</th>
                <th style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)', fontWeight: 700 }}>Issue</th>
                <th style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)', fontWeight: 700 }}>Severity</th>
                <th style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {INTEGRITY_ITEMS.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="fw-semibold" style={{ color: 'var(--ink)' }}>{item.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}><LuMapPin className="me-1" />{item.location}</div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--stone)' }}>{item.issue}</td>
                  <td>
                    <span className={`badge rounded-pill ${sevBadge(item.severity)} text-capitalize`} style={{ fontSize: '0.7rem' }}>
                      {item.severity === 'high' ? ' High' : item.severity === 'med' ? ' Medium' : <><LuDot className="me-1" /> Low</>}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-success" style={{ borderRadius: 8, fontSize: '0.75rem' }}><LuCheck /> Resolve</button>
                      <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 8, fontSize: '0.75rem' }}><LuTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── User Management ─────────────────────────── */
function UserManagement() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(USER_LIST);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
    ));
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-light border-end-0">
            <LuSearch className="text-muted" style={{ fontSize: '0.8rem' }} />
          </span>
          <input
            className="form-control border-start-0 bg-light"
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: '0.875rem' }}
          />
        </div>
        <select className="form-select" style={{ maxWidth: 160, fontSize: '0.875rem' }}>
          <option>All Roles</option>
          <option>Traveler</option>
          <option>Business Owner</option>
        </select>
        <button className="btn btn-sm btn-dark ms-auto d-flex align-items-center gap-2" style={{ borderRadius: 10, fontWeight: 600 }}>
          <LuUserCheck /> Invite Admin
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--stone)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                        style={{ width: 34, height: 34, background: 'var(--secondary)', fontSize: '0.72rem', flexShrink: 0 }}
                      >
                        {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <span className="fw-semibold" style={{ color: 'var(--ink)', fontSize: '0.875rem' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--stone)' }}>{u.email}</td>
                  <td>
                    <span className={`badge rounded-pill ${u.role === 'Business Owner' ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`} style={{ fontSize: '0.7rem' }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${u.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '0.7rem' }}>
                      {u.status === 'Active' ? <><LuCircleDot size={12} className="me-1"/> Active</> : <><LuCircle size={12} className="me-1"/> Suspended</>}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--stone-light)' }}>{u.joined}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8, fontSize: '0.75rem' }}>
                        <LuEye />
                      </button>
                      <button
                        className={`btn btn-sm ${u.status === 'Active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                        style={{ borderRadius: 8, fontSize: '0.75rem' }}
                        onClick={() => toggleStatus(u.id)}
                        title={u.status === 'Active' ? 'Suspend' : 'Activate'}
                      >
                        {u.status === 'Active' ? <LuToggleRight /> : <LuToggleLeft />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-transparent d-flex align-items-center justify-content-between py-2 px-3">
          <small className="text-muted">{filtered.length} user{filtered.length !== 1 ? 's' : ''} shown</small>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-light border"><LuChevronRight style={{ transform: 'rotate(180deg)' }} /></button>
            <button className="btn btn-sm btn-light border"><LuChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Analytics ───────────────────────────────── */
function Analytics() {
  const topPlaces = [
    { name: "Joe's Diner", count: 15, pct: 100 },
    { name: 'Taho Vendor — Session Rd', count: 8, pct: 53 },
    { name: 'Baler Surf Shack', count: 5, pct: 33 },
    { name: 'Vigan Heritage Walk', count: 4, pct: 27 },
    { name: 'Batad Rice Terraces Tour', count: 3, pct: 20 },
  ];
  const regions = [
    { region: 'CAR (Baguio)', verified: 142, pending: 6 },
    { region: 'Ilocos Region', verified: 89, pending: 3 },
    { region: 'Aurora', verified: 45, pending: 2 },
    { region: 'Metro Manila', verified: 108, pending: 1 },
    { region: 'Cagayan Valley', verified: 36, pending: 0 },
  ];

  return (
    <div className="row g-3">
      {/* Top Nominations */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3">
            <h6 className="mb-0 fw-bold"><LuStar className="me-2 text-warning" />Top Nominated Places</h6>
            <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8, fontSize: '0.78rem' }}>
              Send Batch Invites
            </button>
          </div>
          <div className="card-body">
            <div className="d-flex flex-column gap-3">
              {topPlaces.map((p, i) => (
                <div key={i}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 24, height: 24, background: i === 0 ? 'var(--terracotta)' : 'var(--stone)', fontSize: '0.7rem' }}>{i + 1}</span>
                      <span className="fw-semibold" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{p.name}</span>
                    </div>
                    <span className="badge bg-primary-subtle text-primary rounded-pill fw-bold">{p.count} noms</span>
                  </div>
                  <div className="progress" style={{ height: 6, borderRadius: 6 }}>
                    <div className="progress-bar" style={{ width: `${p.pct}%`, background: i === 0 ? 'var(--terracotta)' : 'var(--secondary)', borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Distribution */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between py-3">
            <h6 className="mb-0 fw-bold"><LuCircle className="me-2 text-success" />Regional Distribution</h6>
            <span className="badge bg-success-subtle text-success rounded-pill" style={{ fontSize: '0.7rem' }}>Live</span>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ fontSize: '0.75rem', color: 'var(--stone)', fontWeight: 700 }}>Region</th>
                    <th style={{ fontSize: '0.75rem', color: 'var(--stone)', fontWeight: 700 }}>Verified</th>
                    <th style={{ fontSize: '0.75rem', color: 'var(--stone)', fontWeight: 700 }}>Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: '0.875rem', fontWeight: 500 }}>{r.region}</td>
                      <td><span className="badge bg-success-subtle text-success rounded-pill">{r.verified}</span></td>
                      <td><span className="badge bg-warning-subtle text-warning rounded-pill">{r.pending}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Utilization card */}
      <div className="col-12">
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom py-3">
            <h6 className="mb-0 fw-bold">Platform Utilization (This Month)</h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {[
                { label: 'New User Registrations', value: '148', max: 200, color: 'var(--secondary)' },
                { label: 'Itineraries Created',    value: '312', max: 400, color: 'var(--terracotta)' },
                { label: 'Directory Views',        value: '5.2K', max: 8000, color: 'var(--accent)' },
                { label: 'Nominations Submitted',  value: '34',  max: 60,  color: 'var(--primary)' },
              ].map((item, i) => (
                <div className="col-md-6 col-xl-3" key={i}>
                  <div className="p-3 rounded-3 border" style={{ background: 'var(--bg-sand)' }}>
                    <div className="fw-bold mb-1" style={{ color: item.color, fontFamily: 'var(--ff-display)', fontSize: '1.5rem' }}>{item.value}</div>
                    <div className="text-muted mb-2" style={{ fontSize: '0.78rem' }}>{item.label}</div>
                    <div className="progress" style={{ height: 5 }}>
                      <div className="progress-bar" style={{ width: `${Math.min(100, (parseInt(item.value) / item.max) * 100)}%`, background: item.color, borderRadius: 5 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Settings ────────────────────────────────── */
function Settings() {
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true });
  const [moderation, setModeration] = useState({ autoApprove: false, requireDocs: true });

  return (
    <div className="row g-3">
      {/* Notification Settings */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom py-3">
            <h6 className="mb-0 fw-bold"><LuBell className="me-2 text-primary" />Notification Preferences</h6>
          </div>
          <div className="card-body d-flex flex-column gap-3">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive email alerts for new submissions' },
              { key: 'sms',   label: 'SMS Notifications',   desc: 'Receive SMS for high-priority actions' },
              { key: 'push',  label: 'Push Notifications',  desc: 'Browser push for real-time updates' },
            ].map(item => (
              <div key={item.key} className="d-flex align-items-center justify-content-between p-3 rounded-3 border" style={{ background: 'var(--bg-sand)' }}>
                <div>
                  <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{item.label}</div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>{item.desc}</div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    style={{ width: '3rem', height: '1.5rem', cursor: 'pointer' }}
                    checked={notifs[item.key]}
                    onChange={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moderation Settings */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-header bg-transparent border-bottom py-3">
            <h6 className="mb-0 fw-bold"><LuShield className="me-2 text-success" />Moderation Rules</h6>
          </div>
          <div className="card-body d-flex flex-column gap-3">
            {[
              { key: 'autoApprove',  label: 'Auto-Approve Verified Businesses', desc: 'Skip manual review for trusted re-submissions' },
              { key: 'requireDocs',  label: 'Require Supporting Documents',     desc: 'Mandate DTI permit or equivalent for all listings' },
            ].map(item => (
              <div key={item.key} className="d-flex align-items-center justify-content-between p-3 rounded-3 border" style={{ background: 'var(--bg-sand)' }}>
                <div>
                  <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{item.label}</div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>{item.desc}</div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    style={{ width: '3rem', height: '1.5rem', cursor: 'pointer' }}
                    checked={moderation[item.key]}
                    onChange={() => setModeration(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="col-12">
        <div className="card border-danger border-opacity-25 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-header bg-danger-subtle border-bottom border-danger border-opacity-25 py-3">
            <h6 className="mb-0 fw-bold text-danger"><LuCircle className="me-2" />Danger Zone</h6>
          </div>
          <div className="card-body d-flex align-items-center justify-content-between gap-3 flex-wrap">
            <div>
              <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>Wipe Pending Queue</div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>Permanently remove all unresolved submissions. This cannot be undone.</div>
            </div>
            <button className="btn btn-outline-danger btn-sm" style={{ borderRadius: 10, fontWeight: 600 }}>
              <LuTrash2 className="me-1" /> Clear Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main AdminDashboard ──────────────────────────────────── */
const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Reactive: re-derives activeTab whenever URL changes
  const activeTab = new URLSearchParams(location.search).get('tab') || 'queue';
  const currentTab = TABS[activeTab] || TABS.queue;

  const renderContent = () => {
    switch (activeTab) {
      case 'queue':       return <VerificationQueue />;
      case 'nominations': return <Nominations />;
      case 'integrity':   return <DirectoryIntegrity />;
      case 'users':       return <UserManagement />;
      case 'analytics':   return <Analytics />;
      case 'settings':    return <Settings />;
      default:            return <VerificationQueue />;
    }
  };

  return (
    <DashboardLayout activeTabId={activeTab}>
      <div className="db-page" style={{ maxWidth: 1140 }}>

        {/* ── Page Header ───────────────────────────── */}
        <div className="d-flex align-items-start align-items-sm-center justify-content-between gap-3 flex-wrap mb-2">
          <div>
            <h1 className="fw-bold mb-1" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.75rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              {currentTab.label}
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
              Manage the WanderLocal platform with full admin controls.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" style={{ borderRadius: 10, fontWeight: 600 }}>
              <LuFilter /> Filter
            </button>
            <button className="btn btn-sm d-flex align-items-center gap-2 text-white" style={{ borderRadius: 10, fontWeight: 600, background: 'var(--secondary)' }}>
              <LuDownload /> Export Report
            </button>
          </div>
        </div>

        {/* ── Stats Bar (always visible) ─────────────── */}
        <StatsBar />

        {/* ── Tab Content ───────────────────────────── */}
        {renderContent()}

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
