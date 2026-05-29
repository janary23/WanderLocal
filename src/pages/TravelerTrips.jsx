import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  LuPlus, LuMapPin, LuLock, LuGlobe, LuShare2,
  LuMap, LuLoader, LuTrash2, LuEye
} from 'react-icons/lu';
import { glassCardStyle, glassCardHover, btnPrimaryStyle, btnPrimaryHover, btnGhostStyle, btnGhostHover, applyHover, removeHover } from '../inlineStyles';
import { useAuth } from '../context/AuthContext';
import ItineraryDetailModal from '../components/ItineraryDetailModal';

const STATUS_STYLE = {
  saved:     { bg: 'var(--color-primary-pale)',    color: 'var(--color-primary)',    label: 'Saved' },
  draft:     { bg: 'var(--color-primary-pale)',    color: 'var(--color-primary)',    label: 'Draft' },
  active:    { bg: 'var(--color-secondary-alt)',   color: 'var(--color-secondary)',  label: 'Active' },
  completed: { bg: 'var(--color-accent-pale)',     color: 'var(--color-accent)',     label: 'Completed' },
};

const VIS_ICON = { private: <LuLock />, public: <LuGlobe />, link: <LuShare2 /> };

const getDestinationImage = (dest) => {
  if (!dest) return 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80';
  const text = dest.toLowerCase();
  if (text.includes('beach') || text.includes('boracay') || text.includes('elnido') || text.includes('el nido') || text.includes('coron') || text.includes('siargao') || text.includes('island') || text.includes('sea')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80';
  }
  if (text.includes('baguio') || text.includes('mountain') || text.includes('pulag') || text.includes('hike') || text.includes('trek')) {
    return 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=400&q=80';
  }
  if (text.includes('vigan') || text.includes('heritage') || text.includes('historic') || text.includes('church') || text.includes('history')) {
    return 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=400&q=80';
  }
  return 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80';
};

const TravelerTrips = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useAuth();

  const [trips, setTrips]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  // Modal state
  const [selectedTrip, setSelectedTrip]   = useState(null); // summary row
  const [detailData,   setDetailData]     = useState(null); // full itinerary (days + stops)
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch list ──────────────────────────────────────────────────────────
  const fetchItineraries = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://127.0.0.1:5000/itineraries?user_id=${userId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setTrips(data.itineraries || []);
      } else {
        throw new Error(data.message || 'Failed to fetch itineraries');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load your saved trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItineraries(); }, [userId]);

  // ── Open detail modal ───────────────────────────────────────────────────
  const handleOpenDetail = async (trip, e) => {
    if (e) e.stopPropagation();
    setSelectedTrip(trip);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const res = await fetch(`http://127.0.0.1:5000/itineraries/${trip.id}`);
      const data = await res.json();
      if (data.status === 'success') {
        setDetailData(data.itinerary);
      } else {
        throw new Error(data.message || 'Failed to load itinerary details');
      }
    } catch (err) {
      console.error(err);
      alert('Could not load itinerary details: ' + err.message);
      setSelectedTrip(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedTrip(null);
    setDetailData(null);
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this itinerary?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/itineraries/${tripId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.status === 'success') {
        setTrips(prev => prev.filter(t => t.id !== tripId));
        if (selectedTrip?.id === tripId) handleCloseModal();
      } else {
        throw new Error(data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete itinerary: ' + err.message);
    }
  };

  return (
    <DashboardLayout activeTabId="itineraries">
      <div className="animate-fade-in" style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>

        {/* ── Page Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--color-primary-pale)', color: 'var(--color-primary)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Your Journeys
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              My Trips
            </h1>
          </div>
          <button
            onClick={() => window.dispatchEvent(new Event('open-itinerary-chat'))}
            style={btnPrimaryStyle}
            onMouseOver={e => applyHover(e, btnPrimaryHover)}
            onMouseOut={e => removeHover(e, btnPrimaryStyle)}
          >
            <LuPlus size={20} /> Plan a new trip
          </button>
        </div>

        {/* ── Loader ── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
            <LuLoader size={36} color="var(--color-primary)" style={{ animation: 'spinSlow 2s linear infinite' }} />
            <span style={{ color: 'var(--color-stone)', fontWeight: 600 }}>Loading your travel programs...</span>
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div style={{ background: 'rgba(211,97,53,0.1)', color: 'var(--color-accent)', padding: '1rem', borderRadius: '12px', textAlign: 'center', fontWeight: 700, margin: '2rem 0' }}>
            {error}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && trips.length === 0 && (
          <div style={{ ...glassCardStyle, textAlign: 'center', padding: '6rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LuMap size={48} color="var(--color-stone)" style={{ marginBottom: '1.5rem', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-ink)', marginBottom: '0.5rem' }}>No Saved Journeys</h3>
            <p style={{ color: 'var(--color-stone)', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.5 }}>
              You haven't saved any AI sightseeing programs yet. Open our travel assistant to create one!
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('open-itinerary-chat'))}
              style={btnPrimaryStyle}
              onMouseOver={e => applyHover(e, btnPrimaryHover)}
              onMouseOut={e => removeHover(e, btnPrimaryStyle)}
            >
              Plan a new trip
            </button>
          </div>
        )}

        {/* ── Trip Cards Grid ── */}
        {!loading && !error && trips.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {trips.map((trip, i) => (
              <div
                key={trip.id}
                style={{ ...glassCardStyle, padding: 0, display: 'flex', flexDirection: 'column', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s ease' }}
                onMouseOver={e => applyHover(e, glassCardHover)}
                onMouseOut={e => removeHover(e, glassCardStyle)}
                onClick={(e) => handleOpenDetail(trip, e)}
              >
                {/* Cover Image */}
                <div style={{ height: 220, position: 'relative' }}>
                  <img src={getDestinationImage(trip.destination)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.title} />
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(10,20,30,0.7) 100%)' }} />

                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 14, left: 14, background: STATUS_STYLE[trip.status]?.bg || 'var(--color-primary-pale)', color: STATUS_STYLE[trip.status]?.color || 'var(--color-primary)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, boxShadow: 'var(--shadow-xs)' }}>
                    {STATUS_STYLE[trip.status]?.label || 'Saved'}
                  </div>

                  {/* Visibility badge */}
                  <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', width: 34, height: 34, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-stone)', boxShadow: 'var(--shadow-xs)' }}>
                    {VIS_ICON[trip.visibility] || VIS_ICON.private}
                  </div>

                  {/* Destination overlaid on image bottom */}
                  {trip.destination && (
                    <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <LuMapPin size={13} color="#fff" />
                      <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.5)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {trip.destination}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--glass-bg)' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-ink)', marginBottom: 4, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                    {trip.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-stone-light)', marginBottom: 16, fontWeight: 500 }}>
                    Updated {trip.updated_at ? new Date(trip.updated_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
                    <button
                      onClick={(e) => handleOpenDetail(trip, e)}
                      style={{ ...btnGhostStyle, flex: 2, padding: '0.55rem', fontSize: '0.85rem', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700 }}
                      onMouseOver={e => applyHover(e, btnGhostHover)}
                      onMouseOut={e => { removeHover(e, btnGhostStyle); e.currentTarget.style.background = 'var(--color-surface)'; }}
                    >
                      <LuEye size={15} /> View Details
                    </button>
                    <button
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      style={{ ...btnGhostStyle, padding: '0.55rem 0.75rem', background: 'rgba(211,97,53,0.1)', color: 'var(--color-accent)' }}
                      onMouseOver={e => applyHover(e, { ...btnGhostHover, background: 'rgba(211,97,53,0.2)' })}
                      onMouseOut={e => { removeHover(e, btnGhostStyle); e.currentTarget.style.background = 'rgba(211,97,53,0.1)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                      title="Delete Journey"
                    >
                      <LuTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Detail loading spinner (brief) ── */}
        {detailLoading && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,20,30,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <LuLoader size={36} color="var(--color-primary)" style={{ animation: 'spinSlow 1.5s linear infinite' }} />
              <span style={{ fontWeight: 700, color: 'var(--color-stone)' }}>Loading itinerary details...</span>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>

      {/* ── Itinerary Detail Modal ── */}
      {detailData && !detailLoading && (
        <ItineraryDetailModal
          itinerary={detailData}
          onClose={handleCloseModal}
          onDeleted={(id) => {
            setTrips(prev => prev.filter(t => t.id !== id));
            handleCloseModal();
          }}
          onUpdated={(updated) => {
            setTrips(prev => prev.map(t => t.id === updated.id ? { ...t, title: updated.title } : t));
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default TravelerTrips;
