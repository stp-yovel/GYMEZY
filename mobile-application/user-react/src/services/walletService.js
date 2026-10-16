import { apiService } from './apiService';

class WalletService {
  /**
   * Fetch current user's wallet summary & transactions
   * @param {string} [userId]
   */
  async fetchMyWallet(userId) {
    try {
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      const response = await apiService.executeFetch(
        `/wallet/my${query}`,
        {
          method: 'GET',
          headers: apiService.getHeaders(),
        },
        8000
      );

      const json = await response.json();
      if (response.ok && json.success && json.data) {
        return json.data;
      }
      return null;
    } catch (error) {
      console.warn('[WALLET SERVICE] fetchMyWallet error:', error.message);
      return null;
    }
  }

  /**
   * Top up wallet balance
   * @param {Object} payload - { gymId, amount, paymentMethod, transactionId, userId }
   */
  async topUpWallet(payload) {
    try {
      const response = await apiService.executeFetch(
        '/wallet/top-up',
        {
          method: 'POST',
          headers: apiService.getHeaders(),
          body: JSON.stringify(payload),
        },
        8000
      );

      const json = await response.json();
      if (response.ok && json.success) {
        return json.data;
      }
      throw new Error(json?.message || 'Failed to top up wallet.');
    } catch (error) {
      console.warn('[WALLET SERVICE] topUpWallet error:', error.message);
      throw error;
    }
  }

  /**
   * Request withdrawal / refund from wallet balance
   * @param {Object} payload - { gymId, amount, upiId, accountDetails, reason, userId }
   */
  async withdrawWallet(payload) {
    try {
      const response = await apiService.executeFetch(
        '/wallet/withdraw',
        {
          method: 'POST',
          headers: apiService.getHeaders(),
          body: JSON.stringify(payload),
        },
        8000
      );

      const json = await response.json();
      if (response.ok && json.success) {
        return json.data;
      }
      throw new Error(json?.message || 'Failed to submit withdrawal request.');
    } catch (error) {
      console.warn('[WALLET SERVICE] withdrawWallet error:', error.message);
      throw error;
    }
  }
}

export const walletService = new WalletService();
export default walletService;
