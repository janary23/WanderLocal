import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LuMapPin, LuClock, LuTag, LuStar, LuShare2, LuBookmark, LuCheck, LuCompass, LuChevronLeft, LuHeart, LuPhone, LuGlobe
} from 'react-icons/lu';

/* ── Color Tokens ── */
const C = {
  primary: '#4A90C2',
  secondary: '#5A8BA8',
  ink: '#0F1E2D',
  stone: '#5F6B7A',
  border: '#DDE3ED',
  ffDisplay: "'Manrope', sans-serif",
};

const MOCK_LISTING = {
  id: 1,
  name: 'Baguio Craft Market',
  city: 'Baguio City',
  tier: 'verified',
  category: 'Shopping',
  desc: 'A vibrant collective of Cordillera artisans offering handcrafted woodwork, intricate weavings, and locally sourced goods. The market represents over forty indigenous families from the surrounding mountains, bringing centuries of craftsmanship directly to you. Enjoy the cool pine air while browsing authentic pieces that tell the story of the Philippine highlands.',
  tags: ['Artisan', 'Handmade', 'Cultural Heritage', 'Eco-friendly'],
  hours: 'Mon–Sat: 8AM–8PM, Sun: 9AM–5PM',
  phone: '+63 917 123 4567',
  website: 'www.baguiocraftmarket.ph',
  images: [
    'https://picsum.photos/seed/15197101/1200/800',
    'https://picsum.photos/seed/14979355/800/600',
    'https://picsum.photos/seed/14451165/800/600',
    'https://picsum.photos/seed/15541188/800/600',
    'https://picsum.photos/seed/12345/800/600'
  ],
  reviews: [
    { author: 'Maria S.', text: 'Absolutely beautiful craftsmanship. The woven bags are top quality.', rating: 5, date: '2 weeks ago' },
    { author: 'John D.', text: 'A must-visit in Baguio! Support local artisans.', rating: 5, date: '1 month ago' },
  ]
};

const ListingDetail = () => {
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  
  // In a real app, fetch listing by id. Using mock here.
  const listing = MOCK_LISTING;

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '2rem', width: '100%', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── Breadcrumb & Actions ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/directory" style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.stone, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <LuChevronLeft /> Back to Directory
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', color: C.ink }}>
            <LuShare2 /> Share
          </button>
          <button onClick={() => setSaved(!saved)} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', color: C.ink }}>
            <LuHeart fill={saved ? '#E53935' : 'transparent'} color={saved ? '#E53935' : C.ink} /> Save
          </button>
        </div>
      </div>

      {/* ── Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: C.ffDisplay, fontSize: '2.5rem', fontWeight: 800, color: C.ink, margin: '0 0 0.5rem' }}>{listing.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: C.stone, fontSize: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}><LuStar fill={C.ink} color={C.ink} /> 5.0 (28 reviews)</div>
          <div>•</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><LuMapPin /> {listing.city}</div>
          <div>•</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.secondary, fontWeight: 700 }}><LuCheck /> Verified</div>
        </div>
      </div>

      {/* ── Photo Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '200px 200px', gap: '0.5rem', borderRadius: 24, overflow: 'hidden', marginBottom: '4rem' }}>
        <div style={{ gridRow: '1 / span 2' }}>
          <img src={listing.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Main" />
        </div>
        <div><img src={listing.images[1]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery 1" /></div>
        <div><img src={listing.images[2]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery 2" /></div>
        <div><img src={listing.images[3]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery 3" /></div>
        <div><img src={listing.images[4]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery 4" /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 4fr', gap: '6rem' }}>
        
        {/* ── Left Content ── */}
        <div>
          <h2 style={{ fontFamily: C.ffDisplay, fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: C.ink }}>About this place</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: C.stone, marginBottom: '2rem' }}>{listing.desc}</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '3rem' }}>
            {listing.tags.map(tag => (
              <span key={tag} style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: `1px solid ${C.border}`, fontSize: '0.9rem', fontWeight: 600, color: C.ink }}>{tag}</span>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '3rem', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: C.ffDisplay, fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: C.ink }}>Reviews</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {listing.reviews.map((r, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F4F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.ink }}>{r.author[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: C.ink }}>{r.author}</div>
                      <div style={{ fontSize: '0.85rem', color: C.stoneLight }}>{r.date}</div>
                    </div>
                  </div>
                  <p style={{ color: C.stone, lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
            <button style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: 'transparent', border: `1px solid ${C.ink}`, borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>Show all 28 reviews</button>
          </div>
        </div>

        {/* ── Right Sidebar (Action Card) ── */}
        <div>
          <div style={{ position: 'sticky', top: 120, border: `1px solid ${C.border}`, borderRadius: 24, padding: '2rem', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: C.ink, marginBottom: '1.5rem', fontFamily: C.ffDisplay }}>Plan a Trip</h3>
            <p style={{ color: C.stone, fontSize: '0.95rem', marginBottom: '2rem' }}>Add this highly rated artisan market to your Philippine itinerary to keep track of your journey.</p>
            
            <Link to="/itinerary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '1rem', background: C.secondary, color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', marginBottom: '1.5rem', transition: 'background 0.2s' }}>
              Add to Itinerary
            </Link>

            <div style={{ borderTop: `1px solid ${C.border}`, margin: '0 -2rem', padding: '1.5rem 2rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: C.ink }}>
                <LuClock size={20} color={C.stone} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Opening Hours</div>
                  <div style={{ fontSize: '0.9rem', color: C.stone }}>{listing.hours}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: C.ink }}>
                <LuPhone size={20} color={C.stone} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Phone</div>
                  <div style={{ fontSize: '0.9rem', color: C.stone }}>{listing.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: C.ink }}>
                <LuGlobe size={20} color={C.stone} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Website</div>
                  <div style={{ fontSize: '0.9rem', color: C.stone }}>{listing.website}</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingDetail;
