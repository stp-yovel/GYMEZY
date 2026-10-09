import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import SEO from './components/SEO';
import LandingPage from './pages/landing_page';
import CustomersPage from './pages/customers';
import GymOwnersPage from './pages/gym_owners';
import AboutUsPage from './pages/about_us';
import TrainersPage from './pages/trainers';
import LeadCaptureModal from './components/LeadCaptureModal';
import UserLeadCaptureModal from './components/UserLeadCaptureModal';
import VideoModal from './components/VideoModal';
import WelcomeRoleModal from './components/WelcomeRoleModal';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  // Welcome Role Selection Modal State (shown when user clicks GET STARTED)
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  // Gym Owners / Trainers Lead Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    category: 'Gym Owner / Trainer',
    plan: ''
  });

  // User / Member Launch Offer Modal State
  const [userModalState, setUserModalState] = useState({
    isOpen: false,
    offerTag: 'Launch Offer (50% Off)'
  });

  // Video Player Modal State
  const [videoModalState, setVideoModalState] = useState({
    isOpen: false,
    video: 'reason'
  });

  useEffect(() => {
    const handleOpenEvent = (e) => {
      const { category = 'Gym Owner / Trainer', plan = '' } = e.detail || {};
      setModalState({
        isOpen: true,
        category,
        plan
      });
    };

    const handleOpenUserEvent = (e) => {
      const { offerTag = 'Launch Offer (50% Off)' } = e.detail || {};
      setUserModalState({
        isOpen: true,
        offerTag
      });
    };

    const handleOpenVideoEvent = (e) => {
      const { video = 'reason' } = e.detail || {};
      setVideoModalState({
        isOpen: true,
        video
      });
    };

    const handleOpenWelcomeEvent = () => {
      setWelcomeModalOpen(true);
    };

    window.addEventListener('gymezy:open-lead-modal', handleOpenEvent);
    window.addEventListener('gymezy:open-user-lead-modal', handleOpenUserEvent);
    window.addEventListener('gymezy:open-video-modal', handleOpenVideoEvent);
    window.addEventListener('gymezy:open-welcome-modal', handleOpenWelcomeEvent);

    return () => {
      window.removeEventListener('gymezy:open-lead-modal', handleOpenEvent);
      window.removeEventListener('gymezy:open-user-lead-modal', handleOpenUserEvent);
      window.removeEventListener('gymezy:open-video-modal', handleOpenVideoEvent);
      window.removeEventListener('gymezy:open-welcome-modal', handleOpenWelcomeEvent);
    };
  }, []);

  const handleCloseWelcomeModal = () => {
    setWelcomeModalOpen(false);
  };

  const handleSelectCustomer = () => {
    setWelcomeModalOpen(false);
    setModalState({
      isOpen: true,
      category: 'Customer',
      plan: 'Customer Launch Offer'
    });
  };

  const handleSelectOwner = () => {
    setWelcomeModalOpen(false);
    setModalState({
      isOpen: true,
      category: 'Gym Owner / Business Owner',
      plan: 'Gym Partner Network'
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCloseUserModal = () => {
    setUserModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCloseVideoModal = () => {
    setVideoModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SEO />
      <div className="app-root">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/gym-owners" element={<GymOwnersPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </div>

      {/* Entry Welcome Role Selection Modal */}
      <WelcomeRoleModal
        isOpen={welcomeModalOpen}
        onClose={handleCloseWelcomeModal}
        onSelectCustomer={handleSelectCustomer}
        onSelectOwner={handleSelectOwner}
      />

      {/* Gym Owners & Trainers Partner Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        initialCategory={modalState.category}
        defaultPlan={modalState.plan}
      />

      {/* User / Member Launch Offer Registration Modal */}
      <UserLeadCaptureModal
        isOpen={userModalState.isOpen}
        onClose={handleCloseUserModal}
        offerTag={userModalState.offerTag}
      />

      {/* GYMEZY Video Player Lightbox Modal */}
      <VideoModal
        isOpen={videoModalState.isOpen}
        onClose={handleCloseVideoModal}
        defaultVideo={videoModalState.video}
      />
    </BrowserRouter>
  );
}
