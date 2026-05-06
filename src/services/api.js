/**
 * api.js – Centralized API service layer
 * All frontend components call these functions instead of raw fetch()
 * Base URL points to the Flask backend at http://localhost:5000
 */

const BASE = 'http://localhost:5000';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json();
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────
export const checkEmail = (email) =>
  req('/check-email', { method: 'POST', body: JSON.stringify({ email }) });

export const requestOtp = (email) =>
  req('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) });

export const verifyOtp = (email, code) =>
  req('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, code }) });

export const completeOtpSignup = (email, name, password) =>
  req('/auth/complete-otp-signup', { method: 'POST', body: JSON.stringify({ email, name, password }) });

export const login = (email, password) =>
  req('/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (name, email, password, role) =>
  req('/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) });

export const googleAuth = (credential, role = 'traveler') =>
  req('/auth/google', { method: 'POST', body: JSON.stringify({ credential, role }) });

// ── Listings ──────────────────────────────────────────────────────
export const getListings = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.set('category', filters.category);
  if (filters.tier && filters.tier !== 'All') params.set('tier', filters.tier.toLowerCase());
  if (filters.q) params.set('q', filters.q);
  return req(`/listings?${params}`);
};

export const getListing  = (id) => req(`/listings/${id}`);
export const createListing = (data) => req('/listings', { method: 'POST', body: JSON.stringify(data) });
export const toggleSave  = (lid, user_id) =>
  req(`/listings/${lid}/save`, { method: 'POST', body: JSON.stringify({ user_id }) });
export const getWishlist = (user_id) => req(`/wishlist?user_id=${user_id}`);
export const postReview  = (lid, user_id, rating, body) =>
  req(`/listings/${lid}/review`, { method: 'POST', body: JSON.stringify({ user_id, rating, body }) });

// ── Nominations ───────────────────────────────────────────────────
export const submitNomination = (data) =>
  req('/nominations', { method: 'POST', body: JSON.stringify(data) });
export const getNominations   = () => req('/nominations');
export const updateNomination = (id, status) =>
  req(`/nominations/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });

// ── Itineraries ───────────────────────────────────────────────────
export const getItineraries = (user_id) => req(`/itineraries?user_id=${user_id}`);
export const getItinerary   = (id) => req(`/itineraries/${id}`);
export const createItinerary = (data) =>
  req('/itineraries', { method: 'POST', body: JSON.stringify(data) });
export const updateItinerary = (id, data) =>
  req(`/itineraries/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteItinerary = (id) =>
  req(`/itineraries/${id}`, { method: 'DELETE' });
export const addDay = (iid, label) =>
  req(`/itineraries/${iid}/days`, { method: 'POST', body: JSON.stringify({ label }) });
export const addStop = (iid, did, data) =>
  req(`/itineraries/${iid}/days/${did}/stops`, { method: 'POST', body: JSON.stringify(data) });
export const deleteStop = (iid, sid) =>
  req(`/itineraries/${iid}/stops/${sid}`, { method: 'DELETE' });
export const generateAiItinerary = (data) =>
  req('/ai-itinerary', { method: 'POST', body: JSON.stringify(data) });

// ── User Profile ──────────────────────────────────────────────────
export const getProfile    = (user_id) => req(`/profile?user_id=${user_id}`);
export const updateProfile = (uid, data) =>
  req(`/profile/${uid}`, { method: 'PUT', body: JSON.stringify(data) });
export const getNotifications = (user_id) => req(`/notifications?user_id=${user_id}`);
export const markNotifRead = (nid) =>
  req(`/notifications/${nid}/read`, { method: 'PUT' });
export const getProfileStats = (uid) => req(`/profile/${uid}/stats`);

// ── Business ──────────────────────────────────────────────────────
export const getOwnerListing = (user_id) => req(`/business/listing?user_id=${user_id}`);
export const updateOwnerListing = (lid, data) =>
  req(`/business/listing/${lid}`, { method: 'PUT', body: JSON.stringify(data) });
export const postAnnouncement = (lid, content) =>
  req(`/business/listing/${lid}/announce`, { method: 'POST', body: JSON.stringify({ content }) });
export const getAnnouncements = (lid) => req(`/business/listing/${lid}/announces`);
export const submitClaim = (data) =>
  req('/business/claim', { method: 'POST', body: JSON.stringify(data) });
export const onboardBusiness = (data) =>
  req('/business/onboard', { method: 'POST', body: JSON.stringify(data) });
export const getBusinessStats = (lid) => req(`/business/${lid}/stats`);

// ── Admin ─────────────────────────────────────────────────────────
export const getAdminStats   = () => req('/admin/stats');
export const getAllUsers      = () => req('/admin/users');
export const updateUser      = (uid, data) =>
  req(`/admin/users/${uid}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser      = (uid) =>
  req(`/admin/users/${uid}`, { method: 'DELETE' });
export const getQueue        = () => req('/admin/queue');
export const updateQueueItem = (lid, action, tier) =>
  req(`/admin/queue/${lid}`, { method: 'PUT', body: JSON.stringify({ action, tier }) });
export const getClaims       = () => req('/admin/claims');
export const updateClaim     = (cid, status) =>
  req(`/admin/claims/${cid}`, { method: 'PUT', body: JSON.stringify({ status }) });
