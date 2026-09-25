import React, { useState, useEffect } from 'react';
import { FloatButton, ConfigProvider } from 'antd';
import './LandingPage.css';
import heroBgImg from '../../assets/fitnova_hero_bg.jpg';
import gymModelThumb from '../../assets/gym_model.jpg';
import Navbar from '../../components/Navbar';
import StorySplitSection from '../../components/StorySplitSection';
import PhilosophyCarousel from '../../components/PhilosophyCarousel';
import DualEcosystemSection from '../../components/DualEcosystemSection';
import MobileAppSection from '../../components/MobileAppSection';
import GymAlertsBanner from '../../components/GymAlertsBanner';
import Footer from '../../components/Footer';
import { openLeadModal, openUserLeadModal } from '../../utils/modalUtils';

export default function LandingPage() {
  const [activeService, setActiveService] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
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
      title: 'Verified Fitness Centres',
      tag: 'Flexible Access',
      desc: 'Pay only for the sessions you use. Full gym floor & equipment access with instant OTP entry.',
      mission: 'Our mission is to eliminate fitness barriers by connecting you with top gym facilities, certified coaches, and flexible passes across your city',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      link: '#services'
    },
    {
      id: 2,
      num: '02',
      title: 'Certified Personal Trainers',
      tag: '1-on-1 Coaching',
      desc: 'Book certified coaches for strength, weight loss, HIIT, and customized nutrition guidance.',
      mission: 'Our mission is to empower your fitness journey with certified personal trainers, tailored 1-on-1 workouts, and expert nutrition guidance.',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
      link: '#services'
    },
    {
      id: 3,
      num: '03',
      title: 'Group Classes & Studios',
      tag: 'Yoga, Zumba & HIIT',
      desc: 'Join high-energy group fitness classes led by certified studio instructors.',
      mission: 'Our mission is to build vibrant fitness communities by connecting you with top group studios, energized Zumba, Yoga, and HIIT sessions.',
      img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      link: '#services'
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
          <Navbar
            ctaText="GET STARTED"
            ctaLink="#lead-modal"
            onCtaClick={() => openLeadModal({ category: 'demo', plan: 'General Onboarding' })}
          />

          {/* Hero Content Area */}
          <div className="fitnova-hero-body">
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
                <button
                  type="button"
                  onClick={() => openLeadModal({ category: 'demo', plan: 'Gym & Fitness Network' })}
                  className="fitnova-primary-btn lg-btn"
                  style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                >
                  GET STARTED WITH GYMEZY
                </button>
              </div>
            </div>
          </div>
        </section>



        {/* =================================================================
            3. PHILOSOPHY / ABOUT SECTION
            ================================================================= */}
        <section className="philosophy-section" id="about">
          <div className="section-container">
            <PhilosophyCarousel items={galleryItems} />
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
            2.5. OUR STORY (BORN TO CONNECT EVERY GYM AROUND YOU)
            ================================================================= */}
        <StorySplitSection id="story" />

        {/* =================================================================
            4. MOVE FOR HEALTHY BODY (MULTI-GYM NETWORK SHOWCASE)
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
                <button
                  type="button"
                  onClick={() => openUserLeadModal({ offerTag: 'Start Your Journey Pass' })}
                  className="move-healthy-cta-btn"
                  style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                >
                  START YOUR JOURNEY
                </button>
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
            5. DUAL ECOSYSTEM SHOWCASE (ONE PLATFORM. DOUBLE THE POWER.)
            ================================================================= */}
        <DualEcosystemSection id="ecosystem" />

        {/* =================================================================
            8. MOBILE APP SHOWCASE SECTION (APP STORE & GOOGLE PLAY)
            ================================================================= */}
        <MobileAppSection id="app" />

        {/* =================================================================
            6. GYMEZY ALERTS / VIP BANNER
            ================================================================= */}
        <GymAlertsBanner id="newsletter" />

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
                <button
                  type="button"
                  onClick={() => openUserLeadModal({ offerTag: 'Join Ready Athlete Pass' })}
                  className="join-ready-primary-btn"
                  style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                >
                  <span>Claim Free Launch Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => openLeadModal({ category: 'partner', plan: 'Join Ready Gym Partner' })}
                  className="join-ready-secondary-btn"
                  style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                >
                  <span>Partner &amp; Scale Your Gym Free</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            12. FOOTER
            ================================================================= */}
        <Footer />

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

