// PayEngine API Service
// Handles PayEngine sandbox integration with secure authentication

class PayEngineAPIService {
  constructor() {
    this.baseURL = import.meta.env.VITE_PAYENGINE_BASE_URL || 'https://console.payengine.dev';
    this.apiKey = import.meta.env.VITE_PAYENGINE_API_KEY;
    this.timeout = parseInt(import.meta.env.VITE_PAYENGINE_TIMEOUT) || 30000;
    this.isConnected = false;
    this.lastHealthCheck = null;
    this.connectionStatus = 'disconnected'; // 'disconnected', 'connecting', 'connected', 'error'
    
    // Validate configuration on initialization
    this.validateConfig();
  }

  // Validate configuration on startup
  validateConfig() {
    if (!this.baseURL) {
      console.warn('PayEngine: No base URL configured');
      this.connectionStatus = 'error';
      return false;
    }
    
    if (!this.apiKey || this.apiKey === 'demo_token_replace_with_actual') {
      console.warn('PayEngine: No valid API key configured');
      this.connectionStatus = 'error';
      return false;
    }
    
    console.log('PayEngine: Configuration validated successfully');
    this.connectionStatus = 'connecting';
    return true;
  }

  // Get current connection status
  getConnectionStatus() {
    return this.connectionStatus;
  }

  // Common headers for all requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-Version': '1.0',
      'User-Agent': 'Twill-Partner-Hub/1.0.0'
    };

    if (this.apiKey && this.apiKey !== 'demo_token_replace_with_actual') {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      this.isConnected = response.ok;
      this.lastHealthCheck = new Date();
      return this.isConnected;
    } catch (error) {
      console.error('PayEngine health check failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Twill AI compatible request method
  async request(method, endpoint, params = {}) {
    if (!this.apiKey) {
      throw new Error('PayEngine API key not configured');
    }

    let url = `${this.baseURL}/api${endpoint}`;
    const config = {
      method: method,
      headers: {
        'Authorization': `Basic ${this.apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    // Add params as query string for GET requests
    if (method === 'GET' && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    try {
      console.log(`PayEngine API Request: ${method} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`PayEngine API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`PayEngine API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`PayEngine API Response: ${method} ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`PayEngine API request failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  // Generic API request handler
  async makeRequest(method, endpoint, params = {}, options = {}) {
    if (!this.apiKey) {
      throw new Error('PayEngine API key not configured');
    }

    let url = `${this.baseURL}${endpoint}`;
    const config = {
      method: method,
      headers: this.getHeaders(),
      ...options
    };

    // Add params as query string for GET requests
    if (method === 'GET' && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayEngine API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`PayEngine API request failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  // Merchant API Methods
  async listMerchants(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/merchants${queryParams ? `?${queryParams}` : ''}`;
    return await this.makeRequest('GET', endpoint, params);
  }

  async getMerchant(merchantId) {
    try {
      return await this.apiRequest(`/merchants/${merchantId}`);
    } catch (error) {
      console.error('PayEngine getMerchant failed:', error);
      return null;
    }
  }

  async createMerchant(merchantData) {
    try {
      return await this.apiRequest('/merchants', {
        method: 'POST',
        body: JSON.stringify(merchantData)
      });
    } catch (error) {
      console.error('PayEngine createMerchant failed:', error);
      throw error;
    }
  }

  async updateMerchant(merchantId, updates) {
    try {
      return await this.apiRequest(`/merchants/${merchantId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('PayEngine updateMerchant failed:', error);
      throw error;
    }
  }

  // Commission API Methods
  async listCommissions(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/commissions${queryParams ? `?${queryParams}` : ''}`;
      return await this.apiRequest(endpoint);
    } catch (error) {
      console.error('PayEngine listCommissions failed:', error);
      return [];
    }
  }

  async getCommission(commissionId) {
    try {
      return await this.apiRequest(`/commissions/${commissionId}`);
    } catch (error) {
      console.error('PayEngine getCommission failed:', error);
      return null;
    }
  }

  // Transaction API Methods
  async listTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/transactions${queryParams ? `?${queryParams}` : ''}`;
      return await this.apiRequest(endpoint);
    } catch (error) {
      console.error('PayEngine listTransactions failed:', error);
      return [];
    }
  }

  async processPayment(paymentData) {
    try {
      return await this.apiRequest('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
    } catch (error) {
      console.error('PayEngine processPayment failed:', error);
      throw error;
    }
  }

  async refundTransaction(transactionId, amount) {
    try {
      return await this.apiRequest(`/transactions/${transactionId}/refund`, {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
    } catch (error) {
      console.error('PayEngine refundTransaction failed:', error);
      throw error;
    }
  }

  // User API Methods
  async getCurrentUser() {
    try {
      return await this.apiRequest('/user/me');
    } catch (error) {
      console.error('PayEngine getCurrentUser failed:', error);
      // Return fallback user
      return {
        user_id: 'payengine_user',
        email: 'sandbox@payengine.com',
        name: 'PayEngine User',
        role: 'partner_admin'
      };
    }
  }

  // Integration Stubs (will be implemented with actual PayEngine endpoints)
  async invokeLLM(params) {
    console.warn('PayEngine LLM integration not yet implemented');
    return {
      response: "PayEngine LLM integration coming soon",
      model: "payengine-gpt",
      usage: { tokens: 0 },
      service: "payengine"
    };
  }

  async sendEmail(params) {
    console.warn('PayEngine email integration not yet implemented');
    return {
      message_id: `pe_msg_${Date.now()}`,
      status: "pending",
      service: "payengine",
      message: "PayEngine email integration coming soon"
    };
  }

  async uploadFile(file) {
    console.warn('PayEngine file upload integration not yet implemented');
    return {
      file_id: `pe_file_${Date.now()}`,
      filename: file?.name || 'unknown',
      status: "pending",
      service: "payengine",
      message: "PayEngine file upload integration coming soon"
    };
  }

  async generateImage(params) {
    console.warn('PayEngine image generation integration not yet implemented');
    return {
      image_id: `pe_img_${Date.now()}`,
      url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOGZmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzOTlmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBheUVuZ2luZSBJbWFnZSBDb21pbmcgU29vbjwvdGV4dD4KPC9zdmc+",
      service: "payengine",
      status: "pending"
    };
  }

  async extractDataFromFile(params) {
    console.warn('PayEngine data extraction integration not yet implemented');
    return {
      extraction_id: `pe_ext_${Date.now()}`,
      extracted_data: {
        text: "PayEngine data extraction coming soon",
        metadata: { pages: 0, confidence: 0 },
        fields: {}
      },
      service: "payengine",
      status: "pending"
    };
  }
}

// Export singleton instance
export const payEngineAPI = new PayEngineAPIService();

export default payEngineAPI;
