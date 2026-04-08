import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuPlus, LuMapPin, LuCalendar, LuSave, LuShare2, LuDownload, LuTrash2, LuClock, LuGripVertical, LuArrowLeft
} from 'react-icons/lu';

/* ── Color tokens ── */
const C = {
  primary: '#4A90C2',
  secondary: '#5FAE4B',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  bgSurface: '#FFFFFF',
  ffDisplay: "'Manrope', sans-serif",
};

const INITIAL_DAYS = [
  {
    id: 'd1', date: 'Day 1',
    stops: [
      { id: 's1', time: '09:00 AM', name: 'Baguio Craft Market', type: 'Shopping', duration: '2 hours' },
      { id: 's2', time: '11:30 AM', name: 'Cafe Amore', type: 'Food', duration: '1 hour' },
    ]
  },
  {
    id: 'd2', date: 'Day 2',
    stops: [
      { id: 's3', time: '08:00 AM', name: 'Vigan Heritage Walk', type: 'Attraction', duration: '3 hours' }
    ]
  }
];

const ItineraryBuilder = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('My Philippine Adventure');
  const [days, setDays] = useState(INITIAL_DAYS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 80px)' }}>
      
      {/* ── Toolbar ── */}
      <div style={{ padding: '1.5rem 2rem', background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.ink }}>
            <LuArrowLeft size={18} />
          </button>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: C.ffDisplay, color: C.ink, border: 'none', background: 'transparent', outline: 'none', width: '400px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '0.6rem 1.25rem', borderRadius: 999, fontWeight: 600, color: C.ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}><LuDownload /> Export PDF</button>
          <button style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '0.6rem 1.25rem', borderRadius: 999, fontWeight: 600, color: C.ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}><LuShare2 /> Share</button>
          <button style={{ background: C.secondary, border: 'none', padding: '0.6rem 1.5rem', borderRadius: 999, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(95, 174, 75, 0.25)' }}><LuSave /> Save Trip</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* ── Left Sidebar (Day Plan) ── */}
        <div style={{ width: '400px', background: '#F8FAFC', borderRight: `1px solid ${C.border}`, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {days.map((day, dIdx) => (
            <div key={day.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: C.ink, fontFamily: C.ffDisplay, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LuCalendar color={C.secondary} /> {day.date}
                </h3>
                <button style={{ background: 'transparent', border: 'none', color: '#E53935', cursor: 'pointer' }}><LuTrash2 size={16} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {day.stops.length === 0 ? (
                  <div style={{ padding: '2rem', border: `1px dashed ${C.border}`, borderRadius: 16, textAlign: 'center', color: C.stone }}>
                    No stops added.
                  </div>
                ) : (
                  day.stops.map((stop, sIdx) => (
                    <div key={stop.id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '1.25rem', display: 'flex', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', position: 'relative' }}>
                      <div style={{ color: C.border, cursor: 'grab', display: 'flex', alignItems: 'center' }}>
                        <LuGripVertical size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: C.ink, fontSize: '1rem', marginBottom: 4 }}>{stop.name}</div>
                        <div style={{ fontSize: '0.85rem', color: C.stone, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><LuMapPin size={14} color={C.primary} /> {stop.type}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.ink, display: 'flex', alignItems: 'center', gap: 4 }}><LuClock size={14} color={C.stone} /> {stop.time}</div>
                          <div style={{ fontSize: '0.8rem', color: C.stoneLight }}>{stop.duration}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <button style={{ border: `1px dashed ${C.secondary}`, background: '#eff7ed', color: C.secondary, padding: '0.75rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'center', gap: 6 }}><LuPlus /> Add Stop</button>
              </div>
            </div>
          ))}

          <button style={{ background: '#fff', border: `1px solid ${C.border}`, padding: '1rem', borderRadius: 16, fontWeight: 700, color: C.ink, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: 6, width: '100%', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <LuPlus /> Add New Day
          </button>
        </div>

        {/* ── Right Content (Map & Search) ── */}
        <div style={{ flex: 1, position: 'relative', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Map Placeholder */}
          <div style={{ textAlign: 'center', color: C.stone }}>
            <LuMapPin size={64} style={{ color: C.primary, opacity: 0.5, marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: C.ffDisplay, fontWeight: 800, color: C.ink }}>Interactive Map</h2>
            <p>Select a stop on the left to view it on the map.</p>
          </div>

          {/* Search Panel Overlay (Example) */}
          <div style={{ position: 'absolute', top: 24, left: 24, background: '#fff', borderRadius: 20, width: 360, boxShadow: '0 12px 48px rgba(0,0,0,0.15)', border: `1px solid ${C.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem', borderBottom: `1px solid ${C.border}` }}>
              <h4 style={{ fontWeight: 800, color: C.ink, margin: '0 0 1rem', fontSize: '1rem' }}>Find Places to Add</h4>
              <div style={{ display: 'flex', background: '#F4F6F9', borderRadius: 8, padding: '0.5rem 1rem' }}>
                <input type="text" placeholder="Search saved places or directory..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: '0.9rem' }} />
              </div>
            </div>
            <div style={{ height: 300, overflowY: 'auto', padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#E2E8F0' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: C.ink }}>Batanes Homestead</div>
                  <div style={{ fontSize: '0.8rem', color: C.stone }}>Saved in Shortlist</div>
                </div>
                <button style={{ width: 32, height: 32, borderRadius: 8, background: C.secondary, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><LuPlus size={16} /></button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ItineraryBuilder;
