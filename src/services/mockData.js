// Mock Data Service
// Provides structured mock data with realistic business scenarios

// Mock Merchants Data
export const mockMerchants = [
  {
    merchant_id: "mer_001",
    business_name: "TechFlow Solutions",
    dba_name: "TechFlow",
    business_type: "Software",
    status: "active",
    risk_level: "low",
    monthly_volume: 2500000,
    monthly_commission: 62500,
    created_date: "2023-01-15T08:00:00Z",
    contact_email: "admin@techflow.com",
    phone: "+1-555-0123",
    address: {
      street: "123 Tech Street",
      city: "San Francisco",
      state: "CA",
      zip: "94105"
    },
    processing_start_date: "2023-02-01T00:00:00Z",
    average_transaction: 850,
    transaction_count: 2941,
    chargeback_rate: 0.12,
    approval_rate: 94.8
  },
  {
    merchant_id: "mer_002",
    business_name: "Green Earth Retail",
    dba_name: "Green Earth",
    business_type: "Retail",
    status: "active",
    risk_level: "medium",
    monthly_volume: 1800000,
    monthly_commission: 45000,
    created_date: "2023-03-22T10:30:00Z",
    contact_email: "finance@greenearth.com",
    phone: "+1-555-0456",
    address: {
      street: "456 Eco Drive",
      city: "Portland",
      state: "OR",
      zip: "97201"
    },
    processing_start_date: "2023-04-01T00:00:00Z",
    average_transaction: 125,
    transaction_count: 14400,
    chargeback_rate: 0.28,
    approval_rate: 91.2
  },
  {
    merchant_id: "mer_003",
    business_name: "Prime Healthcare Services",
    dba_name: "Prime Health",
    business_type: "Healthcare",
    status: "active",
    risk_level: "low",
    monthly_volume: 3200000,
    monthly_commission: 80000,
    created_date: "2022-11-08T14:15:00Z",
    contact_email: "billing@primehealth.com",
    phone: "+1-555-0789",
    address: {
      street: "789 Medical Plaza",
      city: "Houston",
      state: "TX",
      zip: "77001"
    },
    processing_start_date: "2022-12-01T00:00:00Z",
    average_transaction: 425,
    transaction_count: 7529,
    chargeback_rate: 0.08,
    approval_rate: 96.5
  },
  {
    merchant_id: "mer_004",
    business_name: "Urban Lifestyle Co",
    dba_name: "Urban Style",
    business_type: "Fashion",
    status: "pending",
    risk_level: "high",
    monthly_volume: 950000,
    monthly_commission: 23750,
    created_date: "2024-01-03T09:45:00Z",
    contact_email: "ops@urbanlifestyle.com",
    phone: "+1-555-0321",
    address: {
      street: "321 Fashion Ave",
      city: "New York",
      state: "NY",
      zip: "10001"
    },
    processing_start_date: "2024-01-15T00:00:00Z",
    average_transaction: 275,
    transaction_count: 3454,
    chargeback_rate: 0.45,
    approval_rate: 87.3
  },
  {
    merchant_id: "mer_005",
    business_name: "Digital Marketing Pro",
    dba_name: "DigitalPro",
    business_type: "Marketing",
    status: "active",
    risk_level: "critical",
    monthly_volume: 1200000,
    monthly_commission: 30000,
    created_date: "2023-08-17T16:20:00Z",
    contact_email: "accounts@digitalpro.com",
    phone: "+1-555-0654",
    address: {
      street: "654 Innovation Blvd",
      city: "Austin",
      state: "TX",
      zip: "78701"
    },
    processing_start_date: "2023-09-01T00:00:00Z",
    average_transaction: 1200,
    transaction_count: 1000,
    chargeback_rate: 0.89,
    approval_rate: 82.1
  }
];

// Mock Commissions Data
export const mockCommissions = [
  {
    commission_id: "com_001",
    merchant_id: "mer_001",
    amount: 62500,
    period: "2024-01",
    status: "paid",
    created_date: "2024-02-01T00:00:00Z",
    paid_date: "2024-02-05T00:00:00Z",
    transaction_volume: 2500000,
    commission_rate: 2.5
  },
  {
    commission_id: "com_002",
    merchant_id: "mer_002",
    amount: 45000,
    period: "2024-01",
    status: "paid",
    created_date: "2024-02-01T00:00:00Z",
    paid_date: "2024-02-05T00:00:00Z",
    transaction_volume: 1800000,
    commission_rate: 2.5
  },
  {
    commission_id: "com_003",
    merchant_id: "mer_003",
    amount: 80000,
    period: "2024-01",
    status: "pending",
    created_date: "2024-02-01T00:00:00Z",
    paid_date: null,
    transaction_volume: 3200000,
    commission_rate: 2.5
  },
  {
    commission_id: "com_004",
    merchant_id: "mer_001",
    amount: 58750,
    period: "2023-12",
    status: "paid",
    created_date: "2024-01-01T00:00:00Z",
    paid_date: "2024-01-05T00:00:00Z",
    transaction_volume: 2350000,
    commission_rate: 2.5
  },
  {
    commission_id: "com_005",
    merchant_id: "mer_004",
    amount: 23750,
    period: "2024-01",
    status: "processing",
    created_date: "2024-02-01T00:00:00Z",
    paid_date: null,
    transaction_volume: 950000,
    commission_rate: 2.5
  }
];

// Mock User Data
export const mockUser = {
  user_id: "user_001",
  email: "partner@twill.ai",
  name: "John Partnership",
  role: "partner_admin",
  permissions: ["view_merchants", "manage_commissions", "view_analytics"],
  created_date: "2023-01-01T00:00:00Z",
  last_login: "2024-01-15T10:30:00Z",
  profile: {
    company: "Twill Partnership Hub",
    phone: "+1-555-TWILL",
    timezone: "America/Los_Angeles"
  }
};

// Utility functions for API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sortData = (data, sortBy) => {
  if (!sortBy) return data;
  
  const isDescending = sortBy.startsWith('-');
  const field = isDescending ? sortBy.slice(1) : sortBy;
  
  return [...data].sort((a, b) => {
    const aVal = a[field] || 0;
    const bVal = b[field] || 0;
    
    if (typeof aVal === 'string') {
      return isDescending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    
    return isDescending ? bVal - aVal : aVal - bVal;
  });
};

const filterData = (data, filters = {}) => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      return item[key] === value;
    });
  });
};

// Mock API Service Class
export class MockAPIService {
  constructor() {
    this.isOnline = true;
    this.responseDelay = 200; // Simulate network delay
  }

  async simulateRequest(data, options = {}) {
    await delay(this.responseDelay);
    
    if (!this.isOnline) {
      throw new Error('Network unavailable - using cached data');
    }
    
    return data;
  }

  // Merchant API Methods
  async listMerchants(sortBy, limit, skip, fields) {
    const sorted = sortData(mockMerchants, sortBy);
    const sliced = limit || skip ? sorted.slice(skip || 0, (skip || 0) + (limit || sorted.length)) : sorted;
    return this.simulateRequest(sliced);
  }

  async getMerchant(merchantId) {
    const merchant = mockMerchants.find(m => m.merchant_id === merchantId);
    if (!merchant) throw new Error(`Merchant ${merchantId} not found`);
    return this.simulateRequest(merchant);
  }

  async createMerchant(merchantData) {
    const newMerchant = {
      merchant_id: `mer_${Date.now()}`,
      created_date: new Date().toISOString(),
      status: 'pending',
      risk_level: 'medium',
      monthly_volume: 0,
      monthly_commission: 0,
      ...merchantData
    };
    mockMerchants.push(newMerchant);
    return this.simulateRequest(newMerchant);
  }

  async updateMerchant(merchantId, updates) {
    const index = mockMerchants.findIndex(m => m.merchant_id === merchantId);
    if (index === -1) throw new Error(`Merchant ${merchantId} not found`);
    
    mockMerchants[index] = { ...mockMerchants[index], ...updates };
    return this.simulateRequest(mockMerchants[index]);
  }

  // Commission API Methods
  async listCommissions(sortBy, limit, skip, fields) {
    const sorted = sortData(mockCommissions, sortBy);
    const sliced = limit || skip ? sorted.slice(skip || 0, (skip || 0) + (limit || sorted.length)) : sorted;
    return this.simulateRequest(sliced);
  }

  async getCommission(commissionId) {
    const commission = mockCommissions.find(c => c.commission_id === commissionId);
    if (!commission) throw new Error(`Commission ${commissionId} not found`);
    return this.simulateRequest(commission);
  }

  // User API Methods
  async getUser() {
    return this.simulateRequest(mockUser);
  }

  async updateUser(updates) {
    Object.assign(mockUser, updates);
    return this.simulateRequest(mockUser);
  }

  // Integration Stubs
  async invokeLLM(params) {
    await delay(1000);
    return this.simulateRequest({
      response: `Mock LLM response for: ${params.prompt || 'No prompt provided'}`,
      model: "mock-gpt-4",
      usage: { tokens: 150 }
    });
  }

  async sendEmail(params) {
    await delay(500);
    return this.simulateRequest({
      message_id: `msg_${Date.now()}`,
      status: "sent",
      to: params.to,
      subject: params.subject,
      sent_at: new Date().toISOString()
    });
  }

  async uploadFile(file) {
    await delay(800);
    return this.simulateRequest({
      file_id: `file_${Date.now()}`,
      filename: file.name,
      size: file.size,
      url: `https://mock-storage.twill.ai/files/file_${Date.now()}`,
      uploaded_at: new Date().toISOString()
    });
  }

  async generateImage(params) {
    await delay(2000);
    return this.simulateRequest({
      image_id: `img_${Date.now()}`,
      url: `https://mock-images.twill.ai/generated/img_${Date.now()}.png`,
      prompt: params.prompt,
      created_at: new Date().toISOString()
    });
  }

  async extractDataFromFile(params) {
    await delay(1500);
    return this.simulateRequest({
      extraction_id: `ext_${Date.now()}`,
      extracted_data: {
        text: "Mock extracted text from document",
        metadata: { pages: 1, confidence: 0.95 },
        fields: { amount: "$1,234.56", date: "2024-01-15" }
      },
      processed_at: new Date().toISOString()
    });
  }

  // Utility methods for testing
  setOnlineStatus(online) {
    this.isOnline = online;
  }

  setResponseDelay(ms) {
    this.responseDelay = ms;
  }
}

// Export singleton instance
export const mockAPI = new MockAPIService();

export default mockAPI;
