import React, { useState } from 'react';
import defaultTrainerImg from '../assets/trainer-hero.webp';
import { openLeadModal } from '../utils/modalUtils';
import './LaunchingSoonBanner.css';

export default function LaunchingSoonBanner({
  id = 'launching-soon',
  eyebrow = 'We Are',
  title = 'Forging',
  titleAccent = 'Greatness',
  description = 'A brand new way to connect with verified gyms, book certified personal coaches, and experience seamless fitness. We strive to be the best while offering up simple services.',
  image = defaultTrainerImg,
  newsTitle = 'Latest Updates',
  updates = [
    {
      date: '20TH AUG 2026',
      title: 'Beta Launch v1.2',
      desc: 'Exclusive early onboarding for certified personal trainers with zero introductory platform fees.'
    },
    {
      date: '18TH JUL 2026',
      title: 'Sign up Now',
      desc: 'Join the priority coach waitlist to unlock verified badges, schedule autonomy, and direct booking requests.'
    }
  ]
}) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="launching-editorial-section" id={id}>
      <div className="section-container">
        <div className="launching-editorial-wrapper">
          {/* Top-Right Decorative Emerald Accent Block */}
          <div className="launching-top-amber-accent" />

          <div className="launching-grid-container">
            {/* Left Column: Content + Green Dock at Bottom */}
            <div className="launching-left-wrapper">
              <div className="launching-content-col">
                <span className="launching-eyebrow-text">{eyebrow}</span>

                <h2 className="launching-headline">
                  {title}
                  <br />
                  <span className="launching-headline-accent">{titleAccent}</span>
                </h2>

                <p className="launching-description">
                  <em>A brand new way</em> {description.replace(/^A brand new way\s*/i, '')}
                </p>

                {/* Action / Subscribe CTA */}
                <div className="launching-cta-block">
                  {isSubmitted ? (
                    <div className="launching-success-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>You're on the early access VIP list!</span>
                    </div>
                  ) : showInput ? (
                    <form className="launching-inline-form" onSubmit={handleSubmit}>
                      <input
                        type="email"
                        className="launching-inline-input"
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        required
                      />
                      <button type="submit" className="launching-boxed-btn active-submit">
                        <span>CONFIRM</span>
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      className="launching-boxed-btn"
                      onClick={() => openLeadModal({ category: 'interest', plan: 'Coach Network' })}
                    >
                      <span>JOIN WAITLIST</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Left Dock: Solid Emerald Green Box */}
              <div className="launching-dock-left">
                <h3 className="launching-dock-heading">{newsTitle}</h3>
              </div>
            </div>

            {/* Right Column: Hero photo full height with transparent/frosted glass overlay at bottom */}
            <div className="launching-right-wrapper">
              <div className="launching-photo-frame">
                <img
                  src={image}
                  alt="GYMEZY Launching Soon - Trainer Showcase"
                  className="launching-hero-photo"
                />

                {/* Transparent Frosted Glass Milestone Overlay */}
                <div className="launching-dock-right">
                  {updates.map((item, idx) => (
                    <div key={idx} className="launching-milestone-card">
                      <span className="milestone-date">{item.date}</span>
                      <h4 className="milestone-title">{item.title}</h4>
                      <p className="milestone-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
