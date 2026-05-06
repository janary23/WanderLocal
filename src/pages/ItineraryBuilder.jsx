import React, { useState } from 'react';
import { LuMapPin, LuDownload, LuCircle, LuCpu, LuChevronRight, LuArrowLeft, LuCheck } from 'react-icons/lu';
import places, { CATEGORIES, REGIONS } from '../data/philippinePlaces';
import logoImg from '../assets/WanderLocalLogo.png';
import { glassCardStyle, glassCardHover, btnPrimaryStyle, btnPrimaryHover, btnSecondaryStyle, btnSecondaryHover, btnGhostStyle, btnGhostHover, applyHover, removeHover } from '../inlineStyles';
import { generateAiItinerary } from '../services/api';

const CATEGORY_COLORS = {
  Beach:    { bg:'var(--color-primary-pale)', color:'var(--color-primary)', border:'var(--color-primary-border)' },
  Nature:   { bg:'var(--color-secondary-alt)', color:'var(--color-secondary)', border:'rgba(90,139,168,0.3)' },
  Heritage: { bg:'var(--color-accent-pale)', color:'var(--color-accent)', border:'rgba(227,178,60,0.3)' },
  City:     { bg:'var(--color-sand)', color:'var(--color-stone)', border:'var(--color-border)' },
  Adventure:{ bg:'rgba(211,97,53,0.1)', color:'var(--color-terracotta)', border:'rgba(211,97,53,0.3)' },
};

const inputStyle = {
  width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)', background: 'var(--color-surface)',
  color: 'var(--color-ink)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font-body)'
};

function ResultView({ itinerary, totalDays, pax, budget, onReset }) {
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  return (
    <div className="animate-fade-in" style={{ 
      maxWidth: 1200, margin: '0 auto', width: '100%', padding: '2rem 3rem 6rem',
      display: 'flex', flexDirection: 'column', gap: '2rem'
    }}>
      <style>{`
        @media print {
          @page { margin: 15mm; }
          body, html { background: white !important; font-family: 'Inter', sans-serif !important; color: #1e293b !important; }
          .db-sidebar, .db-header, .db-overlay, .print-hide { display: none !important; }
          .db-shell, .db-main, .db-content { 
            margin: 0 !important; padding: 0 !important; width: 100% !important; 
            max-width: 100% !important; height: auto !important; position: static !important; 
            overflow: visible !important; background: white !important; display: block !important;
          }
          .print-logo-header { display: flex !important; align-items: center !important; justify-content: space-between !important; border-bottom: 2px solid #e2e8f0 !important; margin-bottom: 1.5rem !important; padding-bottom: 0.75rem !important; }
          .print-logo-header img { width: 130px !important; height: auto !important; }
          .print-header-meta h4 { font-size: 1.1rem !important; font-weight: 700 !important; color: #0f172a !important; margin: 0 0 2px 0 !important; }
          .print-header-meta p { font-size: 0.85rem !important; color: #64748b !important; margin: 0 !important; }
          .print-hide-bg { border: none !important; box-shadow: none !important; background: transparent !important; }
        }
      `}</style>
      
      {/* ── Page Header (Screen Only) ── */}
      <div className="print-hide" style={{ ...glassCardStyle, padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', color: '#fff', border: 'none' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
            Your Perfect Adventure
          </h1>
          <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>Custom curated for {pax} travelers based on your unique preferences.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ ...btnGhostStyle, color: '#fff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }} onMouseOver={e => applyHover(e, { background: 'rgba(255,255,255,0.2)' })} onMouseOut={e => removeHover(e, { background: 'rgba(255,255,255,0.1)' })} onClick={onReset}><LuArrowLeft /> Start Over</button>
          <button style={{ ...btnPrimaryStyle, background: '#fff', color: 'var(--color-primary)' }} onMouseOver={e => applyHover(e, { transform: 'translateY(-2px)' })} onMouseOut={e => removeHover(e, { transform: 'translateY(0)' })} onClick={() => window.print()}><LuDownload /> Export Document</button>
        </div>
      </div>

      <div className="d-none print-logo-header">
        <img src={logoImg} alt="WanderLocal" />
        <div className="print-header-meta" style={{ textAlign: 'right' }}>
          <h4>Premium Travel Itinerary</h4>
          <p>{pax} Travelers &bull; {totalDays} Days &bull; {budget}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {daysArray.map(day => {
          const items = itinerary.filter(i => i.day === day);
          if(items.length === 0) return null;
          return (
            <div key={day} className="print-hide-bg" style={{ ...glassCardStyle, padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 2rem', background: 'var(--color-primary-pale)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--color-primary)', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Day {day}</h3>
                <span style={{ background: '#fff', color: 'var(--color-primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: '0.85rem', boxShadow: 'var(--shadow-xs)' }}>{items.length} Stops</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((item, idx) => {
                  const colors = CATEGORY_COLORS[item.place.category] || CATEGORY_COLORS.Nature;
                  return (
                    <div key={item.placeId + '-' + idx} style={{ padding: '2rem', borderBottom: idx < items.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ width: 120, flexShrink: 0, textAlign: 'right', borderRight: '2px solid var(--color-border)', paddingRight: '1.5rem' }}>
                        <div style={{ color: 'var(--color-ink)', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>{item.time ? item.time.split(' ')[0] : 'AM'}</div>
                        <div style={{ color: 'var(--color-stone)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '0.4rem' }}>{item.time ? item.time.split(' ')[1] : 'Morning'}</div>
                      </div>
                      
                      <div style={{ width: 160, height: 120, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-xs)' }}>
                        <img src={item.place.img} alt={item.place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      
                      <div style={{ flexGrow: 1, minWidth: 250 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--color-ink)', fontSize: '1.25rem' }}>{item.place.name}</h4>
                          <span style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}`, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: '0.75rem' }}>{item.place.category}</span>
                        </div>
                        <div style={{ color: 'var(--color-stone)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <LuMapPin size={16} /> {item.place.province}
                        </div>
                        <p style={{ margin: 0, color: 'var(--color-ink)', fontSize: '1rem', lineHeight: 1.6 }}>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ItineraryBuilder() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 Data
  const [activeRegion, setActiveRegion] = useState('All');
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  // Step 2 & 3 Data
  const [interests, setInterests] = useState([]);
  const [stage, setStage] = useState('');
  const [budget, setBudget] = useState('Standard (Mid-range)');
  const [important, setImportant] = useState('');
  
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [stars, setStars] = useState(3);
  const [arrivalLoc, setArrivalLoc] = useState('');
  const [departureLoc, setDepartureLoc] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [days, setDays] = useState(4);

  // Results
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const WIZARD_STEPS = ['Destinations', 'Interests', 'Logistics', 'Ready'];

  const INTEREST_GROUPS = [
    { title: 'Escape the City', items: ['Beaches & Islands', 'Natural Beauty', 'Outdoor Active (Surfing/Hiking)', 'Provincial Towns & Countryside', 'Island Hopping Cruises'] },
    { title: 'Food for the Soul', items: ['National Museums & Galleries', 'Indigenous Culture'] },
    { title: 'Like the Locals', items: ['Regional Filipino Cuisine', 'Street Food & Markets', 'Nightlife & Local Scene'] },
    { title: 'Philippine History', items: ['Spanish Colonial Heritage', 'WWII Historical Sites', 'Historic Churches', 'Ancestral Houses'] },
    { title: 'Family Adventure', items: ['Family Friendly Places', 'Theme Parks & Resorts'] }
  ];

  const BUDGET_OPTIONS = ['Budget (Backpacker)', 'Standard (Mid-range)', 'Premium (Luxury)'];
  const STAGE_OPTIONS = [
    'Just dreaming / Getting ideas',
    'I have flights, need an itinerary',
    'Ready to book everything'
  ];

  const handleInterestToggle = (item) => {
    if (interests.includes(item)) setInterests(interests.filter(i => i !== item));
    else if (interests.length < 7) setInterests([...interests, item]);
  };

  const togglePlace = (id) => {
    if (selectedPlaces.includes(id)) setSelectedPlaces(selectedPlaces.filter(pid => pid !== id));
    else setSelectedPlaces([...selectedPlaces, id]);
  };

  const generateAI = async () => {
    setLoading(true);
    setError('');
    try {
      // Build the places index the backend needs to resolve placeIds → place objects
      const placesMini = places.map(p => ({
        id: p.id, name: p.name, province: p.province,
        category: p.category, region: p.region
      }));

      // Send everything to the Flask backend — it owns the API key and model fallback
      const result = await generateAiItinerary({
        placesMini,
        days,
        adults,
        children,
        budget,
        stars,
        selectedPlaces,
        interests,
        arrivalLoc,
        departureLoc,
        important,
      });

      if (result.status !== 'success') {
        throw new Error(result.message || 'Backend returned an error');
      }

      const parsed = result.data;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Backend returned an empty itinerary');
      }

      // Hydrate each stop with full place data from local places array
      const compiled = [];
      parsed.forEach(item => {
        const place = places.find(p => p.id === item.placeId);
        if (place) {
          compiled.push({ placeId: place.id, day: item.day, time: item.time, description: item.description, place });
        }
      });

      if (compiled.length === 0) {
        throw new Error('AI returned place IDs that do not match any known destinations. Try again.');
      }

      setGeneratedItinerary(compiled);
    } catch (err) {
      console.error('generateAI error:', err);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && selectedPlaces.length === 0) { setError("Please select at least one destination to add to your trip."); return; }
    if (step === 2 && interests.length === 0) { setError("Please select at least one interest."); return; }
    setError('');
    setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => { setError(''); setStep(s => Math.max(s - 1, 1)); };

  if (generatedItinerary) {
    return <ResultView itinerary={generatedItinerary} totalDays={days} pax={adults + children} budget={budget} onReset={() => { setGeneratedItinerary(null); setStep(1); }} />
  }

  return (
    <div className="animate-fade-in" style={{ 
      maxWidth: 1400, margin: '0 auto', width: '100%', padding: '2rem 3rem 8rem',
      display: 'flex', flexDirection: 'column', gap: '2rem'
    }}>
      
      {/* ── Page Header ── */}
      <div style={{ 
        ...glassCardStyle, padding: '3rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)', color: '#fff', border: 'none'
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LuMapPin size={32} style={{ opacity: 0.8 }} /> Planner Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>Customize your Philippine adventure beautifully.</p>
      </div>

      {/* Customized Progress Stepper */}
      <div style={{ ...glassCardStyle, padding: '2rem 3rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 4, background: 'var(--color-border)', zIndex: 0, transform: 'translateY(-50%)', borderRadius: '2px' }}>
              <div style={{ background: 'var(--color-primary)', height: '100%', width: `${((step - 1) / 3) * 100}%`, transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)', borderRadius: '2px' }} />
            </div>
            
            {WIZARD_STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, width: 100 }}>
                 <div 
                    style={{ 
                      width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1.15rem', transition: 'all 0.3s ease',
                      background: step >= i + 1 ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: step >= i + 1 ? '#fff' : 'var(--color-stone)',
                      border: `3px solid ${step >= i + 1 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      boxShadow: step >= i + 1 ? 'var(--shadow-sm)' : 'none'
                    }}
                 >
                    {i + 1}
                 </div>
                 <span 
                    style={{ 
                      fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginTop: '0.75rem',
                      color: step >= i + 1 ? 'var(--color-primary)' : 'var(--color-stone)',
                      transition: 'color 0.3s'
                    }}
                 >
                    {s}
                 </span>
              </div>
            ))}
         </div>
      </div>

      <div style={{ ...glassCardStyle, padding: '3rem', minHeight: 450, position: 'relative' }}>
        {error && (
          <div style={{ background: 'var(--color-terracotta)', color: '#fff', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, marginBottom: '2rem', boxShadow: '0 4px 12px rgba(211,97,53,0.3)' }}>
            <LuCircle size={20} /> {error}
          </div>
        )}

        {/* STEP 1: Destinations */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Where do you want to go?</h3>
              <p style={{ color: 'var(--color-stone)', fontSize: '1.1rem', margin: 0 }}>Browse top destinations or let our AI fill in the blanks around your selections.</p>
            </div>
            
            {/* Horizontal Region Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }} className="no-scrollbar">
              <button 
                style={activeRegion === 'All' ? { ...btnPrimaryStyle, padding: '0.6rem 1.5rem' } : { ...btnSecondaryStyle, padding: '0.6rem 1.5rem' }} 
                onMouseOver={e => applyHover(e, activeRegion === 'All' ? btnPrimaryHover : btnSecondaryHover)}
                onMouseOut={e => removeHover(e, activeRegion === 'All' ? btnPrimaryStyle : btnSecondaryStyle)}
                onClick={() => setActiveRegion('All')}
              >All Destinations</button>
              {REGIONS.map(r => (
                <button 
                  key={r} 
                  style={activeRegion === r ? { ...btnPrimaryStyle, padding: '0.6rem 1.5rem' } : { ...btnSecondaryStyle, padding: '0.6rem 1.5rem' }} 
                  onMouseOver={e => applyHover(e, activeRegion === r ? btnPrimaryHover : btnSecondaryHover)}
                  onMouseOut={e => removeHover(e, activeRegion === r ? btnPrimaryStyle : btnSecondaryStyle)}
                  onClick={() => setActiveRegion(r)}
                >{r}</button>
              ))}
            </div>

            {/* Places Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }} className="no-scrollbar">
              {(activeRegion === 'All' ? places : places.filter(p => p.region === activeRegion)).map(p => {
                const isSelected = selectedPlaces.includes(p.id);
                return (
                  <div key={p.id} style={{ ...glassCardStyle, padding: 0, overflow: 'hidden', border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 180, position: 'relative' }}>
                      <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1.5rem 1rem 1rem', background: 'linear-gradient(transparent, rgba(11,22,33,0.9))' }}>
                        <h5 style={{ fontWeight: 800, color: '#fff', margin: 0, fontSize: '1.1rem' }}>{p.name}</h5>
                        <small style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><LuMapPin size={14}/>{p.province}</small>
                      </div>
                    </div>
                    <button 
                      style={{ background: isSelected ? 'var(--color-primary-pale)' : 'transparent', color: isSelected ? 'var(--color-primary)' : 'var(--color-stone)', border: 'none', padding: '1rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                      onClick={() => { togglePlace(p.id); setError(''); }}
                      onMouseOver={e => e.currentTarget.style.background = isSelected ? 'var(--color-primary-pale)' : 'var(--color-sand)'}
                      onMouseOut={e => e.currentTarget.style.background = isSelected ? 'var(--color-primary-pale)' : 'transparent'}
                    >
                      {isSelected ? <><LuCheck size={18} /> Added</> : 'Add to Trip'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Interests, Stage, Budget, Priorities */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            
            {/* 1. Interests */}
            <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Which activities would you like us to include?</h3>
                  <p style={{ color: 'var(--color-stone)', margin: 0, fontSize: '1.05rem' }}>Select up to 7 items.</p>
                </div>
                <span style={{ background: 'var(--color-surface)', color: 'var(--color-ink)', border: '1px solid var(--color-border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-pill)', fontWeight: 800, fontSize: '0.9rem', boxShadow: 'var(--shadow-xs)' }}>
                  Selected: <span style={{ color: interests.length === 7 ? 'var(--color-terracotta)' : 'var(--color-primary)' }}>{interests.length} / 7</span>
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {INTEREST_GROUPS.map((group, idx) => (
                  <div key={idx}>
                    <h6 style={{ fontWeight: 800, color: 'var(--color-stone)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{group.title}</h6>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {group.items.map(item => {
                        const isSelected = interests.includes(item);
                        const isDisabled = !isSelected && interests.length >= 7;
                        return (
                          <button key={item} 
                            style={{ 
                              ...(isSelected ? btnPrimaryStyle : btnSecondaryStyle),
                              opacity: isDisabled ? 0.5 : 1, pointerEvents: isDisabled ? 'none' : 'auto',
                              padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: 700
                            }}
                            onMouseOver={e => applyHover(e, isSelected ? btnPrimaryHover : btnSecondaryHover)}
                            onMouseOut={e => removeHover(e, isSelected ? btnPrimaryStyle : btnSecondaryStyle)}
                            onClick={() => { handleInterestToggle(item); setError(''); }}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Planning Stage */}
            <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--color-border)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>In which stage of trip planning are you?</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {STAGE_OPTIONS.map((opt, i) => (
                  <div key={i} 
                    style={{ ...glassCardStyle, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', border: stage === opt ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', background: stage === opt ? 'var(--color-primary-pale)' : 'var(--glass-bg)' }}
                    onMouseOver={e => applyHover(e, glassCardHover)}
                    onMouseOut={e => removeHover(e, glassCardStyle)}
                    onClick={() => setStage(opt)}
                  >
                    <div style={{ fontWeight: 800, color: stage === opt ? 'var(--color-primary)' : 'var(--color-ink)', fontSize: '1.05rem' }}>{opt}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Budget */}
            <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--color-border)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>What's your per-person budget?</h4>
              <p style={{ color: 'var(--color-stone)', margin: '0 0 1.5rem', fontSize: '1.05rem' }}>
                We'll use your budget to guide future recommendations.
              </p>
              
              <div style={{ padding: '1.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ color: 'var(--color-ink)', fontSize: '0.95rem' }}><strong style={{ fontWeight: 800 }}>Included:</strong> Accommodation, transportation, guided tours & activities</div>
                <div style={{ color: 'var(--color-stone)', fontSize: '0.95rem' }}><strong style={{ fontWeight: 800 }}>Not Included:</strong> International flights, trip insurance, and meals</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {BUDGET_OPTIONS.map(opt => (
                  <div key={opt} 
                    style={{ ...glassCardStyle, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', border: budget === opt ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', background: budget === opt ? 'var(--color-primary-pale)' : 'var(--glass-bg)' }}
                    onMouseOver={e => applyHover(e, glassCardHover)}
                    onMouseOut={e => removeHover(e, glassCardStyle)}
                    onClick={() => setBudget(opt)}
                  >
                    <div style={{ fontWeight: 800, color: budget === opt ? 'var(--color-primary)' : 'var(--color-ink)', fontSize: '1.05rem' }}>{opt}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Most Important */}
            <div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>What's most important to you?</h4>
              <p style={{ color: 'var(--color-stone)', margin: '0 0 1.5rem', fontSize: '1.05rem' }}>Do you have any special wishes we should know about or are you celebrating any special occasion during this trip?</p>
              <textarea 
                style={{ ...inputStyle, minHeight: 140, resize: 'none' }}
                placeholder="e.g. Needs to be very relaxing, want to try authentic adobo..."
                value={important}
                onChange={e => setImportant(e.target.value)}
              />
            </div>
          </div>
        )}


        {/* STEP 3: Logistics */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontWeight: 800, marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Accommodation & Transportation</h3>
            
            {/* Rooms */}
            <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--color-border)' }}>
              <h5 style={{ fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>How many rooms do you need?</h5>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '0.25rem', width: 'fit-content', boxShadow: 'var(--shadow-xs)' }}>
                  <button style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--color-sand)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-stone)' }} onClick={() => setRooms(Math.max(1, rooms - 1))}>−</button>
                  <span style={{ fontWeight: 800, minWidth: 80, textAlign: 'center', color: 'var(--color-ink)', fontSize: '1.1rem' }}>{rooms} {rooms === 1 ? 'Room' : 'Rooms'}</span>
                  <button style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--color-sand)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-stone)' }} onClick={() => setRooms(rooms + 1)}>+</button>
                </div>
              </div>

              <div style={{ ...glassCardStyle, padding: '2rem', maxWidth: 500, background: 'var(--color-primary-pale)', border: 'none' }}>
                <h6 style={{ fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Room Configuration</h6>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: '1.05rem' }}>Adults</span>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-pill)', padding: '0.25rem', border: '1px solid var(--color-border)' }}>
                    <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, color: 'var(--color-stone)' }} onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
                    <span style={{ fontWeight: 800, minWidth: 40, textAlign: 'center', color: 'var(--color-ink)' }}>{adults}</span>
                    <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, color: 'var(--color-stone)' }} onClick={() => setAdults(adults + 1)}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-ink)', fontSize: '1.05rem' }}>Children</span>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-pill)', padding: '0.25rem', border: '1px solid var(--color-border)' }}>
                    <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, color: 'var(--color-stone)' }} onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
                    <span style={{ fontWeight: 800, minWidth: 40, textAlign: 'center', color: 'var(--color-ink)' }}>{children}</span>
                    <button style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 800, color: 'var(--color-stone)' }} onClick={() => setChildren(children + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stars */}
            <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--color-border)' }}>
              <h5 style={{ fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Preferred hotel star rating?</h5>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    style={{ 
                      width: 80, height: 80, borderRadius: 'var(--radius-md)', 
                      border: stars >= star ? '2px solid var(--color-accent)' : '1px solid var(--color-border)', 
                      background: stars >= star ? 'var(--color-accent-pale)' : 'var(--color-surface)', 
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                      boxShadow: stars >= star ? 'var(--shadow-sm)' : 'none'
                    }}
                    onClick={() => setStars(star)}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <span style={{ fontSize: '2rem', lineHeight: 1, color: stars >= star ? 'var(--color-accent)' : 'var(--color-stone)' }}>★</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Routing */}
            <div style={{ marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid var(--color-border)' }}>
              <h5 style={{ fontWeight: 800, marginBottom: '2rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Have you already booked your flights?</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.75rem', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Arrival City / Province</label>
                  <select style={inputStyle} value={arrivalLoc} onChange={e => setArrivalLoc(e.target.value)}>
                    <option value="">Let us select the best route</option>
                    {REGIONS.map(r => <option key={`arr-${r}`} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.75rem', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Departure City / Province</label>
                  <select style={inputStyle} value={departureLoc} onChange={e => setDepartureLoc(e.target.value)}>
                    <option value="">Let us select the best route</option>
                    {REGIONS.map(r => <option key={`dep-${r}`} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h5 style={{ fontWeight: 800, marginBottom: '2rem', color: 'var(--color-ink)', fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Do you have your dates set already?</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.75rem', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Date of Arrival</label>
                  <input type="date" style={inputStyle} value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.75rem', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Trip Length</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="number" style={{ ...inputStyle, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} min="1" max="30" value={days} onChange={e => setDays(Number(e.target.value))} />
                    <span style={{ background: 'var(--color-sand)', border: '1px solid var(--color-border)', borderLeft: 'none', padding: '1rem 1.5rem', borderTopRightRadius: 'var(--radius-sm)', borderBottomRightRadius: 'var(--radius-sm)', fontWeight: 800, color: 'var(--color-stone)' }}>days</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 4: Ready */}
        {step === 4 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', width: 120, height: 120, marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <img src={logoImg} alt="WanderLocal" style={{ width: '65%', height: 'auto' }} />
              </div>
              <h2 style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--color-ink)', fontSize: '3rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>Ready to explore!</h2>
              <p style={{ color: 'var(--color-stone)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: 500, margin: '0 auto 3rem' }}>
                We've gathered everything we need. Your custom {days}-day Philippine adventure awaits.
              </p>
              
              {!loading ? (
                <button 
                  style={{ ...btnPrimaryStyle, padding: '1.25rem 3rem', fontSize: '1.25rem', borderRadius: 'var(--radius-pill)' }} 
                  onMouseOver={e => applyHover(e, btnPrimaryHover)} 
                  onMouseOut={e => removeHover(e, btnPrimaryStyle)} 
                  onClick={generateAI}
                >
                  Build My Itinerary <LuCpu />
                </button>
              ) : (
                <div style={{ ...glassCardStyle, padding: '3rem 2rem', background: 'var(--color-primary-pale)', border: '1px solid var(--color-primary-border)', display: 'inline-block', minWidth: 350, animation: 'fadeIn 0.4s' }}>
                  <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                  <LuCpu style={{ fontSize: '3.5rem', color: 'var(--color-primary)', animation: 'spin 1.5s linear infinite', marginBottom: '1.5rem' }} />
                  <h4 style={{ fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--color-primary)', fontSize: '1.25rem' }}>Curating your adventure...</h4>
                  <p style={{ color: 'var(--color-primary)', margin: 0, opacity: 0.8, fontSize: '1rem' }}>Analyzing dates, routing, and availability...</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', borderTop: '1px solid var(--color-border)', padding: '1.25rem 2rem', zIndex: 1000, boxShadow: '0 -8px 32px rgba(11,22,33,0.05)' }}>
        <div style={{ width: '100%', maxWidth: 1400, display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto' }}>
          {step > 1 ? (
            <button style={{ ...btnSecondaryStyle, padding: '0.75rem 1.5rem' }} onMouseOver={e => applyHover(e, btnSecondaryHover)} onMouseOut={e => removeHover(e, btnSecondaryStyle)} onClick={prevStep} disabled={loading}>
              <LuArrowLeft /> Back
            </button>
          ) : <div />}
          
          {step < 4 ? (
            <button style={{ ...btnPrimaryStyle, padding: '0.75rem 2rem' }} onMouseOver={e => applyHover(e, btnPrimaryHover)} onMouseOut={e => removeHover(e, btnPrimaryStyle)} onClick={nextStep}>
              Continue <LuChevronRight />
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
