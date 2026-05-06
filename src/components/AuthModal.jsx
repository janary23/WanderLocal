import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import logoImg from '../assets/WanderLocalLogo.png';
import { LuMapPin, LuCalendar, LuImage, LuBriefcase, LuChartBar, LuMegaphone, LuX, LuChevronLeft } from 'react-icons/lu';

// ── Google Client ID ─────────────────────────────────────────────
const GOOGLE_CLIENT_ID = '897367749062-e5hem7v8ucn6rbmdlvqnnkrgn9rmcq55.apps.googleusercontent.com';

/* Shared Google button rendered via GSI */
function GoogleBtn({ onCredential }) {
  const containerId = 'wl-google-btn';

  useEffect(() => {
    const init = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => onCredential(resp.credential),
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(
        document.getElementById(containerId),
        { theme: 'outline', size: 'large', width: 432, text: 'continue_with', shape: 'rectangular', logo_alignment: 'left' }
      );
    };
    if (window.google) { init(); }
    else {
      const script = document.getElementById('gsi-script');
      if (script) { script.addEventListener('load', init); }
    }
  }, [onCredential]);

  return <div id={containerId} style={{ width: '100%', minHeight: 44 }} />;
}

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

export default function AuthModal({ onClose }) {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'name', 'tour'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [optOut, setOptOut] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const [tourIndex, setTourIndex] = useState(0);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useLockBody(true);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Handle auto-submit of OTP when 6 digits are typed
  useEffect(() => {
    if (step === 'otp' && code.length === 6 && !loading) {
      handleVerifyOtp(code);
    }
  }, [code, step]);

  const handleGoogle = useCallback(async (credential) => {
    const res = await authCtx.loginWithGoogle(credential);
    if (res.success) {
      onClose();
      if (res.role === 'admin') navigate('/admin');
      else if (res.isHost) navigate('/business');
      else navigate('/dashboard');
    } else {
      setError(res.message || 'Google sign-in failed.');
    }
  }, [authCtx, navigate, onClose]);

  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.requestOtp(email);
      if (res.status === 'success') {
        setStep('otp');
      } else {
        setError(res.message || 'Failed to send code.');
      }
    } catch (err) {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpCode) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.verifyOtp(email, otpCode);
      if (res.status === 'success') {
        if (res.action === 'login') {
          if (authCtx.loginWithUser) authCtx.loginWithUser(res.user);
          onClose();
          if (res.user.role === 'admin') navigate('/admin');
          else if (res.user.is_host) navigate('/business');
          else navigate('/dashboard');
        } else if (res.action === 'signup_needed') {
          setStep('name');
        }
      } else {
        setError(res.message || 'Invalid code.');
        setCode(''); // reset
      }
    } catch (err) {
      setError('Verification failed.');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fullName = `${firstName} ${lastName}`.trim();
    try {
      const res = await api.completeOtpSignup(email, fullName, password);
      if (res.status === 'success') {
        setUserData(res.user);
        if (authCtx.loginWithUser) authCtx.loginWithUser(res.user);
        setStep('tour');
      } else {
        setError(res.message || 'Signup failed.');
      }
    } catch (err) {
      setError('Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const finishTour = () => {
    onClose();
    if (userData?.role === 'admin') navigate('/admin');
    else if (userData?.is_host) navigate('/business');
    else navigate('/dashboard');
  };

  const renderTour = () => {
    const features = userData?.is_host ? BUSINESS_FEATURES : TRAVELER_FEATURES;
    const isLast = tourIndex === features.length - 1;

    return (
      <div style={{ textAlign: 'center', animation: 'wlSlideRightIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          Quick Tour &middot; {tourIndex + 1} of {features.length}
        </p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1917', marginBottom: '1.25rem' }}>Here's what you can do</h2>

        <div style={{
          background: 'linear-gradient(135deg,#F3F8EF,#EBF5E3)',
          border: '2px solid #C6E0B0', borderRadius: 18,
          padding: '2rem', marginBottom: '1.5rem',
          animation: 'wlSlideRightIn 0.3s cubic-bezier(0.16,1,0.3,1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {features[tourIndex].icon}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4A90C2', marginBottom: '0.6rem' }}>{features[tourIndex].title}</h3>
          <p style={{ color: '#57534E', lineHeight: 1.7, fontSize: '0.875rem', margin: 0 }}>{features[tourIndex].desc}</p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: '1.5rem' }}>
          {features.map((_, i) => (
            <div key={i} style={{ width: i === tourIndex ? 22 : 7, height: 7, borderRadius: 4, background: i === tourIndex ? '#4A90C2' : '#D6D3D1', transition: 'all 0.3s ease' }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {tourIndex > 0 && (
            <button onClick={() => setTourIndex(tourIndex - 1)}
              style={{ flex: 1, padding: '0.85rem', borderRadius: 12, border: '2px solid #E7E5E4', background: '#fff', fontWeight: 700, cursor: 'pointer', color: '#44403C' }}>
              Back
            </button>
          )}
          <button onClick={() => isLast ? finishTour() : setTourIndex(tourIndex + 1)}
            style={{
              flex: 2, padding: '0.85rem', borderRadius: 12, border: 'none',
              background: isLast ? 'linear-gradient(135deg,#4A90C2,#3A75A0)' : '#1C1917',
              color: '#fff', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
            }}>
            {isLast ? '🎉 Go to Dashboard' : 'Next →'}
          </button>
        </div>
        <button onClick={finishTour}
          style={{ background: 'none', border: 'none', color: '#A8A29E', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.75rem', textDecoration: 'underline' }}>
          Skip tour
        </button>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes wlSlideRightIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes wlFadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes wlModalIn { from { opacity:0; transform:scale(0.95) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        
        .otp-display-box {
          border: 1px solid #222222;
          border-radius: 8px;
          padding: 16px 24px;
          font-size: 22px;
          letter-spacing: 8px;
          color: #222222;
          font-family: monospace;
          min-width: 220px;
          text-align: center;
          background: #fff;
          position: relative;
        }
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
            minHeight: 480,
            maxHeight: '94vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
            pointerEvents: 'auto',
            animation: 'wlModalIn 0.4s cubic-bezier(0.16,1,0.3,1)'
          }}>

          {/* Top Bar with Back/Close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', alignItems: 'center' }}>
            {step !== 'email' && step !== 'tour' ? (
              <button 
                type="button" 
                onClick={() => {
                  if (step === 'otp') setStep('email');
                  if (step === 'name') setStep('email');
                  setError('');
                  setCode('');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#222222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <LuChevronLeft size={24} />
              </button>
            ) : <div style={{ width: 24 }} />}

            <button onClick={onClose}
              style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#44403C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LuX size={16} />
            </button>
          </div>

          {/* Progress bar for signup */}
          {step === 'name' && (
            <div style={{ display: 'flex', gap: 5, margin: '0 1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#4A90C2' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#4A90C2' }} />
            </div>
          )}
          {step === 'tour' && (
            <div style={{ display: 'flex', gap: 5, margin: '0 1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#4A90C2' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#4A90C2' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#4A90C2' }} />
            </div>
          )}

          {/* Content */}
          <div style={{ padding: '0 1.5rem 2rem', overflowY: 'auto' }}>
            {error && (
              <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', color: '#BE123C', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {step === 'email' && (
              <div style={{ animation: 'wlSlideRightIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                  <img src={logoImg} alt="WanderLocal" style={{ display: 'block', margin: '0 auto 1.25rem', width: '150px', height: 'auto' }} />
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1C1917', margin: 0 }}>Log in or sign up</h2>
                  <p style={{ color: '#78716C', fontSize: '0.9rem', marginTop: '0.35rem' }}>Welcome to WanderLocal</p>
                </div>
                <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={lbl}>Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      style={inp} placeholder="you@example.com"
                      onFocus={e => e.target.style.borderColor = '#4A90C2'}
                      onBlur={e => e.target.style.borderColor = '#E7E5E4'} />
                  </div>
                  <button type="submit" disabled={loading} style={primaryBtn}>
                    {loading ? 'Sending code...' : 'Continue'}
                  </button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
                    <div style={{ flex: 1, height: 1, background: '#E7E5E4' }} />
                    <span style={{ fontSize: '0.78rem', color: '#A8A29E', fontWeight: 600 }}>OR</span>
                    <div style={{ flex: 1, height: 1, background: '#E7E5E4' }} />
                  </div>
                  
                  <GoogleBtn onCredential={handleGoogle} />
                </form>
              </div>
            )}

            {step === 'otp' && (
              <div style={{ textAlign: 'center', animation: 'wlSlideRightIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#222222', marginBottom: '0.5rem' }}>Confirm it's you</h2>
                <p style={{ color: '#717171', fontSize: '1rem', marginBottom: '2rem' }}>
                  We sent a code to {email}.
                </p>

                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    maxLength={6}
                    value={code} 
                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                    style={{
                      opacity: 0, position: 'absolute', inset: 0, zIndex: 10, cursor: 'text', width: '100%'
                    }}
                  />
                  <div className="otp-display-box">
                    {code.length === 0 ? (
                      <span style={{ color: '#222' }}>| - - - - - -</span>
                    ) : (
                      code.padEnd(6, '-').split('').join(' ')
                    )}
                  </div>
                </div>

                {loading && <p style={{ color: '#4A90C2', fontSize: '0.9rem', marginBottom: '1rem' }}>Verifying...</p>}

                <button 
                  type="button" 
                  disabled={loading}
                  onClick={() => { setCode(''); handleEmailSubmit(); }}
                  style={{ background: 'none', border: 'none', color: '#222222', textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  Didn't get it? Send a new code
                </button>
              </div>
            )}

            {step === 'name' && (
              <div style={{ animation: 'wlSlideRightIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ marginBottom: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#222222', margin: 0, marginBottom: '0.35rem' }}>Let's create your account</h2>
                  <p style={{ color: '#717171', fontSize: '1rem', margin: 0 }}>This information is required to book or host.</p>
                </div>

                <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Name Block */}
                  <div>
                    <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#222222', marginBottom: '0.5rem' }}>Legal name</label>
                    <div style={{ border: '1px solid #B0B0B0', borderRadius: '8px', overflow: 'hidden' }}>
                      <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                        placeholder="First name"
                        style={{ width: '100%', padding: '1.2rem 1rem', border: 'none', borderBottom: '1px solid #B0B0B0', boxSizing: 'border-box', outline: 'none', fontSize: '1rem', color: '#222' }} />
                      <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                        placeholder="Last name"
                        style={{ width: '100%', padding: '1.2rem 1rem', border: 'none', boxSizing: 'border-box', outline: 'none', fontSize: '1rem', color: '#222' }} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#717171', marginTop: '0.5rem', lineHeight: 1.4 }}>
                      Make sure it matches the name on your government ID. If you go by another name, you can <a href="#" style={{ color: '#222', fontWeight: 600, textDecoration: 'underline' }}>add a preferred first name</a>.
                    </p>
                  </div>

                  {/* DOB Block */}
                  <div>
                    <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#222222', marginBottom: '0.5rem' }}>Date of birth</label>
                    <input type="date" required value={dob} onChange={e => setDob(e.target.value)}
                      style={{ width: '100%', padding: '1.2rem 1rem', border: '1px solid #B0B0B0', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '1rem', color: '#222', fontFamily: 'inherit' }} />
                  </div>

                  {/* Password Block */}
                  <div>
                    <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#222222', marginBottom: '0.5rem' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        style={{ width: '100%', padding: '1.2rem 1rem', border: '1px solid #B0B0B0', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '1rem', color: '#222', paddingRight: '4rem' }} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', color: '#222', fontSize: '0.9rem' }}>
                        {showPw ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {/* Promotions Box */}
                  <div style={{ background: '#F7F7F7', padding: '1.2rem', borderRadius: '8px', fontSize: '0.9rem', color: '#222' }}>
                    <p style={{ margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                      WanderLocal will send you promotions such as deals and marketing notifications. You can opt out anytime via account settings or within marketing emails.
                    </p>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', margin: 0 }}>
                      <span style={{ flex: 1, paddingRight: '1rem' }}>I don't want to receive WanderLocal promotions.</span>
                      <input type="checkbox" checked={optOut} onChange={e => setOptOut(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: '#222' }} />
                    </label>
                  </div>

                  {/* Terms */}
                  <p style={{ fontSize: '0.75rem', color: '#717171', margin: 0, lineHeight: 1.5 }}>
                    By selecting <strong>Agree and continue</strong>, I agree to WanderLocal's <a href="/help/terms" style={{ color: '#0055FF', fontWeight: 600, textDecoration: 'underline' }}>Terms of Service</a>, <a href="/help/terms" style={{ color: '#0055FF', fontWeight: 600, textDecoration: 'underline' }}>Payments Terms of Service</a>, and <a href="/help/terms" style={{ color: '#0055FF', fontWeight: 600, textDecoration: 'underline' }}>Nondiscrimination Policy</a>, and acknowledge the <a href="/help/terms" style={{ color: '#0055FF', fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</a>.
                  </p>

                  <button type="submit" disabled={loading} style={{ ...primaryBtn, padding: '1.2rem', fontSize: '1.1rem', borderRadius: '8px', boxShadow: 'none' }}>
                    {loading ? 'Creating account...' : 'Agree and continue'}
                  </button>
                </form>
              </div>
            )}

            {step === 'tour' && renderTour()}

          </div>
        </div>
      </div>
    </>
  );
}

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
