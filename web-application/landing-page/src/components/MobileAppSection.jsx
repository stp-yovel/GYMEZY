import React from 'react';
import phoneMockupImg from '../assets/gymezy_phone_mockup.jpg';
import { openUserLeadModal } from '../utils/modalUtils';
import './MobileAppSection.css';

export default function MobileAppSection({ id = 'app' }) {
  return (
    <section className="mobile-app-section" id={id}>
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

            {/* Claim Free Launch Pass CTA Button */}
            <div className="mobile-app-cta-group">
              <button
                type="button"
                onClick={() => openUserLeadModal({ offerTag: 'Claim Free Launch Pass - App Section' })}
                className="mobile-app-offer-btn"
              >
                <span>Claim Free Launch Pass</span>
              </button>
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
  );
}
