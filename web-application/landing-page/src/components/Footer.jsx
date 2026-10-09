import React from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { MapsLocation02Icon, Call02Icon, Mail01Icon } from '@hugeicons/core-free-icons';
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
            <div className="footer-social-wrapper">
              <span className="footer-social-title">Follow Us</span>
              <div className="footer-social-links" aria-label="Social media links">
              <a
                href="https://www.instagram.com/gymezyfitness/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn footer-social-instagram"
                aria-label="Follow GYMEZY on Instagram"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://x.com/GymezyFitnubwj?s=20"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn footer-social-x"
                aria-label="Follow GYMEZY on X (Twitter)"
                title="X (Twitter)"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/gymezy-fitness-solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn footer-social-linkedin"
                aria-label="Follow GYMEZY on LinkedIn"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.55a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6z" />
                </svg>
              </a>
              <a
                href="https://wa.me/919150955071"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn footer-social-whatsapp"
                aria-label="Chat with GYMEZY on WhatsApp"
                title="Chat on WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.979-.276-.1-.477-.15-.678.15-.201.3-.778.979-.954 1.18-.175.2-.351.225-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.501.101-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.241-.244-.59-.493-.51-.678-.52-.175-.009-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.201 2.124 3.243 5.145 4.549.719.31 1.28.496 1.718.635.722.23 1.378.197 1.898.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.175-1.431-.075-.125-.276-.2-.577-.35zM12.042 21.75c-1.745 0-3.456-.468-4.965-1.353l-.356-.21-3.693.968.986-3.6-.231-.368A9.704 9.704 0 0 1 2.25 12.042C2.25 6.643 6.643 2.25 12.042 2.25c2.617 0 5.076 1.018 6.927 2.87 1.85 1.85 2.87 4.31 2.87 6.922 0 5.4-4.394 9.708-9.797 9.708zm8.35-18.067C18.17 1.463 15.228.25 12.042.25 5.53.25.25 5.531.25 12.042c0 2.08.543 4.11 1.573 5.901L0 24l6.236-1.636a11.75 11.75 0 0 0 5.806 1.53h.005c6.51 0 11.792-5.281 11.792-11.793 0-3.15-1.226-6.11-3.447-8.418z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@gymezy"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn footer-social-youtube"
                aria-label="Subscribe to GYMEZY on YouTube"
                title="YouTube"
              >
                <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

          {/* Explore Column */}
          <div className="footer-nav-col">
            <h3 className="footer-col-header">Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/about">About GYMEZY</Link>
            <Link to="/trainers">For Trainers</Link>
            <a href="/#faq">FAQ</a>
          </div>

          {/* Partnerships Column */}
          <div className="footer-nav-col">
            <h3 className="footer-col-header">Partnerships</h3>
            <Link to="/gym-owners">For Gym Owners</Link>
            <Link to="/trainers">For Trainers</Link>
            <Link to="/gym-owners#pricing">Partner Plans</Link>
          </div>

          {/* Contact Column */}
          <div className="footer-nav-col footer-contact-col">
            <h3 className="footer-col-header">Contact &amp; Office</h3>
            <div className="footer-contact-item-stacked">
              <span className="contact-col-label">Registered office:</span>
              <span className="contact-col-val">
                Second Floor, Mahalakshmi Nagar, Plot No 5, Jyothi Nagar, Moulivakkam, Kolathuvancheri, Tamil Nadu 600125
              </span>
              <a
                href="https://www.google.com/maps/place/Gymezy+Fitness+Solutions/@13.02381,80.1342988,1189m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3a5261997ee89085:0x98061ceda000a86d!8m2!3d13.0238048!4d80.1368791!16s%2Fg%2F11zgv3d1_x?entry=tts&g_ep=EgoyMDI2MDkyMy4wIPu8ASoASAFQAw%3D%3D&skid=753a0790-e509-4a06-b142-2a1ce24f00dc"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="footer-map-link"
                title="View on Google Maps"
              >
                <HugeiconsIcon icon={MapsLocation02Icon} size={15} className="footer-map-icon" />
                <span>Map</span>
              </a>
            </div>
            <div className="footer-contact-item-inline">
              <HugeiconsIcon icon={Call02Icon} size={16} className="footer-contact-icon" />
              <span className="contact-col-val">
                <a href="tel:9150955071">9150955071</a> / <a href="tel:9884881983">9884881983</a>
              </span>
            </div>
            <div className="footer-contact-item-inline">
              <HugeiconsIcon icon={Mail01Icon} size={16} className="footer-contact-icon" />
              <span className="contact-col-val">
                <a href="mailto:praveen.k@gymezy.com">praveen.k@gymezy.com</a>
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-copyright">
          <span>
            © {new Date().getFullYear()} GYMEZY Fitness Network. All rights reserved. | Empowering athletes, gyms, and coaches everywhere.
          </span>
          <span className="footer-craft-tag">
            <span className="footer-crafted-by">Crafted by</span>{' '}
            <a
              href="https://www.softrateglobal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-softrate-link"
              title="Visit Softrate Global"
            >
              <strong className="footer-softrate-brand">Softrate</strong>
            </a>{' '}
            <svg
              className="footer-heart-svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="#ef4444"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
        </div>
      </div>
    </footer>
  );
}
