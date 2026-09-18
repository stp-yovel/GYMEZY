import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import gymezyLogo from '../../assets/logo/gymezy.png';
import heroBgImg from '../../assets/fitnova_hero_bg.jpg';
import gymModelThumb from '../../assets/gym_model.jpg';
import trainerImg from '../../assets/trainer.png';
import './AboutUsPage.css';

export default function AboutUsPage() {
  const valuesList = [
    {
      num: '01',
      tag: 'UNRESTRICTED ACCESS',
      title: 'Radical Freedom',
      sub: 'Zero contracts. Train on your terms.',
      desc: 'We eliminated the lock-in trap. Access premium gyms, CrossFit boxes, and boutique studios with single passes and total geographic flexibility.',
      badge: '100% Contract-Free',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
    {
      num: '02',
      tag: 'LOCAL FIRST',
      title: 'Empowering Gyms',
      sub: 'Strengthening neighborhood fitness hubs.',
      desc: 'We support local fitness centers and independent trainers by driving high-value walk-ins, maximizing floor capacity, and ensuring instant payouts.',
      badge: 'Partner Growth',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      num: '03',
      tag: 'INSTANT TECH',
      title: 'Frictionless Experience',
      sub: '1-Tap QR check-in & live floor meters.',
      desc: 'From discovering nearby gyms with real-time crowd heatmaps to 10-second digital pass bookings, our smart app makes working out effortless.',
      badge: '0.8s QR Check-in',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      num: '04',
      tag: 'VERIFIED & SAFE',
      title: 'Uncompromising Trust',
      sub: 'Certified coaches & verified equipment.',
      desc: 'Every partner facility is rigorously audited for hygiene, machine quality, and trainer certifications, backed by encrypted secure payments.',
      badge: '100% Verified Partners',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    }
  ];

  const athleteBenefits = [
    {
      title: 'Multi-Gym Freedom',
      desc: 'Single pass unlocks weights, CrossFit, and cardio floors across the city with zero contracts.'
    },
    {
      title: 'Hyperlocal Discovery',
      desc: 'Find verified gyms nearby with live crowd levels, equipment lists, and AC/shower amenities.'
    },
    {
      title: 'Certified Personal Trainers',
      desc: 'Book verified 1-on-1 fitness coaches for single sessions or custom training blocks on demand.'
    },
    {
      title: 'Instant QR Walk-ins',
      desc: 'No front-desk paperwork. Purchase on your phone, scan the QR code at reception, and start lifting.'
    }
  ];

  const ownerBenefits = [
    {
      title: 'Monetize Off-Peak Hours',
      desc: 'Attract high-intent fitness seekers during slower morning and afternoon slots effortlessly.'
    },
    {
      title: 'Zero Risk & Fast Payouts',
      desc: 'Free partner onboarding with transparent automated weekly settlements directly to your bank.'
    },
    {
      title: 'Turnkey Partner Dashboard',
      desc: 'Real-time attendance logging, digital QR check-in scanning, and member analytics in one clean app.'
    },
    {
      title: 'Hyperlocal Member Reach',
      desc: 'Top search placement when local fitness enthusiasts look for gym passes and personal trainers nearby.'
    }
  ];

  return (
    <div className="about-page-wrapper">
      {/* Universal Sticky Navbar */}
      <Navbar ctaText="EXPLORE PASSES" ctaLink="/customers" />

      {/* =================================================================
          1. HERO SECTION WITH FULL-BLEED RUNNER BACKGROUND (MATCHING LANDING PAGE)
          ================================================================= */}
      <section className="about-hero-fullscreen" id="home">
        {/* Full-bleed Background Image */}
        <div className="about-hero-bg-layer">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=2000&q=80"
            alt="Premium GYMEZY partner fitness club"
            className="about-hero-bg-image"
          />
          <div className="about-hero-gradient-overlay" />
        </div>

        {/* Hero Content Area */}
        <div className="about-hero-body">
          {/* Bottom Left Main Headline & Subtitle */}
          <div className="about-hero-bottom-left">
            <h1 className="about-hero-title">
              Connecting <span className="about-serif-italic">people,</span>
              <br />
              <span className="about-serif-italic">empowering</span>
              <br />
              fitness
            </h1>

            <p className="about-hero-subtext">
              GYMEZY is India’s smart fitness platform that connects gyms, trainers, and fitness lovers in one seamless ecosystem. We simplify fitness so gyms grow and people stay on track with 100% freedom.
            </p>

            <div className="about-hero-cta-row">
              <Link to="/customers" className="about-primary-btn lg-btn">
                GET STARTED
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Watch Video Corner Pill */}
        <div className="about-hero-watch-corner">
          <a href="#story" className="about-watch-video-pill" aria-label="Watch Story">
            <span className="about-watch-video-label">Watch Video</span>
            <span className="about-watch-video-thumb">
              <img
                src={gymModelThumb}
                alt="Video thumbnail"
                className="about-watch-video-avatar"
              />
              <span className="about-watch-play-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor" className="about-watch-play-icon">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </span>
            </span>
          </a>
        </div>
      </section>

      {/* =================================================================
          2. OUR STORY SECTION (DYNAMIC ANGLED SPLIT DESIGN)
          ================================================================= */}
      <section className="about-story-split-section" id="story">
        <div className="section-container">
          <div className="story-split-layout">
            {/* Left Column: Angled Parallelogram Visuals with Checkerboard Pattern */}
            <div className="story-visuals-col">
              <div className="story-angled-cards-wrapper">
                {/* Photo 1 */}
                <div className="story-angled-card card-one">
                  <img
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
                    alt="Athlete training with dumbbells"
                    className="story-angled-img"
                  />
                </div>

                {/* Accent Ribbon Tab behind Photo 2 */}
                <div className="story-accent-tab" />

                {/* Photo 2 */}
                <div className="story-angled-card card-two">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                    alt="Fitness trainer guiding seated athlete"
                    className="story-angled-img"
                  />
                </div>
              </div>

              {/* Checkerboard Decorative Pattern */}
              <div className="story-checkerboard-graphic">
                <div className="checker-row">
                  <span className="c-box b-dark" />
                  <span className="c-box b-light" />
                  <span className="c-box b-dark" />
                  <span className="c-box b-light" />
                  <span className="c-box b-dark" />
                  <span className="c-box b-light" />
                </div>
                <div className="checker-row">
                  <span className="c-box b-light" />
                  <span className="c-box b-dark" />
                  <span className="c-box b-light" />
                  <span className="c-box b-dark" />
                  <span className="c-box b-light" />
                  <span className="c-box b-dark" />
                </div>
                <div className="checker-row">
                  <span className="c-box b-dark" />
                  <span className="c-box b-light" />
                  <span className="c-box b-dark" />
                  <span className="c-box b-light" />
                  <span className="c-box b-dark" />
                  <span className="c-box b-light" />
                </div>
              </div>
            </div>

            {/* Right Column: Heading, Desc, Mission Quote Card & CTA */}
            <div className="story-content-col">

              <h2 className="story-headline">
                Born to Connect
                <br />
                <span className="title-serif-italic">Every Gym Around You</span>
              </h2>

              <p className="story-paragraph">
                GYMEZY started with a simple vision: fitness shouldn't be trapped behind rigid contracts or locked into just one facility. We set out to unite every neighborhood gym, elite fitness center, and certified personal trainer into one intuitive app—giving you the ultimate freedom to train anywhere, anytime.
              </p>

              {/* Mission Quote Card */}
              <div className="story-quote-card">
                <div className="quote-watermark-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="quote-card-text">
                  "We built GYMEZY so anyone can open the app, find the best nearby gym in seconds, book a day pass or trainer session, and walk right in. No paperwork, no lock-ins—just seamless fitness."
                </p>
              </div>

              {/* Bottom Actions: Learn More Button & Profile Info */}
              <div className="story-bottom-row">
                <Link to="/customers" className="story-learn-btn">
                  <span>Explore Gyms & Passes</span>
                </Link>

                <div className="story-author-profile">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="GYMEZY Team"
                    className="story-author-avatar"
                  />
                  <div className="story-author-info">
                    <span className="author-name">GYMEZY Team</span>
                    <span className="author-role">Founding Mission</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. OUR CORE VALUES (ARCHITECTURAL DARK BENTO GRID)
          ================================================================= */}
      <section className="about-values-section">
        <div className="section-container">
          <div className="section-centered-header dark-header">
            <h2 className="values-main-heading">
              The Pillars That <span className="title-serif-italic">Drive GYMEZY</span>
            </h2>
            <p className="values-sub-desc">
              Four non-negotiable standards shaping how we connect athletes, certified coaches, and gym owners.
            </p>
          </div>

          <div className="about-values-bento-grid">
            {valuesList.map(val => (
              <div key={val.num} className="value-bento-card">
                <span className="value-watermark-num">{val.num}</span>
                <div className="value-card-top-row">
                  <div className="value-icon-badge">{val.icon}</div>
                  <span className="value-category-tag">{val.tag}</span>
                </div>
                <h3 className="value-card-title">{val.title}</h3>
                <p className="value-card-subtitle">{val.sub}</p>
                <p className="value-card-desc">{val.desc}</p>
                <div className="value-card-footer">
                  <span className="value-highlight-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="check-mini-icon">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {val.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          4. WHY GYMEZY SECTION (DUAL-PERSONA ECOSYSTEM SHOWCASE)
          ================================================================= */}
      <section className="about-why-section">
        <div className="section-container">
          <div className="section-centered-header">
            <h2 className="why-section-title">
              One Platform. <span className="title-serif-italic">Double The Power.</span>
            </h2>
            <p className="why-section-desc">
              Engineered specifically to eliminate friction for trainees and scale sustainable revenue for gym owners.
            </p>
          </div>

          <div className="why-dual-ecosystem-grid">
            {/* Persona Card 1: For Athletes */}
            <div className="why-persona-panel athlete-panel">
              <div className="panel-header">
                <div className="panel-persona-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="persona-svg-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>FOR FITNESS SEEKERS</span>
                </div>
                <h3 className="panel-headline">Workout on Your Own Terms</h3>
                <p className="panel-subhead">Total freedom of choice across premier gyms in your city.</p>
              </div>

              <div className="panel-features-list">
                {athleteBenefits.map((item, i) => (
                  <div key={i} className="panel-feature-row">
                    <div className="feature-marker-dot" />
                    <div className="feature-text-block">
                      <h4 className="feature-title">{item.title}</h4>
                      <p className="feature-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="panel-footer-action">
                <Link to="/customers" className="panel-cta-btn athlete-cta">
                  <span>Explore Passes & Nearby Gyms</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="panel-btn-arrow">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Center Trainer Visual */}
            <div className="why-center-visual-col">
              <div className="why-trainer-img-wrapper">
                <img
                  src={trainerImg}
                  alt="GYMEZY Fitness Athletes"
                  className="why-center-trainer-img"
                />
              </div>
            </div>

            {/* Persona Card 2: For Gym Owners */}
            <div className="why-persona-panel owner-panel">
              <div className="panel-header">
                <div className="panel-persona-badge owner-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="persona-svg-icon">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>FOR GYM & STUDIO OWNERS</span>
                </div>
                <h3 className="panel-headline">Scale Footfall & Maximize Revenue</h3>
                <p className="panel-subhead">Transform empty equipment slots into predictable, recurring profit.</p>
              </div>

              <div className="panel-features-list">
                {ownerBenefits.map((item, i) => (
                  <div key={i} className="panel-feature-row">
                    <div className="feature-marker-dot owner-dot" />
                    <div className="feature-text-block">
                      <h4 className="feature-title">{item.title}</h4>
                      <p className="feature-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="panel-footer-action">
                <Link to="/gym-owners" className="panel-cta-btn owner-cta">
                  <span>List Your Gym on GYMEZY</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="panel-btn-arrow">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* =================================================================
          6. NEWSLETTER BANNER (LANDING PAGE VIP NEWSLETTER BANNER)
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
          7. COMMON SITE FOOTER
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
              <Link to="/">Home</Link>
              <Link to="/about">About GYMEZY</Link>
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
  );
}
