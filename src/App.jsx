import React, { useContext } from 'react';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './layouts/Navbar';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Directory from './pages/Directory';
import Login from './pages/Login';
import TravelerDashboard from './pages/TravelerDashboard';
import ListingDetail from './pages/ListingDetail';
import ItineraryBuilder from './pages/ItineraryBuilder';
import CommunityGallery from './pages/CommunityGallery';
import NominateBusiness from './pages/NominateBusiness';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessClaim from './pages/BusinessClaim';
import AdminDashboard from './pages/AdminDashboard';
import TravelerProfile from './pages/TravelerProfile';
import TravelerSettings from './pages/TravelerSettings';
import TravelerTrips from './pages/TravelerTrips';
import TravelerWishlists from './pages/TravelerWishlists';
import BusinessSettings from './pages/BusinessSettings';
import BusinessListings from './pages/BusinessListings';
import BusinessBookings from './pages/BusinessBookings';
import BusinessReviews from './pages/BusinessReviews';

import AuthModal from './components/AuthModal';

const mainContentStyle = {
  paddingTop: '72px',
};

/* ProtectedRoute guarantees AuthModal is shown if not logged in */
const ProtectedRoute = ({ children }) => {
  const { userRole } = useContext(AuthContext);
  if (!userRole) {
    return (
      <>
        <Navbar />
        <main style={mainContentStyle}>
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Restricted Access</h2>
            <p style={{ color: '#5F6B7A' }}>You must be logged in to view this content.</p>
          </div>
        </main>
        <AuthModal defaultTab="login" onClose={() => window.location.href = '/'} />
      </>
    );
  }
  return children;
};

/* SmartLayout provides a generic Navbar if logged out, or DashboardLayout with Sidebar if logged in */
/* Wait, the user wants SmartLayout pages (like Directory) to FORCE LOGIN as well, so we also check userRole! */
const SmartLayout = ({ children, activeTabId }) => {
  const { userRole } = useContext(AuthContext);

  if (userRole) {
    return (
      <DashboardLayout activeTabId={activeTabId}>
        {children}
      </DashboardLayout>
    );
  }

  // If not logged in and they reach a SmartLayout page, force login!
  return (
    <>
      <Navbar />
      <main style={mainContentStyle}>
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Please Log In</h2>
          <p style={{ color: '#5F6B7A' }}>You must log in to explore this feature.</p>
        </div>
      </main>
      <AuthModal defaultTab="login" onClose={() => window.location.href = '/'} />
    </>
  );
};


function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public Pages (Always Navbar) ──────────── */}
            <Route
              path="/"
              element={<><Navbar /><main style={{ ...mainContentStyle, paddingTop: 0 }}><Home /></main></>}
            />

            {/*
              /login and /register now redirect to Home (/) which has the modal.
              Old links / bookmarks still work gracefully.
            */}
            <Route path="/login"    element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />

            <Route
              path="/nominate"
              element={<><Navbar /><main style={mainContentStyle}><NominateBusiness /></main></>}
            />
            <Route
              path="/claim"
              element={<><Navbar /><main style={mainContentStyle}><BusinessClaim /></main></>}
            />

            {/* ── Hybrid Pages (SmartLayout) ────────────── */}
            <Route
              path="/directory"
              element={<SmartLayout activeTabId="directory"><Directory /></SmartLayout>}
            />
            <Route
              path="/listing/:id"
              element={<SmartLayout activeTabId="directory"><ListingDetail /></SmartLayout>}
            />
            <Route
              path="/itinerary"
              element={<SmartLayout activeTabId="itineraries"><ItineraryBuilder /></SmartLayout>}
            />
            <Route
              path="/gallery"
              element={<SmartLayout activeTabId="gallery"><CommunityGallery /></SmartLayout>}
            />

            {/* ── Dashboard Pages (Always DashboardLayout) ── */}
            <Route path="/dashboard"          element={<ProtectedRoute><TravelerDashboard /></ProtectedRoute>} />
            <Route path="/trips"              element={<ProtectedRoute><TravelerTrips /></ProtectedRoute>} />
            <Route path="/wishlists"          element={<ProtectedRoute><TravelerWishlists /></ProtectedRoute>} />
            <Route path="/profile"            element={<ProtectedRoute><TravelerProfile /></ProtectedRoute>} />
            <Route path="/account-settings"   element={<ProtectedRoute><TravelerSettings /></ProtectedRoute>} />
            <Route path="/business"           element={<ProtectedRoute><BusinessDashboard /></ProtectedRoute>} />
            <Route path="/business/settings"  element={<ProtectedRoute><BusinessSettings /></ProtectedRoute>} />
            <Route path="/business/listings"  element={<ProtectedRoute><BusinessListings /></ProtectedRoute>} />
            <Route path="/business/bookings"  element={<ProtectedRoute><BusinessBookings /></ProtectedRoute>} />
            <Route path="/business/reviews"   element={<ProtectedRoute><BusinessReviews /></ProtectedRoute>} />
            <Route path="/admin"              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
