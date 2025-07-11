// API Entities - Re-export from simplified data service
import { dataService } from '../services/dataService';

// Legacy compatibility layer - maps old entity interface to new data service
export const Merchant = {
  async list(sort, limit, skip, fields) {
    const options = {
      sort,
      limit,
      skip: skip || 0,
      fields
    };
    return await dataService.getMerchants(options);
  },

  async get(merchantId) {
    return await dataService.getMerchant(merchantId);
  },

  async create(merchantData) {
    return await dataService.createMerchant(merchantData);
  },

  async update(merchantId, updates) {
    return await dataService.updateMerchant(merchantId, updates);
  },

  async filter(query, sort, limit, skip, fields) {
    const options = {
      filters: query,
      sort,
      limit,
      skip: skip || 0,
      fields
    };
    return await dataService.getMerchants(options);
  }
};

export const Commission = {
  async list(sort, limit, skip, fields) {
    const options = {
      sort,
      limit,
      skip: skip || 0,
      fields
    };
    return await dataService.getCommissions(options);
  },

  async get(commissionId) {
    return await dataService.getCommission(commissionId);
  },

  async filter(query, sort, limit, skip, fields) {
    const options = {
      filters: query,
      sort,
      limit,
      skip: skip || 0,
      fields
    };
    return await dataService.getCommissions(options);
  }
};

export const User = {
  async me() {
    return await dataService.getCurrentUser();
  },

  async updateMe(updates) {
    return await dataService.updateCurrentUser(updates);
  },

  // Simplified auth methods (no actual authentication)
  login() {
    return Promise.resolve({ success: true });
  },

  logout() {
    return Promise.resolve({ success: true });
  },

  setToken() {
    return Promise.resolve({ success: true });
  },

  isAuthenticated() {
    return true;
  }
};