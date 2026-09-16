import React from 'react';
import './GymPartnerShowcase.css';

export default function GymPartnerShowcase({
  ctaText = 'PARTNER WITH US',
  ctaLink = '#contact'
}) {
  return (
    <section className="progress-analytics-section" id="business-showcase">
      <div className="section-container">
        <div className="analytics-split-layout">
          {/* Left Visual Column with Dumbbell Athlete and 2 Floating Cards */}
          <div className="analytics-visual-col">
            <div className="analytics-athlete-card">
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80"
                alt="Athlete barbell workout in modern gym"
                className="analytics-athlete-bg-img"
              />

              {/* Top-Left Brand Floating Card */}
              <div className="telemetry-brand-pill-card">
                <span className="telemetry-card-tag">Partner Gym Network</span>
                <div className="telemetry-big-stat-row">
                  <span className="telemetry-big-number">
                    100<span className="percent-mark">%</span>
                  </span>
                  <span className="telemetry-sub-metric">
                    Verified
                    <br />
                    Centres
                  </span>
                </div>
              </div>

              {/* Bottom-Left White Management Card */}
              <div className="telemetry-routine-card">
                <h4 className="routine-card-title">Live Partner Overview</h4>
                <div className="routine-chips-row">
                  <span className="routine-chip chip-active">Verified Gym</span>
                  <span className="routine-chip">Smart Check-in</span>
                  <span className="routine-chip">Slot Analytics</span>
                </div>
                <div className="routine-progress-group">
                  <span className="routine-progress-label">
                    Monthly Revenue Target • 85% Achieved
                  </span>
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
                Grow your gym
                <br />
                revenue &
                <br />
                member walk-ins
              </h2>

              <div className="feature-card-divider-group">
                <div className="divider-line" />
                <div className="divider-triangle-mark" />
                <div className="divider-line" />
              </div>

              <p className="feature-brand-description">
                Empower your fitness center with GYMEZY. Showcase your verified
                facilities, digitize member check-ins, monetize floor capacity,
                and connect with high-intent fitness seekers across your city.
              </p>
            </div>

            <a href={ctaLink} className="feature-card-discover-btn">
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
