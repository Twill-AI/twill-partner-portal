// PayEngine Data Service
// Provides PayEngine integration with standardized output format

// PayEngine API Client
class PayEngineClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_PAYENGINE_BASE_URL || 'https://console.payengine.dev';
    this.apiKey = import.meta.env.VITE_PAYENGINE_API_KEY;
    this.timeout = 30000;
  }

  async request(method, endpoint, params = {}) {
    if (!this.apiKey || this.apiKey === 'demo_token_replace_with_actual') {
      throw new Error('PayEngine API key not configured');
    }

    const url = new URL(`${this.baseURL}/api${endpoint}`);
    
    // Add query parameters for GET requests
    if (method === 'GET' && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(this.apiKey + ':')}`
      },
      signal: AbortSignal.timeout(this.timeout)
    };

    // Add body for non-GET requests
    if (method !== 'GET' && Object.keys(params).length > 0) {
      config.body = JSON.stringify(params);
    }

    try {
      const response = await fetch(url.toString(), config);
      
      if (!response.ok) {
        throw new Error(`PayEngine API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PayEngine API request failed:', error);
      throw error;
    }
  }
}

// Data transformation utilities
const transformMerchantData = (payEngineMerchant, feeSchedules = new Map()) => {
  // Calculate risk level based on chargeback rate
  const calculateRiskLevel = (chargebackRate) => {
    if (chargebackRate > 1.0) return 'high';
    if (chargebackRate > 0.5) return 'medium';
    return 'low';
  };

  // Generate status messages for in_review merchants
  const STATUS_MESSAGES = [
    'Please provide 3 months bank statements.',
    'Awaiting compliance review.',
    'Additional documentation required.',
    'Risk assessment in progress.'
  ];

  const chargebackRate = payEngineMerchant.chargeback_rate || 0;
  const riskLevel = calculateRiskLevel(chargebackRate);
  
  return {
    merchant_id: payEngineMerchant.id || payEngineMerchant.merchant_id,
    business_name: payEngineMerchant.business_name || payEngineMerchant.name,
    dba_name: payEngineMerchant.dba_name || payEngineMerchant.business_name,
    business_type: payEngineMerchant.business_type || 'Unknown',
    status: payEngineMerchant.status || 'active',
    risk_level: riskLevel,
    monthly_volume: payEngineMerchant.monthly_volume || 0,
    monthly_commission: payEngineMerchant.monthly_commission || 0,
    created_date: payEngineMerchant.created_at || payEngineMerchant.created_date,
    contact_email: payEngineMerchant.contact_email || payEngineMerchant.email,
    phone: payEngineMerchant.phone || '',
    address: {
      street: payEngineMerchant.address?.street || '',
      city: payEngineMerchant.address?.city || '',
      state: payEngineMerchant.address?.state || '',
      zip: payEngineMerchant.address?.zip || ''
    },
    processing_start_date: payEngineMerchant.processing_start_date || payEngineMerchant.created_at,
    average_transaction: payEngineMerchant.average_transaction || 0,
    transaction_count: payEngineMerchant.transaction_count || 0,
    chargeback_rate: chargebackRate,
    approval_rate: payEngineMerchant.approval_rate || 95.0,
    notes: payEngineMerchant.notes || `Risk Level: ${riskLevel}`,
    status_message: payEngineMerchant.status === 'in_review' 
      ? STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)]
      : undefined
  };
};

const transformCommissionData = (payEngineCommission) => {
  return {
    commission_id: payEngineCommission.id || payEngineCommission.commission_id,
    merchant_id: payEngineCommission.merchant_id,
    business_name: payEngineCommission.business_name || 'Unknown Business',
    period: payEngineCommission.period || new Date().toISOString().slice(0, 7),
    volume: payEngineCommission.volume || 0,
    commission_rate: payEngineCommission.commission_rate || 2.5,
    commission_amount: payEngineCommission.commission_amount || 0,
    status: payEngineCommission.status || 'pending',
    payment_date: payEngineCommission.payment_date,
    created_date: payEngineCommission.created_at || payEngineCommission.created_date
  };
};

// PayEngine Data Service Implementation
export const payEngineDataService = {
  client: new PayEngineClient(),
  feeSchedulesCache: new Map(),
  lastFeeSchedulesFetch: null,

  // Fetch and cache fee schedules
  async getFeeSchedules() {
    const now = Date.now();
    // Cache for 5 minutes
    if (this.lastFeeSchedulesFetch && (now - this.lastFeeSchedulesFetch) < 300000) {
      return this.feeSchedulesCache;
    }

    try {
      const response = await this.client.request('GET', '/fee-schedules');
      this.feeSchedulesCache.clear();
      
      if (response?.data) {
        response.data.forEach(fee => {
          this.feeSchedulesCache.set(fee.id, fee.name);
        });
      }
      
      this.lastFeeSchedulesFetch = now;
      console.log('Fee schedules loaded:', this.feeSchedulesCache.size);
      return this.feeSchedulesCache;
    } catch (error) {
      console.warn('Failed to fetch fee schedules:', error);
      return this.feeSchedulesCache;
    }
  },

  // Merchant operations
  async getMerchants(options = {}) {
    try {
      // Fetch fee schedules first
      const feeSchedules = await this.getFeeSchedules();
      
      // Fetch merchants
      const params = {
        size: options.limit || 100,
        offset: options.skip || 0
      };
      
      const response = await this.client.request('GET', '/merchant', params);
      
      if (!response?.data) {
        throw new Error('No merchant data received from PayEngine');
      }

      // Transform data to match our standard format
      const merchants = response.data.map(merchant => 
        transformMerchantData(merchant, feeSchedules)
      );

      // Apply client-side filtering if needed
      let filteredMerchants = merchants;
      if (options.filters) {
        filteredMerchants = merchants.filter(merchant => {
          return Object.entries(options.filters).every(([key, value]) => {
            if (!value) return true;
            return merchant[key]?.toString().toLowerCase().includes(value.toLowerCase());
          });
        });
      }

      // Apply client-side sorting if needed
      if (options.sort) {
        filteredMerchants.sort((a, b) => {
          const aVal = a[options.sort];
          const bVal = b[options.sort];
          
          if (typeof aVal === 'string') {
            return aVal.localeCompare(bVal);
          }
          return aVal - bVal;
        });
      }

      return {
        data: filteredMerchants,
        total: response.total || merchants.length,
        skip: options.skip || 0,
        limit: options.limit || merchants.length
      };
    } catch (error) {
      console.error('Failed to fetch merchants from PayEngine:', error);
      throw error;
    }
  },

  async getMerchant(merchantId) {
    try {
      const feeSchedules = await this.getFeeSchedules();
      const response = await this.client.request('GET', `/merchant/${merchantId}`);
      
      if (!response?.data) {
        throw new Error(`Merchant ${merchantId} not found`);
      }

      return {
        data: transformMerchantData(response.data, feeSchedules)
      };
    } catch (error) {
      console.error(`Failed to fetch merchant ${merchantId}:`, error);
      throw error;
    }
  },

  async createMerchant(merchantData) {
    try {
      const response = await this.client.request('POST', '/merchant', merchantData);
      const feeSchedules = await this.getFeeSchedules();
      
      return {
        data: transformMerchantData(response.data, feeSchedules)
      };
    } catch (error) {
      console.error('Failed to create merchant:', error);
      throw error;
    }
  },

  async updateMerchant(merchantId, updates) {
    try {
      const response = await this.client.request('PUT', `/merchant/${merchantId}`, updates);
      const feeSchedules = await this.getFeeSchedules();
      
      return {
        data: transformMerchantData(response.data, feeSchedules)
      };
    } catch (error) {
      console.error(`Failed to update merchant ${merchantId}:`, error);
      throw error;
    }
  },

  // Commission operations
  async getCommissions(options = {}) {
    try {
      const params = {
        size: options.limit || 100,
        offset: options.skip || 0
      };
      
      const response = await this.client.request('GET', '/commissions', params);
      
      if (!response?.data) {
        // If no commissions endpoint, generate from merchants
        const merchantsResponse = await this.getMerchants({ limit: 10 });
        const mockCommissions = merchantsResponse.data.map((merchant, index) => ({
          commission_id: `com_${merchant.merchant_id}_${Date.now()}_${index}`,
          merchant_id: merchant.merchant_id,
          business_name: merchant.business_name,
          period: new Date().toISOString().slice(0, 7),
          volume: merchant.monthly_volume,
          commission_rate: 2.5,
          commission_amount: merchant.monthly_commission,
          status: merchant.status === 'active' ? 'paid' : 'pending',
          payment_date: merchant.status === 'active' ? new Date().toISOString() : null,
          created_date: merchant.created_date
        }));
        
        return {
          data: mockCommissions,
          total: mockCommissions.length,
          skip: options.skip || 0,
          limit: options.limit || mockCommissions.length
        };
      }

      const commissions = response.data.map(transformCommissionData);
      
      return {
        data: commissions,
        total: response.total || commissions.length,
        skip: options.skip || 0,
        limit: options.limit || commissions.length
      };
    } catch (error) {
      console.error('Failed to fetch commissions from PayEngine:', error);
      throw error;
    }
  },

  async getCommission(commissionId) {
    try {
      const response = await this.client.request('GET', `/commissions/${commissionId}`);
      
      if (!response?.data) {
        throw new Error(`Commission ${commissionId} not found`);
      }

      return {
        data: transformCommissionData(response.data)
      };
    } catch (error) {
      console.error(`Failed to fetch commission ${commissionId}:`, error);
      throw error;
    }
  },

  // User operations (PayEngine doesn't have user management, so return mock data)
  async getCurrentUser() {
    return {
      data: {
        user_id: "payengine_user",
        email: "partner@payengine.dev",
        name: "PayEngine Partner",
        role: "partner_admin",
        created_date: new Date().toISOString(),
        last_login: new Date().toISOString(),
        preferences: {
          theme: "light",
          notifications: true,
          dashboard_layout: "default"
        }
      }
    };
  },

  async updateCurrentUser(updates) {
    // PayEngine doesn't support user updates, return updated mock data
    const currentUser = await this.getCurrentUser();
    return {
      data: { ...currentUser.data, ...updates }
    };
  },

  // Connection status
  async getConnectionStatus() {
    try {
      await this.client.request('GET', '/health');
      return 'connected';
    } catch (error) {
      console.error('PayEngine connection check failed:', error);
      return 'error';
    }
  }
};

export default payEngineDataService;
