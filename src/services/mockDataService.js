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
    fee_schedule_id: "fee_002", // Premium Processing
    source: "EMS",
    rep: "Sarah Johnson",
    mca: {
      total_amount: 150000,
      paid_amount: 112500,
      remaining_amount: 37500,
      daily_payment: 850,
      start_date: "2023-06-01T00:00:00Z",
      estimated_completion: "2024-01-15T00:00:00Z"
    }
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
    fee_schedule_id: "fee_001", // Standard Processing
    source: "LUQRA",
    rep: "Michael Chen",
    mca: {
      total_amount: 75000,
      paid_amount: 22500,
      remaining_amount: 52500,
      daily_payment: 425,
      start_date: "2024-01-15T00:00:00Z",
      estimated_completion: "2024-08-20T00:00:00Z"
    }
  },
  {
    merchant_id: "mer_003",
    business_name: "Digital Marketing Pro",
    dba_name: "DigiPro",
    business_type: "Services",
    status: "action_required",
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
    status_message: "Action Required: Upload 3 months bank statements and answer compliance questions.",
    fee_schedule_id: "fee_003", // High Risk Processing
    source: "ELAVON",
    rep: "Emily Rodriguez",
    mca: {
      total_amount: 200000,
      paid_amount: 45000,
      remaining_amount: 155000,
      daily_payment: 1200,
      start_date: "2024-03-01T00:00:00Z",
      estimated_completion: "2024-12-15T00:00:00Z"
    }
  },
  {
    merchant_id: "mer_004",
    business_name: "Fresh Food Market",
    dba_name: "Fresh Market",
    business_type: "Retail",
    status: "action_required",
    risk_level: "low",
    monthly_volume: 450000,
    monthly_commission: 11250,
    logo_url: "https://logo.clearbit.com/freshmarket.com",
    created_date: "2025-07-10T10:00:00Z",
    contact_email: "info@freshmarket.com",
    phone: "+1-555-0456",
    address: {
      street: "456 Market Street",
      city: "Seattle",
      state: "WA",
      zip: "98101"
    },
    processing_start_date: null,
    average_transaction: 75,
    transaction_count: 0,
    chargeback_rate: 0,
    approval_rate: 0,
    notes: "New merchant pending approval",
    status_message: "Action Required: Please upload business license and provide additional business references.",
    fee_schedule_id: "fee_001",
    source: "NEXIO",
    rep: "David Kim",
    mca: null
  },
  {
    merchant_id: "mer_005",
    business_name: "Fitness Plus Gym",
    dba_name: "Fitness Plus",
    business_type: "Services",
    status: "pending",
    risk_level: "medium",
    monthly_volume: 320000,
    monthly_commission: 8000,
    logo_url: "https://logo.clearbit.com/fitnessplus.com",
    created_date: "2025-07-12T14:30:00Z",
    contact_email: "admin@fitnessplus.com",
    phone: "+1-555-0789",
    address: {
      street: "789 Fitness Ave",
      city: "Austin",
      state: "TX",
      zip: "73301"
    },
    processing_start_date: null,
    average_transaction: 120,
    transaction_count: 0,
    chargeback_rate: 0,
    approval_rate: 0,
    notes: "Gym membership and personal training services",
    fee_schedule_id: "fee_002",
    source: "EMS",
    rep: "Sarah Johnson",
    mca: {
      total_amount: 100000,
      paid_amount: 85000,
      remaining_amount: 15000,
      daily_payment: 650,
      start_date: "2023-12-01T00:00:00Z",
      estimated_completion: "2024-08-01T00:00:00Z"
    }
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

// Mock Users Data for Sales Team
const mockUsers = [
  {
    user_id: "user_001",
    name: "Sarah Johnson",
    email: "sarah.johnson@twill.ai",
    role: "Sales Manager",
    submissions: 45,
    active: true,
    volume: 2850000,
    commission_structure: "Tiered - 2.5-3.5%",
    created_date: "2023-01-15T00:00:00Z",
    last_login: "2024-01-20T14:30:00Z",
    monthly_submissions: 12,
    active_this_month: 9,
    conversion_rate: 78,
    total_commission: 89250
  },
  {
    user_id: "user_002",
    name: "Michael Chen",
    email: "michael.chen@twill.ai",
    role: "Senior Sales Rep",
    submissions: 38,
    active: true,
    volume: 2100000,
    commission_structure: "Flat - 2.8%",
    created_date: "2023-03-10T00:00:00Z",
    last_login: "2024-01-20T16:45:00Z",
    monthly_submissions: 10,
    active_this_month: 8,
    conversion_rate: 82,
    total_commission: 58800
  },
  {
    user_id: "user_003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@twill.ai",
    role: "Sales Rep",
    submissions: 29,
    active: true,
    volume: 1650000,
    commission_structure: "Tiered - 2.0-3.0%",
    created_date: "2023-06-20T00:00:00Z",
    last_login: "2024-01-19T11:20:00Z",
    monthly_submissions: 8,
    active_this_month: 6,
    conversion_rate: 75,
    total_commission: 41250
  },
  {
    user_id: "user_004",
    name: "David Thompson",
    email: "david.thompson@twill.ai",
    role: "Sales Rep",
    submissions: 22,
    active: true,
    volume: 1200000,
    commission_structure: "Flat - 2.5%",
    created_date: "2023-08-05T00:00:00Z",
    last_login: "2024-01-20T09:15:00Z",
    monthly_submissions: 6,
    active_this_month: 4,
    conversion_rate: 68,
    total_commission: 30000
  },
  {
    user_id: "user_005",
    name: "Lisa Park",
    email: "lisa.park@twill.ai",
    role: "Junior Sales Rep",
    submissions: 15,
    active: true,
    volume: 850000,
    commission_structure: "Tiered - 1.8-2.5%",
    created_date: "2023-10-12T00:00:00Z",
    last_login: "2024-01-18T13:40:00Z",
    monthly_submissions: 4,
    active_this_month: 3,
    conversion_rate: 73,
    total_commission: 19125
  },
  {
    user_id: "user_006",
    name: "Robert Wilson",
    email: "robert.wilson@twill.ai",
    role: "Sales Rep",
    submissions: 31,
    active: false,
    volume: 1800000,
    commission_structure: "Flat - 2.7%",
    created_date: "2023-04-18T00:00:00Z",
    last_login: "2024-01-10T10:30:00Z",
    monthly_submissions: 0,
    active_this_month: 0,
    conversion_rate: 71,
    total_commission: 48600
  },
  {
    user_id: "user_007",
    name: "Amanda Foster",
    email: "amanda.foster@twill.ai",
    role: "Sales Manager",
    submissions: 52,
    active: true,
    volume: 3200000,
    commission_structure: "Tiered - 3.0-4.0%",
    created_date: "2022-11-08T00:00:00Z",
    last_login: "2024-01-20T17:20:00Z",
    monthly_submissions: 14,
    active_this_month: 12,
    conversion_rate: 85,
    total_commission: 112000
  },
  {
    user_id: "user_008",
    name: "James Martinez",
    email: "james.martinez@twill.ai",
    role: "Senior Sales Rep",
    submissions: 41,
    active: true,
    volume: 2400000,
    commission_structure: "Flat - 3.0%",
    created_date: "2023-02-25T00:00:00Z",
    last_login: "2024-01-20T12:10:00Z",
    monthly_submissions: 11,
    active_this_month: 9,
    conversion_rate: 79,
    total_commission: 72000
  }
];

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

  async getUsers(options = {}) {
    await delay(200);
    
    let users = [...mockUsers];
    
    // Apply filters
    if (options.filters) {
      users = filterData(users, options.filters);
    }
    
    // Apply sorting
    if (options.sort) {
      users = sortData(users, options.sort);
    }
    
    // Apply pagination
    const skip = options.skip || 0;
    const limit = options.limit || users.length;
    users = users.slice(skip, skip + limit);
    
    return {
      data: users,
      total: mockUsers.length,
      skip,
      limit
    };
  },

  async getUser(userId) {
    await delay(150);
    const user = mockUsers.find(u => u.user_id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    return { data: user };
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
