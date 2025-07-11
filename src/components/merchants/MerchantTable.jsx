import React, { useState, useEffect, useMemo } from 'react';
import { dataService } from '../../services/dataService';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  RefreshCw, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Info, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  ExternalLink,
  CreditCard,
  BarChart2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  ShieldOff,
  Activity,
  Percent,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  CreditCard as CreditCardIcon,
  AlertOctagon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatPercentage = (value) => {
  if (value === undefined || value === null) return '0.00%';
  return `${parseFloat(value).toFixed(2)}%`;
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
    case 'in_review':
      return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
    case 'action_needed':
      return <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />;
    case 'declined':
      return <X className="w-3.5 h-3.5 text-red-500" />;
    default:
      return <Clock className="w-3.5 h-3.5 text-gray-400" />;
  }
};

const getRiskIcon = (riskLevel) => {
  switch (riskLevel) {
    case 'low':
      return <ShieldCheck className="w-3.5 h-3.5 text-green-500" />;
    case 'medium':
      return <ShieldQuestion className="w-3.5 h-3.5 text-yellow-500" />;
    case 'high':
      return <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />;
    case 'critical':
      return <ShieldOff className="w-3.5 h-3.5 text-red-500" />;
    default:
      return <ShieldQuestion className="w-3.5 h-3.5 text-gray-400" />;
  }
};

const MerchantTable = ({ merchants, isLoading, onMerchantSelect, onRefresh }) => {
  // State
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ 
    key: 'business_name', 
    direction: 'asc' 
  });
  const [activeTab, setActiveTab] = useState('all');
  const [filteredMerchants, setFilteredMerchants] = useState([]);

  // Update total count when merchants change
  useEffect(() => {
    setTotalCount(merchants.length);
  }, [merchants]);

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1); // Reset to first page on tab change
  };

  // Tab definitions with counts
  const tabs = [
    { 
      id: 'all', 
      label: 'All',
      count: merchants.length,
      filter: () => merchants
    },
    { 
      id: 'active', 
      label: 'Active',
      count: merchants.filter(m => m.status === 'active').length,
      filter: () => merchants.filter(m => m.status === 'active')
    },
    { 
      id: 'editing', 
      label: 'Editing',
      count: merchants.filter(m => m.status === 'editing').length,
      filter: () => merchants.filter(m => m.status === 'editing')
    },
    { 
      id: 'in_review', 
      label: 'In Review',
      count: merchants.filter(m => m.status === 'in_review').length,
      filter: () => merchants.filter(m => m.status === 'in_review')
    },
    { 
      id: 'action_needed', 
      label: 'Action Needed',
      count: merchants.filter(m => m.status === 'action_needed').length,
      filter: () => merchants.filter(m => m.status === 'action_needed')
    },
    { 
      id: 'declined', 
      label: 'Declined',
      count: merchants.filter(m => m.status === 'declined').length,
      filter: () => merchants.filter(m => m.status === 'declined')
    },
    { 
      id: 'to_do', 
      label: 'To Do', 
      count: merchants.filter(m => m.status_message || m.risk_level === 'critical').length,
      filter: () => merchants.filter(m => m.status_message || m.risk_level === 'critical')
    }
  ];

  useEffect(() => {
    // Filter by tab logic first
    const currentTab = tabs.find(tab => tab.id === activeTab);
    let filtered = currentTab ? currentTab.filter() : merchants;

    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        (m.business_name || m.name || "").toLowerCase().includes(term) ||
        (m.email || "").toLowerCase().includes(term) ||
        String(m.id).toLowerCase().includes(term)
      );
    }

    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key.includes('_at')) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    
    setFilteredMerchants(sorted);
  }, [activeTab, merchants, sortConfig.key, sortConfig.direction, searchTerm]);

  const handleSort = (field) => {
    if (sortConfig.key === field) {
      setSortConfig({ key: field, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortConfig({ key: field, direction: 'asc' });
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Render detailed fee information
  const renderFeeDetails = (merchant) => {
    const feeScheduleName = merchant.fee_schedule_name || merchant.feeScheduleName;
    
    // Check if we have detailed fee schedule info
    if (feeScheduleName && feeScheduleName !== 'Unknown' && feeScheduleName !== 'Standard Plan: All Cards 2.9% + $.30; No ACH; Monthly Fees $20; PCI Monthly Fee: $6.25') {
      return (
        <div className="space-y-1">
          <div className="font-medium text-black50 text-xs">{feeScheduleName}</div>
        </div>
      );
    }
    
    // For detailed fee schedule strings, parse and display nicely
    if (feeScheduleName && feeScheduleName.includes('Standard Plan:')) {
      return (
        <div className="space-y-1 max-w-[180px]">
          <div className="font-medium text-black50 text-xs">Standard Plan</div>
          <div className="text-xs text-gray100 leading-relaxed">
            <div>Cards: 2.9% + $0.30</div>
            <div>ACH: Not available</div>
            <div>Monthly: $20</div>
            <div>PCI Fee: $6.25/mo</div>
          </div>
        </div>
      );
    }
    
    // Default rendering
    return (
      <div className="text-gray100 text-xs">
        {feeScheduleName || 'No fee schedule'}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSortIcon = (field) => {
    if (sortConfig.key !== field) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Table columns configuration
  const columns = [
    {
      id: 'business',
      header: 'Merchant',
      accessor: 'business_name',
      width: '250px',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <Building2 className="h-5 w-5 text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{row.business_name}</p>
            <p className="text-xs text-gray-500 truncate">ID: {row.id}</p>
          </div>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      width: '120px',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          {getStatusIcon(row.status)}
          <span className="ml-2 text-sm capitalize">
            {row.status.replace('_', ' ')}
          </span>
        </div>
      )
    },
    {
      id: 'risk',
      header: 'Risk',
      accessor: 'risk_level',
      width: '100px',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          {getRiskIcon(row.risk_level)}
          <span className="ml-2 text-sm capitalize">{row.risk_level}</span>
        </div>
      )
    },
    {
      id: 'volume',
      header: 'Monthly Volume',
      accessor: 'monthly_volume',
      width: '150px',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(row.monthly_volume || 0)}
          </p>
          <div className="flex items-center">
            {(row.monthly_volume_change_30d || 0) > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${(row.monthly_volume_change_30d || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(row.monthly_volume_change_30d || 0)}%
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'transactions',
      header: 'Transactions',
      accessor: 'transaction_count',
      width: '140px',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="text-sm text-gray-900">{(row.transaction_count || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500">
            {formatCurrency(row.average_transaction || 0)} avg
          </p>
        </div>
      )
    },
    {
      id: 'metrics',
      header: 'Metrics',
      width: '180px',
      cell: (row) => (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">Approval</p>
            <p className="text-sm font-medium">{formatPercentage(row.approval_rate || 0)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Chargeback</p>
            <p className={`text-sm font-medium ${
              parseFloat(row.chargeback_rate || 0) > 1 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatPercentage(row.chargeback_rate || 0)}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'actions',
      header: '',
      width: '60px',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onMerchantSelect?.(row)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Suspend</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="rounded-xl shadow-md shadow-[rgba(13,10,44,0.08)] bg-white">
      {/* Header with Title and Actions */}
      <div className="px-6 py-4 bg-gray-50 rounded-t-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Merchants</h2>
            <p className="text-sm text-gray-500">
              {totalCount} {totalCount === 1 ? 'merchant' : 'merchants'} found
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-gray-300">
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-300"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count.toLocaleString()}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={`${column.width ? `w-[${column.width}]` : ''} ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && requestSort(column.accessor)}
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="ml-1">
                        {sortConfig.key === column.accessor ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-gray-500" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-gray-500" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mb-2" />
                    <p className="text-gray-500">Loading merchants...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredMerchants.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium text-gray-900">No merchants found</h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'There are no merchants to display.'}
                    </p>
                    {(searchTerm || statusFilter !== 'all') && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setActiveTab('all');
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              filteredMerchants.map((merchant) => (
                <TableRow 
                  key={merchant.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onMerchantSelect?.(merchant)}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={`${merchant.id}-${column.id}`}
                      className={`${column.width ? `w-[${column.width}]` : ''} ${
                        column.id === 'business' ? 'sticky left-0 bg-white' : ''
                      }`}
                    >
                      {column.cell ? column.cell(merchant) : merchant[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
          
          {/* Pagination */}
          {!isLoading && merchants.length > 0 && (
            <TableFooter className="bg-gray-50">
              <TableRow>
                <TableCell colSpan={columns.length} className="px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(page * pageSize, totalCount)}
                      </span>{' '}
                      of <span className="font-medium">{totalCount}</span> merchants
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="border-gray-300"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, i) => i + 1)
                          .filter(num => {
                            if (num === 1 || num === Math.ceil(totalCount / pageSize)) return true;
                            return Math.abs(num - page) <= 1;
                          })
                          .map((num, i, arr) => (
                            <React.Fragment key={num}>
                              {i > 0 && num - arr[i - 1] > 1 && (
                                <span className="px-2 text-gray-500">...</span>
                              )}
                              <Button
                                variant={page === num ? "default" : "outline"}
                                size="sm"
                                className={`w-10 h-10 p-0 ${page === num ? '' : 'border-gray-300'}`}
                                onClick={() => setPage(num)}
                              >
                                {num}
                              </Button>
                            </React.Fragment>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(p + 1, Math.ceil(totalCount / pageSize)))}
                        disabled={page >= Math.ceil(totalCount / pageSize)}
                        className="border-gray-300"
                      >
                        Next
                      </Button>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Rows per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setPage(1);
                        }}
                        className="ml-2 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 rounded-md"
                      >
                        {[10, 25, 50, 100].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
};

export default MerchantTable;