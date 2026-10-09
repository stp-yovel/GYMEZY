import React, { useEffect } from 'react';
import gymezyLogo from '../assets/logo/gymezy.png';
import './WelcomeRoleModal.css';

export default function WelcomeRoleModal({
  isOpen = false,
  onClose,
  onSelectCustomer,
  onSelectOwner
}) {
  // Lock body scroll when open and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (onClose) onClose();
    }
  };

  return (
    <div className="role-modal-overlay" onClick={handleBackdropClick}>
      <div
        className="role-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          className="role-modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Brand Header: Logo on left, Text on right */}
        <div className="role-modal-header">
          <div className="role-modal-logo-wrap">
            <img src={gymezyLogo} alt="GYMEZY Logo" className="role-modal-logo" />
          </div>
          <div className="role-modal-header-text">
            <span className="role-modal-tagline">Connecting People, Empowering Fitness</span>
            <h2 id="role-modal-title" className="role-modal-title">
              How would you like to join?
            </h2>
          </div>
        </div>

        {/* Choice Action Buttons */}
        <div className="role-modal-actions">
          {/* Option 1: Gym Owner / Business Owner */}
          <button
            type="button"
            className="role-choice-btn owner-btn"
            onClick={onSelectOwner}
          >
            <span>Gym Owner / Business Owner</span>
            <svg className="role-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Option 2: Customer */}
          <button
            type="button"
            className="role-choice-btn customer-btn"
            onClick={onSelectCustomer}
          >
            <span>Customer</span>
            <svg className="role-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
