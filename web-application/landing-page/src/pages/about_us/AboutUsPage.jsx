import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import gymezyLogo from '../../assets/logo/gymezy.png';
import './AboutUsPage.css';

export default function AboutUsPage() {
  const heroStats = [
    {
      num: '10,000+',
      label: 'Happy Members',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      num: '500+',
      label: 'Partner Gyms',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      num: '25+',
      label: 'Cities Across India',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    },
    {
      num: '100+',
      label: 'Fitness Experts',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18h12M6 6h12M9 12h6" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
    }
  ];

  const valuesList = [
    {
      id: 'trust',
      title: 'Trust',
      desc: 'Building reliable and transparent experiences for gyms and athletes.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'innovation',
      title: 'Innovation',
      desc: 'Constantly improving technology for a smarter, frictionless tomorrow.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2" />
          <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5" />
        </svg>
      )
    },
    {
      id: 'community',
      title: 'Community',
      desc: 'Stronger together, healthier always — empowering fitness families.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 'impact',
      title: 'Impact',
      desc: 'Empowering local fitness centers and transforming individual lives.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
        </svg>
      )
    }
  ];

  const whyGymezyList = [
    {
      title: 'Smart & Simple',
      sub: 'All-in-one platform',
      desc: 'Intuitive mobile discovery, instant digital QR pass booking, and zero friction for everyday workouts.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
    {
      title: 'Stronger Community',
      sub: 'For Gyms & Members',
      desc: 'Connecting thousands of dedicated athletes with verified neighborhood gyms, studios, and coaches.',
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
      title: 'More Growth',
      sub: 'Better Visibility',
      desc: 'Helping gym owners maximize floor capacity, monetize off-peak hours, and welcome high-value walk-ins.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      )
    },
    {
      title: 'Built for India',
      sub: 'Made for Everyone',
      desc: 'Tailored specifically for Indian fitness culture with flexible daily passes and zero lock-in contracts.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      title: 'Secure & Reliable',
      sub: 'Your Data, Always',
      desc: 'Bank-grade encrypted payments, instant OTP validation, and verified partner fitness centers.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    },
    {
      title: 'Made for Success',
      sub: 'Together We Grow',
      desc: 'Empowering athletes to achieve personal milestones while helping gym owners build sustainable businesses.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
        </svg>
      )
    }
  ];

  const ribbonMetrics = [
    { num: '10,000+', label: 'Happy Members' },
    { num: '500+', label: 'Partner Gyms' },
    { num: '100K+', label: 'Bookings Completed' },
    { num: '25+', label: 'Cities Across India' },
    { num: '100+', label: 'Fitness Experts' },
    { num: '4.8 ★', label: 'Average Rating' }
  ];

  return (
    <div className="about-page-wrapper">
      {/* Universal Sticky Navbar */}
      <Navbar ctaText="GET STARTED" ctaLink="/customers" />

      {/* =================================================================
          1. HERO SECTION (DARK LUXURY THEME)
          ================================================================= */}
      <section className="about-hero-section">
        <div className="section-container about-hero-grid">
          {/* Left Column: Heading & Mission Summary */}
          <div className="about-hero-left">
            <span className="about-hero-tag">About GYMEZY</span>

            <h1 className="about-hero-title">
              Connecting People.
              <br />
              <span className="about-title-accent">Empowering Fitness.</span>
            </h1>

            <p className="about-hero-desc">
              GYMEZY is India’s smart fitness platform that connects gyms, trainers, and fitness lovers in one seamless ecosystem. We simplify fitness so gyms grow and people stay on track with 100% freedom.
            </p>

            {/* Quick Hero Stats Bar */}
            <div className="about-hero-stats-row">
              {heroStats.map((st, idx) => (
                <div key={idx} className="hero-stat-badge">
                  <div className="hero-stat-icon-wrap">
                    {st.icon}
                  </div>
                  <div className="hero-stat-text-wrap">
                    <span className="hero-stat-num">{st.num}</span>
                    <span className="hero-stat-label">{st.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium Fitness Visual */}
          <div className="about-hero-right">
            <div className="about-hero-visual-card">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80"
                alt="GYMEZY Fitness Coaches and Athletes"
                className="about-hero-img"
              />
              <div className="about-hero-card-overlay">
                <div className="hero-card-brand-badge">
                  <span className="badge-dot" />
                  <span>India's Smart Fitness Ecosystem</span>
                </div>
                <p className="hero-card-quote">"Flexibility is the future of fitness."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          2. OUR STORY & OUR MISSION / VISION (LIGHT THEME)
          ================================================================= */}
      <section className="about-story-mission-section" id="story">
        <div className="section-container">
          <div className="story-mission-grid">
            {/* Left Card: Our Story */}
            <div className="story-card">
              <div className="card-top-icon-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="story-svg-icon">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <h3 className="story-card-heading">Our Story</h3>
              </div>

              <div className="story-card-body">
                <p>
                  GYMEZY was born from a simple idea – to make fitness accessible, organized, and rewarding for everyone across India.
                </p>
                <p>
                  We saw a persistent gap between quality fitness centers and workout enthusiasts trapped in rigid annual contracts. So we built GYMEZY – a platform that brings gyms, certified trainers, and athletes together in the most seamless way possible.
                </p>
              </div>

              <div className="story-card-footer">
                <div className="story-skyline-graphic" />
                <div className="story-signature-quote">
                  <span>Stronger Gyms.</span>
                  <span className="quote-accent"> Stronger India.</span>
                </div>
              </div>
            </div>

            {/* Right Card: Our Mission & Vision */}
            <div className="mission-vision-card">
              <div className="card-top-icon-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mission-svg-icon">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <h3 className="story-card-heading">Our Mission &amp; Vision</h3>
              </div>

              <div className="mission-blocks-wrap">
                {/* Mission Item */}
                <div className="mission-item-block">
                  <div className="item-icon-badge badge-mission">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div className="item-content-text">
                    <h4 className="item-title">Our Mission</h4>
                    <p className="item-desc">
                      To empower gyms with smart digital technology and help people achieve their fitness goals every day with total freedom and flexibility.
                    </p>
                  </div>
                </div>

                {/* Vision Item */}
                <div className="mission-item-block">
                  <div className="item-icon-badge badge-vision">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="item-content-text">
                    <h4 className="item-title">Our Vision</h4>
                    <p className="item-desc">
                      To become India’s most trusted fitness platform and build a healthier, more active, and stronger nation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. OUR VALUES SECTION (LIGHT THEME)
          ================================================================= */}
      <section className="about-values-section">
        <div className="section-container">
          <div className="section-centered-header">
            <div className="values-header-divider">
              <span className="divider-line" />
              <h2 className="values-main-heading">Our Values</h2>
              <span className="divider-line" />
            </div>
            <p className="values-sub-desc">The core principles guiding everything we build at GYMEZY.</p>
          </div>

          <div className="about-values-grid">
            {valuesList.map(val => (
              <div key={val.id} className="value-card">
                <div className="value-icon-circle">
                  {val.icon}
                </div>
                <h3 className="value-card-title">{val.title}</h3>
                <p className="value-card-desc">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          4. WHY GYMEZY SECTION (LIGHT THEME - 6 CARD GRID)
          ================================================================= */}
      <section className="about-why-section">
        <div className="section-container">
          <div className="section-centered-header">
            <h2 className="why-section-title">
              Why <span className="title-brand-accent">GYMEZY?</span>
            </h2>
            <div className="title-underline-pill" />
            <p className="why-section-desc">
              Designed from the ground up to empower both everyday athletes and passionate fitness center owners.
            </p>
          </div>

          <div className="why-features-grid">
            {whyGymezyList.map((item, idx) => (
              <div key={idx} className="why-feature-card">
                <div className="why-icon-box">
                  {item.icon}
                </div>
                <h3 className="why-card-title">{item.title}</h3>
                <span className="why-card-sub">{item.sub}</span>
                <p className="why-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          5. METRIC HIGHLIGHTS RIBBON (DEEP NAVY / ACCENT)
          ================================================================= */}
      <section className="about-ribbon-section">
        <div className="section-container">
          <div className="ribbon-metrics-grid">
            {ribbonMetrics.map((met, idx) => (
              <div key={idx} className="ribbon-metric-item">
                <span className="ribbon-num">{met.num}</span>
                <span className="ribbon-label">{met.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================
          6. PRE-FOOTER CALL TO ACTION BANNER
          ================================================================= */}
      <section className="about-cta-banner-section">
        <div className="section-container">
          <div className="about-cta-card">
            <div className="cta-left-content">
              <h2 className="cta-main-title">Let's Build a Stronger Fitness Future</h2>
              <p className="cta-main-desc">
                Join thousands of gyms and fitness enthusiasts who trust GYMEZY every day.
              </p>

              <div className="cta-checkpoints-row">
                <div className="cta-check-item">
                  <span className="cta-check-dot">✓</span>
                  <span>Smarter Gyms</span>
                </div>
                <div className="cta-check-item">
                  <span className="cta-check-dot">✓</span>
                  <span>Stronger Communities</span>
                </div>
                <div className="cta-check-item">
                  <span className="cta-check-dot">✓</span>
                  <span>Better Fitness for All</span>
                </div>
              </div>
            </div>

            <div className="cta-buttons-wrap">
              <Link to="/customers" className="cta-btn-primary">
                <span>Get Started</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="cta-arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <a href="#contact" className="cta-btn-secondary">
                <span>Contact Us</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="cta-arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
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
