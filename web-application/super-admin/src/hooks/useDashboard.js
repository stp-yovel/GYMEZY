import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, clearDashboardError } from '../redux/slices/dashboardSlice';

export const useDashboard = (filterParams = {}) => {
  const dispatch = useDispatch();
  const { stats, loading, error, lastUpdated } = useSelector((state) => state.dashboard);

  const refreshDashboard = useCallback(() => {
    dispatch(fetchDashboardStats(filterParams));
  }, [dispatch, JSON.stringify(filterParams)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const clearError = useCallback(() => {
    dispatch(clearDashboardError());
  }, [dispatch]);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    refreshDashboard,
    clearError,
  };
};

export default useDashboard;
