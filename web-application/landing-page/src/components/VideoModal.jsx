import React, { useState, useEffect, useRef } from 'react';
import introVideo from '../assets/video/intro.mp4';
import reasonVideo from '../assets/video/reason.mp4';
import gymezyLogo from '../assets/logo/gymezy.png';
import { openUserLeadModal, openLeadModal } from '../utils/modalUtils';
import './VideoModal.css';

const VIDEO_PLAYLIST = [
  {
    id: 'reason',
    title: 'The GYMEZY Vision & Story',
    subtitle: 'Why we set out to connect every neighborhood gym and athlete',
    duration: '1:38',
    src: reasonVideo,
    badge: 'OUR MISSION'
  },
  {
    id: 'intro',
    title: 'Platform Tour & App Demo',
    subtitle: 'See how GYMEZY transforms workouts and gym access in 30 seconds',
    duration: '0:30',
    src: introVideo,
    badge: 'QUICK TOUR'
  }
];

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function VideoModal({ isOpen, onClose, defaultVideo = 'reason' }) {
  const [activeVideoId, setActiveVideoId] = useState(defaultVideo || 'reason');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef(null);
  const panelRef = useRef(null);
  const scrubberFillRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleMouseMove = () => {
    resetHideTimer();
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      setShowControls(false);
    }
  };

  // Reset controls visibility when play/pause changes
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    } else {
      resetHideTimer();
    }
  }, [isPlaying]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Sync active video when defaultVideo changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveVideoId(defaultVideo || 'reason');
      setIsPlaying(true);
      setIsLoading(true);
      setShowControls(true);
    }
  }, [isOpen, defaultVideo]);

  // Lock body scroll & Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // High-performance 60fps/120fps progress scrubber loop
  useEffect(() => {
    let animId;

    const tick = () => {
      if (videoRef.current && scrubberFillRef.current && videoRef.current.duration > 0) {
        const ratio = Math.min(1, Math.max(0, videoRef.current.currentTime / videoRef.current.duration));
        scrubberFillRef.current.style.transform = `scaleX(${ratio})`;
      }
      if (isPlaying && isOpen) {
        animId = requestAnimationFrame(tick);
      }
    };

    if (isPlaying && isOpen) {
      animId = requestAnimationFrame(tick);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, isOpen, activeVideoId]);

  // Auto-play when video changes
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      if (scrubberFillRef.current) {
        scrubberFillRef.current.style.transform = 'scaleX(0)';
      }
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with sound may be blocked by browser policy
            setIsPlaying(false);
          });
      }
    }
  }, [activeVideoId, isOpen]);

  const handleClose = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setShowControls(true);
    if (onClose) onClose();
  };

  const handleSwap = () => {
    resetHideTimer();
    setIsLoading(true);
    setActiveVideoId((prev) => (prev === 'intro' ? 'reason' : 'intro'));
  };

  const togglePlayPause = (e) => {
    if (e) e.stopPropagation();
    resetHideTimer();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
    setShowCenterIcon(true);
    setTimeout(() => setShowCenterIcon(false), 700);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      if (scrubberFillRef.current && videoRef.current.duration > 0) {
        const ratio = videoRef.current.currentTime / videoRef.current.duration;
        scrubberFillRef.current.style.transform = `scaleX(${ratio})`;
      }
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (videoRef.current && duration > 0) {
      const newTime = clickRatio * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      if (scrubberFillRef.current) {
        scrubberFillRef.current.style.transform = `scaleX(${clickRatio})`;
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!panelRef.current) return;
    if (!document.fullscreenElement) {
      panelRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const activeVideo = VIDEO_PLAYLIST.find((v) => v.id === activeVideoId) || VIDEO_PLAYLIST[0];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div
      className="gymezy-video-modal-backdrop"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        ref={panelRef}
        className={`gymezy-video-modal-panel edge-to-edge ${!showControls && isPlaying ? 'controls-hidden' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Full-Bleed Edge-to-Edge Video */}
        <div className="video-viewport-wrapper" onClick={togglePlayPause}>
          <video
            ref={videoRef}
            key={activeVideo.id}
            src={activeVideo.src}
            playsInline
            autoPlay
            onLoadStart={() => setIsLoading(true)}
            onWaiting={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onPlaying={() => {
              setIsPlaying(true);
              setIsLoading(false);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              setIsLoading(false);
              if (scrubberFillRef.current) {
                scrubberFillRef.current.style.transform = 'scaleX(1)';
              }
            }}
            className="video-full-bleed-element"
          />

          {/* Quick Side Nav Swap Arrows on Video Edges */}
          <button
            type="button"
            className="video-side-nav-arrow side-arrow-left"
            onClick={(e) => {
              e.stopPropagation();
              handleSwap();
            }}
            title="Swap to other video"
            aria-label="Previous / Swap Video"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            className="video-side-nav-arrow side-arrow-right"
            onClick={(e) => {
              e.stopPropagation();
              handleSwap();
            }}
            title="Swap to other video"
            aria-label="Next / Swap Video"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Center Loading Spinner */}
          {isLoading && (
            <div className="video-loading-backdrop" aria-label="Loading video">
              <div className="video-loading-spinner" />
            </div>
          )}

          {/* Center Play/Pause Indicator (Shown when paused or on click, not while loading) */}
          {!isLoading && (!isPlaying || showCenterIcon) && (
            <div className={`video-center-play-badge ${!isPlaying ? 'is-paused' : 'is-animating'}`}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* TOP BLACK GRADIENT OVERLAY */}
        <div className="video-overlay-top" onClick={(e) => e.stopPropagation()}>
          {/* Header Bar: Logo + Title + Close Button */}
          <div className="video-overlay-header-row">
            <div className="video-overlay-brand">
              <img src={gymezyLogo} alt="GYMEZY Logo" className="video-overlay-logo" />
              <h3 id="video-modal-title" className="video-overlay-headline">
                {activeVideo.title}
              </h3>
            </div>

            <button
              type="button"
              className="video-overlay-close-btn"
              onClick={handleClose}
              aria-label="Close video player"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.4" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

        </div>

        {/* BOTTOM BLACK GRADIENT OVERLAY */}
        <div className="video-overlay-bottom" onClick={(e) => e.stopPropagation()}>
          {/* Custom Timeline Progress Scrubber */}
          <div className="video-scrubber-container" onClick={handleSeek}>
            <div className="video-scrubber-track">
              <div
                ref={scrubberFillRef}
                className="video-scrubber-fill"
              />
            </div>
          </div>

          {/* Bottom Controls & Actions Row */}
          <div className="video-overlay-actions-row">
            {/* Left: Playback controls + Caption */}
            <div className="video-controls-info-left">
              <button
                type="button"
                className="video-control-icon-btn"
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className="video-control-icon-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="22" y1="9" x2="16" y2="15" />
                    <line x1="16" y1="9" x2="22" y2="15" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              <span className="video-timestamp">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <p className="video-caption-text">{activeVideo.subtitle}</p>
            </div>

            {/* Right: Fullscreen + Primary Action Buttons */}
            <div className="video-controls-actions-right">
              <button
                type="button"
                className="video-control-icon-btn"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                aria-label="Toggle Fullscreen"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>

              <button
                type="button"
                className="video-cta-btn-primary"
                onClick={() => {
                  handleClose();
                  openUserLeadModal({ offerTag: 'Video Tour Special' });
                }}
              >
                Get Free Pass
              </button>

              <button
                type="button"
                className="video-cta-btn-secondary"
                onClick={() => {
                  handleClose();
                  openLeadModal({ category: 'demo', plan: 'Free Partner Onboarding' });
                }}
              >
                Partner Gym Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
