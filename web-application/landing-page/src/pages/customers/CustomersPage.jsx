import React from 'react';
import { ConfigProvider } from 'antd';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PhilosophyCarousel from '../../components/PhilosophyCarousel';
import MobileAppSection from '../../components/MobileAppSection';
import { openLeadModal, openUserLeadModal } from '../../utils/modalUtils';
import './CustomersPage.css';

export default function CustomersPage() {

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
        <Navbar
          ctaText="GET STARTED"
          ctaLink="#get-started"
          onCtaClick={() => openLeadModal({ category: 'interest', plan: 'Customer Platform' })}
        />

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
                <button
                  type="button"
                  onClick={() => openUserLeadModal({ offerTag: 'Customer App VIP Pass' })}
                  className="customer-btn-download"
                  style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                >
                  <svg className="btn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M13 5v2" />
                    <path d="M13 11v2" />
                    <path d="M13 17v2" />
                  </svg>
                  <span>Get Launch Pass</span>
                </button>

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
            <PhilosophyCarousel items={galleryItems} />
          </div>
        </section>

        {/* Mobile App Showcase Section */}
        <MobileAppSection id="app" />

        {/* Footer */}
        <Footer />
      </div>
    </ConfigProvider>
  );
}
