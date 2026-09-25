import React from 'react';
import { openLeadModal, openUserLeadModal } from '../utils/modalUtils';
import './GymAlertsBanner.css';

export default function GymAlertsBanner({ id = 'newsletter' }) {
  return (
    <section className="vip-newsletter-section" id={id}>
      <div className="section-container">
        <div className="newsletter-banner-box">
          {/* Left Athlete Photo Card */}
          <div className="newsletter-photo-container">
            <img
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"
              alt="Athletes lifting dumbbells in gym"
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

            {/* Action Modal Buttons */}
            <div className="newsletter-actions-row">
              <button
                type="button"
                onClick={() => openUserLeadModal({ offerTag: 'Alerts Banner Athlete Pass' })}
                className="newsletter-cta-btn athlete-btn"
              >
                <span>Claim Free Launch Pass</span>
              </button>

              <button
                type="button"
                onClick={() => openLeadModal({ category: 'partner', plan: 'Alerts Banner Gym Partner' })}
                className="newsletter-cta-btn owner-btn"
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
