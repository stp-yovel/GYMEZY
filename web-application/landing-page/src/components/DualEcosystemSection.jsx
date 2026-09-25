import React from 'react';
import trainerImg from '../assets/trainer.png';
import { openLeadModal, openUserLeadModal } from '../utils/modalUtils';
import './DualEcosystemSection.css';

export default function DualEcosystemSection({ id = 'ecosystem' }) {
  const athleteBenefits = [
    {
      title: 'Multi-Gym Freedom',
      desc: 'Single pass unlocks weights, CrossFit boxes, and cardio floors across the city with zero lock-in contracts.'
    },
    {
      title: 'Hyperlocal Discovery',
      desc: 'Find verified gyms nearby with live distance, equipment lists, and certified sanitized amenities.'
    },
    {
      title: 'Certified Personal Trainers',
      desc: 'Book certified 1-on-1 fitness coaches for single sessions or custom training blocks on demand.'
    },
    {
      title: 'Instant Digital QR Entry',
      desc: 'No front-desk paperwork. Book your session on mobile, scan your dynamic QR code, and start lifting.'
    }
  ];

  const ownerBenefits = [
    {
      title: 'Monetize Off-Peak Hours',
      desc: 'Attract high-intent fitness seekers during morning and afternoon open slots without discounting.'
    },
    {
      title: 'Zero Risk & Fast Payouts',
      desc: 'Free partner onboarding with transparent automated weekly settlements transferred directly to your bank.'
    },
    {
      title: 'Turnkey Partner Dashboard',
      desc: 'Real-time attendance tracking, digital QR check-in scanning, and member analytics in one clean app.'
    },
    {
      title: 'Hyperlocal Member Reach',
      desc: 'Get top visibility when active athletes and trainees in your locality search for nearby fitness facilities.'
    }
  ];

  return (
    <section className="about-why-section" id={id}>
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
              <h3 className="panel-headline">Workout Anywhere &amp; Train on Your Own Terms</h3>
              <p className="panel-subhead">Total freedom of choice across premier gyms, certified trainers, and flexible passes in your city.</p>
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
              <button
                type="button"
                onClick={() => openUserLeadModal({ offerTag: 'VIP Launch Pass Offer' })}
                className="panel-cta-btn athlete-cta"
                style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                <span>Claim Free Launch Pass</span>
              </button>
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
                <span>FOR GYM &amp; STUDIO OWNERS</span>
              </div>
              <h3 className="panel-headline">Scale Footfall &amp; Maximize Your Gym Revenue</h3>
              <p className="panel-subhead">Transform empty floor slots into predictable, recurring profits with zero upfront onboarding risk.</p>
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
              <button
                type="button"
                onClick={() => openLeadModal({ category: 'demo', plan: 'Free Gym Partner Registration' })}
                className="panel-cta-btn owner-cta"
                style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                <span>Partner &amp; Scale Your Gym Free</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
