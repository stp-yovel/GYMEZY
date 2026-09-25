import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gymezyLogo from '../assets/logo/gymezy.png';
import './Navbar.css';

export default function Navbar({
  ctaText = 'EXPLORE PASSES',
  ctaLink = '/#pricing',
  onCtaClick
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkHeroPage = true; // All main pages (Home, Customers, Gym Owners) feature the dark luxury hero aesthetic

  return (
    <header
      className={`fitnova-navbar ${
        isScrolled || !isDarkHeroPage ? 'fitnova-navbar-scrolled' : ''
      }`}
    >
      <div className="fitnova-nav-container">
        <div className="fitnova-nav-left">
          <Link to="/" className="fitnova-logo">
            <img
              src={gymezyLogo}
              alt="GYMEZY Logo"
              className={`fitnova-logo-img ${
                isScrolled || !isDarkHeroPage ? '' : 'white-filter'
              }`}
            />
            <span className="fitnova-logo-text">GYMEZY</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="fitnova-nav-links">
          <Link
            to="/"
            className={`fitnova-nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`fitnova-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About Us
          </Link>
          <Link
            to="/customers"
            className={`fitnova-nav-link ${location.pathname === '/customers' ? 'active' : ''}`}
          >
            For Customers
          </Link>
          <Link
            to="/gym-owners"
            className={`fitnova-nav-link ${location.pathname === '/gym-owners' ? 'active' : ''}`}
          >
            For Gym Owners
          </Link>
          <Link
            to="/trainers"
            className={`fitnova-nav-link ${location.pathname === '/trainers' ? 'active' : ''}`}
          >
            For Trainers
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="fitnova-nav-cta">
          {onCtaClick ? (
            <button
              type="button"
              className="fitnova-primary-btn"
              onClick={onCtaClick}
            >
              {ctaText}
            </button>
          ) : ctaLink.startsWith('/#') || ctaLink.startsWith('#') ? (
            <a href={ctaLink} className="fitnova-primary-btn">
              {ctaText}
            </a>
          ) : (
            <Link to={ctaLink} className="fitnova-primary-btn">
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
