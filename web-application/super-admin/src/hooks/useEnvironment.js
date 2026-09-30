import { useMemo } from 'react';
import {
  CURRENT_ENV,
  API_BASE_URL,
  IS_DEBUG_MODE,
  ENV_MODES,
  getApiBaseUrl,
} from '../config/envConfig';

/**
 * Custom hook to inspect environment status and active API endpoint
 */
export const useEnvironment = () => {
  return useMemo(() => {
    return {
      currentEnv: CURRENT_ENV,
      apiBaseUrl: getApiBaseUrl() || API_BASE_URL,
      isDebug: IS_DEBUG_MODE,
      isLocal: CURRENT_ENV === ENV_MODES.LOCAL,
      isDev: CURRENT_ENV === ENV_MODES.DEV,
      isProd: CURRENT_ENV === ENV_MODES.PROD,
    };
  }, []);
};

export default useEnvironment;
