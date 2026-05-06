import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuCheck, LuChevronLeft, LuImagePlus, LuMapPin, LuInfo, LuLoader } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { onboardBusiness } from '../services/api';

export default function BusinessOnboarding() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const totalSteps = 20;

  // Form State matching the 20 steps
  const [formData, setFormData] = useState({
    businessType: '',
    setupType: '',
    address: '',
    addressDetails: {
      country: '',
      postalCode: '',
      state: '',
      city: '',
      district: '',
      street: '',
      unit: ''
    },
    pinCorrection: '',
    basics: {
      maxCustomers: '',
      numStaff: '',
      numRooms: '',
      numRestrooms: ''
    },
    servicesFavorites: [],
    servicesStandouts: [],
    photos: [],
    coverPhotoIndex: 0,
    businessName: '',
    highlights: [],
    description: '',
    bookingSetting: '',
    weekdayPrice: '',
    weekendPremium: '',
    promotion: '',
    safety: []
  });

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step – submit to backend
      setSubmitting(true);
      try {
        const res = await onboardBusiness({
          user_id: userId,
          ...formData,
          weekendPrice: formData.weekdayPrice
            ? (parseFloat(formData.weekdayPrice) * (1 + (parseFloat(formData.weekendPremium) || 0) / 100)).toFixed(2)
            : 0,
        });
        if (res.status === 'success') {
          navigate('/business');
        } else {
          alert(res.message || 'Submission failed. Please try again.');
        }
      } catch {
        alert('Network error. Please try again.');
      }
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Helper styles
  const btnStyle = {
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s'
  };

  const primaryBtnStyle = {
    ...btnStyle,
    background: '#0F1E2D',
    color: '#fff',
    border: 'none',
  };

  const disabledBtnStyle = {
    ...primaryBtnStyle,
    background: '#EBF0F7',
    color: '#8D9DB0',
    cursor: 'not-allowed'
  };

  const OptionCard = ({ label, selected, onClick, icon, desc }) => (
    <div
      onClick={onClick}
      style={{
        padding: '1.2rem',
        border: `2px solid ${selected ? '#0F1E2D' : '#EBF0F7'}`,
        borderRadius: '12px',
        background: selected ? '#F8FAFC' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      {icon && <div style={{ fontSize: '1.5rem', color: selected ? '#0F1E2D' : '#5F6B7A' }}>{icon}</div>}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#0F1E2D', fontSize: '1rem' }}>{label}</div>
        {desc && <div style={{ fontSize: '0.875rem', color: '#5F6B7A', marginTop: '0.2rem' }}>{desc}</div>}
      </div>
      {selected && <LuCheck color="#0F1E2D" size={20} />}
    </div>
  );

  const CheckboxCard = ({ label, selected, onClick }) => (
    <div
      onClick={onClick}
      style={{
        padding: '1rem',
        border: `2px solid ${selected ? '#0F1E2D' : '#EBF0F7'}`,
        borderRadius: '12px',
        background: selected ? '#F8FAFC' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <span style={{ fontWeight: 500, color: '#0F1E2D' }}>{label}</span>
      <div style={{ width: 22, height: 22, border: `2px solid ${selected ? '#0F1E2D' : '#DDE3ED'}`, borderRadius: '4px', background: selected ? '#0F1E2D' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <LuCheck color="#fff" size={14} />}
      </div>
    </div>
  );

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    border: '1px solid #DDE3ED',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        const businessTypes = ['Restaurant', 'Café/Coffee Shop', 'Retail Store', 'Hotel/Accommodation', 'Salon & Spa', 'Gym & Fitness', 'Clinic/Medical', 'Law Firm', 'Accounting/Finance', 'Real Estate', 'Construction', 'Transport/Logistics', 'School/Tutorial', 'Events & Entertainment', 'Food Delivery', 'Tech/IT Services', 'Photography/Media', 'Bakery', 'Bar/Nightclub', 'Other'];
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {businessTypes.map(type => (
              <OptionCard key={type} label={type} selected={formData.businessType === type} onClick={() => updateFormData('businessType', type)} />
            ))}
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <OptionCard label="A physical location" desc="Customers visit your place" selected={formData.setupType === 'Physical'} onClick={() => updateFormData('setupType', 'Physical')} />
            <OptionCard label="Online only" desc="You operate fully online" selected={formData.setupType === 'Online'} onClick={() => updateFormData('setupType', 'Online')} />
            <OptionCard label="Both" desc="You have a physical location and also operate online" selected={formData.setupType === 'Both'} onClick={() => updateFormData('setupType', 'Both')} />
          </div>
        );

      case 3:
        return (
          <div style={{ maxWidth: '600px' }}>
            <input type="text" placeholder="Start typing your full address..." value={formData.address} onChange={e => updateFormData('address', e.target.value)} style={{ ...inputStyle, marginBottom: '1rem' }} />
            <div style={{ background: '#F4F6F9', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '0.8rem', color: '#5F6B7A', fontSize: '0.9rem' }}>
              <LuInfo size={20} color="#4A90C2" style={{ flexShrink: 0 }} /> Your exact address will only be shown to customers after they’ve made a booking or inquiry.
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="Country/Region" value={formData.addressDetails.country} onChange={e => updateFormData('addressDetails', { ...formData.addressDetails, country: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Postal Code" value={formData.addressDetails.postalCode} onChange={e => updateFormData('addressDetails', { ...formData.addressDetails, postalCode: e.target.value })} style={inputStyle} />
            </div>
            <input type="text" placeholder="State/Province" value={formData.addressDetails.state} onChange={e => updateFormData('addressDetails', { ...formData.addressDetails, state: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="City/Municipality" value={formData.addressDetails.city} onChange={e => updateFormData('addressDetails', { ...formData.addressDetails, city: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="District/Barangay" value={formData.addressDetails.district} onChange={e => updateFormData('addressDetails', { ...formData.addressDetails, district: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Street Address" value={formData.addressDetails.street} onChange={e => updateFormData('addressDetails', { ...formData.addressDetails, street: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Unit/Floor/Building (Optional)" value={formData.addressDetails.unit} onChange={e => updateFormData('addressDetails', { ...formData.addressDetails, unit: e.target.value })} style={inputStyle} />
          </div>
        );

      case 5:
        return (
          <div style={{ maxWidth: '600px' }}>
            <div style={{ width: '100%', height: '300px', background: '#F8FAFC', border: '1px solid #DDE3ED', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#8D9DB0', marginBottom: '1.5rem' }}>
              <LuMapPin size={48} color="#E53935" />
              <p style={{ marginTop: '1rem', fontWeight: 500 }}>Map Preview Placeholder</p>
            </div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#0F1E2D' }}>Is the pin in the right spot? Describe any correction (optional):</label>
            <input type="text" placeholder="e.g., Move it closer to the main road..." value={formData.pinCorrection} onChange={e => updateFormData('pinCorrection', e.target.value)} style={inputStyle} />
          </div>
        );

      case 6:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#0F1E2D' }}>Maximum customers</div>
                <div style={{ fontSize: '0.85rem', color: '#5F6B7A' }}>Served at a time</div>
              </div>
              <input type="number" placeholder="0" value={formData.basics.maxCustomers} onChange={e => updateFormData('basics', { ...formData.basics, maxCustomers: e.target.value })} style={{ ...inputStyle, width: '100px', textAlign: 'center' }} />
            </div>
            <div style={{ height: '1px', background: '#EBF0F7' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#0F1E2D' }}>Staff/Employees</div>
                <div style={{ fontSize: '0.85rem', color: '#5F6B7A' }}>Total number</div>
              </div>
              <input type="number" placeholder="0" value={formData.basics.numStaff} onChange={e => updateFormData('basics', { ...formData.basics, numStaff: e.target.value })} style={{ ...inputStyle, width: '100px', textAlign: 'center' }} />
            </div>
            <div style={{ height: '1px', background: '#EBF0F7' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#0F1E2D' }}>Service areas or rooms</div>
                <div style={{ fontSize: '0.85rem', color: '#5F6B7A' }}>If applicable</div>
              </div>
              <input type="number" placeholder="0" value={formData.basics.numRooms} onChange={e => updateFormData('basics', { ...formData.basics, numRooms: e.target.value })} style={{ ...inputStyle, width: '100px', textAlign: 'center' }} />
            </div>
            <div style={{ height: '1px', background: '#EBF0F7' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#0F1E2D' }}>Restrooms</div>
                <div style={{ fontSize: '0.85rem', color: '#5F6B7A' }}>Facilities available</div>
              </div>
              <input type="number" placeholder="0" value={formData.basics.numRestrooms} onChange={e => updateFormData('basics', { ...formData.basics, numRestrooms: e.target.value })} style={{ ...inputStyle, width: '100px', textAlign: 'center' }} />
            </div>
          </div>
        );

      case 7:
        return (
          <div style={{ maxWidth: '600px', textAlign: 'center', padding: '3rem 0' }}>
            <LuImagePlus size={64} color="#4A90C2" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '2rem', color: '#0F1E2D', marginBottom: '1rem' }}>Make your business stand out</h2>
            <p style={{ fontSize: '1.1rem', color: '#5F6B7A', lineHeight: 1.6 }}>You’ll add your services, at least 5 photos, a business name or title, and a description. Let's make it shine!</p>
          </div>
        );

      case 8:
        const favorites = ['Free Wifi', 'Parking', 'Delivery', 'Online Booking', 'Accepts Credit/Debit', 'Air Conditioning', 'Wheelchair Accessible', 'Pet Friendly'];
        const standouts = ['Private Rooms', 'Event Space', 'Drive-through', '24/7 Service', 'Loyalty Program', 'Live Entertainment', 'Outdoor Seating', 'Catering', 'Home Service', 'Membership Plans'];
        return (
          <div style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0F1E2D', marginBottom: '1rem' }}>Customer favorites</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {favorites.map(fav => (
                <CheckboxCard key={fav} label={fav} selected={formData.servicesFavorites.includes(fav)} onClick={() => {
                  const newFavs = formData.servicesFavorites.includes(fav) ? formData.servicesFavorites.filter(i => i !== fav) : [...formData.servicesFavorites, fav];
                  updateFormData('servicesFavorites', newFavs);
                }} />
              ))}
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#0F1E2D', marginBottom: '1rem' }}>Standout offerings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {standouts.map(std => (
                <CheckboxCard key={std} label={std} selected={formData.servicesStandouts.includes(std)} onClick={() => {
                  const newStd = formData.servicesStandouts.includes(std) ? formData.servicesStandouts.filter(i => i !== std) : [...formData.servicesStandouts, std];
                  updateFormData('servicesStandouts', newStd);
                }} />
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div style={{ maxWidth: '600px' }}>
            <div style={{ padding: '3rem', border: '2px dashed #DDE3ED', borderRadius: '16px', background: '#FAFCFF', textAlign: 'center', cursor: 'pointer' }}>
              <LuImagePlus size={48} color="#8D9DB0" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0F1E2D', marginBottom: '0.5rem' }}>Drag your photos here</h3>
              <p style={{ color: '#5F6B7A', marginBottom: '1.5rem' }}>Choose at least 5 photos.</p>
              <button style={{ ...primaryBtnStyle, background: '#fff', color: '#0F1E2D', border: '1px solid #DDE3ED' }}>Browse from device</button>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#0F1E2D' }}>Or list the photos you plan to upload:</label>
              <textarea placeholder="e.g., storefront, interior, products, staff, menu" rows="3" style={{ ...inputStyle, resize: 'none' }}></textarea>
            </div>
          </div>
        );

      case 10:
        return (
          <div style={{ maxWidth: '600px', textAlign: 'center' }}>
            <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: '12px', border: '1px solid #DDE3ED', marginBottom: '1.5rem' }}>
               <LuMapPin size={48} color="#4A90C2" style={{ marginBottom: '1rem' }} />
               <p style={{ color: '#5F6B7A' }}>Your uploaded photos will appear here. Choose one as your cover.</p>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#5F6B7A' }}>In a live environment, you would drag and drop to reorder photos easily.</p>
          </div>
        );

      case 11:
        return (
          <div style={{ maxWidth: '600px' }}>
            <input type="text" maxLength={50} placeholder="e.g., The Cozy Corner Café" value={formData.businessName} onChange={e => updateFormData('businessName', e.target.value)} style={{ ...inputStyle, fontSize: '1.25rem', padding: '1.2rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#8D9DB0', fontSize: '0.875rem' }}>
              <span>Keep it clear and easy to remember.</span>
              <span>{formData.businessName.length}/50</span>
            </div>
          </div>
        );

      case 12:
        const highlightsOptions = ['Trusted & Established', 'Budget-Friendly', 'Premium Quality', 'Family-Friendly', 'Fast Service', 'Locally Owned', 'Eco-Friendly', 'Open Late'];
        return (
          <div style={{ maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {highlightsOptions.map(hl => (
              <CheckboxCard key={hl} label={hl} selected={formData.highlights.includes(hl)} onClick={() => {
                const isSelected = formData.highlights.includes(hl);
                if (isSelected) {
                   updateFormData('highlights', formData.highlights.filter(i => i !== hl));
                } else if (formData.highlights.length < 2) {
                   updateFormData('highlights', [...formData.highlights, hl]);
                }
              }} />
            ))}
            <div style={{ gridColumn: '1 / -1', fontSize: '0.9rem', color: '#5F6B7A', marginTop: '1rem' }}>
              You have selected {formData.highlights.length} of 2 highlights.
            </div>
          </div>
        );

      case 13:
        return (
          <div style={{ maxWidth: '600px' }}>
            <textarea maxLength={500} placeholder="We're a family-owned cozy café hidden in the heart of..." value={formData.description} onChange={e => updateFormData('description', e.target.value)} style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}></textarea>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#8D9DB0', fontSize: '0.875rem' }}>
              <span>Offer to write or improve it with AI later!</span>
              <span>{formData.description.length}/500</span>
            </div>
          </div>
        );

      case 14:
        return (
          <div style={{ maxWidth: '600px', textAlign: 'center', padding: '3rem 0' }}>
            <LuCheck size={64} color="#4A90C2" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '2rem', color: '#0F1E2D', marginBottom: '1rem' }}>Almost done!</h2>
            <p style={{ fontSize: '1.1rem', color: '#5F6B7A', lineHeight: 1.6 }}>Now let’s finish setting up. You’ll choose how customers can reach you, set your pricing, and hit publish.</p>
          </div>
        );

      case 15:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <OptionCard label="Manual approval" desc="You review and approve each inquiry or booking yourself." selected={formData.bookingSetting === 'Manual'} onClick={() => updateFormData('bookingSetting', 'Manual')} />
            <OptionCard label="Instant booking" desc="Customers can book or contact you automatically without waiting." selected={formData.bookingSetting === 'Instant'} onClick={() => updateFormData('bookingSetting', 'Instant')} />
          </div>
        );

      case 16:
        return (
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', color: '#0F1E2D', fontWeight: 600 }}>₱</span>
              <input type="number" placeholder="0" value={formData.weekdayPrice} onChange={e => updateFormData('weekdayPrice', e.target.value)} style={{ ...inputStyle, fontSize: '2rem', padding: '1rem', flex: 1 }} />
            </div>
            <p style={{ color: '#5F6B7A', fontSize: '0.9rem' }}>The platform suggests competitive rates based on similar businesses. Taxes or fees may apply on top.</p>
          </div>
        );

      case 17:
        const premiumOptions = [0, 10, 20, 25, 50, 99];
        return (
          <div style={{ maxWidth: '600px' }}>
            <p style={{ color: '#0F1E2D', fontWeight: 600, marginBottom: '1rem' }}>Weekend Premium (%)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              {premiumOptions.map(pct => (
                <div key={pct} onClick={() => updateFormData('weekendPremium', pct)} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: `2px solid ${formData.weekendPremium === pct ? '#0F1E2D' : '#DDE3ED'}`, background: formData.weekendPremium === pct ? '#0F1E2D' : '#fff', color: formData.weekendPremium === pct ? '#fff' : '#0F1E2D', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  +{pct}%
                </div>
              ))}
            </div>
            {formData.weekdayPrice && formData.weekendPremium > 0 && (
              <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', color: '#5F6B7A' }}>
                Your weekend rate will be <strong style={{ color: '#0F1E2D' }}>₱{(formData.weekdayPrice * (1 + formData.weekendPremium / 100)).toFixed(2)}</strong>.
              </div>
            )}
          </div>
        );

      case 18:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <p style={{ color: '#5F6B7A', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Only one promotion applies per transaction.</p>
            <OptionCard label="New listing promo" desc="20% off your first 3 customers." selected={formData.promotion === 'New'} onClick={() => updateFormData('promotion', 'New')} />
            <OptionCard label="Last-minute deal" desc="22% off bookings made 24–48 hours before." selected={formData.promotion === 'LastMinute'} onClick={() => updateFormData('promotion', 'LastMinute')} />
            <OptionCard label="Weekly deal" desc="10% off for customers who book 7+ days in advance." selected={formData.promotion === 'Weekly'} onClick={() => updateFormData('promotion', 'Weekly')} />
            <OptionCard label="Monthly deal" desc="20% off for long-term or recurring customers." selected={formData.promotion === 'Monthly'} onClick={() => updateFormData('promotion', 'Monthly')} />
            <OptionCard label="No promotions for now" desc="I'll add discounts later." selected={formData.promotion === 'None'} onClick={() => updateFormData('promotion', 'None')} />
          </div>
        );

      case 19:
        const safetyOptions = ['CCTV/security cameras on premises', 'Noise or crowd monitoring system', 'Restricted items or equipment on site'];
        return (
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {safetyOptions.map(opt => (
                <CheckboxCard key={opt} label={opt} selected={formData.safety.includes(opt)} onClick={() => {
                  const newSafety = formData.safety.includes(opt) ? formData.safety.filter(i => i !== opt) : [...formData.safety, opt];
                  updateFormData('safety', newSafety);
                }} />
              ))}
            </div>
            <div style={{ background: '#FFF3E0', padding: '1rem', borderRadius: '8px', color: '#E65100', fontSize: '0.9rem', display: 'flex', gap: '0.8rem' }}>
              <LuInfo size={20} style={{ flexShrink: 0 }} /> Remind yourself to comply with all local business regulations, permits, and anti-discrimination policies.
            </div>
          </div>
        );

      case 20:
        return (
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <div style={{ background: '#fff', border: '1px solid #DDE3ED', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
               {/* Cover Image Placeholder */}
               <div style={{ height: '200px', background: '#EBF0F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8D9DB0' }}>
                 Your Cover Photo Here
               </div>
               <div style={{ padding: '2rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F1E2D', marginBottom: '0.5rem' }}>{formData.businessName || 'Your Business Name'}</h2>
                      <p style={{ color: '#5F6B7A' }}>{formData.businessType || 'Type pending'} • {formData.setupType || 'Setup pending'}</p>
                    </div>
                 </div>
                 <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', marginBottom: '1.5rem' }}>
                   <div style={{ fontWeight: 600, color: '#0F1E2D', marginBottom: '0.25rem' }}>Pricing & Settings</div>
                   <div style={{ fontSize: '0.9rem', color: '#5F6B7A' }}>Start at ₱{formData.weekdayPrice || '0'} / Weekday</div>
                   <div style={{ fontSize: '0.9rem', color: '#5F6B7A' }}>{formData.bookingSetting || 'Manual'} booking enabled</div>
                 </div>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F1E2D', marginBottom: '0.5rem' }}>Description</h3>
                 <p style={{ color: '#5F6B7A', fontSize: '0.95rem', lineHeight: 1.5 }}>
                   {formData.description || 'No description provided yet. Customers love stories, consider adding one later!'}
                 </p>
               </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
               <h3 style={{ fontSize: '1.5rem', color: '#0F1E2D', marginBottom: '0.5rem' }}>Congratulations!</h3>
               <p style={{ color: '#5F6B7A' }}>Your business profile is ready to go live. Welcome to WandereLocal!</p>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  const stepsInfo = [
    { id: 1, title: 'Business type', subtitle: 'Which of these best describes your business?' },
    { id: 2, title: 'Business setup type', subtitle: 'How is your business set up?' },
    { id: 3, title: 'Business location', subtitle: 'Where is your business located?' },
    { id: 4, title: 'Confirm address', subtitle: 'Please confirm or correct your address details:' },
    { id: 5, title: 'Pin location', subtitle: 'We’ve placed a pin on the map based on your address. Is it accurate?' },
    { id: 6, title: 'Business basics', subtitle: 'Let’s get some basic capacity and service details.' },
    { id: 7, title: 'Step 2 Intro', hideHeader: true },
    { id: 8, title: 'Services & amenities', subtitle: 'What does your business offer?' },
    { id: 9, title: 'Add photos', subtitle: 'You need at least 5 photos to publish your listing.' },
    { id: 10, title: 'Review photos', subtitle: 'Choose your cover photo. Lead with the most eye-catching one.' },
    { id: 11, title: 'Business name', subtitle: 'What is your business name?' },
    { id: 12, title: 'Business highlights', subtitle: 'Choose up to 2 highlights that best describe your business.' },
    { id: 13, title: 'Business description', subtitle: 'Tell customers what makes your business special.' },
    { id: 14, title: 'Step 3 Intro', hideHeader: true },
    { id: 15, title: 'Booking options', subtitle: 'How would you like customers to connect with you?' },
    { id: 16, title: 'Weekday pricing', subtitle: 'What is your starting price or service rate on weekdays?' },
    { id: 17, title: 'Weekend pricing', subtitle: 'Would you like to set a different rate for weekends?' },
    { id: 18, title: 'Promotions', subtitle: 'Which promotions would you like to offer?' },
    { id: 19, title: 'Safety & legal', subtitle: 'Does your business have any of the following?' },
    { id: 20, title: 'Summary', hideHeader: true },
  ];

  const currentStepData = stepsInfo[currentStep - 1] || {};

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Navbar */}
      <header style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3rem', borderBottom: '1px solid #EBF0F7' }}>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0F1E2D' }}>WandereLocal<span style={{ color: '#4A90C2' }}>.</span></div>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid #DDE3ED', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>Save & exit</button>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', overflowY: 'auto' }}>
        
        {!currentStepData.hideHeader && (
          <div style={{ maxWidth: '600px', width: '100%', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F1E2D', marginBottom: '0.5rem' }}>{currentStepData.title}</h1>
            {currentStepData.subtitle && <p style={{ fontSize: '1rem', color: '#5F6B7A', lineHeight: 1.5 }}>{currentStepData.subtitle}</p>}
          </div>
        )}

        <div style={{ wwidth: '100%', display: 'flex', justifyContent: 'center' }}>
          {renderStepContent()}
        </div>

      </main>

      {/* Bottom Footer (Sticky) */}
      <footer style={{ background: '#fff', borderTop: '1px solid #EBF0F7', padding: '1.5rem 3rem', position: 'sticky', bottom: 0, zIndex: 10 }}>
        
        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: '-2px', left: 0, width: '100%', height: '3px', background: '#EBF0F7' }}>
           <div style={{ width: `${(currentStep / totalSteps) * 100}%`, height: '100%', background: '#0F1E2D', transition: 'width 0.3s ease' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <button 
            onClick={handleBack} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#0F1E2D', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
             <LuChevronLeft size={20} /> Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={submitting}
            style={{ ...primaryBtnStyle, ...(submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}), display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {submitting ? <><LuLoader style={{ animation: 'spin 1s linear infinite' }} /> Publishing...</> : currentStep === totalSteps ? 'Publish listing' : 'Next'}
          </button>
        </div>
      </footer>
    </div>
  );
}
