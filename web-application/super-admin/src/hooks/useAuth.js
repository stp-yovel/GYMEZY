import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginSuperAdmin,
  logoutSuperAdmin,
  fetchCurrentUser,
  clearAuthError,
} from '../redux/slices/authSlice';

/**
 * Custom hook for managing Super Admin authentication lifecycle
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, initialized } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (identifier, password) => {
      const resultAction = await dispatch(
        loginSuperAdmin({ identifier, password })
      );
      if (loginSuperAdmin.fulfilled.match(resultAction)) {
        return { success: true, user: resultAction.payload };
      }
      return {
        success: false,
        error: resultAction.payload || 'Authentication failed.',
      };
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutSuperAdmin());
  }, [dispatch]);

  const checkSession = useCallback(() => {
    return dispatch(fetchCurrentUser());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    initialized,
    login,
    logout,
    checkSession,
    clearError,
  };
};

export default useAuth;
