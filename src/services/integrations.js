// Local Integration Services
// Provides stubs for LLM, email, file, and image services
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

// Core Integration Services
export const Core = {
  // LLM Integration
  InvokeLLM: async (params) => {
    try {
      const apiService = getAPIService();
      return await apiService.invokeLLM(params);
    } catch (error) {
      console.error('InvokeLLM error:', error);
      return {
        response: "Service temporarily unavailable. This feature will be available soon.",
        model: "fallback",
        usage: { tokens: 0 },
        error: true
      };
    }
  },

  // Email Integration
  SendEmail: async (params) => {
    try {
      const apiService = getAPIService();
      return await apiService.sendEmail(params);
    } catch (error) {
      console.error('SendEmail error:', error);
      return {
        message_id: null,
        status: "failed",
        error: "Email service temporarily unavailable",
        fallback: true
      };
    }
  },

  // File Upload Integration
  UploadFile: async (file) => {
    try {
      const apiService = getAPIService();
      return await apiService.uploadFile(file);
    } catch (error) {
      console.error('UploadFile error:', error);
      return {
        file_id: null,
        filename: file?.name || 'unknown',
        status: "failed",
        error: "Upload service temporarily unavailable",
        fallback: true
      };
    }
  },

  // Image Generation Integration
  GenerateImage: async (params) => {
    try {
      const apiService = getAPIService();
      return await apiService.generateImage(params);
    } catch (error) {
      console.error('GenerateImage error:', error);
      return {
        image_id: null,
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEdlbmVyYXRpb24gVW5hdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg==",
        prompt: params?.prompt || '',
        status: "failed",
        error: "Image generation service temporarily unavailable",
        fallback: true
      };
    }
  },

  // Data Extraction Integration
  ExtractDataFromUploadedFile: async (params) => {
    try {
      const apiService = getAPIService();
      return await apiService.extractDataFromFile(params);
    } catch (error) {
      console.error('ExtractDataFromUploadedFile error:', error);
      return {
        extraction_id: null,
        extracted_data: {
          text: "Data extraction service temporarily unavailable",
          metadata: { pages: 0, confidence: 0 },
          fields: {}
        },
        status: "failed",
        error: "Data extraction service temporarily unavailable",
        fallback: true
      };
    }
  }
};

// Export individual functions for easier imports
export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;

// Future PayEngine Integration (placeholder)
export const PayEngine = {
  // These will be implemented when PayEngine is integrated
  async processPayment(paymentData) {
    console.warn('PayEngine integration not yet implemented');
    return {
      payment_id: `pending_${Date.now()}`,
      status: 'pending_integration',
      message: 'PayEngine integration coming soon'
    };
  },

  async getTransactionHistory(filters) {
    console.warn('PayEngine integration not yet implemented');
    return [];
  },

  async refundTransaction(transactionId, amount) {
    console.warn('PayEngine integration not yet implemented');
    return {
      refund_id: `pending_${Date.now()}`,
      status: 'pending_integration',
      message: 'PayEngine integration coming soon'
    };
  }
};

export default {
  Core,
  InvokeLLM,
  SendEmail,
  UploadFile,
  GenerateImage,
  ExtractDataFromUploadedFile,
  PayEngine
};
