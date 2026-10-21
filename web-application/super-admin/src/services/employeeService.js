import apiClient from './apiClient';

/**
 * Service for managing fleet-wide Employee & Trainer operations, approvals, and audits
 */
export const employeeService = {
  /**
   * Get all pending trainer and employee approval requests across all gyms
   * @param {Object} params Optional filtering (e.g. role, gymId)
   */
  getPendingApprovals: async (params = {}) => {
    const response = await apiClient.get('/employees/approvals', { params });
    return response.data?.data?.pendingApprovals || [];
  },

  /**
   * Submit Super Admin approval decision (Approved / Rejected) with remarks
   * @param {string} employeeId 
   * @param {'Approved' | 'Rejected'} decision 
   * @param {string} adminRemarks 
   */
  reviewApproval: async (employeeId, decision, adminRemarks = '') => {
    const response = await apiClient.patch(`/employees/${employeeId}/approval`, {
      decision,
      adminRemarks,
    });
    return response.data?.data;
  },

  /**
   * Fetch employees with pagination and filters
   * @param {Object} params 
   */
  getEmployees: async (params = {}) => {
    const response = await apiClient.get('/employees', { params });
    return response.data?.data || { employees: [], pagination: {} };
  },

  /**
   * Direct update of employee details
   * @param {string} employeeId 
   * @param {Object} updateData 
   */
  updateEmployee: async (employeeId, updateData) => {
    const response = await apiClient.put(`/employees/${employeeId}`, updateData);
    return response.data?.data;
  },

  /**
   * Deactivate or remove employee
   * @param {string} employeeId 
   */
  deleteEmployee: async (employeeId) => {
    const response = await apiClient.delete(`/employees/${employeeId}`);
    return response.data?.data;
  },
};

export default employeeService;
