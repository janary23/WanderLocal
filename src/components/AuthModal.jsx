import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/WanderLocalLogo.png';
import { LuMapPin, LuCalendar, LuImage, LuBriefcase, LuChartBar, LuMegaphone, LuEye, LuEyeOff, LuX, LuCheck, LuMail } from 'react-icons/lu';

/* ── tiny lock-body-scroll helper ── */
function useLockBody(active) {
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [active]);
}

/* ────────────────────────────────────────────────────────────
   ONBOARDING FEATURES  (shown after register step 3)
──────────────────────────────────────────────────────────── */
const TRAVELER_FEATURES = [
  { icon: <LuMapPin size={48} color="#4A90C2" />, title: 'Directory', desc: 'Search verified local businesses, hidden gems, and community nominations across the Philippines.' },
  { icon: <LuCalendar size={48} color="#4A90C2" />, title: 'Itinerary Builder', desc: 'Build day-by-day trip plans, add stops, set times, personal notes, and export as PDF.' },
  { icon: <LuImage size={48} color="#4A90C2" />, title: 'Community Gallery', desc: 'Browse public itineraries from fellow travelers and clone them as your own template.' },
];
const BUSINESS_FEATURES = [
  { icon: <LuBriefcase size={48} color="#C9964A" />, title: 'Manage Your Listing', desc: 'Edit your business profile, upload photos, and manage operating hours.' },
  { icon: <LuChartBar size={48} color="#C9964A" />, title: 'Analytics', desc: 'See how many travelers viewed and added your business to their itineraries.' },
  { icon: <LuMegaphone size={48} color="#C9964A" />, title: 'Announcements', desc: 'Post updates and promotions directly to travelers browsing your listing.' },
];

/* ────────────────────────────────────────────────────────────
   LOGIN PANEL
──────────────────────────────────────────────────────────── */
function LoginPanel({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    const res = await login(email, password);
    if (res.success) {
      onClose();
      if (res.role === 'admin') navigate('/admin');
      else if (res.role === 'business') navigate('/business-dashboard');
      else navigate('/dashboard');
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ animation: 'wlSlideUp 0.35s ease-out' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <img src={logoImg} alt="WanderLocal" style={{ display: 'block', margin: '0 auto 1.25rem', width: '150px', height: 'auto' }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1C1917', margin: 0 }}>Welcome back</h2>
        <p style={{ color: '#78716C', fontSize: '0.9rem', marginTop: '0.35rem' }}>Sign in to your WanderLocal account</p>
      </div>

      {error && (
        <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', color: '#BE123C', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={lbl}>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            style={inp} placeholder="you@example.com"
            onFocus={e => e.target.style.borderColor = '#4A90C2'}
            onBlur={e => e.target.style.borderColor = '#E7E5E4'} />
          <p style={{ fontSize: '0.75rem', color: '#A8A29E', margin: '0.3rem 0 0' }}>
            Tip: "admin@..." for admin, "business@..." for business owner
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <label style={lbl}>Password</label>
          <input type={showPw ? 'text' : 'password'} required value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...inp, paddingRight: '3rem' }} placeholder="........"
            onFocus={e => e.target.style.borderColor = '#4A90C2'}
            onBlur={e => e.target.style.borderColor = '#E7E5E4'} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            style={{ position: 'absolute', right: 14, bottom: 12, background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            {showPw ? <LuEyeOff size={18} /> : <LuEye size={18} />}
          </button>
        </div>

        <button type="submit" style={primaryBtn}>Sign In &rarr;</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#78716C' }}>Don't have an account? </span>
        <button onClick={onSwitchToRegister}
          style={{ background: 'none', border: 'none', color: '#4A90C2', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>
          Create one free
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   REGISTER – Step 1: Form
──────────────────────────────────────────────────────────── */
function RegStep1({ onNext }) {
  const [role, setRole] = useState('traveler');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = (e) => {
    e.preventDefault();
    onNext({ ...form, role });
  };

  return (
    <div style={{ animation: 'wlSlideUp 0.35s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img src={logoImg} alt="WanderLocal" style={{ display: 'block', margin: '0 auto 1.25rem', width: '150px', height: 'auto' }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1C1917', margin: 0 }}>Create your account</h2>
        <p style={{ color: '#78716C', fontSize: '0.875rem', marginTop: '0.35rem' }}>Join thousands discovering local gems</p>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Full Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={inp} placeholder="Juan dela Cruz"
              onFocus={e => e.target.style.borderColor = '#4A90C2'}
              onBlur={e => e.target.style.borderColor = '#E7E5E4'} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={inp} placeholder="juan@example.com"
              onFocus={e => e.target.style.borderColor = '#4A90C2'}
              onBlur={e => e.target.style.borderColor = '#E7E5E4'} />
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <label style={lbl}>Password</label>
          <input type={showPw ? 'text' : 'password'} required value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ ...inp, paddingRight: '3rem' }} placeholder="••••••••"
            onFocus={e => e.target.style.borderColor = '#4A90C2'}
            onBlur={e => e.target.style.borderColor = '#E7E5E4'} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            style={{ position: 'absolute', right: 14, bottom: 12, background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            {showPw ? <LuEyeOff size={18} /> : <LuEye size={18} />}
          </button>
        </div>

        {/* Role chooser */}
        <div>
          <label style={lbl}>I am a...</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {[
              { key: 'traveler', label: 'Traveler', sub: 'Planning a trip', icon: <LuMapPin size={20} />, ac: '#4A90C2', border: '#4A90C2', bg: 'rgba(74,144,194,0.08)' },
              { key: 'business', label: 'Business Owner', sub: 'Listing a place', icon: <LuBriefcase size={20} />, ac: '#C9964A', border: '#C9964A', bg: 'rgba(201,150,74,0.08)' },
            ].map(o => (
              <label key={o.key}
                onClick={() => setRole(o.key)}
                style={{
                  border: `2px solid ${role === o.key ? o.border : '#E7E5E4'}`,
                  padding: '0.85rem',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: role === o.key ? o.bg : '#fff',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  color: role === o.key ? o.ac : '#44403C',
                }}>
                <span style={{ fontSize: '1.25rem', display: 'flex' }}>{o.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{o.label}</span>
                <span style={{ fontSize: '0.72rem', color: '#A8A29E' }}>{o.sub}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" style={primaryBtn}>Continue &rarr;</button>
      </form>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   REGISTER – Step 2: Email verify
──────────────────────────────────────────────────────────── */
function RegStep2({ email, onNext, onBack }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleKey = (i, val) => {
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) document.getElementById(`wl-code-${i + 1}`)?.focus();
  };

  return (
    <div style={{ animation: 'wlSlideUp 0.35s ease-out', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: '#4A90C2', display: 'flex', justifyContent: 'center' }}>
        <LuMail size={40} />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C1917', marginBottom: '0.35rem' }}>Verify your email</h2>
      <p style={{ color: '#78716C', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
        We sent a 6-digit code to <strong style={{ color: '#1C1917' }}>{email}</strong>.<br />
        Enter it below to activate your account.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.75rem' }}>
        {code.map((c, i) => (
          <input key={i} id={`wl-code-${i}`} type="text" maxLength={1} value={c}
            onChange={e => handleKey(i, e.target.value)}
            style={{
              width: 44, height: 52, textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
              border: `2px solid ${c ? '#4A90C2' : '#E7E5E4'}`,
              borderRadius: 10, outline: 'none',
              background: c ? 'rgba(74,144,194,0.08)' : '#fff',
              color: '#1C1917', transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#4A90C2'}
            onBlur={e => e.target.style.borderColor = c ? '#4A90C2' : '#E7E5E4'}
          />
        ))}
      </div>

      <button onClick={onNext} style={{ ...primaryBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <LuCheck size={20} /> Verify &amp; Continue
      </button>
      <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#A8A29E' }}>
        (Demo: click Verify without entering a code)
      </p>
      <button onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.25rem' }}>
        ← Back
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   REGISTER – Step 3: Onboarding tour
──────────────────────────────────────────────────────────── */
function RegStep3({ role, onDone }) {
  const [step, setStep] = useState(0);
  const features = role === 'business' ? BUSINESS_FEATURES : TRAVELER_FEATURES;
  const isLast = step === features.length - 1;

  return (
    <div style={{ animation: 'wlSlideUp 0.35s ease-out', textAlign: 'center' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        Quick Tour &middot; {step + 1} of {features.length}
      </p>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1917', marginBottom: '1.25rem' }}>Here's what you can do</h2>

      <div style={{
        background: 'linear-gradient(135deg,#F3F8EF,#EBF5E3)',
        border: '2px solid #C6E0B0', borderRadius: 18,
        padding: '2rem', marginBottom: '1.5rem',
        animation: 'wlSlideUp 0.3s ease-out'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {features[step].icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4A90C2', marginBottom: '0.6rem' }}>{features[step].title}</h3>
        <p style={{ color: '#57534E', lineHeight: 1.7, fontSize: '0.875rem', margin: 0 }}>{features[step].desc}</p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: '1.5rem' }}>
        {features.map((_, i) => (
          <div key={i} style={{ width: i === step ? 22 : 7, height: 7, borderRadius: 4, background: i === step ? '#4A90C2' : '#D6D3D1', transition: 'all 0.3s ease' }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.6rem' }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)}
            style={{ flex: 1, padding: '0.85rem', borderRadius: 12, border: '2px solid #E7E5E4', background: '#fff', fontWeight: 700, cursor: 'pointer', color: '#44403C' }}>
            Back
          </button>
        )}
        <button onClick={() => isLast ? onDone() : setStep(step + 1)}
          style={{
            flex: 2, padding: '0.85rem', borderRadius: 12, border: 'none',
            background: isLast ? 'linear-gradient(135deg,#4A90C2,#3A75A0)' : '#1C1917',
            color: '#fff', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
          }}>
          {isLast ? '🎉 Go to Dashboard' : 'Next →'}
        </button>
      </div>
      <button onClick={onDone}
        style={{ background: 'none', border: 'none', color: '#A8A29E', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.75rem', textDecoration: 'underline' }}>
        Skip tour
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   MAIN MODAL  (exported)
──────────────────────────────────────────────────────────── */
export default function AuthModal({ defaultTab = 'login', onClose }) {
  const [tab, setTab] = useState(defaultTab); // 'login' | 'register'
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState({});

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useLockBody(true);

  /* Keyboard close */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleRegStep1 = (data) => { setRegData(data); setRegStep(2); };
  const handleRegStep2 = () => { setRegStep(3); };
  const handleOnboardDone = async () => {
    const res = await register(regData.name, regData.email, regData.password, regData.role);
    if (res.success) {
      onClose();
      if (res.role === 'business') navigate('/business-dashboard');
      else if (res.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } else {
      alert('Registration failed: ' + res.message);
    }
  };

  return (
    <>
      <style>{`
        @keyframes wlSlideUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wlFadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes wlModalIn { from { opacity:0; transform:scale(0.95) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(15,20,10,0.55)',
          backdropFilter: 'blur(6px)',
          animation: 'wlFadeIn 0.25s ease-out'
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9001,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', pointerEvents: 'none'
      }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: 24,
            width: '100%', maxWidth: 480,
            maxHeight: '94vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
            pointerEvents: 'auto',
            animation: 'wlModalIn 0.4s cubic-bezier(0.16,1,0.3,1)'
          }}>

          {/* Close btn */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1rem 0' }}>
            <button onClick={onClose}
              style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#44403C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LuX size={16} />
            </button>
          </div>

          {/* Tab switcher (only show on non-onboarding steps) */}
          {!(tab === 'register' && regStep === 3) && (
            <div style={{ display: 'flex', margin: '0 1.5rem', background: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: '1.25rem' }}>
              {['login', 'register'].map(t => (
                <button key={t}
                  onClick={() => { setTab(t); setRegStep(1); }}
                  style={{
                    flex: 1, padding: '0.65rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
                    background: tab === t ? '#fff' : 'transparent',
                    color: tab === t ? '#1C1917' : '#78716C',
                    boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s ease'
                  }}>
                  {t === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          )}

          {/* Progress bar for register */}
          {tab === 'register' && (
            <div style={{ display: 'flex', gap: 5, margin: '0 1.5rem', marginBottom: '1.25rem' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= regStep ? '#4A90C2' : '#E7E5E4', transition: 'background 0.4s' }} />
              ))}
            </div>
          )}

          {/* Content */}
          <div style={{ padding: '0 1.5rem 2rem', overflowY: 'auto' }}>
            {tab === 'login' && (
              <LoginPanel onClose={onClose} onSwitchToRegister={() => { setTab('register'); setRegStep(1); }} />
            )}
            {tab === 'register' && regStep === 1 && (
              <RegStep1 onNext={handleRegStep1} />
            )}
            {tab === 'register' && regStep === 2 && (
              <RegStep2 email={regData.email} onNext={handleRegStep2} onBack={() => setRegStep(1)} />
            )}
            {tab === 'register' && regStep === 3 && (
              <RegStep3 role={regData.role} onDone={handleOnboardDone} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Shared styles ── */
const lbl = {
  display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#44403C',
  marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em'
};
const inp = {
  width: '100%', padding: '0.8rem 1rem', borderRadius: 10,
  border: '2px solid #E7E5E4', fontSize: '0.95rem', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'inherit'
};
const primaryBtn = {
  width: '100%', padding: '1rem', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg,#4A90C2,#3A75A0)', color: '#fff',
  fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(74,144,194,0.35)', transition: 'all 0.2s ease'
};