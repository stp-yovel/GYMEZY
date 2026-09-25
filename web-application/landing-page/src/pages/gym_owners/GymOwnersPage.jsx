import React from 'react';
import { ConfigProvider } from 'antd';
import gymezyLogo from '../../assets/logo/gymezy.png';
import Navbar from '../../components/Navbar';
import GymPartnerShowcase from '../../components/GymPartnerShowcase';
import PartnerPricingPlans from '../../components/PartnerPricingPlans';
import Footer from '../../components/Footer';
import { openLeadModal } from '../../utils/modalUtils';
import './GymOwnersPage.css';

export default function GymOwnersPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00BF62',
          borderRadius: 16,
        },
      }}
    >
      <div className="gym-owners-page-wrapper">
        {/* Top Navbar */}
        <Navbar
          ctaText="LIST YOUR GYM"
          onCtaClick={() => openLeadModal({ category: 'demo', plan: 'Gym Listing' })}
        />

        {/* Hero Section */}
        <section className="owner-hero-split-section">
          {/* Subtle Ambient Radial Glow */}
          <div className="hero-ambient-glow" />

          <div className="section-container owner-hero-split-grid">
            {/* Left Column: Content */}
            <div className="hero-split-left">
              <h1 className="hero-split-headline">
                Grow Your Gym.
                <br />
                <span className="title-italic-accent">Simplify Everything.</span>
              </h1>

              <p className="hero-split-subtext">
                Manage your gym operations, active members, daily bookings, and revenue settlements – all from one powerful, modern dashboard.
              </p>

              <ul className="hero-checklist-items">
                <li>
                  <span className="check-circle-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>All-in-one management dashboard</span>
                </li>
                <li>
                  <span className="check-circle-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Increase members & recurring revenue</span>
                </li>
                <li>
                  <span className="check-circle-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>Smart telemetry & capacity insights</span>
                </li>
                <li>
                  <span className="check-circle-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>100% transparent subscription model</span>
                </li>
              </ul>

              <div className="hero-split-buttons">
                <button
                  type="button"
                  className="hero-btn-primary"
                  onClick={() => openLeadModal({ category: 'demo', plan: 'Gym Owner Demo' })}
                >
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Request Live Demo</span>
                </button>
              </div>
            </div>

            {/* Right Column: Device Mockups (Realistic MacBook Pro + iPhone 16 Pro) */}
            <div className="hero-split-right">
              <div className="device-showcase-wrapper">
                {/* MacBook Pro Mockup */}
                <div className="laptop-device-frame">
                  {/* Laptop Lid Screen Bezel */}
                  <div className="laptop-screen-bezel">
                    {/* Top Notch with Camera & Ambient Sensor */}
                    <div className="laptop-camera-notch">
                      <div className="laptop-camera-lens">
                        <span className="lens-reflection" />
                      </div>
                      <div className="laptop-sensor-dot" />
                    </div>

                    <div className="laptop-screen-content">
                      {/* Dashboard Sidebar */}
                      <aside className="laptop-sidebar">
                        <div className="sidebar-brand">
                          <img src={gymezyLogo} alt="GYMEZY Logo" className="sidebar-logo-icon" />
                          <span className="sidebar-brand-name">GYMEZY</span>
                        </div>

                        <nav className="sidebar-menu">
                          <div className="sidebar-item active">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                              </svg>
                            </span>
                            <span>Overview</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                            </span>
                            <span>Members</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                            </span>
                            <span>Bookings</span>
                            <span className="sidebar-badge">32</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <polyline points="16 11 18 13 22 9" />
                              </svg>
                            </span>
                            <span>Walk-ins</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            </span>
                            <span>Staff</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                            </span>
                            <span>Attendance</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                              </svg>
                            </span>
                            <span>Reports</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                              </svg>
                            </span>
                            <span>Finance</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                <line x1="7" y1="7" x2="7.01" y2="7" />
                              </svg>
                            </span>
                            <span>Promotions</span>
                          </div>

                          <div className="sidebar-item">
                            <span className="sidebar-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                              </svg>
                            </span>
                            <span>Settings</span>
                          </div>
                        </nav>
                      </aside>

                      {/* Dashboard Main Area */}
                      <main className="laptop-main-dashboard">
                        {/* Dashboard Top Header */}
                        <div className="dashboard-top-row">
                          <h2 className="dashboard-page-title">Dashboard Overview</h2>
                          <div className="dashboard-controls-row">
                            <div className="date-picker-badge">
                              <svg className="picker-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              <span>May 20 – May 26, 2026</span>
                              <svg className="chevron-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>
                            <button type="button" className="export-report-btn">
                              Export Report
                            </button>
                          </div>
                        </div>

                        {/* Top Metric Cards (Row 1) */}
                        <div className="dashboard-stats-grid">
                          <div className="dash-metric-card">
                            <span className="dash-metric-label">Total Revenue</span>
                            <div className="dash-metric-val">₹2,45,800</div>
                            <div className="dash-metric-trend trend-up">
                              <span>↑ 18.6%</span> vs last week
                            </div>
                          </div>

                          <div className="dash-metric-card">
                            <span className="dash-metric-label">Walk-in Revenue</span>
                            <div className="dash-metric-val">₹1,25,400</div>
                            <div className="dash-metric-trend trend-up">
                              <span>↑ 15.3%</span> vs last week
                            </div>
                          </div>

                          <div className="dash-metric-card">
                            <span className="dash-metric-label">App Booking Revenue</span>
                            <div className="dash-metric-val">₹1,20,400</div>
                            <div className="dash-metric-trend trend-up">
                              <span>↑ 22.1%</span> vs last week
                            </div>
                          </div>
                        </div>

                        {/* Secondary Metrics (Row 2) */}
                        <div className="dashboard-stats-grid">
                          <div className="dash-metric-card">
                            <span className="dash-metric-label">Total Active Users</span>
                            <div className="dash-metric-val">1,243</div>
                            <div className="dash-metric-trend trend-up">
                              <span>↑ 12.4%</span>
                            </div>
                          </div>

                          <div className="dash-metric-card">
                            <span className="dash-metric-label">Walk-in Count</span>
                            <div className="dash-metric-val">842</div>
                            <div className="dash-metric-trend trend-up">
                              <span>↑ 9.8%</span>
                            </div>
                          </div>

                          <div className="dash-metric-card">
                            <span className="dash-metric-label">Booking Count</span>
                            <div className="dash-metric-val">401</div>
                            <div className="dash-metric-trend trend-up">
                              <span>↑ 16.7%</span>
                            </div>
                          </div>
                        </div>

                        {/* Recent Bookings Table */}
                        <div className="dash-recent-bookings-box">
                          <div className="bookings-header-flex">
                            <h3 className="bookings-table-title">Recent Bookings</h3>
                            <span className="bookings-view-all">View all &gt;</span>
                          </div>

                          <table className="bookings-table">
                            <thead>
                              <tr>
                                <th>Customer Name</th>
                                <th>Type</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="font-semibold">Arun Kumar</td>
                                <td>App Booking</td>
                                <td>26 May, 2026 07:00 AM</td>
                                <td><span className="status-badge status-confirmed">Confirmed</span></td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Priya Sharma</td>
                                <td>Walk-in</td>
                                <td>26 May, 2026 08:30 AM</td>
                                <td><span className="status-badge status-confirmed">Confirmed</span></td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Rohit Verma</td>
                                <td>App Booking</td>
                                <td>26 May, 2026 09:15 AM</td>
                                <td><span className="status-badge status-confirmed">Confirmed</span></td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Sneha Iyer</td>
                                <td>Walk-in</td>
                                <td>26 May, 2026 10:00 AM</td>
                                <td><span className="status-badge status-confirmed">Confirmed</span></td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Karthik R.</td>
                                <td>App Booking</td>
                                <td>26 May, 2026 11:30 AM</td>
                                <td><span className="status-badge status-confirmed">Confirmed</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </main>
                    </div>
                  </div>

                  {/* MacBook Pro Unibody Base Chassis */}
                  <div className="laptop-base-stand">
                    <div className="laptop-notch-cutout" />
                  </div>
                </div>

                {/* iPhone 16 Pro Companion Frame */}
                <div className="mobile-device-frame">
                  {/* Physical Hardware Buttons */}
                  <div className="iphone-btn-volume-up" />
                  <div className="iphone-btn-volume-down" />
                  <div className="iphone-btn-power" />

                  {/* Screen Bezel & Dynamic Island */}
                  <div className="mobile-screen-content">
                    {/* Status Bar with Dynamic Island */}
                    <div className="mobile-status-bar">
                      <span className="mobile-time">9:41</span>
                      
                      {/* Apple Dynamic Island */}
                      <div className="dynamic-island-pill">
                        <div className="island-camera-dot" />
                        <div className="island-sensor-dot" />
                      </div>

                      <div className="mobile-status-icons">
                        <svg className="status-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                          <line x1="12" y1="20" x2="12.01" y2="20" />
                        </svg>
                        <svg className="status-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="16" height="10" rx="2" />
                          <line x1="22" y1="11" x2="22" y2="13" />
                          <rect x="4" y="9" width="8" height="6" fill="currentColor" />
                        </svg>
                      </div>
                    </div>

                    <div className="mobile-dash-header">
                      <h3>Dashboard</h3>
                      <button type="button" className="mobile-add-btn" aria-label="Add entry">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mobile-cards-scroll">
                      <div className="mobile-metric-card">
                        <span className="mobile-metric-label">Total Revenue</span>
                        <div className="mobile-metric-val">₹2,45,800</div>
                        <span className="mobile-metric-trend">↑ 18.6% vs last week</span>
                      </div>

                      <div className="mobile-metric-card">
                        <span className="mobile-metric-label">Walk-in Revenue</span>
                        <div className="mobile-metric-val">₹1,25,400</div>
                        <span className="mobile-metric-trend">↑ 15.3% vs last week</span>
                      </div>

                      <div className="mobile-metric-card">
                        <span className="mobile-metric-label">App Booking Revenue</span>
                        <div className="mobile-metric-val">₹1,20,400</div>
                        <span className="mobile-metric-trend">↑ 22.1% vs last week</span>
                      </div>

                      <div className="mobile-metric-card">
                        <span className="mobile-metric-label">Total Active Users</span>
                        <div className="mobile-metric-val">1,243</div>
                        <span className="mobile-metric-trend">↑ 12.4%</span>
                      </div>
                    </div>

                    {/* iOS Home Indicator Bar */}
                    <div className="ios-home-indicator" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gym Partner Showcase (Telemetry & Walk-ins) */}
        <GymPartnerShowcase ctaLink="#pricing" ctaText="PARTNER WITH US" />

        {/* 4 Partner Subscription Plans */}
        <PartnerPricingPlans ctaLink="#contact" />

        {/* Footer */}
        <Footer />
      </div>
    </ConfigProvider>
  );
}
