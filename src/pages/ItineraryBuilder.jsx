import React, { useState } from 'react';
import { LuMapPin, LuDownload, LuCircle, LuCpu, LuChevronRight, LuArrowLeft, LuCheck } from 'react-icons/lu';
import places, { CATEGORIES, REGIONS } from '../data/philippinePlaces';
import logoImg from '../assets/WanderLocalLogo.png';

const GEMINI_API_KEY = 'AIzaSyALe-3hVBcphba9dwYKWy1ZqvZmhwa7oew';

const CATEGORY_COLORS = {
  Beach:    { bg:'var(--primary-pale)', color:'var(--primary)', border:'#bfdbfe' },
  Nature:   { bg:'#ecfdf5', color:'#059669', border:'#a7f3d0' },
  Heritage: { bg:'#fef3c7', color:'#d97706', border:'#fde68a' },
  City:     { bg:'#f3e8ff', color:'#7c3aed', border:'#ddd6fe' },
  Adventure:{ bg:'var(--terra-pale)', color:'#e11d48', border:'var(--terra-border)' },
};

function ResultView({ itinerary, totalDays, pax, budget, onReset }) {
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh', fontFamily: 'var(--ff-body)' }}>
      <style>{`
        @media print {
          @page { margin: 15mm; }
          body, html { background: white !important; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; color: #1e293b !important; }
          
          /* System Override */
          .db-sidebar, .db-header, .db-overlay, .print-hide, .db-header__actions { display: none !important; }
          .db-shell, .db-main, .db-content { 
            margin: 0 !important; padding: 0 !important; width: 100% !important; 
            max-width: 100% !important; height: auto !important; position: static !important; 
            overflow: visible !important; background: white !important; display: block !important;
          }

          /* General Resets */
          .bg-light, .bg-white { background: transparent !important; }
          .shadow-sm, .shadow-lg, .shadow { box-shadow: none !important; }
          .container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .text-muted, .text-secondary { color: #64748b !important; }
          
          /* Premium Typography & Accents */
          h1, h2, h3, h4, h5 { font-family: 'Inter', sans-serif !important; color: #0f172a !important; letter-spacing: -0.01em; }
          .badge { border: 1px solid #cbd5e1 !important; color: #334155 !important; background: #f8fafc !important; }
          
          /* Compact Inline Header */
          .print-logo-header { display: flex !important; align-items: center !important; justify-content: space-between !important; border-bottom: 2px solid #e2e8f0 !important; margin-bottom: 1.5rem !important; padding-bottom: 0.75rem !important; }
          .print-logo-header img { width: 130px !important; height: auto !important; }
          .print-logo-header .print-header-meta h4 { font-size: 1.1rem !important; font-weight: 700 !important; color: #0f172a !important; margin: 0 0 2px 0 !important; }
          .print-logo-header .print-header-meta p { font-size: 0.85rem !important; color: #64748b !important; margin: 0 !important; }
          
          /* Day Group Styles */
          .day-header { border: none !important; background: #f0fdf4 !important; color: #166534 !important; padding: 0.75rem 1rem !important; border-radius: 8px !important; margin-top: 2.5rem !important; margin-bottom: 1.5rem !important; display: inline-flex !important; align-items: center; border-left: 5px solid #16a34a !important; }
          .day-header .badge { background: white !important; border: none !important; color: #166534 !important; mix-blend-mode: multiply; }
          
          /* List Card & Timeline Styling */
          .card, .list-group-item, .border, .border-bottom { border: none !important; break-inside: avoid; }
          .item-card { margin-bottom: 2rem !important; padding: 0 !important; display: flex !important; gap: 1.5rem !important; }
          .time-col { border-right: 2px solid #e2e8f0 !important; padding-right: 1.5rem !important; width: 100px !important; flex-shrink: 0; text-align: right; }
          
          /* Print Images explicitly allowed */
          .print-image-wrap { display: block !important; width: 160px !important; height: 120px !important; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
          .print-image-wrap img { width: 100% !important; height: 100% !important; object-fit: cover !important; }
        }
      `}</style>
      
      {/* ── Page Header (Screen Only) ── */}
      <div className="bg-white border-bottom shadow-sm mb-4 py-4 print-hide">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-1" style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', color: 'var(--ink)' }}>
                Your Perfect Philippine Adventure
              </h1>
              <p className="text-muted mb-0">Custom curated for {pax} travelers based on your unique preferences.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light border fw-bold px-4 py-2" style={{ borderRadius: 12 }} onClick={onReset}><LuArrowLeft className="me-1"/> Start Over</button>
              <button className="btn btn-dark fw-bold px-4 py-2" style={{ borderRadius: 12 }} onClick={() => window.print()}><LuDownload className="me-1"/> Export Document</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1000 }}>
        
        {/* ── Print Document Header ── */}
        <div className="d-none print-logo-header">
          <img src={logoImg} alt="WanderLocal" />
          <div className="print-header-meta" style={{ textAlign: 'right' }}>
            <h4>Premium Travel Itinerary</h4>
            <p>{pax} Travelers &bull; {totalDays} Days &bull; {budget} Budget</p>
          </div>
        </div>

        {daysArray.map(day => {
          const items = itinerary.filter(i => i.day === day);
          if(items.length === 0) return null;
          return (
            <div key={day} className="card border-0 shadow-sm mb-4 print-hide-bg" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <div className="p-3 bg-success-subtle border-bottom day-header w-100">
                <h4 className="fw-bold text-success mb-0 d-flex align-items-center gap-2">
                  Day {day} <span className="badge bg-white text-success border border-success-subtle fs-6 px-3">{items.length} Stops</span>
                </h4>
              </div>
              <div className="list-group list-group-flush p-2 p-md-3">
                {items.map((item, idx) => {
                  const colors = CATEGORY_COLORS[item.place.category] || CATEGORY_COLORS.Nature;
                  return (
                    <div key={item.placeId + '-' + idx} className="list-group-item item-card p-4 border-bottom d-flex flex-column flex-sm-row align-items-start gap-4" style={{ background: '#fff' }}>
                      <div className="flex-shrink-0 text-start text-sm-end pe-sm-3 border-end-sm time-col" style={{ width: 105 }}>
                        <span className="fw-bold d-block" style={{ color: 'var(--ink)', fontSize: '1.4rem', lineHeight: '1' }}>{item.time ? item.time.split(' ')[0] : 'AM'}</span>
                        <small className="fw-bold" style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase' }}>{item.time ? item.time.split(' ')[1] : 'Morning'}</small>
                      </div>
                      
                      {/* Image Included in Print and Screen */}
                      <div className="print-image-wrap d-none d-sm-block bg-light" style={{ width: 160, height: 120, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={item.place.img} alt={item.place.name} className="w-100 h-100 object-fit-cover" />
                      </div>
                      
                      <div className="flex-grow-1">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                          <h5 className="fw-bold mb-0" style={{ color: '#0f172a', fontSize: '1.25rem' }}>{item.place.name}</h5>
                          <span className="badge rounded-pill fw-bold" style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}>
                            {item.place.category}
                          </span>
                        </div>
                        <p className="d-flex align-items-center gap-1 mb-2 fw-semibold" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                          <LuMapPin size={16} /> {item.place.province}
                        </p>
                        <p className="mb-0" style={{ fontSize: '1rem', lineHeight: 1.6, color: '#334155' }}>
                          {item.description || `Experience the best of ${item.place.name}. Let this highly-rated spot be the highlight of your day!`}
                        </p>
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
      const placesMini = places.map(p => ({ id: p.id, name: p.name, province: p.province, category: p.category, region: p.region }));
      const prompt = `You are a Philippine travel expert creating a premium itinerary formatted as JSON.
Create a detailed ${days}-day itinerary for ${adults} adults and ${children} children on a ${budget} budget, staying in ${stars}-star accomodations.
Selected Specific Destinations to Include: ${selectedPlaces.length > 0 ? selectedPlaces.map(id => places.find(p=>p.id===id)?.name).join(', ') : 'Anywhere'}.
Arrival: ${arrivalLoc || 'Any'} | Departure: ${departureLoc || 'Any'}
Top Interests: ${interests.length > 0 ? interests.join(', ') : 'Popular Highlights'}.
Special Requests: ${important || 'None'}.

Available places (choose from these): ${JSON.stringify(placesMini)}

Rules:
1. MUST integrate and prioritize the "Selected Specific Destinations to Include" chosen by the user in the generated itinerary! Wait, if none selected, pick logical groupings.
2. Group places sensibly (must make geographical sense for multi-day travel).
3. Assign 2-3 places per day.
4. Return ONLY a valid JSON array of objects. Format EXACTLY like this:
[
  {"day": 1, "placeId": 5, "time": "09:00 AM", "description": "Engaging 2-sentence description of what they will do here and why it perfectly fits their preferences..."}, 
  {"day": 1, "placeId": 6, "time": "02:00 PM", "description": "..."}
]
Do not include markdown formatting like \`\`\`json, return the raw JSON array.`;

      const modelsToTry = ['gemini-3-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
      let success = false;
      let lastError;

      for (const model of modelsToTry) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });

          if (!response.ok) throw new Error(`API Error from ${model}`);
          const data = await response.json();
          if (!data.candidates?.length) throw new Error(`No content from ${model}`);
          
          let text = data.candidates[0].content.parts[0].text.trim();
          text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          
          const startIdx = text.indexOf('[');
          const endIdx = text.lastIndexOf(']');
          if (startIdx !== -1 && endIdx !== -1) text = text.substring(startIdx, endIdx + 1);

          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed)) throw new Error('Invalid AI response format');

          const compiled = [];
          parsed.forEach(item => {
            const place = places.find(p => p.id === item.placeId);
            if (place) {
              compiled.push({ placeId: place.id, day: item.day, time: item.time, description: item.description, place: place });
            }
          });
          
          setGeneratedItinerary(compiled);
          success = true;
          break;
        } catch (e) {
          lastError = e;
        }
      }
      if (!success) throw lastError || new Error('All models failed');
    } catch (err) {
      console.error(err);
      setError('Oops, something went wrong formatting the AI response. Try again!');
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
    <div className="bg-light pb-5 mb-5" style={{ minHeight: '100vh', fontFamily: 'var(--ff-body)' }}>
      
      {/* ── Page Header ── */}
      <div className="bg-white border-bottom shadow-sm mb-5 py-4">
        <div className="container-fluid px-4 px-xl-5" style={{ maxWidth: 1600 }}>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h1 className="fw-bold mb-1" style={{ fontFamily: 'var(--ff-display)', fontSize: '2.25rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                <LuMapPin className="text-secondary me-2" /> Planner Dashboard
              </h1>
              <p className="text-muted mb-0 fs-5">Customize your Philippine adventure beautifully.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 px-xl-5" style={{ maxWidth: 1600 }}>
        
        {/* Customized Progress Stepper */}
        <div className="card shadow-sm border-0 mb-4 bg-white" style={{ borderRadius: 16 }}>
           <div className="card-body px-4 py-4 px-md-5">
             <div className="d-flex justify-content-between position-relative">
                {/* Connector Line */}
                <div className="position-absolute top-50 start-0 w-100 translate-middle-y" style={{ height: 3, background: '#e2e8f0', zIndex: 0 }}>
                  <div className="bg-success h-100" style={{ width: `${((step - 1) / 3) * 100}%`, transition: 'width 0.4s ease' }} />
                </div>
                
                {/* Steps */}
                {WIZARD_STEPS.map((s, i) => (
                  <div key={s} className="d-flex flex-column align-items-center position-relative z-1" style={{ width: 100 }}>
                     <div 
                        className={`fw-bold d-flex align-items-center justify-content-center border border-2 rounded-circle mb-2 transition-all shadow-sm ${step >= i + 1 ? 'border-success bg-success text-white' : 'border-light bg-white text-muted'}`} 
                        style={{ width: 44, height: 44, fontSize: '1.1rem' }}
                     >
                        {i + 1}
                     </div>
                     <span 
                        className={`fw-bold ${step >= i + 1 ? 'text-success' : 'text-muted'}`} 
                        style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}
                     >
                        {s}
                     </span>
                  </div>
                ))}
             </div>
           </div>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-4 p-md-5" style={{ minHeight: 450 }}>
            {error && <div className="alert alert-danger fw-bold d-flex align-items-center gap-2 mb-4"><LuCircle className="text-danger" /> {error}</div>}

            {/* STEP 1: Destinations */}
            {step === 1 && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <style>{`
                  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                  .no-scrollbar::-webkit-scrollbar { display: none; }
                  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                <div className="mb-4">
                  <h3 className="fw-bold mb-2" style={{ color: 'var(--ink)' }}>Where do you want to go?</h3>
                  <p className="text-muted fs-5">Browse top destinations or let our AI fill in the blanks around your selections.</p>
                </div>
                
                {/* Horizontal Region Filter */}
                <div className="d-flex gap-2 overflow-auto pb-2 mb-4 no-scrollbar" style={{ whiteSpace: 'nowrap' }}>
                  <button 
                    className={`btn rounded-pill fw-bold px-4 ${activeRegion === 'All' ? 'btn-success shadow-sm' : 'btn-light border text-muted'}`} 
                    onClick={() => setActiveRegion('All')}
                  >All Destinations</button>
                  {REGIONS.map(r => (
                    <button 
                      key={r} 
                      className={`btn rounded-pill fw-bold px-4 ${activeRegion === r ? 'btn-success shadow-sm' : 'btn-light border text-muted'}`} 
                      onClick={() => setActiveRegion(r)}
                    >{r}</button>
                  ))}
                </div>

                {/* Places Grid */}
                <div className="row g-4 overflow-auto pb-4 no-scrollbar" style={{ maxHeight: '65vh' }}>
                  {(activeRegion === 'All' ? places : places.filter(p => p.region === activeRegion)).map(p => {
                    const isSelected = selectedPlaces.includes(p.id);
                    return (
                      <div key={p.id} className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                        <div className={`card overflow-hidden h-100 border ${isSelected ? 'border-success shadow-sm' : 'border-light-subtle'}`} style={{ borderRadius: 12 }}>
                          <div style={{ height: 180, position: 'relative' }}>
                            <img src={p.img} alt={p.name} className="w-100 h-100 object-fit-cover" />
                            <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                              <h5 className="fw-bold text-white mb-0">{p.name}</h5>
                              <small className="text-white-50"><LuMapPin className="me-1" size={14}/>{p.province}</small>
                            </div>
                          </div>
                          <button 
                            className={`btn w-100 rounded-0 fw-bold py-3 ${isSelected ? 'btn-success-subtle text-success border-top border-success-subtle' : 'btn-light text-muted border-top border-light-subtle'}`}
                            onClick={() => { togglePlace(p.id); setError(''); }}
                            style={{ fontSize: '0.95rem' }}
                          >
                            {isSelected ? <><LuCheck className="me-1" /> Added to Trip</> : 'Add to Trip'}
                          </button>
                        </div>
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
                <div className="mb-5 pb-4 border-bottom">
                  <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
                    <div>
                      <h3 className="fw-bold mb-1" style={{ color: 'var(--ink)' }}>Which activities would you like us to include in your trip?</h3>
                      <p className="text-muted mb-0">Select max. 7 items, you can write us about other special wishes below.</p>
                    </div>
                    <span className="badge bg-light text-dark border p-2 px-3 fw-bold" style={{ fontSize: '0.9rem' }}>
                      Selected: <span className={interests.length === 7 ? 'text-danger' : 'text-success'}>{interests.length} / 7</span>
                    </span>
                  </div>
                  
                  <div className="row g-4">
                    {INTEREST_GROUPS.map((group, idx) => (
                      <div className="col-12" key={idx}>
                        <h6 className="fw-bold text-secondary mb-3 text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>{group.title}</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {group.items.map(item => {
                            const isSelected = interests.includes(item);
                            const isDisabled = !isSelected && interests.length >= 7;
                            return (
                              <button key={item} 
                                className={`btn rounded-pill fw-semibold px-4 py-2 ${isSelected ? 'btn-success text-white shadow-sm' : 'btn-light border bg-white text-dark'}`}
                                style={{ opacity: isDisabled ? 0.5 : 1, pointerEvents: isDisabled ? 'none' : 'auto', transition: 'all 0.2s', fontSize: '0.95rem' }}
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
                <div className="mb-5 pb-4 border-bottom">
                  <h4 className="fw-bold mb-4" style={{ color: 'var(--ink)' }}>In which stage of trip planning are you?</h4>
                  <div className="row g-3">
                    {STAGE_OPTIONS.map((opt, i) => (
                      <div key={i} className="col-md-6 col-lg-4">
                        <div 
                          className={`card h-100 border text-center p-3 ${stage === opt ? 'border-success bg-success-subtle shadow-sm' : 'border-light-subtle bg-white'}`}
                          style={{ cursor: 'pointer', borderRadius: 12, transition: 'all 0.2s' }}
                          onClick={() => setStage(opt)}
                        >
                          <h6 className="fw-bold mb-0" style={{ color: stage === opt ? 'var(--secondary)' : 'var(--ink)' }}>{opt}</h6>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Budget */}
                <div className="mb-5 pb-4 border-bottom">
                  <h4 className="fw-bold mb-3" style={{ color: 'var(--ink)' }}>What's your per-person budget for the trip?</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                    We'll use your budget to guide future recommendations. Your first itinerary version is based on your trip preferences, so it may not match exactly — but it's easy to adjust!
                  </p>
                  
                  <div className="p-4 bg-light rounded-4 border border-light-subtle mb-4">
                    <p className="mb-2"><strong>Included:</strong> Accommodation, transportation (transfers, domestic flights, etc.), guided tours & activities</p>
                    <p className="mb-0 text-muted"><strong>Not Included:</strong> International flights, trip insurance, and meals (breakfast may be included)</p>
                  </div>

                  <div className="row g-3">
                    {BUDGET_OPTIONS.map(opt => (
                      <div className="col-md-4" key={opt}>
                        <div 
                          className={`card border p-3 h-100 ${budget === opt ? 'border-success bg-success-subtle shadow-sm' : 'border-light-subtle bg-white'}`}
                          style={{ cursor: 'pointer', borderRadius: 12, transition: 'all 0.2s' }}
                          onClick={() => setBudget(opt)}
                        >
                          <div className="d-flex align-items-center justify-content-center text-center">
                            <span className="fw-bold" style={{ color: budget === opt ? 'var(--secondary)' : 'var(--ink)' }}>{opt}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Most Important */}
                <div>
                  <h4 className="fw-bold mb-3" style={{ color: 'var(--ink)' }}>What's most important to you?</h4>
                  <p className="text-muted mb-3 fs-6">Do you have any special wishes we should know about or are you celebrating any special occasion during this trip?</p>
                  <textarea 
                    className="form-control bg-light mb-2 shadow-sm" 
                    style={{ minHeight: 120, fontSize: '1rem', padding: '1.25rem', borderRadius: 16, border: '1px solid #dee2e6', resize: 'none' }}
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
                <h3 className="fw-bold mb-5 pb-3 border-bottom" style={{ color: 'var(--ink)' }}>Accommodation & Transportation</h3>
                
                {/* Rooms */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-bold mb-4" style={{ color: 'var(--ink)' }}>How many rooms do you need in each city?</h5>
                  
                  <div className="d-flex align-items-center gap-4 flex-wrap mb-4">
                    <div className="d-flex align-items-center bg-light rounded-pill border overflow-hidden p-1 shadow-sm">
                      <button className="btn btn-sm rounded-circle btn-light" onClick={() => setRooms(Math.max(1, rooms - 1))}>−</button>
                      <span className="fw-bold px-4" style={{ minWidth: 50, textAlign: 'center' }}>{rooms} {rooms === 1 ? 'Room' : 'Rooms'}</span>
                      <button className="btn btn-sm rounded-circle btn-light" onClick={() => setRooms(rooms + 1)}>+</button>
                    </div>
                  </div>

                  <div className="card border-0 bg-light rounded-4 p-4 shadow-sm" style={{ maxWidth: 500 }}>
                    <h6 className="fw-bold text-success mb-3">Room Configuration</h6>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-semibold">Adults</span>
                      <div className="d-flex align-items-center bg-white rounded-pill border overflow-hidden p-1">
                        <button className="btn btn-sm rounded-circle border-0 text-muted" onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
                        <span className="fw-bold px-3" style={{ minWidth: 40, textAlign: 'center' }}>{adults}</span>
                        <button className="btn btn-sm rounded-circle border-0 text-muted" onClick={() => setAdults(adults + 1)}>+</button>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Children</span>
                      <div className="d-flex align-items-center bg-white rounded-pill border overflow-hidden p-1">
                        <button className="btn btn-sm rounded-circle border-0 text-muted" onClick={() => setChildren(Math.max(0, children - 1))}>−</button>
                        <span className="fw-bold px-3" style={{ minWidth: 40, textAlign: 'center' }}>{children}</span>
                        <button className="btn btn-sm rounded-circle border-0 text-muted" onClick={() => setChildren(children + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-bold mb-3" style={{ color: 'var(--ink)' }}>Preferred hotel star rating?</h5>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        className={`btn d-flex flex-column align-items-center justify-content-center rounded-3 p-3 border ${stars >= star ? 'border-warning btn-warning text-dark' : 'btn-light text-muted'}`}
                        onClick={() => setStars(star)}
                        style={{ width: 80, height: 80, transition: 'all 0.2s' }}
                      >
                        <span className="fs-3 lh-1 mb-1">★</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Routing */}
                <div className="mb-5 pb-4 border-bottom">
                  <h5 className="fw-bold mb-4" style={{ color: 'var(--ink)' }}>Have you already booked your flights / transportation?</h5>
                  <div className="row g-4 mb-3">
                    <div className="col-md-6">
                      <label className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Arrival City / Province</label>
                      <select className="form-select form-select-lg border-light-subtle bg-light mb-2 shadow-sm" value={arrivalLoc} onChange={e => setArrivalLoc(e.target.value)}>
                        <option value="">Let us select the best route (Recommended)</option>
                        {REGIONS.map(r => <option key={`arr-${r}`} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Departure City / Province</label>
                      <select className="form-select form-select-lg border-light-subtle bg-light shadow-sm" value={departureLoc} onChange={e => setDepartureLoc(e.target.value)}>
                        <option value="">Let us select the best route (Recommended)</option>
                        {REGIONS.map(r => <option key={`dep-${r}`} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <h5 className="fw-bold mb-4" style={{ color: 'var(--ink)' }}>Do you have your dates set already?</h5>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Date of Arrival</label>
                      <input type="date" className="form-control form-control-lg border-light-subtle shadow-sm bg-light" value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Trip Length</label>
                      <div className="input-group input-group-lg shadow-sm">
                        <input type="number" className="form-control bg-light border-light-subtle" min="1" max="30" value={days} onChange={e => setDays(Number(e.target.value))} />
                        <span className="input-group-text bg-light border-light-subtle fw-bold">days</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 4: Ready */}
            {step === 4 && (
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="text-center pb-5 pt-3">
                  <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-light shadow-sm mb-4" style={{ width: 100, height: 100 }}>
                    <img src={logoImg} alt="WanderLocal" style={{ width: '60%', height: 'auto' }} />
                  </div>
                  <h2 className="fw-bold mb-3" style={{ color: 'var(--ink)', fontSize: '2.5rem' }}>Ready to explore!</h2>
                  <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: 500 }}>
                    We've gathered everything we need. Your custom {days}-day Philippine adventure awaits.
                  </p>
                  
                  {!loading ? (
                    <button className="btn btn-success text-white fw-bold px-5 py-3 shadow-lg" onClick={generateAI} style={{ borderRadius: 16, background: 'var(--secondary)', border: 'none', fontSize: '1.25rem' }}>
                      Build My Itinerary <LuCpu className="ms-2" />
                    </button>
                  ) : (
                    <div className="p-4 rounded-4 bg-success-subtle border border-success-subtle d-inline-block text-center shadow-sm" style={{ width: '100%', maxWidth: 450, animation: 'fadeIn 0.4s' }}>
                      <LuCpu className="spin-icon mb-3 text-success" style={{ fontSize: '3rem', animation: 'spin 1.5s linear infinite' }} />
                      <h4 className="fw-bold mb-2 text-success">Curating your adventure...</h4>
                      <p className="text-success mb-0 opacity-75" style={{ fontSize: '0.95rem' }}>Analyzing dates, routing, and availability...</p>
                    </div>
                  )}
                </div>
              </div>
            )}


          </div>
        </div>
      </div>

      <div className="fixed-bottom bg-white border-top shadow-lg p-3 z-3">
        <div className="container-fluid px-4 px-xl-5 d-flex align-items-center justify-content-between" style={{ maxWidth: 1600 }}>
          {step > 1 ? (
            <button className="btn btn-light border fw-bold px-4 py-2" onClick={prevStep} disabled={loading} style={{ borderRadius: 12 }}>
              <LuArrowLeft className="me-2"/> Back
            </button>
          ) : (
            <div /> /* empty placeholder */
          )}

          {step < 4 ? (
            <button className="btn btn-dark fw-bold px-5 py-2 text-white shadow-sm" onClick={nextStep} style={{ borderRadius: 12 }}>
              Continue <LuChevronRight className="ms-1" />
            </button>
          ) : (
            <div /> /* Replaced by the native button inside step 4 */
          )}
        </div>
      </div>
    </div>
  );
}
