import React from 'react';
import Navbar from '../../components/Navbar';
import LaunchingSoonBanner from '../../components/LaunchingSoonBanner';
import Footer from '../../components/Footer';
import trainerHeroImg from '../../assets/trainer-hero.webp';
import { openLeadModal } from '../../utils/modalUtils';
import './TrainersPage.css';

export default function TrainersPage() {
  const trainerPerks = [
    'Hyperlocal client matching across your city',
    'Multi-gym floor access without club lock-in',
    'Automated weekly direct payouts & reports',
    'Free digital profile & certification badge'
  ];

  return (
    <div className="trainers-page-wrapper">
      {/* Universal Sticky Navbar */}
      <Navbar
        ctaText="JOIN AS TRAINER"
        onCtaClick={() => openLeadModal({ category: 'interest', plan: 'Coach Network' })}
      />

      {/* =================================================================
          1. HERO SECTION (FULL-BLEED BACKGROUND IMAGE)
          ================================================================= */}
      <section
        className="trainers-hero-section"
        id="home"
        style={{ backgroundImage: `url(${trainerHeroImg})` }}
      >
        {/* Full-bleed cinematic gradient overlay for text contrast */}
        <div className="trainers-hero-overlay" />
        <div className="trainers-hero-glow-1" />
        <div className="trainers-hero-glow-2" />

        <div className="section-container">
          <div className="trainers-hero-grid">
            {/* Left Content Column */}
            <div className="trainers-hero-left">
              <div className="trainers-category-badge">
                <span className="trainers-badge-dot" />
                <span>FOR CERTIFIED PERSONAL TRAINERS &amp; COACHES</span>
              </div>

              <h1 className="trainers-hero-title">
                Empower Your <span className="trainers-serif-italic">Training.</span>
                <br />
                Monetize Your <span className="trainers-serif-italic">Coaching.</span>
              </h1>

              <p className="trainers-hero-desc">
                Join India's smart fitness network. Connect with high-intent fitness clients near you, conduct 1-on-1 sessions at top verified partner gyms with zero facility lock-ins, and keep 100% control over your schedule.
              </p>

              {/* Performed checkmarks */}
              <div className="trainers-perks-list">
                {trainerPerks.map((perk, idx) => (
                  <div key={idx} className="trainers-perk-item">
                    <span className="trainers-perk-check">✓</span>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="trainers-hero-cta-row">
                <button
                  type="button"
                  className="trainers-primary-btn"
                  onClick={() => openLeadModal({ category: 'interest', plan: 'Coach Network' })}
                >
                  <span>GET EARLY ACCESS</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column: Clean transparent space to let the background photo shine through */}
            <div className="trainers-hero-visual-col" />
          </div>
        </div>
      </section>

      {/* =================================================================
          2. SECTION 2: LAUNCHING SOON NOTE (REUSABLE COMPONENT)
          ================================================================= */}
      <LaunchingSoonBanner
        id="launching-soon"
        eyebrow="UPCOMING LAUNCH"
        title="Empowering"
        titleAccent="Coaches & Trainers"
        description="We are gearing up to launch India's first on-demand trainer network. Soon, certified coaches can train clients across verified gym floors with zero club lock-ins and guaranteed weekly payouts."
        newsTitle="Coming Soon"
        updates={[
          {
            date: 'PHASE 1 • UPCOMING',
            title: 'Founding Coach Onboarding',
            desc: 'Early onboarding for certified personal trainers with exclusive lifetime 0% commission & priority profile badging.'
          },
          {
            date: 'PHASE 2 • COMING SOON',
            title: 'Direct Client Matchmaking',
            desc: 'Receive direct booking requests from nearby fitness enthusiasts, with flexible multi-gym floor access.'
          }
        ]}
      />

      {/* =================================================================
          3. COMMON FOOTER
          ================================================================= */}
      <Footer />
    </div>
  );
}
