/**
 * Global helper to trigger the Welcome Role Selection Modal ("How would you like to join?")
 */
export function openWelcomeModal() {
  const event = new CustomEvent('gymezy:open-welcome-modal');
  window.dispatchEvent(event);
}

/**
 * Global helper to trigger the GYMEZY Lead Capture Modal (Gym Owners / Trainers)
 * @param {Object} options
 * @param {string} [options.category='Gym Owner / Trainer']
 * @param {string} [options.plan='']
 */
export function openLeadModal({ category = 'Gym Owner / Trainer', plan = '' } = {}) {
  const event = new CustomEvent('gymezy:open-lead-modal', {
    detail: { category, plan }
  });
  window.dispatchEvent(event);
}

/**
 * Global helper to trigger the GYMEZY User / Member Launch Offer Modal
 * @param {Object} [options]
 * @param {string} [options.offerTag='Launch Offer (50% Off)']
 */
export function openUserLeadModal({ offerTag = 'Launch Offer (50% Off)' } = {}) {
  const event = new CustomEvent('gymezy:open-user-lead-modal', {
    detail: { offerTag }
  });
  window.dispatchEvent(event);
}

/**
 * Global helper to trigger the GYMEZY Video Player Modal
 * @param {Object} [options]
 * @param {'intro' | 'reason'} [options.video='intro']
 */
export function openVideoModal({ video = 'reason' } = {}) {
  const event = new CustomEvent('gymezy:open-video-modal', {
    detail: { video }
  });
  window.dispatchEvent(event);
}

// Attach to window object for non-React callers or inline clicks
if (typeof window !== 'undefined') {
  window.openGymezyWelcomeModal = openWelcomeModal;
  window.openGymezyLeadModal = openLeadModal;
  window.openGymezyUserModal = openUserLeadModal;
  window.openGymezyVideoModal = openVideoModal;
}
