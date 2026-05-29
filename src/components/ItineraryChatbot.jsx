import React, { useState, useEffect, useRef } from 'react';
import { LuMapPin, LuDownload, LuChevronRight, LuArrowLeft, LuCheck, LuX, LuSparkles, LuCompass, LuBookOpen, LuSend, LuMessageSquare, LuMinus, LuMaximize2, LuMinimize2, LuSave } from 'react-icons/lu';
import places, { REGIONS } from '../data/philippinePlaces';
import { glassCardStyle, btnPrimaryStyle, btnPrimaryHover, btnSecondaryStyle, btnSecondaryHover, applyHover, removeHover } from '../inlineStyles';
import { generateAiItinerary, generateAiChat, saveFullItinerary } from '../services/api';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/WanderLocalLogo.png';

// Broad function to strip asterisks (markdown bold) and ALL unicode emojis/symbols
const cleanText = (str) => {
  if (!str || typeof str !== 'string') return '';
  // Remove asterisks *
  let cleaned = str.replace(/\*/g, '');
  // Remove standard unicode emojis and colored/pictographic glyph symbols
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FAFF}]|[\u{2B50}\u{2605}\u{2606}]|[\u{200D}\u{FE0F}]/gu, '');
  // Explicitly remove common standard symbols that act as emojis
  const customEmojis = /[📌🗺️🎯👥📅🚀🎉✨🧭🎒🌴🏖️🌊🌋⛪🛍️🚲🚗✈️🏨🛑💬⭐📍🔍❌👉🧭🗺️🏨🌊]/g;
  cleaned = cleaned.replace(customEmojis, '');
  return cleaned.trim();
};

// Substring place name matcher to find matching place from phPlaces database for a specific line of text
const matchPlaceInLine = (text) => {
  if (!text) return null;
  // Skip matching for generic loading text
  if (text.includes('Asking WanderAI') || text.includes('Curating')) return null;

  let matchedPlace = null;
  places.forEach(p => {
    // Extract base keywords (e.g. "El Nido", "Boracay", "Vigan")
    // Clean suffix words like City, Island, Falls, etc. to get high-accuracy matches
    const cleanPName = p.name
      .replace(/(City|Island|Islands|Falls|Tours|Sanctuary|Park|Subterranean River|Underground River|Burnham|Rizal|Global)/gi, '')
      .trim();
    
    if (cleanPName.length >= 3) {
      // Relaxed substring matching (case-insensitive) instead of strict RegExp word boundary
      if (text.toLowerCase().includes(cleanPName.toLowerCase())) {
        matchedPlace = p;
      }
    }
  });
  return matchedPlace;
};

// Generates a gorgeous visual fallback place card with a category-matched Unsplash stock image
const getFallbackPlace = (title, lineText) => {
  if (!title) return null;
  
  const text = lineText.toLowerCase();
  let img = 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=300&q=80'; // Default beautiful tropical skyline/nature
  
  if (text.includes('beach') || text.includes('island') || text.includes('sea') || text.includes('sand') || text.includes('reef') || text.includes('surf') || text.includes('ocean')) {
    img = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'; // Beautiful tropical beach
  } else if (text.includes('mountain') || text.includes('trek') || text.includes('hike') || text.includes('falls') || text.includes('river') || text.includes('lake') || text.includes('nature') || text.includes('forest') || text.includes('volcano')) {
    img = 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=300&q=80'; // Beautiful tropical rainforest
  } else if (text.includes('heritage') || text.includes('church') || text.includes('history') || text.includes('historic') || text.includes('ruins') || text.includes('fort') || text.includes('spanish') || text.includes('colonial')) {
    img = 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=300&q=80'; // Beautiful Vigan heritage style
  }
  
  return {
    name: title,
    province: 'Philippines',
    img: img,
    wiki: title.replace(/\s+/g, '_')
  };
};

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', borderRadius: '12px',
  border: '1px solid var(--color-border)', background: '#fff',
  color: 'var(--color-ink)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font-body)'
};

const INTEREST_GROUPS = [
  { title: 'Escape the City', items: ['Beaches and Islands', 'Natural Beauty', 'Outdoor Active Surfing Hiking', 'Provincial Towns and Countryside', 'Island Hopping Cruises'] },
  { title: 'Food for the Soul', items: ['National Museums and Galleries', 'Indigenous Culture'] },
  { title: 'Like the Locals', items: ['Regional Filipino Cuisine', 'Street Food and Markets', 'Nightlife and Local Scene'] },
  { title: 'Philippine History', items: ['Spanish Colonial Heritage', 'WWII Historical Sites', 'Historic Churches', 'Ancestral Houses'] },
  { title: 'Family Adventure', items: ['Family Friendly Places', 'Theme Parks and Resorts'] }
];

const parseAiTextToRichUi = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ height: '0.4rem' }} />;

        // Numbered list item: e.g. "1. Manila - The capital"
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const content = numMatch[2];
          const parts = content.split(/ - |: /);
          const title = parts[0];
          const desc = parts.slice(1).join(' - ');
          
          const matchedPlace = matchPlaceInLine(trimmed) || getFallbackPlace(title, trimmed);

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.2rem 0' }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  color: '#fff', width: '22px', height: '22px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '0.15rem',
                  boxShadow: '0 2px 6px rgba(26,95,122,0.2)'
                }}>
                  {num}
                </div>
                <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {parts.length > 1 ? (
                    <>
                      <strong style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{title}</strong>
                      <span style={{ color: 'var(--color-stone)' }}> — </span>
                      <span style={{ color: 'var(--color-ink)' }}>{desc}</span>
                    </>
                  ) : (
                    <span style={{ color: 'var(--color-ink)' }}>{content}</span>
                  )}
                </div>
              </div>
              {matchedPlace && <InlinePlaceCard place={matchedPlace} indent="2.2rem" />}
            </div>
          );
        }

        // Bullet item: e.g. "- Boracay Island"
        const bulletMatch = trimmed.match(/^[-•*]\s+(.*)/);
        if (bulletMatch) {
          const content = bulletMatch[1];
          const parts = content.split(/ in | - |: /);
          const title = parts[0];
          const desc = parts.slice(1).join(' - ');

          const matchedPlace = matchPlaceInLine(trimmed) || getFallbackPlace(title, trimmed);

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.2rem 0' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--color-accent)', flexShrink: 0, marginTop: '0.65rem',
                  boxShadow: '0 0 4px var(--color-accent)'
                }} />
                <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {parts.length > 1 ? (
                    <>
                      <strong style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{title}</strong>
                      <span style={{ color: 'var(--color-stone)' }}> — </span>
                      <span style={{ color: 'var(--color-ink)' }}>{desc}</span>
                    </>
                  ) : (
                    <span style={{ color: 'var(--color-ink)' }}>{content}</span>
                  )}
                </div>
              </div>
              {matchedPlace && <InlinePlaceCard place={matchedPlace} indent="1.25rem" />}
            </div>
          );
        }

        // Standard paragraph
        const matchedPlace = matchPlaceInLine(trimmed);
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--color-ink)' }}>
              {trimmed}
            </p>
            {matchedPlace && <InlinePlaceCard place={matchedPlace} indent="0" />}
          </div>
        );
      })}
    </div>
  );
};

function ChatBubble({ sender, children }) {
  const isAi = sender === 'ai';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isAi ? 'flex-start' : 'flex-end',
      marginBottom: '0.75rem',
      width: '100%',
      animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div 
        className={isAi ? 'ai-bubble-premium' : ''}
        style={{
          maxWidth: '90%',
          padding: '0.95rem 1.25rem',
          borderRadius: isAi ? '24px 24px 24px 4px' : '24px 24px 4px 24px',
          background: isAi ? 'rgba(255, 255, 255, 0.85)' : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          color: isAi ? 'var(--color-ink)' : '#fff',
          border: isAi ? '1px solid rgba(255, 255, 255, 0.75)' : 'none',
          boxShadow: isAi ? '0 8px 32px rgba(16, 55, 92, 0.04), inset 0 1px 1px rgba(255,255,255,0.8)' : '0 8px 24px rgba(26,95,122,0.18)',
          backdropFilter: isAi ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isAi ? 'blur(16px)' : 'none',
          fontSize: '0.925rem',
          lineHeight: 1.45,
          fontWeight: isAi ? 500 : 600,
        }}
      >
        {isAi && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.55rem' }}>
            <LuSparkles size={12} color="var(--color-primary)" style={{ animation: 'spinSlow 6s linear infinite' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)' }}>WanderAI</span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function InlinePlaceCard({ place, indent = '2.2rem' }) {
  if (!place) return null;
  return (
    <div
      onClick={() => window.open(`https://en.wikipedia.org/wiki/${place.wiki || place.name.replace(/\s+/g, '_')}`, '_blank')}
      style={{
        display: 'flex', gap: '0.75rem', alignItems: 'center',
        padding: '0.5rem', borderRadius: '14px', background: '#F8F9FA',
        border: '1px solid rgba(26, 95, 122, 0.08)',
        margin: `0.35rem 0 0.75rem ${indent}`, cursor: 'pointer',
        boxShadow: 'var(--shadow-xs)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: 'translateY(0)'
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = 'rgba(26, 95, 122, 0.2)';
        e.currentTarget.style.background = '#EDF4F8';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = 'rgba(26, 95, 122, 0.08)';
        e.currentTarget.style.background = '#F8F9FA';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Left visual cover photo */}
      <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
        <img src={place.img} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* Right details (caption) */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: '0.775rem', color: 'var(--color-primary)' }}>{place.name}</div>
        <small style={{ color: 'var(--color-stone)', fontSize: '0.65rem', fontWeight: 600 }}>{place.province} &bull; Click to read more</small>
      </div>
    </div>
  );
}

export default function ItineraryChatbot() {
  const { isAuthenticated, userId, userName } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Talent Mode: null = Select, 'itinerary' = Interview, 'chat' = Free guide chat
  const [talentMode, setTalentMode] = useState(null);
  
  // Interview Step
  const [interviewStep, setInterviewStep] = useState(1); // 1=Destinations, 2=Style, 3=Logistics, 4=Recap, 5=Loading, 6=Stops

  // Selections
  const [activeRegion, setActiveRegion] = useState('All');
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [interests, setInterests] = useState([]);
  const [important, setImportant] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(4);
  const [arrivalDate, setArrivalDate] = useState('');

  // Results
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [error, setError] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 'g1',
      sender: 'ai',
      text: 'Mabuhay! I am your multi-talented WanderAI Travel Assistant. How would you like me to help you today?'
    },
    {
      id: 'g2',
      sender: 'ai',
      text: 'Please choose a talent pathway below. I can design a custom step-by-step sightseeing itinerary, or answer open-ended questions about Philippine travel!'
    }
  ]);

  const chatBodyRef = useRef(null);

  // Auto-scroll on changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, talentMode, interviewStep, selectedPlaces, interests, error]);

  // Listener to open
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      // Auto-focus custom itinerary planner if triggered from dashboards/listings
      setTalentMode('itinerary');
      setInterviewStep(1);
    };
    window.addEventListener('open-itinerary-chat', handleOpenChat);
    return () => window.removeEventListener('open-itinerary-chat', handleOpenChat);
  }, []);

  const selectTalent = (mode) => {
    setMessages(prev => [
      ...prev,
      {
        id: `user-select-${Date.now()}`,
        sender: 'user',
        text: mode === 'itinerary' ? 'Create Custom Itinerary' : 'Ask Travel Questions'
      }
    ]);

    setTalentMode(mode);

    if (mode === 'itinerary') {
      setInterviewStep(1);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-itinerary-greet-${Date.now()}`,
          sender: 'ai',
          text: 'Starting your bespoke itinerary interview! First, what activities are you most interested in, and do you have any special wishes for this trip?'
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-chat-greet-${Date.now()}`,
          sender: 'ai',
          text: 'Free Guide Mode activated! Feel free to ask anything, or tap one of our popular quick shortcuts below.'
        }
      ]);
    }
  };

  const handleShortcutClick = async (type) => {
    let requestText = '';
    let responseText = '';

    if (type === 'top10') {
      requestText = 'Tell me the Top 10 Places in the Philippines';
      responseText = `Here are the top 10 places in the Philippines to visit:

1. Manila - The vibrant historic capital featuring ancient Spanish colonial architecture and walled fortresses.
2. Boracay - Known globally for its incredible fine white sand beach, stunning sunsets, and active water sports.
3. El Nido - Spectacular soaring limestone cliffs, crystal clear hidden lagoons, and islands.
4. Cebu - Rich historical landmarks, tropical diving sites, and swimming with gentle whale sharks.
5. Bohol - Features the unique geological Chocolate Hills and the cute tiny Philippine tarsier.
6. Siargao - The ultimate surfing capital of the country with a wonderfully laid back atmosphere.
7. Coron - Breathtaking clean sapphire lakes, pristine shipwrecks, and dramatic coastal islands.
8. Baguio - The cool high altitude mountain city famous for pine trees and scenic lookouts.
9. Vigan - A beautifully preserved sixteenth century Spanish colonial town with stone cobblestone streets.
10. Batanes - Enchanting green hills, traditional stone shelter houses, and sweeping blue ocean views.`;
    } else if (type === 'beaches') {
      requestText = 'What are the best beaches and islands?';
      responseText = `Here are some of the most beautiful beaches and islands in the country:

- White Beach in Boracay - Renowned for its powdery fine sand and lively beachfront vibes.
- Nacpan Beach in El Nido - A long scenic stretch of golden sand lined with tall coconut palms.
- Alona Beach in Panglao - Known for its wonderful proximity to rich marine life and diving.
- Kalanggaman Island in Leyte - A stunning sandbar stretching far out into clear turquoise sea.
- Bantayan Island in Cebu - A tranquil beach paradise perfect for peaceful island relaxation.`;
    } else if (type === 'adventure') {
      requestText = 'Recommend some adventure hotspots';
      responseText = `For thrill seekers and nature lovers, try these adventure highlights:

- Mount Pulag in Benguet - Trek above the mountains to view the famous sea of clouds at sunrise.
- Chocolate Hills Adventure Park in Bohol - Enjoy high altitude canopy walking and wave ziplining.
- Donsol in Sorsogon - Experience snorkeling alongside magnificent whale sharks in the wild.
- Pagsanjan Falls in Laguna - Ride a traditional wooden canoe to shoot the rapids through a lush canyon.
- Tubbataha Reefs - Embark on a premier diving expedition to view rich coral walls and sharks.`;
    } else if (type === 'heritage') {
      requestText = 'What are the best historical and heritage tours?';
      responseText = `Immerse yourself in history with these cultural and heritage destinations:

- Intramuros in Manila - Take a walking tour of the ancient stone walls, Fort Santiago, and colonial churches.
- Vigan Heritage Village - Ride a traditional horse carriage through beautifully preserved historic streets.
- Rice Terraces of Banaue - Walk along the jaw dropping hand carved mountainside agricultural terraces.
- Basilica del Santo Nino in Cebu - Discover the oldest historic Roman Catholic church in the country.
- Corregidor Island - Explore the historic World War II island fortress located in Manila Bay.`;
    }

    setMessages(prev => [
      ...prev,
      { id: `user-req-${Date.now()}`, sender: 'user', text: cleanText(requestText) }
    ]);

    const loadingId = `shortcut-loading-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      { id: loadingId, sender: 'ai', text: 'Asking WanderAI...' }
    ]);

    try {
      const response = await generateAiChat(requestText);
      if (response.status === 'success') {
        const cleanedResponse = cleanText(response.data);
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== loadingId);
          return [
            ...filtered,
            { id: `ai-res-${Date.now()}`, sender: 'ai', text: cleanedResponse }
          ];
        });
      } else {
        throw new Error(response.message || 'Failed to fetch AI recommendation');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingId);
        return [
          ...filtered,
          { id: `ai-res-${Date.now()}`, sender: 'ai', text: cleanText(responseText) }
        ];
      });
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const prompt = inputValue.trim();
    if (!prompt) return;

    setInputValue('');

    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: prompt }
    ]);

    const loadingId = `loading-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      { id: loadingId, sender: 'ai', text: 'Asking WanderAI...' }
    ]);

    try {
      const response = await generateAiChat(prompt);
      if (response.status === 'success') {
        const cleanedResponse = cleanText(response.data);
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== loadingId);
          return [
            ...filtered,
            { id: `ai-res-${Date.now()}`, sender: 'ai', text: cleanedResponse }
          ];
        });
      } else {
        throw new Error(response.message || 'Failed to connect to WanderAI');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== loadingId);
        return [
          ...filtered,
          { id: `ai-err-${Date.now()}`, sender: 'ai', text: 'Sorry, I am having trouble connecting to my brain. Please try again in a moment.' }
        ];
      });
    }
  };

  const handleStyleConfirm = () => {
    if (interests.length === 0) {
      setError('Please select at least one activity.');
      return;
    }
    setError('');
    const interestStr = interests.join(', ');
    const wishesStr = important ? ` Wishes: ${important}` : '';
    setMessages(prev => [
      ...prev,
      { id: `user-style-${Date.now()}`, sender: 'user', text: `My interests: ${interestStr}.${wishesStr}` },
      { id: `ai-style-${Date.now()}`, sender: 'ai', text: 'Fabulous selections! Next, where would you like to explore? Please select your dream destinations below.' }
    ]);
    setInterviewStep(2);
  };

  const handlePlacesConfirm = () => {
    if (selectedPlaces.length === 0) {
      setError('Please select at least one place.');
      return;
    }
    setError('');
    const placeNames = selectedPlaces.map(id => places.find(p => p.id === id)?.name).filter(Boolean).join(', ');
    setMessages(prev => [
      ...prev,
      { id: `user-places-${Date.now()}`, sender: 'user', text: `Selected destinations: ${placeNames}` },
      { id: `ai-places-${Date.now()}`, sender: 'ai', text: 'Perfect choices! Lastly, how many travelers are going on this trip, and how many days is your adventure?' }
    ]);
    setInterviewStep(3);
  };

  const handleLogisticsConfirm = () => {
    if (days <= 0) {
      setError('Days count must be positive.');
      return;
    }
    setError('');
    const arrivalStr = arrivalDate ? ` starting on ${arrivalDate}` : '';
    setMessages(prev => [
      ...prev,
      { id: `user-logistics-${Date.now()}`, sender: 'user', text: `We have ${travelers} traveler(s) for a ${days}-day trip${arrivalStr}.` },
      { id: `ai-logistics-${Date.now()}`, sender: 'ai', text: 'Perfect. Here is a summary of your preferences. Ready to build your bespoke attractions-only itinerary?' }
    ]);
    setInterviewStep(4);
  };

  const generateAI = async () => {
    setError('');
    setInterviewStep(5);
    const loadingMessageId = `loading-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      { id: loadingMessageId, sender: 'ai', text: 'Curating your bespoke attractions itinerary...' }
    ]);

    try {
      const placesMini = places.map(p => ({
        id: p.id, name: p.name, province: p.province,
        category: p.category, region: p.region
      }));

      const result = await generateAiItinerary({
        placesMini,
        days,
        travelers,
        selectedPlaces,
        interests,
        important,
      });

      if (result.status !== 'success') {
        throw new Error(result.message || 'Backend returned an error');
      }

      const parsed = result.data;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Backend returned an empty itinerary');
      }

      const compiled = [];
      parsed.forEach(item => {
        const place = places.find(p => p.id === item.placeId);
        if (place) {
          compiled.push({
            placeId: place.id,
            day: item.day,
            time: item.time,
            description: cleanText(item.description),
            place
          });
        }
      });

      setGeneratedItinerary(compiled);
      setMessages(prev => {
        const cleaned = prev.filter(m => m.id !== loadingMessageId);
        return [
          ...cleaned,
          {
            id: `result-${Date.now()}`,
            sender: 'ai',
            text: 'Your custom attractions-only itinerary is ready! Here is your bespoke daily sightseeing plan:'
          }
        ];
      });
      setInterviewStep(6);
    } catch (err) {
      console.error(err);
      setError(cleanText(err.message || 'Failed to generate itinerary. Try again.'));
      setInterviewStep(4);
      setMessages(prev => prev.filter(m => m.id !== loadingMessageId));
    }
  };

  const handleReset = () => {
    setGeneratedItinerary(null);
    setSelectedPlaces([]);
    setInterests([]);
    setImportant('');
    setTravelers(2);
    setDays(4);
    setArrivalDate('');
    setInterviewStep(1);
    setTalentMode(null);
    setError('');
    setMessages([
      {
        id: 'g1',
        sender: 'ai',
        text: 'Mabuhay! I am your multi-talented WanderAI Travel Assistant. How would you like me to help you today?'
      },
      {
        id: 'g2',
        sender: 'ai',
        text: 'Please choose a talent pathway below. I can design a custom step-by-step sightseeing itinerary, or answer open-ended questions about Philippine travel!'
      }
    ]);
  };

  const handleSaveItinerary = async () => {
    if (!isAuthenticated || !userId) {
      setError('Please log in or sign up to save your itinerary to your profile!');
      return;
    }

    setError('');
    try {
      const daysArray = [];
      for (let d = 1; d <= days; d++) {
        const stopsForDay = generatedItinerary.filter(stop => stop.day === d);
        daysArray.push({
          day_index: d,
          day_label: `Day ${d}`,
          stops: stopsForDay.map(stop => ({
            listing_id: null,
            name: stop.place.name,
            time: stop.time,
            duration: '2 hours',
            type: stop.place.category
          }))
        });
      }

      const payload = {
        user_id: userId,
        title: `My Bespoke ${days}-Day Itinerary`,
        destination: selectedPlaces.length > 0 ? places.find(p => p.id === selectedPlaces[0])?.name || 'Philippines' : 'Philippines',
        days: daysArray
      };

      const res = await saveFullItinerary(payload);
      if (res.status === 'success') {
        setMessages(prev => [
          ...prev,
          { 
            id: `ai-save-success-${Date.now()}`, 
            sender: 'ai', 
            text: `Success! Your bespoke ${days}-day itinerary has been successfully saved to your WanderLocal profile! You can view and manage it anytime in your Traveler Dashboard under "My Journeys".` 
          }
        ]);
        alert('Itinerary saved successfully to your WanderLocal profile!');
      } else {
        throw new Error(res.message || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to save itinerary: ${err.message}`);
    }
  };

  const togglePlace = (id) => {
    if (selectedPlaces.includes(id)) {
      setSelectedPlaces(selectedPlaces.filter(pid => pid !== id));
    } else {
      setSelectedPlaces([...selectedPlaces, id]);
    }
  };

  const handleInterestToggle = (item) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else if (interests.length < 7) {
      setInterests([...interests, item]);
    }
  };

  // Helper to extract places mentioned in chat messages
  const getMentionedPlaces = () => {
    const mentioned = new Set();
    messages.forEach(msg => {
      if (msg.sender === 'ai' || msg.sender === 'user') {
        places.forEach(p => {
          const cleanPName = p.name.replace(/(City|Island|Islands|Falls|Sanctuary|Park|Subterranean River|Underground River|Burnham|Rizal|Global|Tours)/gi, '').trim();
          if (cleanPName.length >= 3 && msg.text.toLowerCase().includes(cleanPName.toLowerCase())) {
            mentioned.add(p);
          }
        });
      }
    });
    return Array.from(mentioned);
  };

  return (
    <div className="itinerary-chatbot-root-container">
      {/* Keyframe Animations */}
      <style>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3) translateY(40px); }
          50% { transform: scale(1.1) translateY(-10px); }
          70% { transform: scale(0.9) translateY(5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes panelUp {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-panel-up { animation: panelUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .chat-no-scrollbar::-webkit-scrollbar { display: none; }
        .chat-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .ai-bubble-premium {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ai-bubble-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(26,95,122,0.08), 0 0 0 1px rgba(26,95,122,0.15) !important;
          border-color: rgba(26,95,122,0.25) !important;
        }
        .print-only-itinerary-document {
          display: none;
        }
        .print-document-body {
          padding: 50px 45px;
        }
        @media print {
          /* High-end Page Setup: 20mm top/bottom, 18mm left/right margin on ALL pages */
          @page {
            size: A4 portrait;
            margin: 20mm 18mm 20mm 18mm;
          }

          /* Hide all direct children of #root except our chatbot root container */
          #root > *:not(.itinerary-chatbot-root-container) {
            display: none !important;
          }
          
          /* Clean up main browser dimensions & layout during print */
          html, body, #root, .itinerary-chatbot-root-container {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
          }
          
          /* Hide interactive chatbot items */
          .itinerary-chatbot-root-container > *:not(.print-only-itinerary-document) {
            display: none !important;
          }
          
          /* Show print document */
          .print-only-itinerary-document {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          /* Zero padding on body during print so A4 page margins manage it perfectly and consistently */
          .print-document-body {
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Centered Modal Blurred Overlay */}
      {isOpen && isExpanded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 22, 33, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 9998,
            animation: 'fadeIn 0.3s ease-out',
            transition: 'all 0.3s ease-out'
          }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Floating Bubble Button */}
      {!isOpen && (
        <button
          className="animate-bounce-in print-hide"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            width: '68px', height: '68px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            color: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 36px rgba(26,95,122,0.35), inset 0 1px 1px rgba(255,255,255,0.25)',
            zIndex: 9999, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: 'scale(1)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(26,95,122,0.45), inset 0 1px 1px rgba(255,255,255,0.25)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(26,95,122,0.35), inset 0 1px 1px rgba(255,255,255,0.25)';
          }}
        >
          <LuCompass size={28} style={{ animation: 'spinSlow 10s linear infinite' }} />
        </button>
      )}

      {/* Expanded Chat Panel */}
      {isOpen && (
        <div
          className="animate-panel-up print-hide"
          style={{
            ...glassCardStyle,
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            boxShadow: '0 24px 64px rgba(11,22,33,0.18), 0 0 0 1px rgba(255,255,255,0.6) inset',
            border: '1px solid rgba(226, 228, 232, 0.8)',
            background: 'rgba(253, 251, 247, 0.98)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            
            // Dynamic Positioning states
            ...(isExpanded ? {
              bottom: '50%',
              right: '50%',
              transform: 'translate(50%, 50%)',
              width: '980px',
              height: '80vh',
              maxWidth: '94vw',
              maxHeight: '820px',
            } : {
              bottom: '2.5rem',
              right: '2.5rem',
              width: '440px',
              height: '700px',
              transform: 'none',
            })
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.25rem 1.75rem',
            background: 'linear-gradient(135deg, #10375C 0%, #1A5F7A 100%)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(16,55,92,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)'
              }}>
                <LuCompass size={18} color="#fff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em', color: '#fff' }}>WanderAI Assistant</h4>
                <small style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Philippine Travel Planner</small>
              </div>
            </div>
            
            {/* Header Window Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }} onClick={e => e.stopPropagation()}>
              {/* Expand to Center Modal / Restore to normal Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                title={isExpanded ? "Collapse to Sidebar" : "Expand to Center Modal"}
                style={{
                  background: 'rgba(255,255,255,0.12)', border: 'none',
                  width: 30, height: 30, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                {isExpanded ? <LuMinimize2 size={14} /> : <LuMaximize2 size={14} />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                title="Close"
                style={{
                  background: 'rgba(255,255,255,0.12)', border: 'none',
                  width: 30, height: 30, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                <LuX size={15} />
              </button>
            </div>
          </div>

          {/* Messages and Bottom Bar Wrapper */}
          <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
            
            {/* Left pane: Standard Chat Interface */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: isExpanded ? 1.3 : 1,
              height: '100%',
              borderRight: isExpanded ? '1px solid var(--color-border)' : 'none',
              transition: 'flex 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden'
            }}>
              
              {/* Chat Messages Body */}
              <div
                ref={chatBodyRef}
                className="chat-no-scrollbar"
                style={{
                  flex: 1, padding: '1.25rem 1.25rem 0.5rem', overflowY: 'auto',
                  display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  background: 'radial-gradient(circle at 50% 10%, rgba(26,95,122,0.03) 0%, transparent 60%)'
                }}
              >
                {messages.map((msg) => {
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <ChatBubble sender={msg.sender}>
                        {msg.sender === 'ai' ? (
                          parseAiTextToRichUi(msg.text)
                        ) : (
                          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                        )}
                      </ChatBubble>
                    </div>
                  );
                })}

                {/* INITIAL MODE SELECTION BADGES */}
                {talentMode === null && (
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '0.75rem',
                    marginTop: '0.75rem', marginBottom: '1.5rem',
                    animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.2rem', letterSpacing: '0.05em' }}>Choose AI Talent</div>
                    
                    {/* Mode Option 1: Itinerary Builder */}
                    <div
                      onClick={() => selectTalent('itinerary')}
                      style={{
                        display: 'flex', gap: '0.85rem', padding: '1rem', borderRadius: '16px',
                        border: '1px solid rgba(26, 95, 122, 0.12)', background: '#fff',
                        cursor: 'pointer', boxShadow: 'var(--shadow-xs)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: 'translateY(0)'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,95,122,0.08)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(26, 95, 122, 0.12)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                      }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <LuCompass size={20} color="var(--color-primary)" />
                      </div>
                      <div>
                        <h5 style={{ margin: '0 0 0.2rem 0', fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-ink)' }}>Create Custom Itinerary</h5>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-stone)', lineHeight: 1.35 }}>Generate a structured day-by-day sightseeing and activities plan step-by-step.</p>
                      </div>
                    </div>

                    {/* Mode Option 2: Guide Chat */}
                    <div
                      onClick={() => selectTalent('chat')}
                      style={{
                        display: 'flex', gap: '0.85rem', padding: '1rem', borderRadius: '16px',
                        border: '1px solid rgba(26, 95, 122, 0.12)', background: '#fff',
                        cursor: 'pointer', boxShadow: 'var(--shadow-xs)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: 'translateY(0)'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,95,122,0.08)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(26, 95, 122, 0.12)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                      }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(211,97,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <LuMessageSquare size={20} color="var(--color-accent)" />
                      </div>
                      <div>
                        <h5 style={{ margin: '0 0 0.2rem 0', fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-ink)' }}>Ask Travel Questions</h5>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-stone)', lineHeight: 1.35 }}>Ask open questions freely, view beautiful cover photos, and explore Philippine travel guides.</p>
                      </div>
                    </div>

                  </div>
                )}

                {/* Guide Chat Mode: Show popular shortcuts at start */}
                {talentMode === 'chat' && messages.length <= 4 && (
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    marginTop: '0.5rem', marginBottom: '1rem',
                    animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Travel Shortcuts</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleShortcutClick('top10')}
                        style={{
                          padding: '0.65rem 0.75rem', borderRadius: '12px', border: '1px solid var(--color-border)',
                          background: '#fff', color: 'var(--color-ink)', fontSize: '0.8rem', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', textAlign: 'left',
                          transition: 'all 0.2s', boxShadow: 'var(--shadow-xs)'
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-pale)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = '#fff'; }}
                      >
                        <LuBookOpen size={14} color="var(--color-primary)" /> Top 10 Places
                      </button>
                      <button
                        onClick={() => handleShortcutClick('beaches')}
                        style={{
                          padding: '0.65rem 0.75rem', borderRadius: '12px', border: '1px solid var(--color-border)',
                          background: '#fff', color: 'var(--color-ink)', fontSize: '0.8rem', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', textAlign: 'left',
                          transition: 'all 0.2s', boxShadow: 'var(--shadow-xs)'
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-pale)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = '#fff'; }}
                      >
                        <LuSparkles size={14} color="var(--color-primary)" /> Best Beaches
                      </button>
                      <button
                        onClick={() => handleShortcutClick('adventure')}
                        style={{
                          padding: '0.65rem 0.75rem', borderRadius: '12px', border: '1px solid var(--color-border)',
                          background: '#fff', color: 'var(--color-ink)', fontSize: '0.8rem', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', textAlign: 'left',
                          transition: 'all 0.2s', boxShadow: 'var(--shadow-xs)'
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-pale)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = '#fff'; }}
                      >
                        <LuCompass size={14} color="var(--color-primary)" /> Adventure Spots
                      </button>
                      <button
                        onClick={() => handleShortcutClick('heritage')}
                        style={{
                          padding: '0.65rem 0.75rem', borderRadius: '12px', border: '1px solid var(--color-border)',
                          background: '#fff', color: 'var(--color-ink)', fontSize: '0.8rem', fontWeight: 700,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', textAlign: 'left',
                          transition: 'all 0.2s', boxShadow: 'var(--shadow-xs)'
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-pale)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = '#fff'; }}
                      >
                        <LuMapPin size={14} color="var(--color-primary)" /> Heritage Tours
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Day-by-day Itinerary stops (renders inside the flow for Step-by-Step mode) */}
                {talentMode === 'itinerary' && interviewStep === 6 && generatedItinerary && (
                  <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(226, 228, 232, 0.6)',
                    borderRadius: '16px', padding: '1.15rem', marginBottom: '1rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex', flexDirection: 'column', gap: '0.85rem',
                    animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    
                    <div className="chat-no-scrollbar" style={{ maxHeight: isExpanded ? '440px' : '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.25rem' }}>
                      {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                        const stops = generatedItinerary.filter(stop => stop.day === day);
                        if (stops.length === 0) return null;
                        return (
                          <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ background: 'var(--color-primary-pale)', color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.775rem', padding: '0.25rem 0.65rem', borderRadius: '20px', textTransform: 'uppercase', border: '1px solid rgba(26,95,122,0.12)' }}>
                                Day {day} Stops
                              </div>
                              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--color-border), transparent)' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(26,95,122,0.1)', marginLeft: '0.6rem' }}>
                              {stops.map((stop, sidx) => (
                                <div key={sidx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', position: 'relative', animation: 'fadeInUp 0.3s ease-out' }}>
                                  
                                  {/* Timeline Bullet Pin */}
                                  <div style={{
                                    width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)',
                                    position: 'absolute', left: '-13px', top: '5px', border: '2px solid #fff',
                                    boxShadow: '0 0 0 2px var(--color-primary-pale)'
                                  }} />

                                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-xs)', border: '1px solid var(--color-border)' }}>
                                    <img src={stop.place.img} alt={stop.place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>

                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span>{stop.place.name}</span>
                                      <small style={{ color: 'var(--color-primary)', fontSize: '0.675rem', fontWeight: 800, background: 'var(--color-primary-pale)', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
                                        {stop.time}
                                      </small>
                                    </div>
                                    <small style={{ color: 'var(--color-stone)', display: 'block', fontSize: '0.675rem', fontWeight: 600, marginBottom: '0.2, margin-bottom: 0.2rem' }}>
                                      {stop.place.province} &bull; {stop.place.category}
                                    </small>
                                    <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-ink)', lineHeight: 1.4 }}>
                                      {stop.description}
                                    </p>
                                  </div>

                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
                      <button 
                        style={{ ...btnSecondaryStyle, flex: 1, padding: '0.55rem 0.65rem', fontSize: '0.775rem', borderRadius: '10px', fontWeight: 800 }} 
                        onClick={handleReset}
                      >
                        Reset
                      </button>
                      <button 
                        style={{ ...btnPrimaryStyle, flex: 1.4, padding: '0.55rem 0.65rem', fontSize: '0.775rem', borderRadius: '10px', fontWeight: 800, background: '#10375C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }} 
                        onClick={handleSaveItinerary}
                        onMouseOver={e => applyHover(e, { background: '#0a233b' })}
                        onMouseOut={e => removeHover(e, { ...btnPrimaryStyle, background: '#10375C' })}
                      >
                        <LuSave size={13}/> Save Itinerary
                      </button>
                      <button 
                        style={{ ...btnPrimaryStyle, flex: 1.6, padding: '0.55rem 0.65rem', fontSize: '0.775rem', borderRadius: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }} 
                        onClick={() => window.print()}
                      >
                        <LuDownload size={13}/> Export PDF
                      </button>
                    </div>

                  </div>
                )}

                {/* Error notifications */}
                {error && (
                  <div style={{
                    background: 'rgba(211,97,53,0.1)', color: 'var(--color-accent)', padding: '0.6rem 1rem', borderRadius: '12px',
                    fontSize: '0.825rem', fontWeight: 700, textAlign: 'center', margin: '0.5rem 0'
                  }}>
                    Warning: {error}
                  </div>
                )}
              </div>

              {/* BOTTOM INTERACTION BAR */}
              
              {/* Menu Selection Bottom text spacer */}
              {talentMode === null && (
                <div style={{
                  background: '#fff', borderTop: '1px solid var(--color-border)',
                  padding: '1.25rem', textAlign: 'center', color: 'var(--color-stone)',
                  fontSize: '0.825rem', fontWeight: 600, boxShadow: '0 -4px 16px rgba(11,22,33,0.04)'
                }}>
                  Choose a travel talent pathway above to begin
                </div>
              )}

              {/* Guide Chat Mode Bottom Input Form */}
              {talentMode === 'chat' && (
                <form onSubmit={handleSend} style={{
                  background: '#fff', borderTop: '1px solid var(--color-border)',
                  padding: '0.85rem 1.25rem', display: 'flex', gap: '0.75rem',
                  alignItems: 'center', boxShadow: '0 -4px 16px rgba(11,22,33,0.04)'
                }}>
                  <input
                    type="text"
                    placeholder="Ask anything about travel in the Philippines..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    style={{
                      flex: 1, padding: '0.75rem 1.15rem', borderRadius: '30px',
                      border: '1px solid var(--color-border)', background: '#F8F9FA',
                      color: 'var(--color-ink)', fontSize: '0.925rem', outline: 'none',
                      fontFamily: 'var(--font-body)', transition: 'all 0.2s'
                    }}
                    onFocus={e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = '#fff'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.background = '#F8F9FA'; }}
                  />
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      background: 'transparent', border: '1px solid var(--color-border)',
                      color: 'var(--color-stone)', padding: '0.45rem 0.85rem', borderRadius: '20px',
                      cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                    }}
                  >
                    Menu
                  </button>
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    style={{
                      background: inputValue.trim() ? 'var(--color-primary)' : 'var(--color-border)',
                      color: '#fff', border: 'none', width: '40px', height: '40px',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: inputValue.trim() ? 'pointer' : 'default',
                      transition: 'all 0.2s', flexShrink: 0
                    }}
                  >
                    <LuSend size={18} />
                  </button>
                </form>
              )}

              {/* Itinerary Interview Mode Bottom Form wizard panel */}
              {talentMode === 'itinerary' && (
                <div style={{
                  background: '#fff', borderTop: '1px solid var(--color-border)',
                  padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  boxShadow: '0 -4px 16px rgba(11,22,33,0.04)',
                  animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  
                  {/* STEP 1: Style Selection */}
                  {interviewStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: '110px', overflowY: 'auto' }} className="chat-no-scrollbar">
                        {INTEREST_GROUPS.flatMap(g => g.items).map(item => {
                          const isSelected = interests.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() => handleInterestToggle(item)}
                              style={{
                                padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid var(--color-border)',
                                background: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: isSelected ? '#fff' : 'var(--color-stone)',
                                fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s'
                              }}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>

                      <textarea
                        style={{ ...inputStyle, minHeight: '50px', fontSize: '0.825rem', resize: 'none', padding: '0.5rem 0.75rem' }}
                        placeholder="Enter special wishes (e.g. relaxing pace, family active)..."
                        value={important}
                        onChange={e => setImportant(e.target.value)}
                      />

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ ...btnSecondaryStyle, flex: 1, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px' }} onClick={handleReset}>Menu</button>
                        <button
                          onClick={handleStyleConfirm}
                          style={{ ...btnPrimaryStyle, flex: 2, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px' }}
                          onMouseOver={e => applyHover(e, btnPrimaryHover)}
                          onMouseOut={e => removeHover(e, btnPrimaryStyle)}
                        >
                          Confirm Style ({interests.length}) <LuChevronRight />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Destinations selection */}
                  {interviewStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {/* Region filters */}
                      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }} className="chat-no-scrollbar">
                        {REGIONS.map(r => (
                          <button
                            key={r}
                            onClick={() => setActiveRegion(r)}
                            style={{
                              padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid var(--color-border)',
                              background: activeRegion === r ? 'var(--color-primary)' : 'var(--color-surface)',
                              color: activeRegion === r ? '#fff' : 'var(--color-stone)',
                              fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                              transition: 'all 0.15s', whiteSpace: 'nowrap'
                            }}
                          >
                            {r === 'All' ? 'All Destinations' : r}
                          </button>
                        ))}
                      </div>

                      {/* Destinations cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', maxHeight: '140px', overflowY: 'auto' }} className="chat-no-scrollbar">
                        {(activeRegion === 'All' ? places : places.filter(p => p.region === activeRegion)).map(p => {
                          const isSelected = selectedPlaces.includes(p.id);
                          return (
                            <div
                              key={p.id}
                              onClick={() => togglePlace(p.id)}
                              style={{
                                borderRadius: '10px', border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                overflow: 'hidden', background: '#fff', cursor: 'pointer', position: 'relative', height: '64px',
                                boxShadow: 'var(--shadow-xs)', transition: 'all 0.15s'
                              }}
                            >
                              <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{
                                position: 'absolute', inset: 0, padding: '0.4rem',
                                background: 'linear-gradient(to top, rgba(11,22,33,0.85) 0%, rgba(11,22,33,0.1) 80%)',
                                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                              }}>
                                <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>{p.name}</span>
                              </div>
                              {isSelected && (
                                <div style={{
                                  position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%',
                                  background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                  <LuCheck size={10} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ ...btnSecondaryStyle, flex: 1, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px' }} onClick={() => setInterviewStep(1)}><LuArrowLeft /> Back</button>
                        <button
                          onClick={handlePlacesConfirm}
                          style={{ ...btnPrimaryStyle, flex: 2, padding: '0.6rem 1rem', fontSize: '0.85rem', borderRadius: '12px' }}
                          onMouseOver={e => applyHover(e, btnPrimaryHover)}
                          onMouseOut={e => removeHover(e, btnPrimaryStyle)}
                        >
                          Confirm Selected ({selectedPlaces.length}) <LuChevronRight />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Logistics details */}
                  {interviewStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8F9FA', padding: '0.5rem 0.75rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-stone)' }}>TRAVELERS COUNT</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <button style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'var(--color-sand)', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setTravelers(Math.max(1, travelers - 1))}>−</button>
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', minWidth: '48px', textAlign: 'center' }}>{travelers} Pax</span>
                          <button style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'var(--color-sand)', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setTravelers(travelers + 1)}>+</button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: 800, fontSize: '0.7rem', color: 'var(--color-stone)', marginBottom: '0.25rem' }}>TRIP LENGTH (DAYS)</label>
                          <input type="number" min="1" max="30" style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={days} onChange={e => setDays(Number(e.target.value))} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: 800, fontSize: '0.7rem', color: 'var(--color-stone)', marginBottom: '0.25rem' }}>ARRIVAL DATE</label>
                          <input type="date" style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <button style={{ ...btnSecondaryStyle, flex: 1, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px' }} onClick={() => setInterviewStep(2)}><LuArrowLeft /> Back</button>
                        <button
                          onClick={handleLogisticsConfirm}
                          style={{ ...btnPrimaryStyle, flex: 2, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px' }}
                          onMouseOver={e => applyHover(e, btnPrimaryHover)}
                          onMouseOut={e => removeHover(e, btnPrimaryStyle)}
                        >
                          Confirm Details <LuChevronRight />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Recap & Confirm */}
                  {interviewStep === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.5rem', background: '#F8F9FA', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>Selected Places: <strong>{selectedPlaces.length}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>Travel Style: <strong>{interests.length} picks</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>Group Size: <strong>{travelers} Pax</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-stone)' }}>Trip Length: <strong>{days} Days</strong></div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ ...btnSecondaryStyle, flex: 1, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px' }} onClick={() => setInterviewStep(3)}><LuArrowLeft /> Back</button>
                        <button
                          onClick={generateAI}
                          style={{ ...btnPrimaryStyle, flex: 2.2, padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px' }}
                          onMouseOver={e => applyHover(e, btnPrimaryHover)}
                          onMouseOut={e => removeHover(e, btnPrimaryStyle)}
                        >
                          Build Itinerary <LuSend />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Loading state */}
                  {interviewStep === 5 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', color: 'var(--color-stone)', fontSize: '0.85rem', fontWeight: 700 }}>
                      <LuSparkles style={{ animation: 'spinSlow 2s linear infinite' }} /> Curating attractions-only sightseeing list...
                    </div>
                  )}

                  {/* STEP 6: Finished state */}
                  {interviewStep === 6 && (
                    <button
                      onClick={handleReset}
                      style={{ ...btnSecondaryStyle, width: '100%', padding: '0.6rem 1rem', fontSize: '0.85rem', borderRadius: '12px' }}
                      onMouseOver={e => applyHover(e, btnSecondaryHover)}
                      onMouseOut={e => removeHover(e, btnSecondaryStyle)}
                    >
                      Reset / Plan Another Itinerary
                    </button>
                  )}

                </div>
              )}

            </div>

            {/* Right pane: Discovery Hub Sidebar (only shown when expanded) */}
            {isExpanded && (
              <div style={{
                flex: 0.8,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'rgba(250, 248, 245, 0.96)',
                padding: '1.25rem',
                overflowY: 'auto',
                borderLeft: '1px solid rgba(26, 95, 122, 0.08)',
                animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }} className="chat-no-scrollbar">
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px dashed var(--color-border)', paddingBottom: '0.75rem' }}>
                  <LuSparkles color="var(--color-primary)" size={18} />
                  <h5 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>Discovery Hub</h5>
                </div>

                {/* Itinerary progress section */}
                {talentMode === 'itinerary' && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Selected Places ({selectedPlaces.length})
                    </div>
                    {selectedPlaces.length === 0 ? (
                      <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#F8F9FA', color: 'var(--color-stone)', fontSize: '0.75rem', fontStyle: 'italic', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                        No destinations selected yet. Select in Step 1!
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {selectedPlaces.map(id => {
                          const place = places.find(p => p.id === id);
                          if (!place) return null;
                          return (
                            <div key={id} style={{ borderRadius: '8px', overflow: 'hidden', height: '52px', position: 'relative', boxShadow: 'var(--shadow-xs)' }}>
                              <img src={place.img} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 80%)', display: 'flex', alignItems: 'flex-end', padding: '0.35rem' }}>
                                <span style={{ color: '#fff', fontSize: '0.675rem', fontWeight: 700 }}>{place.name}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Mentioned Places Directory */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    Places In This Chat
                  </div>
                  {getMentionedPlaces().length === 0 ? (
                    <div style={{ padding: '0.85rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center', color: 'var(--color-stone)', fontSize: '0.775rem' }}>
                      Places mentioned in your conversation (like Boracay, Vigan, Cebu) will appear here as gorgeous guide cards!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {getMentionedPlaces().map(place => (
                        <div
                          key={place.id}
                          style={{
                            background: '#fff', border: '1px solid rgba(26, 95, 122, 0.08)',
                            borderRadius: '12px', padding: '0.65rem', display: 'flex', gap: '0.65rem',
                            boxShadow: 'var(--shadow-xs)', animation: 'fadeInUp 0.3s ease-out'
                          }}
                        >
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={place.img} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.775rem', color: 'var(--color-ink)' }}>{place.name}</div>
                            <small style={{ color: 'var(--color-primary)', display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '0.15rem' }}>{place.province} &bull; {place.region}</small>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-stone)', lineHeight: 1.3 }}>{place.desc || 'Explore amazing sights and attractions in this region.'}</p>
                            <a
                              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(place.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: 'inline-block', marginTop: '0.35rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none' }}
                            >
                              Wikipedia Guide &rarr;
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts Prompting */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--color-stone)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    Quick Inquiry Prompts
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {[
                      { label: 'Top Beaches', query: 'Show me the best beaches in the Philippines' },
                      { label: 'Heritage Sites', query: 'What are the main Spanish colonial historical landmarks?' },
                      { label: 'Adventure Spots', query: 'List extreme adventure and hiking spots' },
                      { label: 'Palawan Guide', query: 'Give me a travel overview for El Nido and Coron Palawan' },
                    ].map(q => (
                      <button
                        key={q.label}
                        onClick={() => {
                          setTalentMode('chat');
                          setInputValue(q.query);
                        }}
                        style={{
                          padding: '0.35rem 0.65rem', borderRadius: '15px', border: '1px solid var(--color-border)',
                          background: '#fff', color: 'var(--color-stone)', fontSize: '0.7rem', fontWeight: 700,
                          cursor: 'pointer', transition: 'all 0.15s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-stone)'; }}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* HIDDEN PRINT-ONLY FORMAL DOCUMENT (Optimized for standard A4/Letter papers) */}
      <style>{`
        @media print {
          @page { margin: 20mm; }
          .print-only-itinerary-document { display: block !important; }
        }
        .print-document-body { padding: 50px 45px; }
      `}</style>
      {generatedItinerary && (
        <div className="print-only-itinerary-document" style={{ display: 'none' }}>
          {/* Main Document Accent Top bar */}
          <div style={{ height: '8px', background: '#10375C', width: '100%' }} />
          
          <div className="print-document-body" style={{ fontFamily: "'Inter', sans-serif", color: '#1E293B', backgroundColor: '#FFF', position: 'relative' }}>
            
            {/* Elegant Background Stamp or watermark-style header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', paddingBottom: '24px', marginBottom: '35px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#1A5F7A', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>Curated Sightseeing Program</span>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#10375C', letterSpacing: '-0.02em' }}>Official Travel Itinerary</h1>
                <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Curation Powered by WanderAI Assistant &bull; WanderLocal Philippines</p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <img src={logoImg} alt="WanderLocal Logo" style={{ height: '75px', width: 'auto', marginBottom: '4px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#1A5F7A', textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid #1A5F7A', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                  Premium Tourism
                </span>
              </div>
            </div>

            {/* Luxury Metadata Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '0', 
              background: '#FAF8F5', 
              borderRadius: '8px', 
              border: '1px solid #E2E8F0', 
              marginBottom: '40px',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '18px 24px', borderRight: '1px solid #E2E8F0' }}>
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Prepared For</span>
                <strong style={{ fontSize: '13px', color: '#10375C', fontWeight: 800 }}>{userName || 'WanderLocal Traveler'}</strong>
              </div>
              <div style={{ padding: '18px 24px', borderRight: '1px solid #E2E8F0' }}>
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Passengers / Size</span>
                <strong style={{ fontSize: '13px', color: '#1E293B', fontWeight: 800 }}>{travelers} Traveler(s)</strong>
              </div>
              <div style={{ padding: '18px 24px', borderRight: '1px solid #E2E8F0' }}>
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Trip Length</span>
                <strong style={{ fontSize: '13px', color: '#1E293B', fontWeight: 800 }}>{days} Day(s) Curated</strong>
              </div>
              <div style={{ padding: '18px 24px' }}>
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Travel Preferences</span>
                <strong style={{ fontSize: '13px', color: '#10375C', fontWeight: 800, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {interests.slice(0, 2).join(', ') || 'General Sightseeing'}
                </strong>
              </div>
            </div>

            {/* Daily Stops List with beautiful Vertical timelines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '45px' }}>
              {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                const stops = generatedItinerary.filter(stop => stop.day === day);
                if (stops.length === 0) return null;
                return (
                  <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Premium Day Divider */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      background: '#F8FAFC', 
                      borderLeft: '4px solid #10375C', 
                      padding: '12px 20px', 
                      borderRadius: '4px', 
                      border: '1px solid #E2E8F0', 
                      borderLeftWidth: '4px',
                      pageBreakInside: 'avoid'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#10375C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        DAY {day} &mdash; Attractions Sightseeing Schedule
                      </h3>
                      <div style={{ flex: 1, textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#1A5F7A' }}>
                        {stops.length} Selected Stop(s)
                      </div>
                    </div>

                    {/* Timeline Container (Left border connects items) */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '30px', 
                      paddingLeft: '24px', 
                      marginLeft: '12px', 
                      borderLeft: '2px solid #E2E8F0', 
                      position: 'relative',
                      marginTop: '8px',
                      marginBottom: '10px'
                    }}>
                      {stops.map((stop, sidx) => (
                        <div key={sidx} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', position: 'relative', pageBreakInside: 'avoid' }}>
                          
                          {/* Beautiful Custom Circular Timeline Bullet Anchor (Mathematically centered) */}
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#FFF',
                            border: '3px solid #10375C',
                            position: 'absolute',
                            left: '-30px',
                            top: '6px',
                            boxShadow: '0 0 0 3px #F1F5F9',
                            zIndex: 10
                          }} />

                          {/* Time tag in sleek professional border box */}
                          <div style={{ 
                            minWidth: '85px', 
                            fontWeight: 800, 
                            fontSize: '11px', 
                            color: '#10375C', 
                            textTransform: 'uppercase', 
                            padding: '4px 8px', 
                            borderRadius: '6px', 
                            border: '1px solid #E2E8F0', 
                            background: '#F8FAFC', 
                            textAlign: 'center',
                            marginTop: '2px',
                            letterSpacing: '0.02em'
                          }}>
                            {stop.time}
                          </div>

                          {/* Stop Details */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>{stop.place.name}</h4>
                              <span style={{ fontSize: '10px', color: '#94A3B8' }}>&bull;</span>
                              <span style={{ color: '#1A5F7A', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {stop.place.province}
                              </span>
                            </div>
                            
                            {/* Subtle Category Badge */}
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ 
                                display: 'inline-block', 
                                fontSize: '9px', 
                                fontWeight: 700, 
                                color: '#64748B', 
                                background: '#F1F5F9', 
                                padding: '2px 8px', 
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.03em'
                              }}>
                                {stop.place.category}
                              </span>
                            </div>
                            
                            <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
                              {stop.description}
                            </p>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Formal Terms Disclaimer */}
            <div style={{ marginTop: '50px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px 20px', pageBreakInside: 'avoid' }}>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Important Travel Information</span>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>
                This sightseeing itinerary program has been custom-curated based on simulated Philippine travel guides and attractions. Travelers are strongly advised to coordinate in advance with official local tour operators regarding direct transportation logistics, actual weather guidelines, local environmental compliance fees, and official destination operations.
              </p>
            </div>

            {/* Luxury Footer with Signature Line & Document Code */}
            <div style={{ 
              marginTop: '55px', 
              paddingTop: '25px', 
              borderTop: '2px solid #E2E8F0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              fontSize: '11px', 
              color: '#64748B',
              pageBreakInside: 'avoid'
            }}>
              <div>
                <strong style={{ color: '#10375C' }}>WanderLocal Curation Hub</strong>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>Document Ref: WL-AI-ITIN-{Date.now().toString().slice(-6).toUpperCase()}</div>
              </div>
              
              <div style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.08em', fontWeight: 800, color: '#94A3B8' }}>
                &copy; {new Date().getFullYear()} WanderLocal Inc. &bull; Sustainable Tourism Philippines
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
