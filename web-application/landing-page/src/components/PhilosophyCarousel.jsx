import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PhilosophyCarousel.css';

export default function PhilosophyCarousel({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleCardClick = (offset) => {
    if (offset === 0) return; // Already featured
    setCurrentIndex((prev) => (prev + offset + items.length) % items.length);
  };

  // Re-ordered 3 cards according to active index:
  // Slot 0 (Featured Left), Slot 1 (Right 1), Slot 2 (Right 2)
  const orderedItems = [
    { item: items[currentIndex], slot: 0 },
    { item: items[(currentIndex + 1) % items.length], slot: 1 },
    { item: items[(currentIndex + 2) % items.length], slot: 2 }
  ];

  const featuredItem = items[currentIndex];

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
