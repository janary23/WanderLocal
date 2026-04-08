import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const C = { ink: '#0F1E2D', ffDisplay: "'Manrope', sans-serif" };

const BusinessBookings = () => {
  return (
    <DashboardLayout activeTabId="bookings">
      <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: C.ink, marginBottom: '2rem', fontFamily: C.ffDisplay }}>Manage Bookings</h1>
        <p>Bookings interface module will render here.</p>
      </div>
    </DashboardLayout>
  );
};
export default BusinessBookings;
