import React, { useState } from 'react';
import './PartnerPricingPlans.css';

export default function PartnerPricingPlans({
  ctaLink = '#contact'
}) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = [
    {
      id: 'free-listing',
      name: 'Free Listing',
      badge: 'Starter',
      price: 'Free',
      period: 'lifetime free',
      desc: 'Get your gym listed on the GYMEZY directory for basic brand discovery by local fitness seekers.',
      features: [
        { text: 'Basic Gym Discovery Profile', included: true },
        { text: 'Photos & Amenities Showcase', included: true },
        { text: 'Customer Phone Number Access', included: false },
        { text: 'Day Pass & Session Bookings', included: false },
        { text: 'Map Location & Navigation', included: false },
        { text: 'GMS Dashboard & Operations', included: false }
      ],
      popular: false,
      ctaText: 'Claim Free Listing'
    },
    {
      id: 'gms',
      name: 'GMS Software',
      badge: 'Operations',
      price: billingCycle === 'monthly' ? '₹999' : '₹799',
      period: billingCycle === 'monthly' ? 'per month' : 'per mo (billed yearly)',
      desc: 'Complete standalone gym management software to digitize your everyday floor and staff operations.',
      features: [
        { text: 'Mobile App & Web Admin Dashboard', included: true },
        { text: 'Existing Member ERP Management', included: true },
        { text: 'Staff & Employee Attendance', included: true },
        { text: 'New Member Addition & Records', included: true },
        { text: 'Fee Expiry & Renewal Alerts', included: true },
        { text: 'GYMEZY Marketplace App Listing', included: false },
        { text: 'Consumer Session & Pass Bookings', included: false }
      ],
      popular: false,
      ctaText: 'Get GMS Software'
    },
    {
      id: 'app-listing',
      name: 'App Listing',
      badge: 'Marketplace',
      price: billingCycle === 'monthly' ? '₹1,499' : '₹1,199',
      period: billingCycle === 'monthly' ? 'per month' : 'per mo (billed yearly)',
      desc: 'Boost your walk-ins and direct inquiries by getting listed on the GYMEZY Consumer App marketplace.',
      features: [
        { text: 'Featured GYMEZY Marketplace Listing', included: true },
        { text: 'Direct Gym Phone Number & Inquiries', included: true },
        { text: 'Turn-by-Turn Map & Navigation', included: true },
        { text: 'Consumer Day Pass & Session Bookings', included: true },
        { text: 'High-intent Local Fitness Traffic', included: true },
        { text: 'Staff Attendance & Shift Tracking', included: false },
        { text: 'Existing Member ERP Management', included: false }
      ],
      popular: false,
      ctaText: 'Get App Listing'
    },
    {
      id: 'hybrid',
      name: 'Hybrid Partner',
      badge: 'Most Popular',
      price: billingCycle === 'monthly' ? '₹1,999' : '₹1,599',
      period: billingCycle === 'monthly' ? 'per month' : 'per mo (billed yearly)',
      desc: 'The complete end-to-end powerhouse combining standalone GMS tools with full marketplace exposure.',
      features: [
        { text: 'Full GMS ERP + Mobile Staff App', included: true },
        { text: 'Member Management & Attendance', included: true },
        { text: 'Featured GYMEZY Marketplace Listing', included: true },
        { text: 'Direct Phone, Map & Session Bookings', included: true },
        { text: 'Automated Fee Renewals & Payouts', included: true },
        { text: 'Priority 24/7 Dedicated Partner Support', included: true }
      ],
      popular: true,
      ctaText: 'Join Hybrid Plan'
    }
  ];

  return (
    <section className="pricing-modern-section" id="pricing">
      <div className="section-container">
        <div className="section-centered-header">
          <span className="section-category-pill">Partner Subscription Plans</span>
          <h2 className="section-heading-lg">
            Choose the Right Plan For <span className="title-italic-accent">Your Gym</span>
          </h2>
          <p className="section-sub-desc">
            Flexible subscription tiers designed for fitness business owners: from free discovery and standalone GMS operations to high-growth marketplace listing and all-in-one hybrid packages.
          </p>

          <div className="billing-toggle-wrapper">
            <button
              type="button"
              className={`billing-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              className={`billing-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Annual Billing <span className="discount-tag">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-cards-grid">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card-box ${plan.popular ? 'highlighted-pro' : ''}`}
            >
              {plan.popular && <div className="popular-badge-ribbon">{plan.badge}</div>}

              <div className="pricing-card-head">
                <h3 className="plan-name-title">{plan.name}</h3>
                <div className="plan-price-group">
                  <span className="plan-price-val">{plan.price}</span>
                  <span className="plan-price-period">({plan.period})</span>
                </div>
                <p className="plan-desc-text">{plan.desc}</p>
              </div>

              <ul className="plan-features-list">
                {plan.features.map((feat, fidx) => (
                  <li
                    key={fidx}
                    className={feat.included ? 'feature-enabled' : 'feature-disabled'}
                  >
                    {feat.included ? (
                      <span className="feature-check-icon">✓</span>
                    ) : (
                      <span className="feature-cross-icon">✕</span>
                    )}
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>

              <a
                href={ctaLink}
                className={`plan-select-btn ${plan.popular ? 'btn-popular' : ''}`}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
