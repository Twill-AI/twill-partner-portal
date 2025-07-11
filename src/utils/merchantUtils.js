import { format } from 'date-fns';

/**
 * Format currency values consistently
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Format percentages
 */
export const formatPercentage = (value, decimals = 1) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format((value || 0) / 100);
};

/**
 * Format dates consistently
 */
export const formatDate = (dateString, formatStr = 'MMM d, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Get status display information
 */
export const getStatusInfo = (status) => {
  const statusMap = {
    active: {
      label: 'Active',
      color: 'bg-green-100 text-green-800',
      icon: 'CheckCircle',
    },
    in_review: {
      label: 'In Review',
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'Clock',
    },
    suspended: {
      label: 'Suspended',
      color: 'bg-red-100 text-red-800',
      icon: 'AlertTriangle',
    },
    inactive: {
      label: 'Inactive',
      color: 'bg-gray-100 text-gray-800',
      icon: 'XCircle',
    },
    editing: {
      label: 'Editing',
      color: 'bg-blue-100 text-blue-800',
      icon: 'Edit',
    },
    action_needed: {
      label: 'Action Needed',
      color: 'bg-orange-100 text-orange-800',
      icon: 'AlertCircle',
    },
    declined: {
      label: 'Declined',
      color: 'bg-red-100 text-red-800',
      icon: 'XCircle',
    },
  };

  return statusMap[status] || {
    label: status || 'Unknown',
    color: 'bg-gray-100 text-gray-800',
    icon: 'HelpCircle',
  };
};

/**
 * Get risk level display information
 */
export const getRiskInfo = (riskLevel) => {
  const riskMap = {
    low: {
      label: 'Low',
      color: 'bg-green-100 text-green-800',
      icon: 'ShieldCheck',
    },
    medium: {
      label: 'Medium',
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'ShieldAlert',
    },
    high: {
      label: 'High',
      color: 'bg-red-100 text-red-800',
      icon: 'ShieldOff',
    },
    critical: {
      label: 'Critical',
      color: 'bg-red-100 text-red-800',
      icon: 'AlertOctagon',
    },
  };

  return riskMap[riskLevel?.toLowerCase()] || {
    label: riskLevel || 'Unknown',
    color: 'bg-gray-100 text-gray-800',
    icon: 'ShieldQuestion',
  };
};

/**
 * Format transaction type
 */
export const formatTransactionType = (type) => {
  const types = {
    sale: 'Sale',
    refund: 'Refund',
    authorization: 'Authorization',
    capture: 'Capture',
    void: 'Void',
    chargeback: 'Chargeback',
  };

  return types[type] || type || 'Unknown';
};

/**
 * Format card type
 */
export const formatCardType = (cardType) => {
  const types = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    jcb: 'JCB',
    diners: 'Diners Club',
    unionpay: 'UnionPay',
  };

  return types[cardType?.toLowerCase()] || cardType || 'Unknown';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '??';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

/**
 * Format business type
 */
export const formatBusinessType = (type) => {
  const types = {
    llc: 'LLC',
    corporation: 'Corporation',
    sole_proprietorship: 'Sole Proprietorship',
    partnership: 'Partnership',
    non_profit: 'Non-Profit',
    government: 'Government',
    individual: 'Individual',
  };

  return types[type] || type || 'Unknown';
};

/**
 * Calculate trend percentage
 */
export const calculateTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

/**
 * Format trend with arrow
 */
export const formatTrend = (value) => {
  const numValue = parseFloat(value) || 0;
  const isPositive = numValue > 0;
  const isNegative = numValue < 0;
  const isNeutral = numValue === 0;
  
  const absValue = Math.abs(numValue).toFixed(1);
  
  return {
    value: absValue,
    isPositive,
    isNegative,
    isNeutral,
    formatted: `${isPositive ? '+' : isNegative ? '-' : ''}${absValue}%`,
  };
};

/**
 * Format merchant address
 */
export const formatAddress = (address) => {
  if (!address) return 'N/A';
  
  const { line1, line2, city, state, postal_code, country } = address;
  const parts = [line1, line2, `${city}, ${state} ${postal_code}`, country]
    .filter(Boolean);
    
  return parts.join('\n');
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  // Simple formatting for US numbers
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

export default {
  formatCurrency,
  formatPercentage,
  formatDate,
  getStatusInfo,
  getRiskInfo,
  formatTransactionType,
  formatCardType,
  getInitials,
  formatBusinessType,
  calculateTrend,
  formatTrend,
  formatAddress,
  formatPhoneNumber,
};
