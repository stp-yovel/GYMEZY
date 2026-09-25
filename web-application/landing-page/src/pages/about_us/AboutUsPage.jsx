import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import gymModelThumb from '../../assets/gym_model.jpg';
import StorySplitSection from '../../components/StorySplitSection';
import DualEcosystemSection from '../../components/DualEcosystemSection';
import GymAlertsBanner from '../../components/GymAlertsBanner';
import Footer from '../../components/Footer';
import { openLeadModal, openVideoModal } from '../../utils/modalUtils';
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
              <button
                type="button"
                onClick={() => openLeadModal({ category: 'partner', plan: 'About Us Hero Partner Onboarding' })}
                className="about-primary-btn lg-btn"
                style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>

        {/* Floating Watch Video Corner Pill */}
        <div className="about-hero-watch-corner">
          <button
            type="button"
            className="about-watch-video-pill"
            onClick={() => openVideoModal({ video: 'reason' })}
            aria-label="Watch GYMEZY Story Video"
          >
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
          </button>
        </div>
      </section>

      {/* =================================================================
          2. OUR STORY SECTION (DYNAMIC ANGLED SPLIT DESIGN)
          ================================================================= */}
      <StorySplitSection id="story" />

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
      <DualEcosystemSection id="why" />

      {/* =================================================================
          6. NEWSLETTER / ALERTS BANNER
          ================================================================= */}
      <GymAlertsBanner id="newsletter" />

      {/* =================================================================
          7. COMMON SITE FOOTER
          ================================================================= */}
      <Footer />
    </div>
  );
}
