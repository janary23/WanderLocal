import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  LuCircle, LuMapPin, LuClock, LuPhone, LuBookmark, LuBookmarkMinus, LuPlus, LuCamera, LuTag, LuArrowLeft, LuChevronLeft, LuChevronRight
} from 'react-icons/lu';

/* ── Color tokens ── */
const C = {
  secondary: '#5FAE4B', accent: '#F39C12', ink: '#0F1E2D',
  stone: '#5F6B7A', stoneLight: '#8D9DB0', border: '#DDE3ED',
};

/* ── Mock DB ── */
const LISTINGS = {
  1: {
    name: 'Cafe Amore', category: 'Food & Beverage', tier: 'verified',
    city: 'Baguio City', hours: 'Mon–Fri: 8AM–8PM  |  Sat–Sun: 9AM–9PM',
    phone: '+63 912 345 6789', email: 'hello@cafeamore.ph',
    address: '45 Heritage Lane, Baguio City, Benguet',
    desc: "A cozy cafe featuring locally-sourced highland beans and homemade pastries. We pride ourselves on creating a welcoming atmosphere for both locals and travelers. Family-owned since 2012, we actively support local farmers by sourcing 100% of our coffee beans from the nearby Benguet highlands. Come for the brew, stay for the community.",
    tags: ['Eco-friendly', 'Family-owned', 'Local Beans', 'Wheelchair Accessible'],
    addedTo: 124,
    photos: ['https://picsum.photos/seed/15541188/800/600','https://picsum.photos/seed/14979355/800/600','https://picsum.photos/seed/14451165/800/600','https://picsum.photos/seed/15090422/800/600'],
  },
  2: {
    name: 'Vigan Heritage Walk', category: 'Attraction / Heritage', tier: 'verified',
    city: 'Vigan, Ilocos Sur', hours: 'Daily: 7AM–6PM',
    phone: '+63 977 111 2222', email: 'tours@vigan.ph',
    address: 'Calle Crisologo, Vigan, Ilocos Sur',
    desc: 'Guided walking tour around the beautifully preserved Spanish colonial cobblestone streets of Vigan — a UNESCO World Heritage City. Experience a living museum with kalesas still running down ancestral homes dating back 400 years.',
    tags: ['Culture', 'UNESCO', 'Walking Tour', 'Family-friendly'],
    addedTo: 89,
    photos: ['https://picsum.photos/seed/15967078/800/600','https://picsum.photos/seed/16088199/800/600','https://picsum.photos/seed/15632007/800/600'],
  },
  3: {
    name: 'Baguio Craft Market', category: 'Shopping', tier: 'community',
    city: 'Baguio City', hours: 'Unknown',
    desc: 'Handcrafted local goods from Cordillera artisans — woodwork, weavings, baskets, and silver jewelry.',
    tags: ['Artisan', 'Handmade'], addedTo: 0,
    photos: ['https://picsum.photos/seed/15197101/800/600'],
  },
  4: {
    name: "Joe's Diner", category: 'Restaurant', tier: 'fallback',
    city: 'Manila', address: '123 Main St, Ermita, Manila',
    desc: 'Local eatery near the port. Data sourced from OpenStreetMap.',
    tags: [], addedTo: 0, photos: [],
  },
};

/* ── Photo Gallery ── */
function PhotoGallery({ photos }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (!photos || photos.length === 0) return null;
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', borderRadius: 20, overflow: 'hidden', marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden', maxHeight: 420 }} onClick={() => { setActive(0); setLightbox(true); }}>
          <img src={photos[0]} alt="Main" style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {photos.slice(1, 3).map((p, i) => (
            <div key={i} style={{ position: 'relative', flex: 1, overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setActive(i + 1); setLightbox(true); }}>
              <img src={p} alt={`Photo ${i + 2}`} style={{ width: '100%', height: '100%', minHeight: 196, objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
              {i === 1 && photos.length > 3 && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', gap: 8 }}
                  onClick={() => { setActive(2); setLightbox(true); }}>
                  <LuCamera /> +{photos.length - 3} Photos
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightbox(false)}>
          <button style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setLightbox(false)}>✕</button>
          <button style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); setActive((active - 1 + photos.length) % photos.length); }}><LuChevronLeft /></button>
          <img src={photos[active]} alt="" style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
          <button style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); setActive((active + 1) % photos.length); }}><LuChevronRight /></button>
          <div style={{ position: 'absolute', bottom: 20, color: '#fff', opacity: 0.7, fontSize: '0.9rem' }}>{active + 1} / {photos.length}</div>
        </div>
      )}
    </>
  );
}

/* ── Main ListingDetail ── */
const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const listing = LISTINGS[id] || LISTINGS[1];
  const isFallback  = listing.tier === 'fallback';
  const isCommunity = listing.tier === 'community';

  const showToast = msg => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2500); };
  const handleSave = () => { setSaved(!saved); showToast(saved ? 'Removed from Shortlist' : 'Saved to Shortlist!'); };

  /* ── Fallback View ── */
  if (isFallback) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '1px solid #BBF7D0', padding: '1.75rem 2rem', borderRadius: 16, textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: C.secondary, fontWeight: 800, marginBottom: '0.4rem' }}>🏪 Are you the owner of this business?</h2>
          <p style={{ color: '#57534E', marginBottom: '1rem', fontSize: '0.9rem' }}>Claim your free profile to unlock rich photos, verified features, and let travelers add you to their itineraries.</p>
          <Link to="/claim" style={{ background: 'linear-gradient(135deg, #2D5016, #3D6B1F)', color: '#fff', borderRadius: 10, fontWeight: 700, padding: '0.65rem 2rem', textDecoration: 'none', display: 'inline-block' }}>Claim This Listing</Link>
        </div>

        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 20, border: '1px solid #E7E5E4', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: C.ink, marginBottom: '0.4rem' }}>{listing.name}</h1>
          <p style={{ color: C.stoneLight, fontSize: '0.9rem', marginBottom: '1.5rem' }}>{listing.category} · Unclaimed Listing</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.stone, marginBottom: '0.75rem' }}>
            <LuMapPin style={{ color: C.secondary }} /><span>{listing.address || listing.city}</span>
          </div>
          <p style={{ color: C.stoneLight, fontSize: '0.85rem' }}>Data sourced from OpenStreetMap / Google Places</p>
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#F9FAFB', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Know more about this place?</div>
            <p style={{ color: C.stoneLight, fontSize: '0.85rem', marginBottom: '1rem' }}>Nominate it so we can invite the owner to verify.</p>
            <Link to="/nominate" style={{ border: `1px solid ${C.border}`, color: C.stone, borderRadius: 10, fontWeight: 700, padding: '0.55rem 1.5rem', textDecoration: 'none' }}>Nominate This Business</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Verified / Community View ── */
  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Toast */}
      <div style={{ position: 'fixed', top: 90, right: 24, zIndex: 9999, background: C.ink, color: '#fff', padding: '0.9rem 1.5rem', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', transform: toastMsg ? 'translateX(0)' : 'translateX(120%)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', fontWeight: 600, fontSize: '0.9rem' }}>
        {toastMsg}
      </div>

      {/* ── Page Header Banner ── */}
      <div style={{ background: '#fff', borderBottom: `1px solid #EBF0F7`, boxShadow: '0 1px 4px rgba(28,25,23,0.04)', marginBottom: '2rem', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.4rem' }}>
                <button onClick={() => navigate(-1)} style={{ borderRadius: 8, fontWeight: 600, fontSize: '0.82rem', padding: '4px 12px', background: '#F4F6F9', color: C.stone, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                  <LuArrowLeft size={14} /> Directory
                </button>
                {!isCommunity && (
                  <span style={{ background: 'rgba(45,80,22,0.1)', color: C.secondary, border: '1px solid #C6E0B0', padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <LuCircle size={11} /> Verified
                  </span>
                )}
                {isCommunity && <span style={{ background: '#FFF7ED', color: C.accent, border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>Community Nominated</span>}
              </div>
              <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '2.25rem', fontWeight: 700, color: C.ink, letterSpacing: '-0.02em', margin: '0 0 0.25rem' }}>{listing.name}</h1>
              <p style={{ color: C.stone, margin: 0, fontSize: '1.05rem' }}>{listing.category} · {listing.city}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={handleSave} style={{ borderRadius: 11, fontSize: '0.875rem', fontWeight: 700, padding: '0.55rem 1.25rem', background: '#fff', border: `1.5px solid ${saved ? C.secondary : C.border}`, color: saved ? C.secondary : C.stone, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                {saved ? <LuBookmark style={{ color: C.secondary }} /> : <LuBookmarkMinus />}
                {saved ? 'Saved' : 'Save to Shortlist'}
              </button>
              {!isCommunity && (
                <Link to="/itinerary" style={{ background: 'linear-gradient(135deg, #2D5016, #3D6B1F)', color: '#fff', borderRadius: 11, fontSize: '0.875rem', fontWeight: 700, padding: '0.55rem 1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(45,80,22,0.3)' }}>
                  <LuPlus /> Add to Itinerary
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        <PhotoGallery photos={listing.photos} />

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isCommunity ? '1fr' : '1fr 340px', gap: '2.5rem' }}>
          {/* Left */}
          <div>
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: C.ink, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>📖 About</h2>
              <p style={{ color: '#57534E', lineHeight: 1.85, fontSize: '0.95rem', margin: 0 }}>{listing.desc}</p>
            </section>

            {listing.tags.length > 0 && (
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: C.ink, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LuTag style={{ color: C.secondary, fontSize: '1rem' }} /> Community Tags
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {listing.tags.map(tag => (
                    <span key={tag} style={{ background: 'rgba(45,80,22,0.09)', color: C.secondary, padding: '0.45rem 1rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(45,80,22,0.15)' }}>{tag}</span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: C.ink, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>📍 Location</h2>
              <div style={{ width: '100%', height: 280, background: '#F1F8F1', borderRadius: 16, border: '1px solid #C3E2BC', overflow: 'hidden' }}>
                <iframe title="Map View" width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.address || listing.city)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} allowFullScreen />
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          {!isCommunity && (
            <div>
              <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E7E5E4', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', position: 'sticky', top: 90 }}>
                <div style={{ padding: '1.5rem 1.5rem 0' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.ink, marginBottom: '1.25rem' }}>ℹ️ Info & Contact</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {listing.hours && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,150,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><LuClock style={{ color: C.accent }} /></div>
                        <div>
                          <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.85rem', marginBottom: 2 }}>Hours</div>
                          <div style={{ color: C.stone, fontSize: '0.85rem' }}>{listing.hours}</div>
                        </div>
                      </div>
                    )}
                    {listing.address && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(45,80,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><LuMapPin style={{ color: C.secondary }} /></div>
                        <div>
                          <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.85rem', marginBottom: 2 }}>Address</div>
                          <div style={{ color: C.stone, fontSize: '0.85rem' }}>{listing.address}</div>
                        </div>
                      </div>
                    )}
                    {listing.phone && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><LuPhone style={{ color: '#3A75A0' }} /></div>
                        <div>
                          <div style={{ fontWeight: 700, color: C.ink, fontSize: '0.85rem', marginBottom: 2 }}>Contact</div>
                          <div style={{ color: C.stone, fontSize: '0.85rem' }}>{listing.phone}</div>
                          {listing.email && <div style={{ color: C.stone, fontSize: '0.85rem' }}>{listing.email}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <hr style={{ margin: '1.25rem 1.5rem', border: 'none', borderTop: '1px solid #F3F4F6' }} />

                <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={handleSave} style={{ borderRadius: 12, padding: '0.85rem', width: '100%', background: saved ? '#F1F8F1' : '#fff', border: `2px solid ${saved ? C.secondary : C.border}`, color: saved ? C.secondary : C.stoneLight, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s ease', fontFamily: 'inherit' }}>
                    {saved ? <><LuBookmark />&nbsp;Saved to Shortlist</> : <><LuBookmarkMinus />&nbsp;Save to Shortlist</>}
                  </button>
                  <Link to="/itinerary" style={{ borderRadius: 12, padding: '0.85rem', background: 'linear-gradient(135deg, #2D5016, #3D6B1F)', color: '#fff', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(45,80,22,0.3)' }}>
                    <LuPlus /> Add to Itinerary
                  </Link>
                  {listing.addedTo > 0 && (
                    <p style={{ textAlign: 'center', margin: '0.25rem 0 0', fontSize: '0.75rem', color: C.stoneLight }}>
                      🗺️ Added to {listing.addedTo} itineraries this month
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
