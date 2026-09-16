import React, { useState, useEffect } from 'react';
import { FloatButton, ConfigProvider } from 'antd';
import './LandingPage.css';
import heroBgImg from '../../assets/fitnova_hero_bg.jpg';
import gymModelThumb from '../../assets/gym_model.jpg';
import gymezyLogo from '../../assets/logo/gymezy.png';
import phoneMockupImg from '../../assets/gymezy_phone_mockup.jpg';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeService, setActiveService] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 40);
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
        setScrollPercent(percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: 0,
      num: '01',
      title: 'Pay-Per-Session Drop-in Passes',
      desc: 'Work out anytime without monthly lock-ins. Book a single-day gym pass with instant 24-hour digital access.'
    },
    {
      id: 1,
      num: '02',
      title: 'Flexible Multi-Duration Memberships',
      desc: 'Choose from 1, 3, 6, or 12-month memberships with multi-gym flexibility and maximum savings on long-term plans.'
    },
    {
      id: 2,
      num: '03',
      title: 'Certified 1-on-1 Personal Coaching',
      desc: 'Connect with verified trainers for strength, weight loss, HIIT, and bodybuilding with transparent schedules and ratings.',
      featured: true
    },
    {
      id: 3,
      num: '04',
      title: 'Specialized Studio Classes',
      desc: 'Reserve morning and evening slots for Hatha Yoga, Zumba Fitness, HIIT, CrossFit, and MMA boxing classes.'
    },
    {
      id: 4,
      num: '05',
      title: 'Contactless QR & OTP Entry',
      desc: 'Show your dynamic pass code at the gym reception for instant, queue-free front-desk check-in.'
    },
    {
      id: 5,
      num: '06',
      title: 'Verified Facilities & Amenities',
      desc: 'Filter by air-conditioned floors, locker facilities, hot showers, parking, free Wi-Fi, and certified sanitized equipment.'
    }
  ];

  const galleryItems = [
    {
      id: 1,
      num: '01',
      title: 'Universal Drop-in Passes',
      tag: 'Flexible Access',
      desc: 'Pay only for the sessions you use. Full gym floor & equipment access with instant OTP entry.',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 2,
      num: '02',
      title: 'Certified Personal Trainers',
      tag: '1-on-1 Coaching',
      desc: 'Book certified coaches for strength, weight loss, HIIT, and customized nutrition guidance.',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      num: '03',
      title: 'Group Classes & Studios',
      tag: 'Yoga, Zumba & HIIT',
      desc: 'Join high-energy group fitness classes led by certified studio instructors.',
      img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const gymOwnerFeatures = [
    {
      id: 'go-1',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: 'Monetize Off-Peak Capacity',
      desc: 'Turn vacant workout slots and idle equipment into steady, recurring income with drop-in pass buyers and multi-gym athletes.'
    },
    {
      id: 'go-2',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      title: '1-Tap QR & OTP Scanner',
      desc: 'Seamless front-desk verification. Scan member passes in under a second with zero paperwork or physical logbooks.'
    },
    {
      id: 'go-3',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Trainer & Class Timetable',
      desc: 'Manage your in-house trainer roster, assign group class capacities (Yoga, Zumba, HIIT), and track live member attendance.'
    },
    {
      id: 'go-4',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: 'Automated Payouts & Telemetry',
      desc: 'Real-time footfall analytics, daily settlement reports, and automated direct bank deposits with 100% financial transparency.'
    }
  ];

  const trainerFeatures = [
    {
      id: 'tr-1',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
      title: 'Direct Client Acquisition',
      desc: 'Get discovered by thousands of active gym members seeking 1-on-1 coaching for weight loss, strength, bodybuilding, or yoga.'
    },
    {
      id: 'tr-2',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: 'Flexible Schedule & Custom Rates',
      desc: 'Set your available morning and evening slots, define your personal training fees, and manage sessions seamlessly on your phone.'
    },
    {
      id: 'tr-3',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: 'Verified Reviews & Credibility',
      desc: 'Build your professional fitness brand with verified client testimonials, star ratings, and showcased specialty achievements.'
    }
  ];

  const pricingPlans = [
    {
      id: 'dropin',
      name: 'Single Drop-in Pass',
      price: 'Affordable Drop-in',
      period: 'per session',
      desc: 'Ideal for travelers, newcomers, and athletes wanting complete flexibility without recurring commitments.',
      features: [
        'Full gym floor & equipment access',
        'Valid for 24 hours from purchase',
        'Locker & shower facilities included',
        'Instant digital OTP pass check-in',
        'Zero registration or hidden fees'
      ],
      popular: false,
      ctaText: 'Book Drop-in Pass'
    },
    {
      id: 'monthly',
      name: 'Monthly Unlimited Pass',
      price: 'Affordable Monthly',
      period: 'per month',
      desc: 'Our most popular plan for regular gym-goers wanting unlimited access with high flexibility.',
      features: [
        '30 days unlimited gym access',
        'All equipment & floor facilities',
        'Complimentary fitness & BMI evaluation',
        'Special discount on group class bookings',
        'Instant mobile app pass sync'
      ],
      popular: true,
      ctaText: 'Get Monthly Pass'
    },
    {
      id: 'annual',
      name: 'Annual VIP Passport',
      price: 'Maximum Value',
      period: 'annual access',
      desc: 'Comprehensive year-round fitness package with personal training add-on and maximum long-term savings.',
      features: [
        '365 days unlimited gym access',
        '1-on-1 Personal trainer sessions included',
        'Priority booking for peak-hour class slots',
        'Custom nutrition & workout guide',
        '4 Complimentary guest day passes'
      ],
      popular: false,
      ctaText: 'Get Annual VIP'
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00BF62',
          borderRadius: 16,
        },
      }}
    >
      <div className="gym-site-wrapper">
        {/* =================================================================
            1. HERO SECTION WITH FULL-BLEED RUNNER BACKGROUND
            ================================================================= */}
        <section className="fitnova-hero-section" id="home">
          {/* Full-bleed Background Image */}
          <div className="fitnova-hero-bg-layer">
            <img src={heroBgImg} alt="Athletic runner in modern gym" className="fitnova-hero-bg-image" />
            <div className="fitnova-hero-gradient-overlay" />
          </div>

          {/* Top Navbar */}
          <header className={`fitnova-navbar ${isScrolled ? 'fitnova-navbar-scrolled' : ''}`}>
            <div className="fitnova-nav-container">
              <div className="fitnova-nav-left">
                <a href="#home" className="fitnova-logo">
                  <img src={gymezyLogo} alt="GYMEZY Logo" className="fitnova-logo-img white-filter" />
                  <span className="fitnova-logo-text">GYMEZY</span>
                </a>
              </div>
              {/* Navigation Links */}
              <nav className="fitnova-nav-links">
                <a href="#home" className="fitnova-nav-link active">Home</a>
                <a href="#about" className="fitnova-nav-link">About Us</a>
                <a href="#services" className="fitnova-nav-link">Services</a>
                <a href="#gym-owners" className="fitnova-nav-link">For Gym Owners</a>
                <a href="#trainers" className="fitnova-nav-link">For Trainers</a>
                <a href="#app" className="fitnova-nav-link">Mobile App</a>
                <a href="#pricing" className="fitnova-nav-link">Plans</a>
              </nav>

              {/* CTA Button */}
              <div className="fitnova-nav-cta">
                <a href="#pricing" className="fitnova-primary-btn">
                  EXPLORE PASSES
                </a>
              </div>
            </div>
          </header>

          {/* Hero Content Area */}
          <div className="fitnova-hero-body">
            {/* Top-Left Client Satisfaction Pill */}
            <div className="fitnova-client-badge-wrapper">
              <div className="fitnova-client-top-pill">
                <span className="fitnova-orange-circle-dot" />
                <span className="fitnova-client-text">25,000+ WORKOUTS BOOKED ACROSS TOP GYMS</span>
              </div>
              <div className="fitnova-avatars-bottom-tab">
                <span className="client-avatar a1" />
                <span className="client-avatar a2" />
                <span className="client-avatar a3" />
                <span className="client-avatar a4" />
                <span className="client-avatar a5" />
              </div>
            </div>

            {/* Bottom Left Main Headline & Subtitle */}
            <div className="fitnova-hero-bottom-left">
              <h1 className="fitnova-hero-title">
                Unlock the <span className="fitnova-serif-italic">best gyms,</span>
                <br />
                <span className="fitnova-serif-italic">train</span> without limits
              </h1>

              <p className="fitnova-hero-subtext">
                Discover top-rated fitness centers near you, book flexible daily drop-in passes or multi-gym memberships, and train with certified coaches. No lock-in contracts.
              </p>

              <div className="fitnova-hero-cta-row">
                <a href="#pricing" className="fitnova-primary-btn lg-btn">
                  FIND A GYM NEAR YOU
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            2. PHILOSOPHY / ABOUT SECTION
            ================================================================= */}
        <section className="philosophy-section" id="about">
          <div className="section-container">
            <div className="philosophy-header-row">
              <h2 className="philosophy-title">
                At GYMEZY, we believe
                <br />
                <span className="title-italic-accent">fitness</span> should be flexible and accessible
              </h2>
              <div className="philosophy-header-controls">
                <div className="carousel-nav-arrows">
                  <button
                    type="button"
                    className={`carousel-arrow-btn ${activeSlide === 0 ? 'inactive' : 'active'}`}
                    onClick={() => setActiveSlide(prev => (prev > 0 ? prev - 1 : galleryItems.length - 1))}
                    aria-label="Previous class"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="carousel-arrow-btn active"
                    onClick={() => setActiveSlide(prev => (prev < galleryItems.length - 1 ? prev + 1 : 0))}
                    aria-label="Next class"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Asymmetric Gallery Grid matching the template */}
            <div className="philosophy-asymmetric-grid">
              {/* Featured Left Tall Card (Card 1) */}
              <div className="asymmetric-card-featured">
                <img
                  src={galleryItems[0].img}
                  alt={galleryItems[0].title}
                  className="asymmetric-card-img"
                />
                <div className="floating-card-pill-overlay">
                  <span className="pill-card-title">{galleryItems[0].title}</span>
                  <a href="#services" className="pill-view-now-btn">
                    Explore
                  </a>
                </div>
              </div>

              {/* Right Column: 2 Cards + Mission Statement */}
              <div className="asymmetric-right-column">
                <div className="asymmetric-right-cards-row">
                  {/* Card 2 */}
                  <div className="asymmetric-card-sm">
                    <img
                      src={galleryItems[1].img}
                      alt={galleryItems[1].title}
                      className="asymmetric-card-img"
                    />
                    <div className="floating-card-pill-overlay sm-pill">
                      <span className="pill-card-title">{galleryItems[1].title}</span>
                      <a href="#trainers" className="pill-view-now-btn">
                        Explore
                      </a>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="asymmetric-card-sm">
                    <img
                      src={galleryItems[2].img}
                      alt={galleryItems[2].title}
                      className="asymmetric-card-img"
                    />
                    <div className="floating-card-pill-overlay sm-pill">
                      <span className="pill-card-title">{galleryItems[2].title}</span>
                      <a href="#services" className="pill-view-now-btn">
                        Explore
                      </a>
                    </div>
                  </div>
                </div>

                {/* Mission Text Below Cards 2 & 3 */}
                <div className="philosophy-mission-block">
                  <p className="philosophy-mission-text">
                    Our mission is to eliminate fitness barriers by connecting you with top gym facilities, certified coaches, and flexible passes across your city
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            3. SERVICES SECTION (GYMEZY FEATURES)
            ================================================================= */}
        <section className="services-section" id="services">
          <div className="section-container">
            <div className="section-centered-header">
              <span className="section-category-pill">Our Core Services</span>
              <h2 className="section-heading-lg">
                Complete Fitness <span className="title-italic-accent">Flexibility</span> at Your Fingertips
              </h2>
              <p className="section-sub-desc">
                Everything you need to work out anywhere, book certified trainers, and access premier fitness centers with zero friction.
              </p>
            </div>

            <div className="services-grid-container">
              {services.map((srv) => {
                const isSelected = activeService === srv.id;
                return (
                  <div
                    key={srv.id}
                    className={`service-modern-card ${isSelected ? 'active-featured' : ''}`}
                    onClick={() => setActiveService(srv.id)}
                  >
                    <div className="service-card-top">
                      <span className="service-number">{srv.num}</span>
                      <div className="service-icon-indicator">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="service-card-title">{srv.title}</h3>
                    <p className="service-card-desc">{srv.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            4. TRACK YOUR HEALTH PROGRESS & PASS TELEMETRY
            ================================================================= */}
        <section className="progress-analytics-section" id="testimonials">
          <div className="section-container">
            <div className="analytics-split-layout">
              {/* Left Visual Column with Dumbbell Athlete and 2 Floating Cards */}
              <div className="analytics-visual-col">
                <div className="analytics-athlete-card">
                  <img
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80"
                    alt="Athlete lifting dumbbell overhead"
                    className="analytics-athlete-bg-img"
                  />

                  {/* Top-Left Brand Floating Card */}
                  <div className="telemetry-brand-pill-card">
                    <span className="telemetry-card-tag">Active Pass Status</span>
                    <div className="telemetry-big-stat-row">
                      <span className="telemetry-big-number">100<span className="percent-mark">%</span></span>
                      <span className="telemetry-sub-metric">Verified</span>
                    </div>
                  </div>

                  {/* Bottom-Left White Routine Card */}
                  <div className="telemetry-routine-card">
                    <h4 className="routine-card-title">My Next Session</h4>
                    <div className="routine-chips-row">
                      <span className="routine-chip chip-active">Drop-in Pass</span>
                      <span className="routine-chip">FitZone Gym</span>
                      <span className="routine-chip">Strength</span>
                    </div>
                    <div className="routine-progress-group">
                      <span className="routine-progress-label">Today @ 6:00 PM • Anna Nagar</span>
                      <div className="routine-progress-track">
                        <div className="routine-progress-fill" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Brand Feature Column */}
              <div className="analytics-brand-feature-card">
                <div className="feature-card-top-bar" />
                
                <div className="feature-card-main-content">
                  <h2 className="feature-brand-headline">
                    Track your pass &
                    <br />
                    workout progress
                  </h2>

                  <div className="feature-card-divider-group">
                    <div className="divider-line" />
                    <div className="divider-triangle-mark" />
                    <div className="divider-line" />
                  </div>

                  <p className="feature-brand-description">
                    Our digital pass management system helps you monitor active memberships, upcoming slot bookings, workout history, and personal trainer milestones in one place.
                  </p>
                </div>

                <a href="#pricing" className="feature-card-discover-btn">
                  EXPLORE PASSES
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            5. MOVE FOR HEALTHY BODY (MULTI-GYM NETWORK SHOWCASE)
            ================================================================= */}
        <section className="move-healthy-section" id="mission">
          <div className="section-container">
            <div className="move-healthy-layout">
              {/* Left Content Column */}
              <div className="move-healthy-left-col">
                <h2 className="move-healthy-title">
                  Move for <span className="title-serif-italic">healthy</span>
                  <br />
                  body
                </h2>
                <p className="move-healthy-desc">
                  Access strength gyms, functional CrossFit boxes, yoga studios, and cardio centers with a single unified pass.
                </p>
                <a href="#pricing" className="move-healthy-cta-btn">
                  START YOUR JOURNEY
                </a>
              </div>

              {/* Right Cards Showcase Layout */}
              <div className="move-healthy-cards-grid">
                {/* Main Featured Photo Card with ↗ icon & bottom caption */}
                <div className="move-card-main-featured">
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80"
                    alt="Athlete medicine ball workout"
                    className="move-card-bg-img"
                  />
                  <div className="move-card-overlay-gradient" />
                  
                  <a href="#services" className="move-card-top-arrow" aria-label="Explore program">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>

                  <div className="move-card-bottom-caption">
                    <h3 className="move-card-caption-title">
                      A brighter future starts
                      <br />
                      with the healthy life
                    </h3>
                  </div>
                </div>

                {/* Right Nested Column: Brand Color Box + Athlete Photo Card */}
                <div className="move-card-right-col">
                  {/* Brand Color Box */}
                  <div className="move-card-accent-box">
                    <h3 className="move-accent-box-text">
                      Designed for
                      <br />
                      every athlete
                    </h3>
                  </div>

                  {/* Bottom Athlete Photo Card */}
                  <div className="move-card-photo-box">
                    <img
                      src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
                      alt="Athlete battle rope training"
                      className="move-card-bg-img"
                    />
                    <div className="move-card-overlay-gradient sm-gradient" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            6. FULL-WIDTH SECTION: FOR GYM OWNERS & FACILITY MANAGERS
            ================================================================= */}
        <section className="gym-owner-fullwidth-section" id="gym-owners">
          <div className="section-container">
            <div className="section-centered-header">
              <span className="section-category-pill">For Gym Owners & Managers</span>
              <h2 className="section-heading-lg">
                Monetize Unused Gym Capacity, <span className="title-italic-accent">Automate</span> Operations
              </h2>
              <p className="section-sub-desc">
                Transform empty workout slots into recurring revenue. Get verified drop-in athletes, automated attendance logs, and instant settlements with zero upfront listing fees.
              </p>
            </div>

            <div className="owner-features-grid">
              {gymOwnerFeatures.map((item) => (
                <div key={item.id} className="owner-feature-card">
                  <div className="owner-icon-box">
                    {item.icon}
                  </div>
                  <h3 className="owner-card-title">{item.title}</h3>
                  <p className="owner-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="owner-cta-banner">
              <div className="owner-cta-text-wrap">
                <h3 className="owner-cta-title">Ready to grow your gym footfall?</h3>
                <p className="owner-cta-sub">List your fitness facility on GYMEZY in under 5 minutes and start welcoming new athletes today.</p>
              </div>
              <a href="#contact" className="owner-action-btn">
                Partner Your Gym
              </a>
            </div>
          </div>
        </section>

        {/* =================================================================
            7. FULL-WIDTH SECTION: FOR CERTIFIED PERSONAL TRAINERS
            ================================================================= */}
        <section className="trainers-fullwidth-section" id="trainers">
          <div className="section-container">
            <div className="section-centered-header">
              <span className="section-category-pill">For Personal Trainers</span>
              <h2 className="section-heading-lg">
                Expand Your Coaching Business With <span className="title-italic-accent">GYMEZY</span>
              </h2>
              <p className="section-sub-desc">
                Connect with thousands of dedicated athletes seeking 1-on-1 guidance for strength training, fat loss, yoga, and athletic conditioning.
              </p>
            </div>

            <div className="trainer-features-grid">
              {trainerFeatures.map((item) => (
                <div key={item.id} className="trainer-feature-card">
                  <div className="trainer-icon-box">
                    {item.icon}
                  </div>
                  <h3 className="trainer-card-title">{item.title}</h3>
                  <p className="trainer-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="trainer-cta-banner">
              <div className="trainer-cta-text-wrap">
                <h3 className="trainer-cta-title">Are you a certified fitness coach?</h3>
                <p className="trainer-cta-sub">Set your own rates, manage daily client slots, and grow your income with verified athlete reviews.</p>
              </div>
              <a href="#contact" className="trainer-action-btn">
                Join as a Trainer
              </a>
            </div>
          </div>
        </section>

        {/* =================================================================
            8. MOBILE APP SHOWCASE SECTION (APP STORE & GOOGLE PLAY)
            ================================================================= */}
        <section className="mobile-app-section" id="app">
          <div className="section-container">
            <div className="mobile-app-layout">
              {/* Left Column: Smartphone Mockup Showcase */}
              <div className="mobile-app-mockup-col">
                <div className="phone-mockup-showcase-container">
                  <div className="phone-mockup-card-wrapper">
                    <img
                      src={phoneMockupImg}
                      alt="GYMEZY Mobile App on Smartphone Screen"
                      className="phone-mockup-rendered-img"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Information, Benefits & Store Buttons */}
              <div className="mobile-app-info-col">
                <span className="section-category-pill">Mobile Application</span>
                <h2 className="mobile-app-heading">
                  Find & book gyms <span className="title-italic-accent">instantly,</span> anywhere
                </h2>
                <p className="mobile-app-description">
                  Experience seamless fitness with the GYMEZY mobile app. Search nearby gyms by distance and amenities, book flexible drop-in passes, schedule certified coaches, and check in with your digital pass.
                </p>

                <div className="mobile-app-features-grid">
                  <div className="app-feature-item">
                    <div className="app-feature-icon-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-feature-svg-icon">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                      </svg>
                    </div>
                    <div className="app-feature-text-block">
                      <h4 className="app-feature-title">1-Tap Gym Discovery</h4>
                      <p className="app-feature-sub">Find top-rated gyms near you with real-time distance, equipment, and reviews.</p>
                    </div>
                  </div>

                  <div className="app-feature-item">
                    <div className="app-feature-icon-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-feature-svg-icon">
                        <rect x="3" y="4" width="18" height="18" rx="3" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <path d="m9 16 2 2 4-4" />
                      </svg>
                    </div>
                    <div className="app-feature-text-block">
                      <h4 className="app-feature-title">Flexible Passes & Classes</h4>
                      <p className="app-feature-sub">Reserve single-session drop-ins, weekly passes, or group classes in seconds.</p>
                    </div>
                  </div>

                  <div className="app-feature-item">
                    <div className="app-feature-icon-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-feature-svg-icon">
                        <rect x="5" y="2" width="14" height="20" rx="3" />
                        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
                        <path d="M9 8a4.5 4.5 0 0 1 6 0" />
                        <path d="M10.5 10.5a2 2 0 0 1 3 0" />
                      </svg>
                    </div>
                    <div className="app-feature-text-block">
                      <h4 className="app-feature-title">Instant Digital OTP & QR Entry</h4>
                      <p className="app-feature-sub">Keyless contactless entry at front desks without physical paperwork.</p>
                    </div>
                  </div>
                </div>

                {/* Download CTA Store Buttons */}
                <div className="app-download-buttons-group">
                  {/* Apple App Store Button */}
                  <a href="#download-ios" className="store-download-pill-btn" aria-label="Download on the App Store">
                    <div className="store-btn-icon-wrap">
                      <svg viewBox="0 0 24 24" className="store-btn-icon apple-icon">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76 1.01.08 2.05-.51 2.68-1.26z" fill="#ffffff" />
                      </svg>
                    </div>
                    <div className="store-btn-text-wrap">
                      <span className="store-btn-sub">Download on the</span>
                      <span className="store-btn-main">App Store</span>
                    </div>
                  </a>

                  {/* Google Play Store Button */}
                  <a href="#download-android" className="store-download-pill-btn" aria-label="Get it on Google Play">
                    <div className="store-btn-icon-wrap">
                      <svg viewBox="0 0 512 512" className="store-btn-icon google-play-icon">
                        <path
                          fill="#00E27B"
                          d="M48 24.3C37.3 35.6 31 52.8 31 75.3v361.4c0 22.5 6.3 39.7 17 51l2.6 2.3 202.4-202.4v-4.8L50.6 22 48 24.3z"
                        />
                        <path
                          fill="#FFB300"
                          d="M320.6 322.8L253 255.2v-4.8l67.6-67.6 1.6 0.9 80 45.7c22.8 13 22.8 34.3 0 47.3l-80 45.7-1.6 0.9z"
                        />
                        <path
                          fill="#FF334B"
                          d="M253 250.4L50.6 488c7.8 8.3 20.7 9.3 35.3 1L322.2 321.9 253 250.4z"
                        />
                        <path
                          fill="#00B0FF"
                          d="M253 261.6l69.2-71.5L85.9 23c-14.6-8.3-27.5-7.3-35.3 1L253 261.6z"
                        />
                      </svg>
                    </div>
                    <div className="store-btn-text-wrap">
                      <span className="store-btn-sub">GET IT ON</span>
                      <span className="store-btn-main">Google Play</span>
                    </div>
                  </a>
                </div>

                {/* Social Proof Stats */}
                <div className="app-social-proof-row">
                  <div className="app-stars-badge">
                    <span className="app-star">★</span>
                    <span className="app-star">★</span>
                    <span className="app-star">★</span>
                    <span className="app-star">★</span>
                    <span className="app-star">★</span>
                    <span className="app-rating-number">4.9 / 5.0</span>
                  </div>
                  <span className="app-proof-separator">•</span>
                  <span className="app-downloads-count">50K+ Active Athletes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            9. PRICING & ACCESS PLANS SECTION (AFFORDABLE & FLEXIBLE)
            ================================================================= */}
        <section className="pricing-modern-section" id="pricing">
          <div className="section-container">
            <div className="section-centered-header">
              <span className="section-category-pill">Affordable Access Plans</span>
              <h2 className="section-heading-lg">
                Flexible Plans That <span className="title-italic-accent">Fit</span> Your Schedule
              </h2>
              <p className="section-sub-desc">
                No rigid long-term commitments. Pay only for what you use, or choose an unlimited multi-gym pass.
              </p>

              <div className="billing-toggle-wrapper">
                <button
                  type="button"
                  className={`billing-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly & Drop-in
                </button>
                <button
                  type="button"
                  className={`billing-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Long-term Access <span className="discount-tag">Maximum Value</span>
                </button>
              </div>
            </div>

            <div className="pricing-cards-grid">
              {pricingPlans.map((plan) => (
                <div key={plan.id} className={`pricing-card-box ${plan.popular ? 'highlighted-pro' : ''}`}>
                  {plan.popular && <div className="popular-badge-ribbon">Most Popular</div>}
                  
                  <div className="pricing-card-head">
                    <h3 className="plan-name-title">{plan.name}</h3>
                    <div className="plan-price-group">
                      <span className="plan-price-val">{plan.price}</span>
                      <span className="plan-price-period">({plan.period})</span>
                    </div>
                    <p className="plan-desc-text">{plan.desc}</p>
                  </div>

                  <ul className="plan-features-list">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx}>
                        <span className="feature-check-icon">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`plan-select-btn ${plan.popular ? 'btn-popular' : ''}`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            10. NEWSLETTER BANNER (MODERN ATHLETE VIP BANNER)
            ================================================================= */}
        <section className="vip-newsletter-section">
          <div className="section-container">
            <div className="newsletter-banner-box">
              {/* Left Athlete Photo Card */}
              <div className="newsletter-photo-container">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"
                  alt="Athlete dumbbell training"
                  className="newsletter-athlete-img"
                />
              </div>

              {/* Right Content */}
              <div className="newsletter-content-group">
                {/* Tag Pills */}
                <div className="newsletter-tags-row">
                  <span className="newsletter-tag-outline">Stay Updated</span>
                  <span className="newsletter-tag-solid">GYMEZY Alerts</span>
                </div>

                {/* Headline with luxury serif italics */}
                <h2 className="newsletter-headline">
                  Get the latest <span className="newsletter-serif-italic">Gym Openings</span>, flash{' '}
                  <span className="newsletter-serif-italic">Pass Discounts</span>, and expert fitness tips!
                </h2>

                {/* Form Input with send button */}
                <form className="newsletter-form-wrapper" onSubmit={(e) => e.preventDefault()}>
                  <div className="newsletter-input-container">
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      className="newsletter-pill-input"
                      required
                    />
                    <button type="submit" className="newsletter-send-circle-btn" aria-label="Subscribe">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            11. JOIN US WHENEVER READY (FINAL CALL TO ACTION)
            ================================================================= */}
        <section className="join-ready-cta-section">
          <div className="section-container">
            <div className="join-ready-content">
              <h2 className="join-ready-headline">
                Join us whenever you're <span className="join-serif-italic">ready,</span>
                <br />
                train wherever you are
              </h2>
              <p className="join-ready-subtitle">
                Experience the ultimate freedom of flexible, affordable gym passes and certified coaching. Download the GYMEZY app today.
              </p>
              <div className="join-ready-btn-wrapper">
                <a href="#pricing" className="join-ready-primary-btn">
                  GET STARTED WITH GYMEZY
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            12. FOOTER
            ================================================================= */}
        <footer className="site-footer" id="contact">
          <div className="section-container">
            <div className="footer-links-grid">
              <div className="footer-brand-col">
                <div className="fitnova-logo footer-logo">
                  <img src={gymezyLogo} alt="GYMEZY Logo" className="fitnova-logo-img footer-logo-img" />
                  <span className="fitnova-logo-text">GYMEZY</span>
                </div>
                <p className="footer-brand-desc">
                  GYMEZY connects fitness enthusiasts with top-rated gyms, certified trainers, and flexible passes across your city with zero lock-in contracts.
                </p>
              </div>

              <div className="footer-nav-col">
                <h4 className="footer-col-header">Explore</h4>
                <a href="#home">Home</a>
                <a href="#about">About GYMEZY</a>
                <a href="#services">Services</a>
                <a href="#pricing">Affordable Passes</a>
                <a href="#app">Mobile App</a>
              </div>

              <div className="footer-nav-col">
                <h4 className="footer-col-header">Partnerships</h4>
                <a href="#gym-owners">For Gym Owners</a>
                <a href="#trainers">For Personal Trainers</a>
                <a href="#gym-owners">Front-Desk Scanner</a>
                <a href="#trainers">Trainer Verification</a>
              </div>

              <div className="footer-nav-col">
                <h4 className="footer-col-header">Workouts & Hubs</h4>
                <a href="#services">Strength & Cardio</a>
                <a href="#services">Hatha Yoga & Zumba</a>
                <a href="#services">CrossFit & Boxing</a>
                <a href="#services">Personal Training</a>
              </div>
            </div>

            <div className="footer-bottom-copyright">
              <span>© 2026 GYMEZY Fitness Network. All rights reserved.</span>
              <span>Empowering athletes, gyms, and coaches everywhere.</span>
            </div>
          </div>
        </footer>

        {/* Sticky Floating Watch Video Pill */}
        <div className="fitnova-sticky-video-widget">
          <a href="#video-tour" className="fitnova-watch-video-pill" aria-label="Watch Video Preview">
            <span className="watch-video-label">Watch Video</span>
            <div className="watch-video-thumb-circle">
              <img src={gymModelThumb} alt="Video preview thumbnail" />
              <div className="thumb-play-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Ant Design FloatButton with Circular Progress Ring */}
        <FloatButton.BackTop
          shape="circle"
          type="primary"
          percent={scrollPercent}
          style={{ right: 28, bottom: 28, zIndex: 1000 }}
        />
      </div>
    </ConfigProvider>
  );
}

