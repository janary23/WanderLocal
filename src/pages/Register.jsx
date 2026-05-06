import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LuUser, LuMail, LuLock, LuEye, LuEyeOff, LuCircle, LuCompass, LuStore, LuArrowRight, LuDot, LuMap, LuCamera, LuMegaphone
} from 'react-icons/lu';

/* ── Step 1: Registration Form ─────────────────────── */
function StepRegister({ onNext }) {
  const [role, setRole] = useState('traveler');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register(form.name, form.email, form.password, role);
      if (result.success) {
        onNext({ ...form, role });
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2D5016, #4A8025)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem', fontSize: '1.75rem'
        }}></div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.4rem' }}>
          Create Your Account
        </h2>
        <p style={{ color: 'var(--stone)', fontSize: '0.9rem' }}>
          Join thousands of travelers discovering local gems
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--stone-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <LuUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-light)' }} />
            <input
              type="text" required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.8rem', borderRadius: 10, border: '2px solid #E7E5E4', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--secondary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="Juan dela Cruz"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--stone-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <LuMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-light)' }} />
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '0.85rem 0.85rem 0.85rem 2.8rem', borderRadius: 10, border: '2px solid #E7E5E4', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--secondary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="juan@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--stone-light)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <LuLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone-light)' }} />
            <input
              type={showPw ? 'text' : 'password'} required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '0.85rem 3rem 0.85rem 2.8rem', borderRadius: 10, border: '2px solid #E7E5E4', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--secondary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--stone-light)', cursor: 'pointer', padding: 0 }}>
              {showPw ? <LuEyeOff /> : <LuEye />}
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--stone-light)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            I am a...
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { key: 'traveler', label: 'Traveler', sub: 'Planning a trip', icon: <LuCompass />, color: 'var(--secondary)', bg: 'rgba(45,80,22,0.08)', border: 'var(--secondary)' },
              { key: 'business', label: 'Business Owner', sub: 'Listing a place', icon: <LuStore />, color: 'var(--accent)', bg: 'rgba(201,150,74,0.08)', border: 'var(--accent)' },
            ].map(opt => (
              <label key={opt.key}
                style={{
                  border: `2px solid ${role === opt.key ? opt.border : 'var(--border)'}`,
                  padding: '1rem',
                  borderRadius: 12,
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: role === opt.key ? opt.bg : '#fff',
                  transition: 'all 0.2s ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                }}
                onClick={() => setRole(opt.key)}>
                <span style={{ fontSize: '1.25rem', color: role === opt.key ? opt.color : 'var(--stone-light)' }}>{opt.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: role === opt.key ? opt.color : 'var(--stone-light)' }}>{opt.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--stone-light)' }}>{opt.sub}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.75rem 1rem', borderRadius: 10,
            background: 'rgba(220,38,38,0.08)', border: '1.5px solid rgba(220,38,38,0.25)',
            color: '#DC2626', fontSize: '0.875rem', fontWeight: 500
          }}>
            <span style={{ flexShrink: 0, fontWeight: 700 }}>⚠</span>
            {error}
          </div>
        )}

        <button type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '1rem', marginTop: '0.5rem',
            background: loading ? '#6B9E4A' : 'linear-gradient(135deg, #2D5016, #3D6B1F)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(45,80,22,0.35)', transition: 'all 0.2s ease',
            opacity: loading ? 0.8 : 1
          }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.75s linear infinite' }} />
              Creating account…
            </>
          ) : <>Continue <LuArrowRight /></>}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--stone)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 700 }}>Log In</Link>
      </p>
    </div>
  );
}

/* ── Step 2: Email Verification ────────────────────── */
function StepVerify({ email, onNext }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (i, val) => {
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) document.getElementById(`code-${i + 1}`)?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem', fontSize: '1.75rem'
      }}></div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.5rem' }}>
        Verify Your Email
      </h2>
      <p style={{ color: 'var(--stone)', marginBottom: '2rem', fontSize: '0.9rem' }}>
        We sent a 6-digit code to <strong style={{ color: 'var(--ink)' }}>{email || 'your email'}</strong>.<br />
        Enter it below to activate your account.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '2rem' }}>
          {code.map((c, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              maxLength={1}
              value={c}
              onChange={e => handleChange(i, e.target.value)}
              style={{
                width: 48, height: 56, textAlign: 'center', fontSize: '1.5rem', fontWeight: 700,
                border: `2px solid ${c ? 'var(--secondary)' : 'var(--border)'}`, borderRadius: 10,
                outline: 'none', transition: 'border-color 0.2s', color: 'var(--ink)',
                background: c ? 'rgba(45,80,22,0.06)' : '#fff'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--secondary)'}
              onBlur={e => e.target.style.borderColor = c ? 'var(--secondary)' : 'var(--border)'}
            />
          ))}
        </div>

        {/* Simulate any code works */}
        <button type="submit"
          style={{
            width: '100%', padding: '1rem',
            background: 'linear-gradient(135deg, #2D5016, #3D6B1F)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(45,80,22,0.3)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
          <LuCircle /> Verify & Continue
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', color: 'var(--stone-light)', fontSize: '0.85rem' }}>
        Didn't receive it? <button style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Resend Code</button>
      </p>

      {/* Demo shortcut */}
      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--stone-light)' }}>
        (Demo: click Verify to continue without entering a code)
      </p>
    </div>
  );
}

/* ── Step 3: Onboarding Tooltip Walkthrough ─────────── */
function StepOnboarding({ role, onDone }) {
  const [step, setStep] = useState(0);

  const features = role === 'traveler' ? [
    { icon: <LuCompass />, title: 'Directory', desc: 'Search verified local businesses, hidden gems, and community nominations across the Philippines.' },
    { icon: <LuMap />, title: 'Itinerary Builder', desc: 'Build day-by-day trip plans, add stops, set times, notes, and export as a printable PDF.' },
    { icon: <LuCamera />, title: 'Community Gallery', desc: 'Browse public itineraries from fellow travelers and clone them as your own template.' },
  ] : [
    { icon: <LuStore />, title: 'Manage Your Listing', desc: 'Edit your business profile, upload photos, and manage your operating hours.' },
    { icon: <LuCircle />, title: 'Analytics', desc: 'See how many travelers viewed and added your business.' },
    { icon: <LuMegaphone />, title: 'Announcements', desc: 'Post updates and promotions directly to travelers browsing your listing.' },
  ];

  const isLast = step === features.length - 1;

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out', textAlign: 'center' }}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--stone-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        Quick Tour <LuDot style={{ margin: '0 0.25rem' }} /> {step + 1} of {features.length}
      </p>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '2rem' }}>
        Here's what you can do 
      </h2>

      {/* Feature card */}
      <div style={{
        background: 'linear-gradient(135deg, #F3F8EF, #EBF5E3)',
        border: '2px solid #C6E0B0',
        borderRadius: 20, padding: '2.5rem',
        marginBottom: '2rem',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{features[step].icon}</div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          {features[step].title}
        </h3>
        <p style={{ color: '#57534E', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {features[step].desc}
        </p>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: '2rem' }}>
        {features.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i === step ? 'var(--secondary)' : '#D6D3D1',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)}
            style={{ flex: 1, padding: '0.9rem', borderRadius: 12, border: '2px solid #E7E5E4', background: '#fff', fontWeight: 700, cursor: 'pointer', color: 'var(--stone-light)' }}>
            Back
          </button>
        )}
        <button onClick={() => isLast ? onDone() : setStep(step + 1)}
          style={{
            flex: 2, padding: '0.9rem', borderRadius: 12,
            background: isLast ? 'linear-gradient(135deg, #2D5016, #3D6B1F)' : 'var(--ink)',
            color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
          {isLast ? <><LuCircle /> Go to Dashboard</> : <>Next <LuArrowRight /></>}
        </button>
      </div>

      <button onClick={onDone}
        style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--stone-light)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
        Skip tour
      </button>
    </div>
  );
}

/* ── Main Register Component ──────────────────────── */
const Register = () => {
  const [step, setStep] = useState(1); // 1=form, 2=verify, 3=onboard
  const [regData, setRegData] = useState({});
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);

  const handleRegisterNext = (data) => {
    // Registration already completed in StepRegister; just advance steps
    setRegData(data);
    setStep(2);
  };

  const handleVerifyNext = () => {
    setStep(3);
  };

  const handleOnboardDone = () => {
    // User is already logged in (persisted by AuthContext.register)
    // Use the stored role from context; fall back to regData.role
    const role = userRole || regData.role;
    if (role === 'business') {
      navigate('/business-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      background: 'linear-gradient(135deg, #F3F8EF 0%, #EBF5E3 50%, #F9FAFB 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1rem'
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        background: '#fff',
        padding: '2.5rem',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        maxWidth: step === 3 ? 480 : 480,
        width: '100%'
      }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '2rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: s <= step ? 'var(--secondary)' : 'var(--border)',
              transition: 'background 0.4s ease'
            }} />
          ))}
        </div>

        {step === 1 && <StepRegister onNext={handleRegisterNext} />}
        {step === 2 && <StepVerify email={regData.email} onNext={handleVerifyNext} />}
        {step === 3 && <StepOnboarding role={regData.role} onDone={handleOnboardDone} />}
      </div>
    </div>
  );
};

export default Register;
