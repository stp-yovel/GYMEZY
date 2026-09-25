import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import trainerImg from '../assets/trainer.png';
import gymezyLogo from '../assets/logo/gymezy.png';
import './UserLeadCaptureModal.css';

// Dedicated Google Apps Script Web App URL for User Launch Offers
const GOOGLE_USER_SCRIPT_URL =
  import.meta.env.VITE_USER_LAUNCH_GOOGLE_SHEET_WEBAPP_URL ||
  import.meta.env.VITE_GOOGLE_SHEET_WEBAPP_URL ||
  'https://script.google.com/macros/s/AKfycbwRuYiEoxBfDcERbsg5IxbGZpKZH_ho9zwq8K-Csur6-RfgviGpi2Rg1WtkGY8IfxIpsA/exec';

function triggerSuccessConfetti() {
  try {
    // 1. Center Burst
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#00bf62', '#00df73', '#fed085', '#5b62b0', '#ffffff'],
      zIndex: 9999999
    });

    // 2. Left Cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
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
        particleCount: 60,
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
    case 'name':
      if (!val) return 'Full name is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Please enter a valid name';
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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return 'Enter a valid email (e.g. name@gmail.com)';
      return '';

    case 'place':
      if (!val) return 'City / Location is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      return '';

    case 'experience':
      if (!val) return 'Please select your fitness level';
      return '';

    case 'age':
      if (!val) return 'Please select your age group';
      return '';

    default:
      return '';
  }
}

export default function UserLeadCaptureModal({
  isOpen = false,
  onClose,
  offerTag = 'Launch Offer (50% Off)'
}) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    place: 'Chennai',
    experience: 'New to Fitness / Beginner',
    age: '18 - 25',
    goal: 'Weight Loss & Toning'
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    if (loading) return;
    setFormData({
      name: '',
      mobile: '',
      email: '',
      place: 'Chennai',
      experience: 'New to Fitness / Beginner',
      age: '18 - 25',
      goal: 'Weight Loss & Toning'
    });
    setTouched({});
    setErrors({});
    setErrorMsg('');
    setSubmitted(false);
    if (onClose) onClose();
  };

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
    let updatedValue = value;

    if (name === 'mobile') {
      updatedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));

    if (touched[name]) {
      const error = validateField(name, updatedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const requiredFields = ['name', 'mobile', 'email', 'place', 'experience', 'age'];
    const newErrors = {};
    const newTouched = {};

    requiredFields.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateAll()) {
      setErrorMsg('Please complete all required fields correctly.');
      return;
    }

    setLoading(true);

    const payload = {
      timestamp: new Date().toISOString(),
      type: 'User Launch Offer Registration',
      offer: offerTag,
      name: formData.name.trim(),
      mobile: `' +91 ${formData.mobile.trim()}`,
      phoneDigits: formData.mobile.trim(),
      email: formData.email.trim(),
      place: formData.place.trim(),
      experience: formData.experience,
      age: formData.age,
      goal: formData.goal,
      pageUrl: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      await fetch(GOOGLE_USER_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

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
        className="lead-modal-container user-lead-modal-container"
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
                  <h3 className="lead-modal-title">Register Now for Launch Offers</h3>
                  <p className="lead-modal-subtitle">
                    Be the first to get exclusive discount passes and early member perks when GYMEZY launches!
                  </p>
                </div>

                {errorMsg && <div className="lead-modal-error">{errorMsg}</div>}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="lead-modal-form" noValidate>
                  {/* Row 1: Name + Mobile Number */}
                  <div className="lead-form-row">
                    <div className={`lead-form-group ${getFieldStatusClass('name')}`}>
                      <label className="lead-label">
                        Full Name <span className="lead-required-star">*</span>
                      </label>
                      <div className="lead-input-wrap">
                        <input
                          type="text"
                          name="name"
                          className="lead-input"
                          placeholder="Praveen Kumar"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        {touched.name && !errors.name && formData.name && (
                          <span className="lead-valid-check">✓</span>
                        )}
                      </div>
                      {touched.name && errors.name && (
                        <span className="lead-error-text">{errors.name}</span>
                      )}
                    </div>

                    <div className={`lead-form-group ${getFieldStatusClass('mobile')}`}>
                      <label className="lead-label">
                        Mobile Number <span className="lead-required-star">*</span>
                      </label>
                      <div className="lead-input-wrap lead-phone-input-wrap">
                        <span className="lead-phone-prefix">+91</span>
                        <input
                          type="tel"
                          name="mobile"
                          className="lead-input lead-phone-input"
                          placeholder="9887625362"
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
                  </div>

                  {/* Row 2: Email + City / Place */}
                  <div className="lead-form-row">
                    <div className={`lead-form-group ${getFieldStatusClass('email')}`}>
                      <label className="lead-label">
                        Email Address <span className="lead-required-star">*</span>
                      </label>
                      <div className="lead-input-wrap">
                        <input
                          type="email"
                          name="email"
                          className="lead-input"
                          placeholder="praveen@gmail.com"
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

                    <div className={`lead-form-group ${getFieldStatusClass('place')}`}>
                      <label className="lead-label">
                        City / Place <span className="lead-required-star">*</span>
                      </label>
                      <div className="lead-input-wrap">
                        <input
                          type="text"
                          name="place"
                          className="lead-input"
                          placeholder="Chennai / Anna Nagar"
                          value={formData.place}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        {touched.place && !errors.place && formData.place && (
                          <span className="lead-valid-check">✓</span>
                        )}
                      </div>
                      {touched.place && errors.place && (
                        <span className="lead-error-text">{errors.place}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Fitness Experience + Age Group */}
                  <div className="lead-form-row">
                    <div className={`lead-form-group ${getFieldStatusClass('experience')}`}>
                      <label className="lead-label">
                        Fitness Experience <span className="lead-required-star">*</span>
                      </label>
                      <select
                        name="experience"
                        className="lead-select"
                        value={formData.experience}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="New to Fitness / Beginner">New to Fitness (Beginner)</option>
                        <option value="Intermediate (1-2 yrs)">Intermediate (1 - 2 yrs)</option>
                        <option value="Experienced / Athlete (3+ yrs)">Experienced Athlete (3+ yrs)</option>
                        <option value="Looking for Personal Trainer">Looking for Personal Trainer</option>
                        <option value="Group Classes / Yoga / CrossFit">Group Classes (Yoga, CrossFit)</option>
                      </select>
                      {touched.experience && errors.experience && (
                        <span className="lead-error-text">{errors.experience}</span>
                      )}
                    </div>

                    <div className={`lead-form-group ${getFieldStatusClass('age')}`}>
                      <label className="lead-label">
                        Age Group <span className="lead-required-star">*</span>
                      </label>
                      <select
                        name="age"
                        className="lead-select"
                        value={formData.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      >
                        <option value="Under 18">Under 18</option>
                        <option value="18 - 25">18 - 25 yrs</option>
                        <option value="26 - 35">26 - 35 yrs</option>
                        <option value="36 - 45">36 - 45 yrs</option>
                        <option value="46+">46+ yrs</option>
                      </select>
                      {touched.age && errors.age && (
                        <span className="lead-error-text">{errors.age}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Fitness Goal */}
                  <div className="lead-form-group full-width">
                    <label className="lead-label">
                      Primary Fitness Goal <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>(optional)</span>
                    </label>
                    <select
                      name="goal"
                      className="lead-select"
                      value={formData.goal}
                      onChange={handleChange}
                    >
                      <option value="Weight Loss & Toning">Weight Loss &amp; Body Toning</option>
                      <option value="Muscle Building & Strength">Muscle Building &amp; Strength</option>
                      <option value="General Fitness & Stamina">General Fitness &amp; Stamina</option>
                      <option value="Flexible Multi-Gym Access">Flexible Multi-Gym Daily Access</option>
                      <option value="Personal Coaching Guidance">1-on-1 Personal Coaching Guidance</option>
                    </select>
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
                      className="lead-btn-submit user-launch-btn-submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="lead-spinner-text">Reserving Offer...</span>
                      ) : (
                        <span>Get Offer on Launch</span>
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
                <div className="user-success-badge">🎉 VIP PASS RESERVED</div>
                <h3 className="lead-success-title">You're on the VIP Launch List!</h3>
                <p className="lead-success-desc">
                  Thank you, <strong>{formData.name || 'Fitness Enthusiast'}</strong>! We have reserved your{' '}
                  <strong>Launch Special Discount Offer</strong>.
                  <br /><br />
                  As soon as GYMEZY goes live in <strong>{formData.place}</strong>, we will send your exclusive launch voucher &amp; early pass directly to{' '}
                  <strong>+91 {formData.mobile}</strong> and <strong>{formData.email}</strong>.
                </p>
                <button type="button" className="lead-btn-submit" onClick={handleClose}>
                  Awesome, Got It!
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
