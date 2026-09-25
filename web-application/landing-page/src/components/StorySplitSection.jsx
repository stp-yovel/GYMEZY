import React from 'react';
import { Link } from 'react-router-dom';
import './StorySplitSection.css';

export default function StorySplitSection({ id = 'story' }) {
  return (
    <section className="about-story-split-section" id={id}>
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
              <Link to="/gym-owners" className="story-learn-btn">
                <span>Explore Gyms &amp; Passes</span>
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
  );
}
