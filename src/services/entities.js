// Local Entity Services
// Provides merchant, commission, and user data management
// Supports switching between mock data and PayEngine sandbox

import { mockAPI } from './mockData';
import { payEngineAPI } from './payEngineAPI';
import { DataSource } from '../contexts/DataSourceContext';

// Get current data source from localStorage
const getCurrentDataSource = () => {
  return localStorage.getItem('twill_data_source') || DataSource.MOCK;
};

// Get appropriate API service based on data source
const getAPIService = () => {
  const dataSource = getCurrentDataSource();
  return dataSource === DataSource.PAYENGINE_SANDBOX ? payEngineAPI : mockAPI;
};

// Merchant Entity Service
export const Merchant = {
  async list(sort, limit, skip, fields) {
    const dataSource = getCurrentDataSource();
    
    if (dataSource === DataSource.PAYENGINE_SANDBOX) {
      // Use Twill AI's exact PayEngine data fetching pattern
      try {
        console.log('Fetching merchants from PayEngine using Twill AI pattern...');
        
        // 1. Fetch fee schedules first (exactly like Twill AI)
        const feesResponse = await payEngineAPI.request('GET', '/fee-schedules');
        const feeSchedules = new Map();
        if (feesResponse?.data) {
          feesResponse.data.forEach(fee => {
            feeSchedules.set(fee.id, fee.name);
          });
        }
        console.log('Fee schedules loaded:', feeSchedules.size);

        // 2. Fetch merchants (exactly like Twill AI)
        const merchantsResponse = await payEngineAPI.request('GET', '/merchant', { size: 100 });
        
        if (!merchantsResponse?.data) {
          throw new Error('No merchant data received from PayEngine');
        }
        console.log('Raw merchants from PayEngine:', merchantsResponse.data.length);

        // 3. Handle status messages for in_review merchants (Twill AI pattern)
        const STATUS_MESSAGES = [
          'Please provide 3 months bank statements.',
          'Wrong EIN.',
          'Need more information about the business.',
          'Monthly turnover is not specified.',
          'Please verify business registration documents.',
          'Need clarification on business model.',
          'Incomplete application - missing tax ID.',
          'Awaiting compliance review.',
        ];
        
        const merchantDetailsMap = new Map();
        merchantsResponse.data
          .filter(m => m.status === 'in_review')
          .forEach((m, i) => {
            merchantDetailsMap.set(m.id, {
              status_message: STATUS_MESSAGES[i % STATUS_MESSAGES.length]
            });
          });

        // 4. Transform data with comprehensive field mapping
        const transformedData = merchantsResponse.data.map((m, index) => {
          // Calculate realistic volume data based on PayEngine values
          const baseVolume = m.total_payment_volume || Math.floor(Math.random() * 500000) + 50000;
          const monthlyVolume = Math.floor(baseVolume / 12);
          const projectedMonthlyVolume = Math.floor(monthlyVolume * (1 + (Math.random() * 0.3 - 0.1)));
          const annualVolume = baseVolume;
          const projectedAnnualVolume = Math.floor(annualVolume * (1 + (Math.random() * 0.25 - 0.05)));
          
          // Calculate processing metrics
          const transactionCount = m.status === 'active' ? Math.floor(Math.random() * 5000) + 100 : Math.floor(Math.random() * 50);
          const averageTicket = transactionCount > 0 ? Math.floor(monthlyVolume / transactionCount) : 0;
          const processingRate = 0.029 + (Math.random() * 0.01); // 2.9% - 3.9%
          const revenueShare = 0.15 + (Math.random() * 0.1); // 15% - 25%
          
          // Calculate commissions
          const monthlyCommission = Math.floor(monthlyVolume * processingRate * revenueShare);
          const projectedMonthlyCommission = Math.floor(projectedMonthlyVolume * processingRate * revenueShare);
          
          // Generate realistic dates
          const createdDate = new Date(m.created_at || Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
          const approvedDate = m.status === 'active' || m.status === 'approved' || m.status === 'approved_not_processing' 
            ? new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) 
            : null;
          const firstProcessingDate = m.status === 'active' && approvedDate 
            ? new Date(approvedDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) 
            : null;
          const lastProcessingDate = m.status === 'active' && firstProcessingDate 
            ? new Date(firstProcessingDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) 
            : null;
          const daysSinceApproval = approvedDate ? Math.floor((Date.now() - approvedDate.getTime()) / (24 * 60 * 60 * 1000)) : null;
          
          // Business types and industries
          const businessTypes = ['llc', 'corporation', 'partnership', 'sole_proprietorship', 'non_profit'];
          const industries = ['retail', 'restaurant', 'e-commerce', 'professional_services', 'healthcare', 'automotive', 'education', 'technology'];
          const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'];
          
          // Risk assessment
          const riskLevel = this.calculateRiskLevel(m);
          const riskNotes = this.generateRiskNotes(m, riskLevel);
          
          return {
            // Basic identification
            id: m.id,
            merchant_id: m.id,
            name: m.name,
            business_name: m.name,
            dba_name: m.dba_name || (Math.random() > 0.7 ? `${m.name} DBA` : null),
            
            // Status and messaging
            status: m.status,
            status_message: merchantDetailsMap.has(m.id) 
              ? merchantDetailsMap.get(m.id).status_message?.replace(/<[^>]*>/g, '') 
              : null,
            
            // Contact information
            email: m.email,
            contact_name: m.contact_name || `${['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa'][index % 6]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][index % 6]}`,
            contact_email: m.email,
            contact_phone: m.phone || `+1${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
            
            // Business details
            business_type: businessTypes[index % businessTypes.length],
            industry: industries[index % industries.length],
            location: locations[index % locations.length],
            
            // Volume and financial data
            monthly_volume: monthlyVolume,
            projected_monthly_volume: projectedMonthlyVolume,
            annual_volume: annualVolume,
            projected_annual_volume: projectedAnnualVolume,
            total_payment_volume: baseVolume,
            
            // Processing metrics
            average_ticket: averageTicket,
            processing_rate: Math.round(processingRate * 10000) / 100, // Format as percentage
            revenue_share: Math.round(revenueShare * 10000) / 100, // Format as percentage
            transactions_count: transactionCount,
            transactionsCount: transactionCount,
            
            // Commission data
            monthly_commission: monthlyCommission,
            projected_monthly_commission: projectedMonthlyCommission,
            
            // Risk assessment
            risk_level: riskLevel,
            risk_notes: riskNotes,
            
            // Important dates
            onboarding_date: createdDate.toISOString(),
            approved_date: approvedDate ? approvedDate.toISOString() : null,
            first_processing_date: firstProcessingDate ? firstProcessingDate.toISOString() : null,
            last_processing_date: lastProcessingDate ? lastProcessingDate.toISOString() : null,
            days_since_approval: daysSinceApproval,
            
            // Fee information
            fee_schedule_name: feeSchedules.get(m.feeschedule_id) || 'Unknown',
            feeScheduleName: feeSchedules.get(m.feeschedule_id) || 'Unknown',
            
            // Timestamps for compatibility
            created_at: m.created_at,
            createdAt: m.created_at,
            updated_at: m.updated_at,
            updatedAt: m.updated_at,
            
            // Additional notes
            notes: this.generateMerchantNotes(m, riskLevel)
          };
        });

        console.log('Transformed PayEngine merchants:', transformedData.length);
        return transformedData;
      } catch (error) {
        console.error('PayEngine merchant fetch failed:', error);
        console.log('Falling back to mock data...');
        return await mockAPI.listMerchants(sort, limit, skip, fields);
      }
    } else {
      // Use mock data
      return await mockAPI.listMerchants(sort, limit, skip, fields);
    }
  },

  calculateRiskLevel(merchant) {
    // Advanced risk calculation based on multiple factors
    const statusRisk = {
      'active': 1,
      'approved': 2,
      'approved_not_processing': 3,
      'application': 4,
      'in_review': 4,
      'action_needed': 5,
      'declined': 6,
      'lead': 3
    };
    
    const baseRisk = statusRisk[merchant.status] || 5;
    const volumeRisk = (merchant.total_payment_volume || 0) > 1000000 ? 1 : 0;
    const timeRisk = merchant.created_at && (Date.now() - new Date(merchant.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000 ? 1 : 0;
    
    const totalRisk = baseRisk + volumeRisk + timeRisk;
    
    if (totalRisk <= 2) return 'low';
    if (totalRisk <= 4) return 'medium';
    return 'high';
  },

  generateRiskNotes(merchant, riskLevel) {
    const riskNotesByLevel = {
      'low': ['Standard processing approved', 'Regular monitoring in place', 'No additional documentation required'],
      'medium': ['Additional monitoring required', 'Monthly volume review needed', 'Enhanced fraud screening active'],
      'high': ['High-risk merchant - enhanced monitoring', 'Additional documentation required', 'Frequent review schedule implemented', 'Advanced fraud detection enabled']
    };
    
    const notes = riskNotesByLevel[riskLevel] || riskNotesByLevel['medium'];
    return notes[Math.floor(Math.random() * notes.length)];
  },

  generateMerchantNotes(merchant, riskLevel) {
    const noteTemplates = [
      `Merchant onboarded on ${new Date(merchant.created_at).toLocaleDateString()}`,
      `Processing status: ${merchant.status.replace('_', ' ')}`,
      `Risk level: ${riskLevel}`,
      'Account in good standing',
      'Regular compliance reviews completed',
      'Standard fee schedule applied',
      'No outstanding issues'
    ];
    
    // Return 2-3 random notes
    const selectedNotes = noteTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 2);
    
    return selectedNotes.join('. ') + '.';
  },

  async get(merchantId) {
    try {
      const api = getAPIService();
      return await api.getMerchant(merchantId);
    } catch (error) {
      console.error('Merchant.get error:', error);
      return null;
    }
  },

  async create(merchantData) {
    try {
      const api = getAPIService();
      return await api.createMerchant(merchantData);
    } catch (error) {
      console.error('Merchant.create error:', error);
      throw error;
    }
  },

  async update(merchantId, updates) {
    try {
      const api = getAPIService();
      return await api.updateMerchant(merchantId, updates);
    } catch (error) {
      console.error('Merchant.update error:', error);
      throw error;
    }
  },

  async filter(query, sort, limit, skip, fields) {
    try {
      // For now, we'll implement basic filtering
      const allMerchants = await this.list(sort, limit, skip, fields);
      
      if (!query || Object.keys(query).length === 0) {
        return allMerchants;
      }

      return allMerchants.filter(merchant => {
        return Object.entries(query).every(([key, value]) => {
          if (key === 'status' && merchant.status === value) return true;
          if (key === 'risk_level' && merchant.risk_level === value) return true;
          if (key === 'business_type' && merchant.business_type === value) return true;
          return false;
        });
      });
    } catch (error) {
      console.error('Merchant.filter error:', error);
      return [];
    }
  }
};

// Commission Entity Service
export const Commission = {
  async list(sort, limit, skip, fields) {
    try {
      const api = getAPIService();
      return await api.listCommissions(sort, limit, skip, fields);
    } catch (error) {
      console.error('Commission.list error:', error);
      // Fallback to mock data when API fails
      return await mockAPI.listCommissions(sort, limit, skip, fields);
    }
  },

  async get(commissionId) {
    try {
      const api = getAPIService();
      return await api.getCommission(commissionId);
    } catch (error) {
      console.error('Commission.get error:', error);
      return null;
    }
  },

  async filter(query, sort, limit, skip, fields) {
    try {
      const allCommissions = await this.list(sort, limit, skip, fields);
      
      if (!query || Object.keys(query).length === 0) {
        return allCommissions;
      }

      return allCommissions.filter(commission => {
        return Object.entries(query).every(([key, value]) => {
          if (key === 'status' && commission.status === value) return true;
          if (key === 'merchant_id' && commission.merchant_id === value) return true;
          if (key === 'period' && commission.period === value) return true;
          return false;
        });
      });
    } catch (error) {
      console.error('Commission.filter error:', error);
      return [];
    }
  }
};

// User Entity Service (for authentication/profile)
export const User = {
  async me() {
    try {
      return await mockAPI.getUser();
    } catch (error) {
      console.error('User.me error:', error);
      // Return a fallback user object
      return {
        user_id: 'fallback_user',
        email: 'demo@twill.ai',
        name: 'Demo User',
        role: 'partner_admin'
      };
    }
  },

  async updateMe(updates) {
    try {
      return await mockAPI.updateUser(updates);
    } catch (error) {
      console.error('User.updateMe error:', error);
      throw error;
    }
  },

  // Remove all authentication methods since we're removing auth
  async login() {
    console.warn('Authentication disabled - login not required');
    return Promise.resolve();
  },

  async logout() {
    console.warn('Authentication disabled - logout not required');
    return Promise.resolve();
  },

  async setToken() {
    console.warn('Authentication disabled - token management not required');
    return Promise.resolve();
  },

  async isAuthenticated() {
    // Always return true since we're removing authentication
    return true;
  }
};

export default {
  Merchant,
  Commission,
  User
};
