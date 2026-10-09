import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PhilosophyCarousel.css';

export const DEFAULT_PHILOSOPHY_ITEMS = [
  {
    id: 1,
    num: '01',
    title: 'Verified Fitness Centres',
    tag: 'Flexible Access',
    desc: 'Pay only for the sessions you use. Full gym floor & equipment access with instant OTP entry.',
    mission: 'Eliminate fitness barriers by connecting you with top gym facilities, certified coaches, and flexible passes across your city.',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    link: '#services'
  },
  {
    id: 2,
    num: '02',
    title: 'Certified Personal Trainers',
    tag: '1-on-1 Coaching',
    desc: 'Book certified coaches for strength, weight loss, HIIT, and customized nutrition guidance.',
    mission: 'Empower your fitness journey with certified personal trainers, tailored 1-on-1 workouts, and expert nutrition guidance.',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    link: '#services'
  },
  {
    id: 3,
    num: '03',
    title: 'Group Classes & Studios',
    tag: 'Yoga, Zumba & HIIT',
    desc: 'Join high-energy group fitness classes led by certified studio instructors.',
    mission: 'Build vibrant fitness communities by connecting you with top group studios, energized Zumba, Yoga, and HIIT sessions.',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    link: '#services'
  }
];

export default function PhilosophyCarousel({ items = DEFAULT_PHILOSOPHY_ITEMS }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeItems = items && items.length > 0 ? items : DEFAULT_PHILOSOPHY_ITEMS;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  const handleCardClick = (offset) => {
    if (offset === 0) return; // Already featured
    setCurrentIndex((prev) => (prev + offset + activeItems.length) % activeItems.length);
  };

  // Re-ordered 3 cards according to active index:
  // Slot 0 (Featured Left), Slot 1 (Right 1), Slot 2 (Right 2)
  const orderedItems = [
    { item: activeItems[currentIndex % activeItems.length], slot: 0 },
    { item: activeItems[(currentIndex + 1) % activeItems.length], slot: 1 },
    { item: activeItems[(currentIndex + 2) % activeItems.length], slot: 2 }
  ];

  const featuredItem = activeItems[currentIndex % activeItems.length];

  const springConfig = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8
  };

  return (
    <div className="philosophy-carousel-wrapper">
      <div className="philosophy-header-row">
        <h2 className="philosophy-title">
          At GYMEZY, we believe
          <br />
          <span className="title-italic-accent">fitness</span> should be flexible and accessible
        </h2>
        <div className="philosophy-header-controls">
          <div className="carousel-nav-arrows">
            <motion.button
              type="button"
              className="carousel-arrow-btn active"
              onClick={handlePrev}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous class"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
            <motion.button
              type="button"
              className="carousel-arrow-btn active"
              onClick={handleNext}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next class"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

        {/* Unified 3-Card Layout with Framer Motion FLIP Physical Swap */}
      <div className="philosophy-asymmetric-grid">
        {orderedItems.map(({ item, slot }, index) => {
          const isFeatured = slot === 0;
          const slotClass = isFeatured
            ? 'slot-featured'
            : slot === 1
              ? 'slot-sm-1'
              : 'slot-sm-2';

          return (
            <motion.div
              key={item.id}
              layoutId={`philosophy-card-item-${item.id}`}
              layout
              transition={{
                layout: springConfig,
                opacity: { duration: 0.25 }
              }}
              className={`philosophy-swap-card ${slotClass}`}
              onClick={() => handleCardClick(index)}
              whileHover={isFeatured ? {} : { scale: 1.025, y: -4 }}
              whileTap={isFeatured ? {} : { scale: 0.98 }}
              role={isFeatured ? 'region' : 'button'}
              tabIndex={isFeatured ? -1 : 0}
              onKeyDown={(e) => {
                if (!isFeatured && (e.key === 'Enter' || e.key === ' ')) {
                  handleCardClick(index);
                }
              }}
              aria-label={isFeatured ? item.title : `Select ${item.title}`}
            >
              <div className="philosophy-card-media-wrapper">
                <motion.img
                  layoutId={`philosophy-img-${item.id}`}
                  layout
                  src={item.img}
                  alt={item.title}
                  className="asymmetric-card-img"
                  transition={{ layout: springConfig }}
                />
                <div className="philosophy-card-vignette" />
              </div>

              {/* Dynamic Bottom Pill Overlay */}
              <motion.div
                layoutId={`philosophy-pill-${item.id}`}
                layout
                className={`floating-card-pill-overlay ${isFeatured ? '' : 'sm-pill'}`}
                transition={{ layout: springConfig }}
              >
                <span className="pill-card-title">{item.title}</span>
                <a
                  href={item.link || '#services'}
                  className="pill-view-now-btn"
                  onClick={(e) => {
                    if (!isFeatured) {
                      e.stopPropagation();
                      handleCardClick(index);
                    }
                  }}
                >
                  Explore
                </a>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Mobile Pagination Dots */}
        <div className="philosophy-mobile-dots-wrapper">
          {activeItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`philosophy-dot ${currentIndex % activeItems.length === idx ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Mission Text Below Cards */}
        <div className="philosophy-mission-block">
          <AnimatePresence mode="wait">
            <motion.p
              className="philosophy-mission-text"
              key={`mission-${featuredItem.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {featuredItem.mission}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
