import React from 'react';
import { Link } from 'react-router-dom';
import gymezyLogo from '../assets/logo/gymezy.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="section-container">
        <div className="footer-links-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <img src={gymezyLogo} alt="GYMEZY Logo" className="footer-logo-img" />
              <span className="footer-logo-text">GYMEZY</span>
            </Link>
            <p className="footer-brand-desc">
              GYMEZY connects fitness enthusiasts with top-rated gyms, certified trainers, and flexible passes across your city with zero lock-in contracts.
            </p>
          </div>

          {/* Explore Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-header">Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About GYMEZY</Link>
            <Link to="/customers">For Customers</Link>
            <Link to="/gym-owners">For Gym Owners</Link>
            <Link to="/trainers">For Trainers</Link>
            <a href="/#app">Mobile App</a>
          </div>

          {/* Partnerships Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-header">Partnerships</h4>
            <Link to="/gym-owners">For Gym Owners</Link>
            <Link to="/trainers">For Trainers</Link>
            <Link to="/gym-owners#pricing">Partner Plans</Link>
          </div>

          {/* Contact Column */}
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
          <span className="footer-craft-tag">
            <span className="footer-crafted-by">Crafted by</span>{' '}
            <strong className="footer-softrate-brand">Softrate</strong>{' '}
            <svg
              className="footer-heart-svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="#ef4444"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>{' '}
            | Empowering athletes, gyms, and coaches everywhere.
          </span>
        </div>
      </div>
    </footer>
  );
}
