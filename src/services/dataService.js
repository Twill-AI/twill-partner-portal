// Unified Data Service
// Provides consistent data interface for both mock and PayEngine sources

import { mockDataService } from './mockDataService';
import { payEngineDataService } from './payEngineDataService';
import { DataSource } from '../contexts/DataSourceContext';

// Get current data source from localStorage
const getCurrentDataSource = () => {
  return localStorage.getItem('twill_data_source') || DataSource.MOCK;
};

// Get appropriate data service based on current source
const getDataService = () => {
  const dataSource = getCurrentDataSource();
  return dataSource === DataSource.PAYENGINE_SANDBOX ? payEngineDataService : mockDataService;
};

// Unified Data Service Interface
export const dataService = {
  // Merchant operations
  async getMerchants(options = {}) {
    const service = getDataService();
    return await service.getMerchants(options);
  },

  async getMerchant(merchantId) {
    const service = getDataService();
    return await service.getMerchant(merchantId);
  },

  async createMerchant(merchantData) {
    const service = getDataService();
    return await service.createMerchant(merchantData);
  },

  async updateMerchant(merchantId, updates) {
    const service = getDataService();
    return await service.updateMerchant(merchantId, updates);
  },

  // Commission operations
  async getCommissions(options = {}) {
    const service = getDataService();
    return await service.getCommissions(options);
  },

  async getCommission(commissionId) {
    const service = getDataService();
    return await service.getCommission(commissionId);
  },

  // User operations
  async getCurrentUser() {
    const service = getDataService();
    return await service.getCurrentUser();
  },

  async updateCurrentUser(updates) {
    const service = getDataService();
    return await service.updateCurrentUser(updates);
  },

  // Fee schedule operations
  async getFeeSchedules(options = {}) {
    const service = getDataService();
    return service.getFeeSchedules ? await service.getFeeSchedules(options) : { data: [] };
  },

  async getFeeSchedule(scheduleId) {
    const service = getDataService();
    return service.getFeeSchedule ? await service.getFeeSchedule(scheduleId) : null;
  },

  // Utility methods
  getCurrentDataSource,
  
  async getConnectionStatus() {
    const service = getDataService();
    return service.getConnectionStatus ? await service.getConnectionStatus() : 'connected';
  }
};

export default dataService;
