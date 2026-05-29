import React, { useState, useEffect, useRef } from 'react';
import {
  LuX, LuPrinter, LuMapPin, LuClock, LuCalendar, LuMap,
  LuPencil, LuCheck, LuLoader, LuTrash2, LuChevronDown, LuChevronUp,
  LuGlobe, LuLock, LuShare2, LuUsers
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { updateItinerary, deleteStop } from '../services/api';
import logoImg from '../assets/WanderLocalLogo.png';

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_STYLE_ID = 'itin-modal-print';
function injectPrint() {
  if (document.getElementById(PRINT_STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = PRINT_STYLE_ID;
  s.textContent = `
    @media print {
      @page { size: A4 portrait; margin: 18mm 15mm; }
      body > * { display: none !important; }
      #itin-print-doc {
        display: block !important;
        position: fixed !important; inset: 0 !important;
        background: #fff !important; z-index: 999999 !important;
        overflow: auto !important;
      }
    }
  `;
  document.head.appendChild(s);
}
function removePrint() {
  const el = document.getElementById(PRINT_STYLE_ID);
  if (el) el.remove();
}

const VIS_LABEL = { private: '🔒 Private', public: '🌐 Public', link: '🔗 Link Only' };

const categoryColor = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('beach') || t.includes('resort'))               return { bg: '#DBEAFE', color: '#1D4ED8' };
  if (t.includes('restaurant') || t.includes('food') || t.includes('cafe')) return { bg: '#FEF9C3', color: '#854D0E' };
  if (t.includes('hotel') || t.includes('lodge'))                return { bg: '#F3E8FF', color: '#7C3AED' };
  if (t.includes('nature') || t.includes('park'))                return { bg: '#DCFCE7', color: '#166534' };
  if (t.includes('heritage') || t.includes('historic') || t.includes('church')) return { bg: '#FFF7ED', color: '#C2410C' };
  return { bg: '#F1F5F9', color: '#475569' };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ItineraryDetailModal = ({ itinerary: init, onClose, onDeleted, onUpdated }) => {
  const { userName } = useAuth();
  const [itin,       setItin]       = useState(init);
  const [editTitle,  setEditTitle]  = useState(false);
  const [titleVal,   setTitleVal]   = useState(init?.title || '');
  const [saving,     setSaving]     = useState(false);
  const [expanded,   setExpanded]   = useState({});

  useEffect(() => {
    injectPrint();
    if (itin?.days) {
      const all = {};
      itin.days.forEach((_, i) => { all[i] = true; });
      setExpanded(all);
    }
    return removePrint;
  }, []);

  if (!itin) return null;

  const totalStops = (itin.days || []).reduce((a, d) => a + (d.stops || []).length, 0);
  const docRef = `WL-AI-${String(itin.id || '').padStart(6, '0')}`;
  const dateStr = new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });

  // ── Save title
  const saveTitle = async () => {
    if (!titleVal.trim() || titleVal === itin.title) { setEditTitle(false); return; }
    setSaving(true);
    try {
      await updateItinerary(itin.id, { title: titleVal.trim() });
      const updated = { ...itin, title: titleVal.trim() };
      setItin(updated);
      if (onUpdated) onUpdated(updated);
    } catch (e) { console.error(e); }
    setSaving(false);
    setEditTitle(false);
  };

  // ── Remove stop
  const handleRemoveStop = async (dayIdx, stop) => {
    if (!window.confirm(`Remove "${stop.name}"?`)) return;
    try {
      await deleteStop(itin.id, stop.id);
      setItin(prev => ({
        ...prev,
        days: prev.days.map((d, di) => di !== dayIdx ? d : {
          ...d, stops: d.stops.filter(s => s.id !== stop.id)
        })
      }));
    } catch (e) { alert('Failed to remove stop.'); }
  };

  const toggle = (i) => setExpanded(p => ({ ...p, [i]: !p[i] }));

  // ─────────────────────────────────────────────────────────────────────────────
  // Document body (shared between modal and print)
  // ─────────────────────────────────────────────────────────────────────────────
  const DocumentBody = ({ interactive = false }) => (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", color: '#1E293B', background: '#fff' }}>

      {/* ── Top Accent Bar ── */}
      <div style={{ height: 8, background: 'linear-gradient(90deg, #10375C 0%, #1A5F7A 50%, #157A6E 100%)' }} />

      <div style={{ padding: interactive ? '28px 32px' : '36px 42px' }}>

        {/* ── Document Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', paddingBottom: 20, marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#1A5F7A', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
              Curated Sightseeing Program — WanderAI Assistant
            </span>

            {/* Editable title (interactive only) */}
            {interactive && editTitle ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <input
                  autoFocus
                  value={titleVal}
                  onChange={e => setTitleVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditTitle(false); }}
                  style={{
                    fontSize: 22, fontWeight: 800, color: '#10375C',
                    border: '2px solid #1A5F7A', borderRadius: 8,
                    padding: '4px 10px', outline: 'none', fontFamily: 'inherit',
                    letterSpacing: '-0.02em', flex: 1, background: '#F8FAFC'
                  }}
                />
                <button onClick={saveTitle} disabled={saving} style={{ background: '#10375C', border: 'none', borderRadius: 8, color: '#fff', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  {saving ? <LuLoader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <LuCheck size={16} />}
                </button>
              </div>
            ) : (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: interactive ? 'pointer' : 'default', marginBottom: 4 }}
                onClick={interactive ? () => { setEditTitle(true); setTitleVal(itin.title); } : undefined}
              >
                <h1 style={{ margin: 0, fontSize: interactive ? 22 : 26, fontWeight: 800, color: '#10375C', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {itin.title}
                </h1>
                {interactive && (
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8', flexShrink: 0 }}>
                    <LuPencil size={12} />
                  </div>
                )}
              </div>
            )}

            <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 600 }}>
              Curation Powered by WanderAI • WanderLocal Philippines
            </p>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, marginLeft: 20 }}>
            <img src={logoImg} alt="WanderLocal" style={{ height: interactive ? 52 : 64, width: 'auto', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))' }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#1A5F7A', textTransform: 'uppercase', letterSpacing: '0.06em', border: '1px solid #1A5F7A', padding: '2px 8px', borderRadius: 4 }}>
              Premium Tourism
            </span>
          </div>
        </div>

        {/* ── Metadata Grid ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0',
          marginBottom: 32, overflow: 'hidden'
        }}>
          {[
            { label: 'Prepared For',   value: userName || 'WanderLocal Traveler' },
            { label: 'Destination',    value: itin.destination || 'Philippines' },
            { label: 'Trip Length',    value: `${(itin.days || []).length} Day(s)` },
            { label: 'Total Stops',    value: `${totalStops} Attraction(s)` },
          ].map((m, i) => (
            <div key={i} style={{ padding: '14px 18px', borderRight: i < 3 ? '1px solid #E2E8F0' : 'none' }}>
              <span style={{ display: 'block', fontSize: 8, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{m.label}</span>
              <strong style={{ fontSize: 12, color: '#10375C', fontWeight: 800, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.value}</strong>
            </div>
          ))}
        </div>

        {/* ── Days ── */}
        {(itin.days || []).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94A3B8' }}>
            <LuMap size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontWeight: 600 }}>No stops recorded yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {(itin.days || []).map((day, dIdx) => {
              const stops = day.stops || [];
              return (
                <div key={day.id || dIdx} style={{ pageBreakInside: 'avoid' }}>

                  {/* Day Header Row — matches PDF style */}
                  <div
                    onClick={interactive ? () => toggle(dIdx) : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: '#F8FAFC', borderLeft: '4px solid #10375C',
                      border: '1px solid #E2E8F0', borderLeftWidth: 4,
                      padding: '10px 16px', borderRadius: 4, marginBottom: 16,
                      cursor: interactive ? 'pointer' : 'default', userSelect: 'none'
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#10375C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {day.label || `Day ${day.index || dIdx + 1}`} — Attractions Sightseeing Schedule
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#1A5F7A' }}>
                        {stops.length} Stop{stops.length !== 1 ? 's' : ''}
                      </span>
                      {interactive && (
                        <span style={{ color: '#94A3B8' }}>
                          {expanded[dIdx] ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stops Timeline */}
                  {(!interactive || expanded[dIdx]) && (
                    stops.length === 0 ? (
                      <p style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic', paddingLeft: 24 }}>No stops for this day.</p>
                    ) : (
                      <div style={{
                        paddingLeft: 22, marginLeft: 10,
                        borderLeft: '2px solid #E2E8F0',
                        display: 'flex', flexDirection: 'column', gap: 24
                      }}>
                        {stops.map((stop, sIdx) => {
                          const cc = categoryColor(stop.type);
                          return (
                            <div key={stop.id || sIdx} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', pageBreakInside: 'avoid' }}>

                              {/* Timeline bullet */}
                              <div style={{
                                width: 10, height: 10, borderRadius: '50%',
                                background: '#fff', border: '3px solid #10375C',
                                position: 'absolute', left: -28, top: 5,
                                boxShadow: '0 0 0 3px #F1F5F9', zIndex: 10, flexShrink: 0
                              }} />

                              {/* Time tag */}
                              <div style={{
                                minWidth: 80, fontWeight: 800, fontSize: 10, color: '#10375C',
                                textTransform: 'uppercase', padding: '3px 8px',
                                borderRadius: 5, border: '1px solid #E2E8F0',
                                background: '#F8FAFC', textAlign: 'center',
                                letterSpacing: '0.02em', marginTop: 2, flexShrink: 0
                              }}>
                                {stop.time || `Stop ${sIdx + 1}`}
                              </div>

                              {/* Stop details */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 800, fontSize: 13, color: '#1E293B' }}>{stop.name}</span>
                                  {stop.type && (
                                    <span style={{ background: cc.bg, color: cc.color, padding: '1px 7px', borderRadius: 4, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                      {stop.type}
                                    </span>
                                  )}
                                </div>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                  {stop.duration && (
                                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>~{stop.duration}</span>
                                  )}
                                  {itin.destination && (
                                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
                                      <LuMapPin size={10} /> {itin.destination}
                                    </span>
                                  )}
                                </div>
                                {!interactive && (
                                  <p style={{ margin: '6px 0 0', fontSize: 11, color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
                                    A curated highlight of {itin.destination || 'your destination'} — immerse yourself in the local culture and beauty.
                                  </p>
                                )}
                              </div>

                              {/* Delete (interactive only) */}
                              {interactive && (
                                <button
                                  onClick={() => handleRemoveStop(dIdx, stop)}
                                  title="Remove stop"
                                  style={{
                                    background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                                    color: '#EF4444', borderRadius: 7, width: 30, height: 30,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s'
                                  }}
                                  onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                                  onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                                >
                                  <LuTrash2 size={13} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Disclaimer ── */}
        <div style={{ marginTop: 40, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', padding: '12px 16px', pageBreakInside: 'avoid' }}>
          <span style={{ display: 'block', fontSize: 8, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Important Travel Information
          </span>
          <p style={{ margin: 0, fontSize: 10, color: '#64748B', lineHeight: 1.5 }}>
            This sightseeing program has been curated by WanderAI for Philippine tourism. Travelers are advised to coordinate with local tour operators for transportation, weather, and destination-specific guidelines.
          </p>
        </div>

        {/* ── Footer ── */}
        <div style={{
          marginTop: 40, paddingTop: 18, borderTop: '2px solid #E2E8F0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 10, color: '#94A3B8', pageBreakInside: 'avoid'
        }}>
          <div>
            <strong style={{ color: '#10375C', fontSize: 11 }}>WanderLocal Curation Hub</strong>
            <div style={{ marginTop: 2 }}>Doc Ref: {docRef} • Generated {dateStr}</div>
          </div>
          <div style={{ textTransform: 'uppercase', fontSize: 8, letterSpacing: '0.08em', fontWeight: 800, textAlign: 'right' }}>
            © {new Date().getFullYear()} WanderLocal Inc.<br />Sustainable Tourism Philippines
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <>
      {/* ── MODAL OVERLAY ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(10,20,30,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '32px 16px', overflowY: 'auto'
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 820,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 40px 100px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: 40
          }}
        >
          {/* Floating action bar (top right, outside document flow) */}
          <div style={{
            position: 'absolute', top: 14, right: 14, zIndex: 100,
            display: 'flex', gap: 8
          }}>
            <button
              onClick={() => window.print()}
              style={{
                background: '#10375C', color: '#fff', border: 'none',
                borderRadius: 10, padding: '8px 16px',
                display: 'flex', alignItems: 'center', gap: 6,
                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16,55,92,0.35)',
                fontFamily: 'inherit', transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#1A5F7A'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#10375C'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <LuPrinter size={15} /> Export PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(0,0,0,0.12)', border: 'none', borderRadius: 10,
                color: '#64748B', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#EF4444'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#64748B'; }}
            >
              <LuX size={17} />
            </button>
          </div>

          {/* Document preview */}
          <DocumentBody interactive={true} />

          {/* Hint */}
          <div style={{ textAlign: 'center', padding: '8px 0 16px', fontSize: '0.75rem', color: '#CBD5E1', fontStyle: 'italic' }}>
            Click title to rename • Trash icon removes a stop • Export PDF to print
          </div>
        </div>
      </div>

      {/* ── HIDDEN PRINT DOCUMENT ── */}
      <div id="itin-print-doc" style={{ display: 'none' }}>
        <DocumentBody interactive={false} />
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

export default ItineraryDetailModal;
