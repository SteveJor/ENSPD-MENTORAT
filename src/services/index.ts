import { APP_CONFIG } from '../config/constants';
import { mockApiService } from './mock.api.service';
import apiService from './api.service';

// Export le service approprié selon la configuration
export const api = APP_CONFIG.useMockApi ? mockApiService : apiService;

// Pour faciliter les imports
export default api;