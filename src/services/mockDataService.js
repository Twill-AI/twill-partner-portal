// Mock Data Service
// Provides consistent mock data with standardized output format

// Mock Fee Schedules Data
const mockFeeSchedules = [
  {
    id: "fee_001",
    name: "Standard Processing",
    is_default: true,
    is_enabled: true,
    schedule_data: {
      monthly_fee: 99.00,
      discount_rate: 2.5,
      authorization_fee: 0.10,
      ach_rate: 0.75
    }
  },
  {
    id: "fee_002",
    name: "Premium Processing",
    is_default: false,
    is_enabled: true,
    schedule_data: {
      monthly_fee: 199.00,
      discount_rate: 2.2,
      authorization_fee: 0.08,
      ach_rate: 0.50
    }
  },
  {
    id: "fee_003",
    name: "High Risk Processing",
    is_default: false,
    is_enabled: true,
    schedule_data: {
      monthly_fee: 299.00,
      discount_rate: 3.5,
      authorization_fee: 0.15,
      ach_rate: 1.25
    }
  }
];

// Mock Merchants Data
const mockMerchants = [
  {
    merchant_id: "mer_001",
    business_name: "TechFlow Solutions",
    dba_name: "TechFlow",
    business_type: "Software",
    status: "active",
    risk_level: "low",
    monthly_volume: 2500000,
    monthly_commission: 62500,
    logo_url: "https://logo.clearbit.com/techflow.com",
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
    approval_rate: 94.8,
    notes: "High-performing tech merchant with excellent payment history",
    fee_schedule_id: "fee_002" // Premium Processing
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
    logo_url: "https://logo.clearbit.com/greenearth.com",
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
    approval_rate: 92.1,
    notes: "Sustainable retail business with growing transaction volume",
    fee_schedule_id: "fee_001" // Standard Processing
  },
  {
    merchant_id: "mer_003",
    business_name: "Digital Marketing Pro",
    dba_name: "DigiPro",
    business_type: "Services",
    status: "in_review",
    risk_level: "high",
    monthly_volume: 950000,
    monthly_commission: 23750,
    logo_url: "https://logo.clearbit.com/digipro.com",
    created_date: "2024-01-10T14:15:00Z",
    contact_email: "ops@digipro.com",
    phone: "+1-555-0789",
    address: {
      street: "789 Marketing Blvd",
      city: "Austin",
      state: "TX",
      zip: "78701"
    },
    processing_start_date: "2024-02-01T00:00:00Z",
    average_transaction: 1580,
    transaction_count: 601,
    chargeback_rate: 1.45,
    approval_rate: 87.3,
    notes: "Please provide 3 months bank statements.",
    status_message: "Please provide 3 months bank statements.",
    fee_schedule_id: "fee_003" // High Risk Processing
  }
];

// Mock Commissions Data
const mockCommissions = [
  // January 2024
  {
    commission_id: "com_001",
    merchant_id: "mer_001",
    business_name: "TechFlow Solutions",
    period: "2024-01",
    volume: 2500000,
    commission_rate: 2.5,
    commission_amount: 62500,
    status: "paid",
    payment_date: "2024-02-05T00:00:00Z",
    created_date: "2024-01-31T00:00:00Z"
  },
  {
    commission_id: "com_002",
    merchant_id: "mer_002",
    business_name: "Green Earth Retail",
    period: "2024-01",
    volume: 1800000,
    commission_rate: 2.5,
    commission_amount: 45000,
    status: "paid",
    payment_date: "2024-02-05T00:00:00Z",
    created_date: "2024-01-31T00:00:00Z"
  },
  // February 2024
  {
    commission_id: "com_003",
    merchant_id: "mer_001",
    business_name: "TechFlow Solutions",
    period: "2024-02",
    volume: 2750000,
    commission_rate: 2.5,
    commission_amount: 68750,
    status: "paid",
    payment_date: "2024-03-05T00:00:00Z",
    created_date: "2024-02-29T00:00:00Z"
  },
  {
    commission_id: "com_004",
    merchant_id: "mer_002",
    business_name: "Green Earth Retail",
    period: "2024-02",
    volume: 1950000,
    commission_rate: 2.5,
    commission_amount: 48750,
    status: "paid",
    payment_date: "2024-03-05T00:00:00Z",
    created_date: "2024-02-29T00:00:00Z"
  },
  // March 2024
  {
    commission_id: "com_005",
    merchant_id: "mer_001",
    business_name: "TechFlow Solutions",
    period: "2024-03",
    volume: 2900000,
    commission_rate: 2.5,
    commission_amount: 72500,
    status: "paid",
    payment_date: "2024-04-05T00:00:00Z",
    created_date: "2024-03-31T00:00:00Z"
  },
  {
    commission_id: "com_006",
    merchant_id: "mer_003",
    business_name: "Digital Marketing Pro",
    period: "2024-03",
    volume: 950000,
    commission_rate: 2.5,
    commission_amount: 23750,
    status: "pending",
    payment_date: null,
    created_date: "2024-03-31T00:00:00Z"
  },
  // April 2024
  {
    commission_id: "com_007",
    merchant_id: "mer_004",
    business_name: "Bella's Bistro",
    period: "2024-04",
    volume: 450000,
    commission_rate: 2.5,
    commission_amount: 11250,
    status: "paid",
    payment_date: "2024-05-05T00:00:00Z",
    created_date: "2024-04-30T00:00:00Z"
  },
  {
    commission_id: "com_008",
    merchant_id: "mer_001",
    business_name: "TechFlow Solutions",
    period: "2024-04",
    volume: 3100000,
    commission_rate: 2.5,
    commission_amount: 77500,
    status: "paid",
    payment_date: "2024-05-05T00:00:00Z",
    created_date: "2024-04-30T00:00:00Z"
  },
  // May 2024
  {
    commission_id: "com_009",
    merchant_id: "mer_002",
    business_name: "Green Earth Retail",
    period: "2024-05",
    volume: 2100000,
    commission_rate: 2.5,
    commission_amount: 52500,
    status: "paid",
    payment_date: "2024-06-05T00:00:00Z",
    created_date: "2024-05-31T00:00:00Z"
  },
  // June 2024
  {
    commission_id: "com_010",
    merchant_id: "mer_001",
    business_name: "TechFlow Solutions",
    period: "2024-06",
    volume: 3300000,
    commission_rate: 2.5,
    commission_amount: 82500,
    status: "pending",
    payment_date: null,
    created_date: "2024-06-30T00:00:00Z"
  }
];

// Mock User Data
const mockUser = {
  user_id: "user_001",
  email: "partner@twill.ai",
  name: "John Partnership",
  role: "partner_admin",
  created_date: "2023-01-01T00:00:00Z",
  last_login: "2024-01-15T10:30:00Z",
  preferences: {
    theme: "light",
    notifications: true,
    dashboard_layout: "default"
  }
};

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sortData = (data, sortBy) => {
  if (!sortBy) return data;
  
  return [...data].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal);
    }
    return aVal - bVal;
  });
};

const filterData = (data, filters = {}) => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
    });
  });
};

// Mock Data Service Implementation
export const mockDataService = {
  // Merchant operations
  async getMerchants(options = {}) {
    await delay(200); // Simulate network delay
    
    let merchants = [...mockMerchants];
    
    // Apply filters
    if (options.filters) {
      merchants = filterData(merchants, options.filters);
    }
    
    // Apply sorting
    if (options.sort) {
      merchants = sortData(merchants, options.sort);
    }
    
    // Apply pagination
    const skip = options.skip || 0;
    const limit = options.limit || merchants.length;
    merchants = merchants.slice(skip, skip + limit);
    
    return {
      data: merchants,
      total: mockMerchants.length,
      skip,
      limit
    };
  },

  async getMerchant(merchantId) {
    await delay(150);
    const merchant = mockMerchants.find(m => m.merchant_id === merchantId);
    if (!merchant) {
      throw new Error(`Merchant ${merchantId} not found`);
    }
    return { data: merchant };
  },

  async createMerchant(merchantData) {
    await delay(300);
    const newMerchant = {
      merchant_id: `mer_${Date.now()}`,
      created_date: new Date().toISOString(),
      status: "pending",
      risk_level: "medium",
      ...merchantData
    };
    mockMerchants.push(newMerchant);
    return { data: newMerchant };
  },

  async updateMerchant(merchantId, updates) {
    await delay(250);
    const index = mockMerchants.findIndex(m => m.merchant_id === merchantId);
    if (index === -1) {
      throw new Error(`Merchant ${merchantId} not found`);
    }
    
    mockMerchants[index] = { ...mockMerchants[index], ...updates };
    return { data: mockMerchants[index] };
  },

  // Commission operations
  async getCommissions(options = {}) {
    await delay(200);
    
    let commissions = [...mockCommissions];
    
    // Apply filters
    if (options.filters) {
      commissions = filterData(commissions, options.filters);
    }
    
    // Apply sorting
    if (options.sort) {
      commissions = sortData(commissions, options.sort);
    }
    
    // Apply pagination
    const skip = options.skip || 0;
    const limit = options.limit || commissions.length;
    commissions = commissions.slice(skip, skip + limit);
    
    return {
      data: commissions,
      total: mockCommissions.length,
      skip,
      limit
    };
  },

  async getCommission(commissionId) {
    await delay(150);
    const commission = mockCommissions.find(c => c.commission_id === commissionId);
    if (!commission) {
      throw new Error(`Commission ${commissionId} not found`);
    }
    return { data: commission };
  },

  // User operations
  async getCurrentUser() {
    await delay(100);
    return { data: mockUser };
  },

  async updateCurrentUser(updates) {
    await delay(200);
    Object.assign(mockUser, updates);
    return { data: mockUser };
  },

  // Fee schedule operations
  async getFeeSchedules(options = {}) {
    await delay(100);
    let schedules = [...mockFeeSchedules];
    
    // Apply filters if provided
    if (options.enabled !== undefined) {
      schedules = schedules.filter(s => s.is_enabled === options.enabled);
    }
    
    return { data: schedules };
  },

  async getFeeSchedule(scheduleId) {
    await delay(100);
    const schedule = mockFeeSchedules.find(s => s.id === scheduleId);
    if (!schedule) {
      throw new Error(`Fee schedule ${scheduleId} not found`);
    }
    return { data: schedule };
  },

  // Connection status (always connected for mock)
  async getConnectionStatus() {
    return 'connected';
  }
};

export default mockDataService;
