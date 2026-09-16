import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import gymezyLogo from '../../assets/logo/gymezy.png';
import phoneMockupImg from '../../assets/gymezy_phone_mockup.jpg';
import Navbar from '../../components/Navbar';
import './CustomersPage.css';

export default function CustomersPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const galleryItems = [
    {
      id: 1,
      num: '01',
      title: 'Verified Fitness Centres',
      tag: 'Flexible Access',
      desc: 'Pay only for the sessions you use. Full gym floor & equipment access with instant OTP entry.',
      mission: 'Our mission is to eliminate fitness barriers by connecting you with top gym facilities, certified coaches, and flexible passes across your city.',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      link: '#app'
    },
    {
      id: 2,
      num: '02',
      title: 'Certified Personal Trainers',
      tag: '1-on-1 Coaching',
      desc: 'Book certified coaches for strength, weight loss, HIIT, and customized nutrition guidance.',
      mission: 'Our mission is to empower your fitness journey with certified personal trainers, tailored 1-on-1 workouts, and expert nutrition guidance.',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
      link: '#app'
    },
    {
      id: 3,
      num: '03',
      title: 'Group Classes & Studios',
      tag: 'High Energy',
      desc: 'Reserve your spot for high-octane Yoga, Zumba, HIIT, and Boxing studio classes.',
      mission: 'Our mission is to build an inspiring community where group fitness and dynamic studio workouts are accessible to everyone, everywhere.',
      img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      link: '#app'
    }
  ];

  const orderedGallery = galleryItems.map((_, idx) => galleryItems[(activeSlide + idx) % galleryItems.length]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00BF62',
          borderRadius: 16,
        },
      }}
    >
      <div className="customers-page-wrapper">
        {/* Top Navbar */}
        <Navbar ctaText="GET THE APP" ctaLink="#app-download" />

        {/* =================================================================
            HERO SECTION (3-COLUMN SPLIT: VALUE PROPOSITION, ATHLETE MODEL, IPHONE APP MOCKUP)
            ================================================================= */}
        <section className="customer-hero-split-section">
          <div className="section-container customer-hero-split-grid">
            
            {/* Left Column: Heading, Subheading, Bullet Checklist & Action CTAs */}
            <div className="customer-hero-left">
              <div className="customer-hero-pill">
                <span>For Customers</span>
              </div>

              <h1 className="customer-hero-main-title">
                Your Fitness Journey,
                <br />
                <span className="title-accent-green">Made Easy with GYMEZY</span>
              </h1>

              <p className="customer-hero-main-desc">
                Discover gyms, book sessions, buy memberships and achieve your fitness goals — all in one app.
              </p>

              {/* 4 Value Checkpoints */}
              <ul className="customer-checklist">
                <li className="customer-check-item">
                  <span className="check-icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Find the best gyms near you</span>
                </li>
                <li className="customer-check-item">
                  <span className="check-icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Book in a few taps</span>
                </li>
                <li className="customer-check-item">
                  <span className="check-icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Flexible memberships</span>
                </li>
                <li className="customer-check-item">
                  <span className="check-icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Secure payments &amp; easy check-in</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="customer-hero-btn-group">
                <a href="#app-download" className="customer-btn-download">
                  <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download App</span>
                </a>

                <a href="#app" className="customer-btn-demo">
                  <span className="demo-play-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span>Watch Demo</span>
                </a>
              </div>
            </div>

            {/* Center Column: Athlete Photo with Ambient Lighting */}
            <div className="customer-hero-center">
              <div className="athlete-photo-frame">
                <img
                  src="https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=900&q=80"
                  alt="Fit athlete using GYMEZY mobile app"
                  className="athlete-hero-img"
                />
                <div className="athlete-bottom-glow" />
              </div>
            </div>

            {/* Right Column: Realistic Silver iPhone 16 Pro Customer App Mockup */}
            <div className="customer-hero-right">
              <div className="customer-phone-mockup">
                {/* Physical Silver Hardware Buttons */}
                <div className="iphone-btn-volume-up" />
                <div className="iphone-btn-volume-down" />
                <div className="iphone-btn-power" />

                <div className="customer-phone-screen">
                  {/* iOS Status Bar + Dynamic Island */}
                  <div className="phone-status-bar">
                    <span className="phone-time">9:41</span>
                    
                    <div className="phone-dynamic-island">
                      <div className="island-camera-dot" />
                      <div className="island-sensor-dot" />
                    </div>

                    <div className="phone-status-icons">
                      <svg className="phone-status-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                        <line x1="12" y1="20" x2="12.01" y2="20" />
                      </svg>
                      <svg className="phone-status-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="2" y="7" width="16" height="10" rx="2" />
                        <line x1="22" y1="11" x2="22" y2="13" />
                        <rect x="4" y="9" width="8" height="6" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  {/* Customer App Top Header (Greeting + Notification) */}
                  <div className="app-user-header">
                    <div className="app-greeting-wrap">
                      <div className="app-greeting-title">
                        <span>Hi, Arjun</span>
                        <svg className="app-wave-icon" viewBox="0 0 24 24" fill="none" stroke="#00BF62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                        </svg>
                      </div>
                      <span className="app-greeting-subtitle">Find your perfect gym. Book it. Go!</span>
                    </div>

                    <div className="app-notif-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                      <span className="app-notif-dot">1</span>
                    </div>
                  </div>

                  {/* App Search Bar */}
                  <div className="app-search-input-box">
                    <svg className="app-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span className="app-search-placeholder">Search gyms, locations or areas...</span>
                    <svg className="app-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <line x1="4" y1="21" x2="4" y2="14" />
                      <line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" />
                      <line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" />
                      <line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                  </div>

                  {/* App Quick Category Chips */}
                  <div className="app-categories-row">
                    <div className="app-cat-chip active">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span>Passes</span>
                    </div>
                    <div className="app-cat-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      <span>Gyms</span>
                    </div>
                    <div className="app-cat-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                      <span>Studios</span>
                    </div>
                    <div className="app-cat-chip">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                      <span>Coaches</span>
                    </div>
                  </div>

                  {/* Featured Gym Promotion Card with Countdown */}
                  <div className="app-promo-card">
                    <div className="promo-card-bg-overlay" />
                    
                    <div className="promo-badges-row">
                      <span className="promo-tag-pill">LIMITED TIME OFFER</span>
                      <div className="promo-countdown-pill">
                        <span className="countdown-label">Offer Ends in</span>
                        <span className="countdown-timer">05d : 12h : 30m</span>
                      </div>
                    </div>

                    <div className="promo-content-block">
                      <h4 className="promo-gym-name">FitZone Gym</h4>
                      <div className="promo-discount-highlight">
                        <span className="discount-big-text">30% OFF</span>
                        <span className="discount-sub-text">on Quarterly Membership</span>
                      </div>

                      <div className="promo-perk-item">
                        <svg className="perk-gift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 12 20 22 4 22 4 12" />
                          <rect x="2" y="7" width="20" height="5" />
                          <line x1="12" y1="22" x2="12" y2="7" />
                          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                        </svg>
                        <span>+ 2 FREE Personal Training Sessions</span>
                      </div>

                      <button type="button" className="promo-book-btn">
                        <span>Book Now</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Nearby Trending Pass Card */}
                  <div className="app-mini-pass-card">
                    <div className="mini-pass-left">
                      <span className="mini-pass-title">CrossMatrix Arena</span>
                      <span className="mini-pass-sub">Indiranagar • 0.8 km</span>
                    </div>
                    <div className="mini-pass-right">
                      <span className="mini-pass-price">₹249</span>
                      <span className="mini-pass-tag">Instant Pass</span>
                    </div>
                  </div>

                  {/* iOS Home Indicator Bar */}
                  <div className="phone-home-indicator" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            PHILOSOPHY / AT GYMEZY, WE BELIEVE SECTION
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
                    className="carousel-arrow-btn active"
                    onClick={() => setActiveSlide(prev => (prev > 0 ? prev - 1 : galleryItems.length - 1))}
                    aria-label="Previous category"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="carousel-arrow-btn active"
                    onClick={() => setActiveSlide(prev => (prev < galleryItems.length - 1 ? prev + 1 : 0))}
                    aria-label="Next category"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Asymmetric Gallery Grid */}
            <div className="philosophy-asymmetric-grid">
              {/* Featured Left Tall Card (Card 1) */}
              <div className="asymmetric-card-featured">
                <img
                  key={`featured-img-${orderedGallery[0].id}`}
                  src={orderedGallery[0].img}
                  alt={orderedGallery[0].title}
                  className="asymmetric-card-img swap-fade-anim"
                />
                <div
                  key={`featured-pill-${orderedGallery[0].id}`}
                  className="floating-card-pill-overlay swap-pill-anim"
                >
                  <span className="pill-card-title">{orderedGallery[0].title}</span>
                  <a href={orderedGallery[0].link || '#explore-gyms'} className="pill-view-now-btn">
                    Explore
                  </a>
                </div>
              </div>

              {/* Right Column: 2 Cards + Mission Statement */}
              <div className="asymmetric-right-column">
                <div className="asymmetric-right-cards-row">
                  {/* Card 2 */}
                  <div
                    className="asymmetric-card-sm clickable-card"
                    onClick={() => setActiveSlide((activeSlide + 1) % galleryItems.length)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveSlide((activeSlide + 1) % galleryItems.length); }}
                    aria-label={`Select ${orderedGallery[1].title}`}
                  >
                    <img
                      key={`sm1-img-${orderedGallery[1].id}`}
                      src={orderedGallery[1].img}
                      alt={orderedGallery[1].title}
                      className="asymmetric-card-img swap-fade-anim"
                    />
                    <div
                      key={`sm1-pill-${orderedGallery[1].id}`}
                      className="floating-card-pill-overlay sm-pill swap-pill-anim"
                    >
                      <span className="pill-card-title">{orderedGallery[1].title}</span>
                      <span className="pill-view-now-btn">
                        Explore
                      </span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div
                    className="asymmetric-card-sm clickable-card"
                    onClick={() => setActiveSlide((activeSlide + 2) % galleryItems.length)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveSlide((activeSlide + 2) % galleryItems.length); }}
                    aria-label={`Select ${orderedGallery[2].title}`}
                  >
                    <img
                      key={`sm2-img-${orderedGallery[2].id}`}
                      src={orderedGallery[2].img}
                      alt={orderedGallery[2].title}
                      className="asymmetric-card-img swap-fade-anim"
                    />
                    <div
                      key={`sm2-pill-${orderedGallery[2].id}`}
                      className="floating-card-pill-overlay sm-pill swap-pill-anim"
                    >
                      <span className="pill-card-title">{orderedGallery[2].title}</span>
                      <span className="pill-view-now-btn">
                        Explore
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mission Text Below Cards 2 & 3 */}
                <div className="philosophy-mission-block">
                  <p className="philosophy-mission-text key-fade-anim" key={`mission-${orderedGallery[0].id}`}>
                    {orderedGallery[0].mission}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            MOBILE APP SHOWCASE SECTION (APP STORE & GOOGLE PLAY)
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
                  Find &amp; book gyms <span className="title-italic-accent">instantly,</span> anywhere
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
                      <h4 className="app-feature-title">Flexible Passes &amp; Classes</h4>
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
                      <h4 className="app-feature-title">Instant Digital OTP &amp; QR Entry</h4>
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

        {/* Footer */}
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
                <Link to="/">Home</Link>
                <a href="/#about">About GYMEZY</a>
                <Link to="/customers">For Customers</Link>
                <Link to="/gym-owners">For Gym Owners</Link>
                <a href="/#app">Mobile App</a>
              </div>

              <div className="footer-nav-col">
                <h4 className="footer-col-header">Partnerships</h4>
                <Link to="/gym-owners">For Gym Owners</Link>
                <Link to="/gym-owners">Partner Pricing Plans</Link>
                <Link to="/gym-owners">Front-Desk Scanner</Link>
                <Link to="/gym-owners">GMS Operations</Link>
              </div>

              <div className="footer-nav-col footer-contact-col">
                <h4 className="footer-col-header">Contact &amp; Office</h4>
                <div className="footer-contact-item-stacked">
                  <span className="contact-col-label">Registered office:</span>
                  <span className="contact-col-val">Office location</span>
                </div>
                <div className="footer-contact-item-stacked">
                  <span className="contact-col-label">Phone Number:</span>
                  <span className="contact-col-val">
                    <a href="tel:9150955071">9150955071</a> / <a href="tel:9884881983">9884881983</a>
                  </span>
                </div>
                <div className="footer-contact-item-stacked">
                  <span className="contact-col-label">Email:</span>
                  <span className="contact-col-val">
                    <a href="mailto:praveen.k@gymezy.com">praveen.k@gymezy.com</a>
                  </span>
                </div>
              </div>
            </div>

            <div className="footer-bottom-copyright">
              <span>© {new Date().getFullYear()} GYMEZY Fitness Network. All rights reserved.</span>
              <span>Empowering athletes, gyms, and coaches everywhere.</span>
            </div>
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
}
