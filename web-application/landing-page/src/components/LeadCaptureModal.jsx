import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import trainerImg from '../assets/trainer.png';
import gymezyLogo from '../assets/logo/gymezy.png';
import './LeadCaptureModal.css';

// Dedicated Google Apps Script Web App URLs
const GOOGLE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_SHEET_WEBAPP_URL ||
  'https://script.google.com/macros/s/AKfycbwRuYiEoxBfDcERbsg5IxbGZpKZH_ho9zwq8K-Csur6-RfgviGpi2Rg1WtkGY8IfxIpsA/exec';

const GOOGLE_USER_SCRIPT_URL =
  import.meta.env.VITE_USER_LAUNCH_GOOGLE_SHEET_WEBAPP_URL ||
  'https://script.google.com/macros/s/AKfycbzh4NVp8z_wKP1Mnk-mI1861kmoYboMQV36kQ4ArI6c_latldMzGzC-MUuY_blyISklaw/exec';

function triggerSuccessConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#00bf62', '#00df73', '#fed085', '#5b62b0', '#ffffff'],
      zIndex: 9999999
    });

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

// Validation Helper
function validateField(name, value) {
  const val = (value || '').toString().trim();

  switch (name) {
    // Owner fields
    case 'gymName':
      if (!val) return 'Gym / Center name is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      return '';

    case 'ownerName':
      if (!val) return 'Contact person name is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Please enter a valid full name';
      return '';

    case 'gymType':
      if (!val) return 'Please select a gym type';
      return '';

    case 'membersCount':
      if (!val) return 'Please select current member range';
      return '';

    case 'city':
      if (!val) return 'Please select a city';
      return '';

    case 'area':
      if (!val) return 'Area / Location is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      return '';

    // Trainer fields
    case 'trainerName':
      if (!val) return 'Trainer name is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Please enter a valid full name';
      return '';

    case 'specialization':
      if (!val) return 'Please select your specialization';
      return '';

    // Customer fields
    case 'name':
      if (!val) return 'Full name is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Please enter a valid name';
      return '';

    case 'place':
      if (!val) return 'City / Location is required';
      if (val.length < 2) return 'Must be at least 2 characters';
      return '';

    case 'experience':
      if (!val) return 'Please select your experience';
      return '';

    case 'age':
      if (!val) return 'Please select your age group';
      return '';

    // Common fields
    case 'mobile': {
      const digits = val.replace(/\D/g, '');
      if (!digits) return 'Mobile number is required';
      if (!/^[6-9]/.test(digits)) return 'Must start with 6, 7, 8, or 9';
      if (digits.length !== 10) return `Enter 10 digits (${digits.length}/10 entered)`;
      return '';
    }

    case 'email':
      if (!val) return 'Email address is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return 'Enter a valid email address';
      return '';

    default:
      return '';
  }
}

export default function LeadCaptureModal({
  isOpen = false,
  onClose,
  initialCategory = 'Gym Owner / Business Owner',
  defaultPlan = ''
}) {
  const [category, setCategory] = useState(initialCategory || 'Gym Owner / Business Owner');

  // Gym Owner Form Data
  const [ownerData, setOwnerData] = useState({
    gymName: '',
    ownerName: '',
    mobile: '',
    email: '',
    city: 'Chennai',
    area: '',
    gymType: '',
    membersCount: '250 - 500',
    notes: ''
  });

  // Trainer Form Data
  const [trainerData, setTrainerData] = useState({
    trainerName: '',
    mobile: '',
    email: '',
    city: 'Chennai',
    area: '',
    specialization: 'Personal Training & Bodybuilding',
    experience: '3 - 5 years',
    notes: ''
  });

  // Customer Form Data
  const [customerData, setCustomerData] = useState({
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

  const isCustomer = category === 'Customer';
  const isTrainer = category === 'Trainer';
  const isOwner = !isCustomer && !isTrainer;

  const currentFormData = isCustomer ? customerData : isTrainer ? trainerData : ownerData;

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
      if (initialCategory === 'Gym Owner / Trainer') {
        setCategory('Gym Owner / Business Owner');
      } else {
        setCategory(initialCategory);
      }
    }
  }, [initialCategory]);

  // Handle ESC key to close and lock body scrolling
  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading]);

  if (!isOpen) return null;

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setTouched({});
    setErrors({});
    setErrorMsg('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedVal = value;

    if (name === 'mobile') {
      formattedVal = value.replace(/\D/g, '').slice(0, 10);
    }

    if (isCustomer) {
      setCustomerData((prev) => ({ ...prev, [name]: formattedVal }));
    } else if (isTrainer) {
      setTrainerData((prev) => ({ ...prev, [name]: formattedVal }));
    } else {
      setOwnerData((prev) => ({ ...prev, [name]: formattedVal }));
    }

    if (touched[name]) {
      const fieldError = validateField(name, formattedVal);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = isCustomer
      ? ['name', 'mobile', 'email', 'place', 'experience', 'age']
      : isTrainer
      ? ['trainerName', 'mobile', 'email', 'city', 'area', 'specialization']
      : ['gymName', 'ownerName', 'mobile', 'email', 'city', 'area', 'gymType', 'membersCount'];

    const newErrors = {};
    const newTouched = {};
    let hasError = false;

    fieldsToValidate.forEach((f) => {
      newTouched[f] = true;
      const err = validateField(f, currentFormData[f]);
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

    let payload;
    let targetUrl;

    if (isCustomer) {
      payload = {
        timestamp: new Date().toISOString(),
        type: 'Customer Launch Offer Registration',
        category: 'Customer',
        name: customerData.name.trim(),
        mobile: `' +91 ${customerData.mobile.trim()}`,
        phoneDigits: customerData.mobile.trim(),
        email: customerData.email.trim(),
        place: customerData.place.trim(),
        experience: customerData.experience,
        age: customerData.age,
        goal: customerData.goal,
        pageUrl: window.location.href
      };
      targetUrl = GOOGLE_USER_SCRIPT_URL;
    } else if (isTrainer) {
      payload = {
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        category: 'Trainer',
        plan: defaultPlan || 'Trainer Network',
        trainerName: trainerData.trainerName.trim(),
        mobile: `' +91 ${trainerData.mobile.trim()}`,
        email: trainerData.email.trim(),
        city: trainerData.city,
        area: trainerData.area.trim(),
        specialization: trainerData.specialization,
        experience: trainerData.experience,
        notes: trainerData.notes.trim(),
        pageUrl: window.location.href
      };
      targetUrl = GOOGLE_SCRIPT_URL;
    } else {
      payload = {
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        category: 'Gym Owner / Business Owner',
        plan: defaultPlan || 'Partner Network',
        gymName: ownerData.gymName.trim(),
        ownerName: ownerData.ownerName.trim(),
        mobile: `' +91 ${ownerData.mobile.trim()}`,
        email: ownerData.email.trim(),
        city: ownerData.city,
        area: ownerData.area.trim(),
        gymType: ownerData.gymType,
        membersCount: ownerData.membersCount,
        notes: ownerData.notes.trim(),
        pageUrl: window.location.href
      };
      targetUrl = GOOGLE_SCRIPT_URL;
    }

    try {
      if (targetUrl) {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitted(true);
      setLoading(false);
      triggerSuccessConfetti();
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true);
      setLoading(false);
      triggerSuccessConfetti();
    }
  };

  const getFieldStatusClass = (fieldName) => {
    if (!touched[fieldName]) return '';
    if (errors[fieldName]) return 'has-error';
    if (currentFormData[fieldName]) return 'is-valid';
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
                  <h3 className="lead-modal-title">
                    {isCustomer
                      ? 'Register for Launch Offers'
                      : isTrainer
                      ? 'Join GYMEZY Coach Network'
                      : 'Partner with GYMEZY'}
                  </h3>
                  <p className="lead-modal-subtitle">
                    {isCustomer
                      ? 'Be the first to get exclusive daily pass discounts and early member perks.'
                      : isTrainer
                      ? 'Connect with clients, manage coaching slots, and expand your fitness brand.'
                      : 'Fill in your details below and our partnership team will get in touch with you.'}
                  </p>
                </div>

                {errorMsg && <div className="lead-modal-error">{errorMsg}</div>}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="lead-modal-form" noValidate>
                  {/* Row 0: Role Selection Dropdown (3 options) */}
                  <div className="lead-form-row">
                    <div className="lead-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                      <label className="lead-label">I am a <span className="lead-required-star">*</span></label>
                      <select
                        name="category"
                        className="lead-select"
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="Gym Owner / Business Owner">Gym Owner / Business Owner</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Customer">Customer</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Form Fields Based on Role */}
                  {isCustomer ? (
                    /* ================= CUSTOMER FORM FIELDS ================= */
                    <>
                      {/* Row 1: Full Name + Mobile */}
                      <div className="lead-form-row">
                        <div className={`lead-form-group ${getFieldStatusClass('name')}`}>
                          <label className="lead-label">Full Name <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap">
                            <input
                              type="text"
                              name="name"
                              className="lead-input"
                              value={customerData.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.name && !errors.name && customerData.name && (
                              <span className="lead-valid-check">✓</span>
                            )}
                          </div>
                          {touched.name && errors.name && (
                            <span className="lead-error-text">{errors.name}</span>
                          )}
                        </div>

                        <div className={`lead-form-group ${getFieldStatusClass('mobile')}`}>
                          <label className="lead-label">Mobile Number <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap lead-phone-input-wrap">
                            <span className="lead-phone-prefix">+91</span>
                            <input
                              type="tel"
                              name="mobile"
                              className="lead-input lead-phone-input"
                              value={customerData.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              maxLength={10}
                              required
                            />
                            {touched.mobile && !errors.mobile && customerData.mobile.length === 10 && (
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
                          <label className="lead-label">Email Address <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap">
                            <input
                              type="email"
                              name="email"
                              className="lead-input"
                              value={customerData.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.email && !errors.email && customerData.email && (
                              <span className="lead-valid-check">✓</span>
                            )}
                          </div>
                          {touched.email && errors.email && (
                            <span className="lead-error-text">{errors.email}</span>
                          )}
                        </div>

                        <div className={`lead-form-group ${getFieldStatusClass('place')}`}>
                          <label className="lead-label">City / Place <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap">
                            <input
                              type="text"
                              name="place"
                              className="lead-input"
                              value={customerData.place}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.place && !errors.place && customerData.place && (
                              <span className="lead-valid-check">✓</span>
                            )}
                          </div>
                          {touched.place && errors.place && (
                            <span className="lead-error-text">{errors.place}</span>
                          )}
                        </div>
                      </div>

                      {/* Row 3: Experience + Age */}
                      <div className="lead-form-row">
                        <div className={`lead-form-group ${getFieldStatusClass('experience')}`}>
                          <label className="lead-label">Fitness Experience <span className="lead-required-star">*</span></label>
                          <select
                            name="experience"
                            className="lead-select"
                            value={customerData.experience}
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
                          <label className="lead-label">Age Group <span className="lead-required-star">*</span></label>
                          <select
                            name="age"
                            className="lead-select"
                            value={customerData.age}
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
                        <label className="lead-label">Primary Fitness Goal <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>(optional)</span></label>
                        <select
                          name="goal"
                          className="lead-select"
                          value={customerData.goal}
                          onChange={handleChange}
                        >
                          <option value="Weight Loss & Toning">Weight Loss &amp; Body Toning</option>
                          <option value="Muscle Building & Strength">Muscle Building &amp; Strength</option>
                          <option value="General Fitness & Stamina">General Fitness &amp; Stamina</option>
                          <option value="Flexible Multi-Gym Access">Flexible Multi-Gym Daily Access</option>
                          <option value="Personal Coaching Guidance">1-on-1 Personal Coaching Guidance</option>
                        </select>
                      </div>
                    </>
                  ) : isTrainer ? (
                    /* ================= TRAINER FORM FIELDS ================= */
                    <>
                      {/* Row 1: Trainer Full Name + Mobile */}
                      <div className="lead-form-row">
                        <div className={`lead-form-group ${getFieldStatusClass('trainerName')}`}>
                          <label className="lead-label">Full Name <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap">
                            <input
                              type="text"
                              name="trainerName"
                              className="lead-input"
                              value={trainerData.trainerName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.trainerName && !errors.trainerName && trainerData.trainerName && (
                              <span className="lead-valid-check">✓</span>
                            )}
                          </div>
                          {touched.trainerName && errors.trainerName && (
                            <span className="lead-error-text">{errors.trainerName}</span>
                          )}
                        </div>

                        <div className={`lead-form-group ${getFieldStatusClass('mobile')}`}>
                          <label className="lead-label">Mobile Number <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap lead-phone-input-wrap">
                            <span className="lead-phone-prefix">+91</span>
                            <input
                              type="tel"
                              name="mobile"
                              className="lead-input lead-phone-input"
                              value={trainerData.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              maxLength={10}
                              required
                            />
                            {touched.mobile && !errors.mobile && trainerData.mobile.length === 10 && (
                              <span className="lead-valid-check">✓</span>
                            )}
                          </div>
                          {touched.mobile && errors.mobile && (
                            <span className="lead-error-text">{errors.mobile}</span>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Email + City */}
                      <div className="lead-form-row">
                        <div className={`lead-form-group ${getFieldStatusClass('email')}`}>
                          <label className="lead-label">Email Address <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap">
                            <input
                              type="email"
                              name="email"
                              className="lead-input"
                              value={trainerData.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.email && !errors.email && trainerData.email && (
                              <span className="lead-valid-check">✓</span>
                            )}
                          </div>
                          {touched.email && errors.email && (
                            <span className="lead-error-text">{errors.email}</span>
                          )}
                        </div>

                        <div className={`lead-form-group ${getFieldStatusClass('city')}`}>
                          <label className="lead-label">City <span className="lead-required-star">*</span></label>
                          <select
                            name="city"
                            className="lead-select"
                            value={trainerData.city}
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
                      </div>

                      {/* Row 3: Area / Location + Specialization */}
                      <div className="lead-form-row">
                        <div className={`lead-form-group ${getFieldStatusClass('area')}`}>
                          <label className="lead-label">Area / Location <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap">
                            <input
                              type="text"
                              name="area"
                              className="lead-input"
                              value={trainerData.area}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.area && !errors.area && trainerData.area && (
                              <span className="lead-valid-check">✓</span>
                            )}
                          </div>
                          {touched.area && errors.area && (
                            <span className="lead-error-text">{errors.area}</span>
                          )}
                        </div>

                        <div className={`lead-form-group ${getFieldStatusClass('specialization')}`}>
                          <label className="lead-label">Specialization <span className="lead-required-star">*</span></label>
                          <select
                            name="specialization"
                            className="lead-select"
                            value={trainerData.specialization}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                          >
                            <option value="Personal Training & Bodybuilding">Personal Training &amp; Bodybuilding</option>
                            <option value="Strength & Conditioning">Strength &amp; Conditioning</option>
                            <option value="CrossFit & Functional Training">CrossFit &amp; Functional Training</option>
                            <option value="Yoga & Pilates">Yoga &amp; Pilates</option>
                            <option value="Zumba & Group Fitness">Zumba &amp; Group Fitness</option>
                            <option value="Weight Loss & Nutrition">Weight Loss &amp; Nutrition</option>
                          </select>
                          {touched.specialization && errors.specialization && (
                            <span className="lead-error-text">{errors.specialization}</span>
                          )}
                        </div>
                      </div>

                      {/* Row 4: Experience */}
                      <div className="lead-form-group full-width">
                        <label className="lead-label">Coaching Experience <span className="lead-required-star">*</span></label>
                        <select
                          name="experience"
                          className="lead-select"
                          value={trainerData.experience}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="1 - 2 years">1 - 2 years</option>
                          <option value="3 - 5 years">3 - 5 years</option>
                          <option value="5+ years">5+ years</option>
                          <option value="Freelance / Independent Trainer">Freelance / Independent Trainer</option>
                        </select>
                      </div>

                      {/* Row 5: Notes */}
                      <div className="lead-form-group full-width">
                        <label className="lead-label">Tell us about your coaching <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>(optional)</span></label>
                        <textarea
                          name="notes"
                          className="lead-textarea"
                          rows="3"
                          style={{ resize: 'none' }}
                          value={trainerData.notes}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  ) : (
                    /* ================= GYM OWNER / BUSINESS OWNER FORM FIELDS ================= */
                    <>
                      {/* Row 1: Gym Name + Owner Name */}
                      <div className="lead-form-row">
                        <div className={`lead-form-group ${getFieldStatusClass('gymName')}`}>
                          <label className="lead-label">Gym / Fitness Center Name <span className="lead-required-star">*</span></label>
                          <div className="lead-input-wrap">
                            <input
                              type="text"
                              name="gymName"
                              className="lead-input"
                              value={ownerData.gymName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.gymName && !errors.gymName && ownerData.gymName && (
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
                              value={ownerData.ownerName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.ownerName && !errors.ownerName && ownerData.ownerName && (
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
                              value={ownerData.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              maxLength={10}
                              required
                            />
                            {touched.mobile && !errors.mobile && ownerData.mobile.length === 10 && (
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
                              value={ownerData.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.email && !errors.email && ownerData.email && (
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
                            value={ownerData.city}
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
                              value={ownerData.area}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                            />
                            {touched.area && !errors.area && ownerData.area && (
                              <span className="lead-valid-check">✓</span>
                            )}
                          </div>
                          {touched.area && errors.area && (
                            <span className="lead-error-text">{errors.area}</span>
                          )}
                        </div>
                      </div>

                      {/* Row 4: Gym Type + Current Members (Approx.) */}
                      <div className="lead-form-row">
                        <div className={`lead-form-group ${getFieldStatusClass('gymType')}`}>
                          <label className="lead-label">Gym Type <span className="lead-required-star">*</span></label>
                          <select
                            name="gymType"
                            className="lead-select"
                            value={ownerData.gymType}
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
                            value={ownerData.membersCount}
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
                          value={ownerData.notes}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

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
                        <span>{isCustomer ? 'Get Offer on Launch' : 'Submit Request'}</span>
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
                {isCustomer ? (
                  <>
                    <div className="user-success-badge" style={{ color: '#00bf62', fontWeight: 800, fontSize: '11.5px', marginBottom: '8px' }}>
                      VIP PASS RESERVED
                    </div>
                    <h3 className="lead-success-title">You're on the VIP Launch List!</h3>
                    <p className="lead-success-desc">
                      Thank you, <strong>{customerData.name || 'Fitness Enthusiast'}</strong>! We have reserved your{' '}
                      <strong>Launch Special Discount Offer</strong>.
                      <br /><br />
                      As soon as GYMEZY goes live in <strong>{customerData.place}</strong>, we will send your exclusive launch voucher directly to{' '}
                      <strong>+91 {customerData.mobile}</strong> and <strong>{customerData.email}</strong>.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="lead-success-title">Request Received!</h3>
                    <p className="lead-success-desc">
                      Thank you, <strong>{isTrainer ? (trainerData.trainerName || 'Coach') : (ownerData.ownerName || 'Partner')}</strong>! We have registered your{' '}
                      <strong>Partnership Request</strong> for{' '}
                      <strong>{isTrainer ? 'Certified Coach Network' : (ownerData.gymName || 'your center')}</strong>.
                      <br /><br />
                      Our onboarding team will connect with you on <strong>+91 {isTrainer ? trainerData.mobile : ownerData.mobile}</strong> shortly.
                    </p>
                  </>
                )}
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
