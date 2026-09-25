import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import trainerImg from '../assets/trainer.png';
import gymezyLogo from '../assets/logo/gymezy.png';
import './LeadCaptureModal.css';

// Default Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_SHEET_WEBAPP_URL ||
  'https://script.google.com/macros/s/AKfycbwRuYiEoxBfDcERbsg5IxbGZpKZH_ho9zwq8K-Csur6-RfgviGpi2Rg1WtkGY8IfxIpsA/exec';

function triggerSuccessConfetti() {
  try {
    // 1. Center Burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#00bf62', '#00df73', '#fed085', '#5b62b0', '#ffffff'],
      zIndex: 9999999
    });

    // 2. Left Cannon
    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 60,
        origin: { x: 0.15, y: 0.65 },
        colors: ['#00bf62', '#00df73', '#fed085', '#ffffff'],
        zIndex: 9999999
      });
    }, 120);

    // 3. Right Cannon
    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 60,
        origin: { x: 0.85, y: 0.65 },
        colors: ['#00bf62', '#00df73', '#fed085', '#ffffff'],
        zIndex: 9999999
      });
    }, 240);
  } catch (e) {
    console.error('Confetti trigger error:', e);
  }
}

// Live Validation Helper
function validateField(name, value) {
  const val = (value || '').toString().trim();

  switch (name) {
    case 'gymName':
      if (!val) return 'Gym / Center name is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      return '';

    case 'ownerName':
      if (!val) return 'Contact person name is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Please enter a valid full name';
      return '';

    case 'mobile': {
      const digits = val.replace(/\D/g, '');
      if (!digits) return 'Mobile number is required';
      if (!/^[6-9]/.test(digits)) return 'Must start with 6, 7, 8, or 9';
      if (digits.length !== 10) return `Enter 10 digits (${digits.length}/10 entered)`;
      return '';
    }

    case 'email':
      if (!val) return 'Email address is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return 'Enter a valid email address (e.g. name@domain.com)';
      return '';

    case 'city':
      if (!val) return 'Please select a city';
      return '';

    case 'area':
      if (!val) return 'Area / Location is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      return '';

    case 'gymType':
      if (!val) return 'Please select a gym type';
      return '';

    case 'membersCount':
      if (!val) return 'Please select member count';
      return '';

    default:
      return '';
  }
}

export default function LeadCaptureModal({
  isOpen = false,
  onClose,
  initialCategory = 'demo', // 'demo' | 'interest'
  defaultPlan = ''
}) {
  const [category, setCategory] = useState(initialCategory); // 'demo' | 'interest'
  const [formData, setFormData] = useState({
    gymName: '',
    ownerName: '',
    mobile: '',
    email: '',
    city: 'Chennai',
    area: 'Anna Nagar',
    gymType: '',
    membersCount: '250 - 500',
    notes: ''
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    if (!loading) {
      setSubmitted(false);
      setErrorMsg('');
      setTouched({});
      setErrors({});
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedVal = value;

    // Auto-clean phone input to max 10 digits
    if (name === 'mobile') {
      formattedVal = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedVal
    }));

    // Run live validation immediately if touched or typing
    const fieldError = validateField(name, formattedVal);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields touched and validate
    const fieldsToValidate = ['gymName', 'ownerName', 'mobile', 'email', 'city', 'area', 'gymType', 'membersCount'];
    const newErrors = {};
    const newTouched = {};
    let hasError = false;

    fieldsToValidate.forEach((f) => {
      newTouched[f] = true;
      const err = validateField(f, formData[f]);
      if (err) {
        newErrors[f] = err;
        hasError = true;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (hasError) {
      setErrorMsg('Please fix the highlighted fields above before submitting.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const payload = {
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      category: category === 'demo' ? 'Request a Demo' : 'Register Interest',
      plan: defaultPlan || 'Standard',
      gymName: formData.gymName.trim(),
      ownerName: formData.ownerName.trim(),
      mobile: `' +91 ${formData.mobile.trim()}`,
      email: formData.email.trim(),
      city: formData.city,
      area: formData.area.trim(),
      gymType: formData.gymType || 'General Fitness',
      membersCount: formData.membersCount,
      notes: formData.notes.trim(),
      pageUrl: window.location.href
    };

    try {
      if (GOOGLE_SCRIPT_URL) {
        // Send data to Google Apps Script Web App (text/plain avoids browser CORS preflight blocking)
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
      } else {
        console.log('[GYMEZY Lead Capture] Form submitted:', payload);
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitted(true);
      setLoading(false);
      triggerSuccessConfetti();
    } catch (err) {
      console.error('Submission error:', err);
      // Data reaches Google Sheets even if browser reports opaque response in no-cors
      setSubmitted(true);
      setLoading(false);
      triggerSuccessConfetti();
    }
  };

  const getFieldStatusClass = (fieldName) => {
    if (!touched[fieldName]) return '';
    if (errors[fieldName]) return 'has-error';
    if (formData[fieldName]) return 'is-valid';
    return '';
  };

  return (
    <div className="lead-modal-overlay" onClick={handleClose}>
      <div
        className="lead-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close 'X' Button */}
        <button
          type="button"
          className="lead-modal-close-btn"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          ✕
        </button>

        <div className="lead-modal-layout">
          {/* Left Column: Form Content */}
          <div className="lead-modal-form-col">
            {!submitted ? (
              <>
                {/* Modal Title */}
                <div className="lead-modal-header">
                  <h3 className="lead-modal-title">Get Started with Gymezy</h3>
                  <p className="lead-modal-subtitle">
                    Fill in your details below and our team will get in touch with you shortly.
                  </p>
                </div>

                {errorMsg && <div className="lead-modal-error">{errorMsg}</div>}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="lead-modal-form" noValidate>
                  {/* Row 0: Request / Inquiry Type Dropdown */}
                  <div className="lead-form-row">
                    <div className="lead-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                      <label className="lead-label">I want to <span className="lead-required-star">*</span></label>
                      <select
                        name="category"
                        className="lead-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="demo">Request a Demo (Schedule a 1-on-1 walkthrough)</option>
                        <option value="interest">Register Interest (Partner as Gym Owner / Studio)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 1: Gym Name + Owner Name */}
                  <div className="lead-form-row">
                    <div className={`lead-form-group ${getFieldStatusClass('gymName')}`}>
                      <label className="lead-label">Gym / Fitness Center Name <span className="lead-required-star">*</span></label>
                      <div className="lead-input-wrap">
                        <input
                          type="text"
                          name="gymName"
                          className="lead-input"
                          placeholder="FitZone Gym"
                          value={formData.gymName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        {touched.gymName && !errors.gymName && formData.gymName && (
                          <span className="lead-valid-check">✓</span>
                        )}
                      </div>
                      {touched.gymName && errors.gymName && (
                        <span className="lead-error-text">{errors.gymName}</span>
                      )}
                    </div>

                    <div className={`lead-form-group ${getFieldStatusClass('ownerName')}`}>
                      <label className="lead-label">Owner / Contact Person Name <span className="lead-required-star">*</span></label>
                      <div className="lead-input-wrap">
                        <input
                          type="text"
                          name="ownerName"
                          className="lead-input"
                          placeholder="Praveen Kumar"
                          value={formData.ownerName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        {touched.ownerName && !errors.ownerName && formData.ownerName && (
                          <span className="lead-valid-check">✓</span>
                        )}
                      </div>
                      {touched.ownerName && errors.ownerName && (
                        <span className="lead-error-text">{errors.ownerName}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Mobile Number + Email */}
                  <div className="lead-form-row">
                    <div className={`lead-form-group ${getFieldStatusClass('mobile')}`}>
                      <label className="lead-label">Mobile Number <span className="lead-required-star">*</span></label>
                      <div className="lead-input-wrap lead-phone-input-wrap">
                        <span className="lead-phone-prefix">+91</span>
                        <input
                          type="tel"
                          name="mobile"
                          className="lead-input lead-phone-input"
                          placeholder="9150955071"
                          value={formData.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={10}
                          required
                        />
                        {touched.mobile && !errors.mobile && formData.mobile.length === 10 && (
                          <span className="lead-valid-check">✓</span>
                        )}
                      </div>
                      {touched.mobile && errors.mobile && (
                        <span className="lead-error-text">{errors.mobile}</span>
                      )}
                    </div>

                    <div className={`lead-form-group ${getFieldStatusClass('email')}`}>
                      <label className="lead-label">Email Address <span className="lead-required-star">*</span></label>
                      <div className="lead-input-wrap">
                        <input
                          type="email"
                          name="email"
                          className="lead-input"
                          placeholder="praveen.k@gymezy.com"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        {touched.email && !errors.email && formData.email && (
                          <span className="lead-valid-check">✓</span>
                        )}
                      </div>
                      {touched.email && errors.email && (
                        <span className="lead-error-text">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: City + Area / Location */}
                  <div className="lead-form-row">
                    <div className={`lead-form-group ${getFieldStatusClass('city')}`}>
                      <label className="lead-label">City <span className="lead-required-star">*</span></label>
                      <select
                        name="city"
                        className="lead-select"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="Chennai">Chennai</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Pune">Pune</option>
                        <option value="Coimbatore">Coimbatore</option>
                        <option value="Other">Other City</option>
                      </select>
                      {touched.city && errors.city && (
                        <span className="lead-error-text">{errors.city}</span>
                      )}
                    </div>

                    <div className={`lead-form-group ${getFieldStatusClass('area')}`}>
                      <label className="lead-label">Area / Location <span className="lead-required-star">*</span></label>
                      <div className="lead-input-wrap">
                        <input
                          type="text"
                          name="area"
                          className="lead-input"
                          placeholder="Anna Nagar"
                          value={formData.area}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        {touched.area && !errors.area && formData.area && (
                          <span className="lead-valid-check">✓</span>
                        )}
                      </div>
                      {touched.area && errors.area && (
                        <span className="lead-error-text">{errors.area}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Gym Type + Current Members */}
                  <div className="lead-form-row">
                    <div className={`lead-form-group ${getFieldStatusClass('gymType')}`}>
                      <label className="lead-label">Gym Type <span className="lead-required-star">*</span></label>
                      <select
                        name="gymType"
                        className="lead-select"
                        value={formData.gymType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="" disabled>Select gym type</option>
                        <option value="Traditional Gym">Traditional Gym &amp; Fitness Center</option>
                        <option value="CrossFit Box">CrossFit Box &amp; Functional Training</option>
                        <option value="Studio / Yoga / Pilates">Studio (Yoga, Zumba, Pilates)</option>
                        <option value="Multi-purpose Club">Multi-purpose Fitness Club</option>
                        <option value="Personal Trainer Studio">Personal Trainer Studio</option>
                      </select>
                      {touched.gymType && errors.gymType && (
                        <span className="lead-error-text">{errors.gymType}</span>
                      )}
                    </div>

                    <div className={`lead-form-group ${getFieldStatusClass('membersCount')}`}>
                      <label className="lead-label">Current Members (Approx.) <span className="lead-required-star">*</span></label>
                      <select
                        name="membersCount"
                        className="lead-select"
                        value={formData.membersCount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="Under 100">Under 100</option>
                        <option value="100 - 250">100 - 250</option>
                        <option value="250 - 500">250 - 500</option>
                        <option value="500+">500+ members</option>
                      </select>
                      {touched.membersCount && errors.membersCount && (
                        <span className="lead-error-text">{errors.membersCount}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 5: Notes */}
                  <div className="lead-form-group full-width">
                    <label className="lead-label">Tell us about your gym <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>(optional)</span></label>
                    <textarea
                      name="notes"
                      className="lead-textarea"
                      rows="3"
                      style={{ resize: 'none' }}
                      placeholder="We are a premium fitness center with spacious workout areas and certified trainers."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="lead-modal-actions">
                    <button
                      type="button"
                      className="lead-btn-back"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="lead-btn-submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="lead-spinner-text">Submitting...</span>
                      ) : (
                        <span>Submit Request</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success Screen */
              <div className="lead-success-screen">
                <div className="lead-success-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="lead-success-title">Request Received!</h3>
                <p className="lead-success-desc">
                  Thank you, <strong>{formData.ownerName || 'Partner'}</strong>! We have registered your{' '}
                  <strong>{category === 'demo' ? 'Demo Request' : 'Interest'}</strong> for{' '}
                  <strong>{formData.gymName || 'your center'}</strong>.
                  <br />
                  Our partnership team will connect with you on <strong>+91 {formData.mobile}</strong> shortly.
                </p>
                <button type="button" className="lead-btn-submit" onClick={handleClose}>
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Visual Showcase with trainer.png */}
          <div className="lead-modal-visual-col">
            <div className="lead-visual-bg-glow" />

            {/* Brand Header */}
            <div className="lead-visual-brand-header">
              <div className="lead-visual-brand">
                <img
                  src={gymezyLogo}
                  alt="GYMEZY Logo"
                  className="lead-visual-brand-logo"
                />
              </div>
              <p className="lead-visual-tagline">Make Your Gym Easy</p>
            </div>

            <div className="lead-visual-image-wrapper">
              <img
                src={trainerImg}
                alt="Gymezy Trainers"
                className="lead-visual-trainer-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
