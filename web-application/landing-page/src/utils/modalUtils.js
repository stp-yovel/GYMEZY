/**
 * Global helper to trigger the GYMEZY Lead Capture Modal (Gym Owners / Trainers)
 * @param {Object} options
 * @param {'demo' | 'interest'} [options.category='demo']
 * @param {string} [options.plan='']
 */
export function openLeadModal({ category = 'demo', plan = '' } = {}) {
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

// Attach to window object for non-React callers or inline clicks
if (typeof window !== 'undefined') {
  window.openGymezyLeadModal = openLeadModal;
  window.openGymezyUserModal = openUserLeadModal;
}
