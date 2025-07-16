import React, { useState, useEffect, useMemo } from 'react';
import { dataService } from '../../services/dataService';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/ui/table/TableHeader";
import TableActions from "@/components/ui/table/TableActions";
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
  AlertOctagon,
  Eye, 
  Edit, 
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableRow,
  TableFooter
} from "@/components/ui/table";

// Utility functions
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  return `${(value * 100).toFixed(1)}%`;
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
    case 'pending':
      return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
    case 'in_review':
      return <AlertCircle className="w-3.5 h-3.5 text-blue-500" />;
    case 'rejected':
      return <X className="w-3.5 h-3.5 text-red-500" />;
    default:
      return <AlertCircle className="w-3.5 h-3.5 text-gray-500" />;
  }
};

const getRiskIcon = (riskLevel) => {
  switch (riskLevel) {
    case 'low':
      return <ShieldCheck className="w-3.5 h-3.5 text-green-500" />;
    case 'medium':
      return <ShieldAlert className="w-3.5 h-3.5 text-yellow-500" />;
    case 'high':
      return <ShieldOff className="w-3.5 h-3.5 text-red-500" />;
    default:
      return <ShieldQuestion className="w-3.5 h-3.5 text-gray-500" />;
  }
};

const MerchantTable = ({ merchants, isLoading, onMerchantSelect, onRefresh, initialTab = 'all' }) => {
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
  const [activeTab, setActiveTab] = useState(initialTab);
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

  // Handle merchant actions
  const handleViewMerchant = (merchant) => {
    onMerchantSelect?.(merchant);
  };

  const handleEditMerchant = (merchant) => {
    console.log('Edit merchant:', merchant);
  };

  const handleDeleteMerchant = (merchant) => {
    console.log('Delete merchant:', merchant);
  };

  // Actions column renderer using Twill AI UI TableActions component
  const renderActions = (merchant) => {
    // Define additional actions for the dropdown
    const additionalActions = [
      {
        label: "Suspend",
        onClick: () => console.log(`Suspend merchant: ${merchant.business_name}`),
        className: "text-error"
      },
      {
        label: "Download Documents",
        onClick: () => console.log(`Download documents for: ${merchant.business_name}`),
        icon: <FileText className="h-4 w-4" />
      }
    ];
    
    return (
      <TableActions
        item={merchant}
        onView={handleViewMerchant}
        onEdit={handleEditMerchant}
        onDelete={handleDeleteMerchant}
        onApprove={(merchant) => console.log(`Approve merchant: ${merchant.business_name}`)}
        onReject={(merchant) => console.log(`Reject merchant: ${merchant.business_name}`)}
        additionalActions={additionalActions}
      />
    );
  };

  // Filter merchants based on active tab and search term
  useEffect(() => {
    let filtered = [...merchants];

    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(merchant => merchant.status === activeTab);
    }

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(merchant => 
        merchant.business_name?.toLowerCase().includes(lowerCaseSearch) ||
        merchant.merchant_id?.toLowerCase().includes(lowerCaseSearch) ||
        merchant.email?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Apply sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredMerchants(filtered);
  }, [merchants, activeTab, searchTerm, sortConfig]);

  // Calculate pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);
  const pageCount = Math.ceil(filteredMerchants.length / pageSize);

  // Prepare tabs with counts
  const tabs = [
    { id: 'all', label: 'All', count: merchants.length },
    { id: 'active', label: 'Active', count: merchants.filter(m => m.status === 'active').length },
    { id: 'pending', label: 'Pending', count: merchants.filter(m => m.status === 'pending').length },
    { id: 'in_review', label: 'In Review', count: merchants.filter(m => m.status === 'in_review').length },
    { id: 'rejected', label: 'Rejected', count: merchants.filter(m => m.status === 'rejected').length },
  ];

  // Define table columns
  const columns = [
    {
      id: 'business',
      header: 'Business',
      width: '200px',
      cell: (row) => (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray40 flex items-center justify-center text-black50 font-medium">
            {row.business_name?.charAt(0).toUpperCase() || 'M'}
          </div>
          <div>
            <p className="text-sm font-medium text-black50">{row.business_name}</p>
            <p className="text-sm text-black50">{row.merchant_id}</p>
          </div>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      width: '120px',
      cell: (row) => {
        const status = row.status || 'unknown';
        const statusConfig = {
          active: { color: 'bg-green-100 text-green-800', icon: getStatusIcon('active') },
          pending: { color: 'bg-yellow-100 text-yellow-800', icon: getStatusIcon('pending') },
          in_review: { color: 'bg-blue-100 text-blue-800', icon: getStatusIcon('in_review') },
          rejected: { color: 'bg-red-100 text-red-800', icon: getStatusIcon('rejected') },
          unknown: { color: 'bg-gray-100 text-gray-800', icon: getStatusIcon('unknown') }
        };
        
        return (
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className={`${statusConfig[status].color} border-none`}>
              <span className="mr-1">{statusConfig[status].icon}</span>
              {status.replace('_', ' ')}
            </Badge>
          </div>
        );
      }
    },
    {
      id: 'risk_level',
      header: 'Risk',
      accessor: 'risk_level',
      sortable: true,
      width: '100px',
      cell: (row) => {
        const risk = row.risk_level || 'unknown';
        const riskConfig = {
          low: { color: 'bg-green-100 text-green-800', icon: getRiskIcon('low') },
          medium: { color: 'bg-yellow-100 text-yellow-800', icon: getRiskIcon('medium') },
          high: { color: 'bg-red-100 text-red-800', icon: getRiskIcon('high') },
          unknown: { color: 'bg-gray-100 text-gray-800', icon: getRiskIcon('unknown') }
        };
        
        return (
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className={`${riskConfig[risk].color} border-none`}>
              <span className="mr-1">{riskConfig[risk].icon}</span>
              {risk}
            </Badge>
          </div>
        );
      }
    },
    {
      id: 'volume',
      header: 'Volume',
      accessor: 'volume',
      sortable: true,
      width: '120px',
      cell: (row) => (
        <div>
          <p className="text-sm font-medium text-black50">{formatCurrency(row.volume || 0)}</p>
          <div className="flex items-center">
            {row.volume_trend > 0 ? (
              <>
                <TrendingUp className="w-3 h-3 text-green mr-1" />
                <span className="text-sm text-green">{formatPercentage(row.volume_trend || 0)}</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3 h-3 text-error mr-1" />
                <span className="text-sm text-error">{formatPercentage(Math.abs(row.volume_trend || 0))}</span>
              </>
            )}
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
          <p className="text-sm font-medium text-black50">{(row.transaction_count || 0).toLocaleString()}</p>
          <p className="text-sm text-black50">
            {formatCurrency(row.average_transaction || 0)} avg
          </p>
        </div>
      )
    },
    {
      id: 'source',
      header: 'Source',
      accessor: 'source',
      width: '120px',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.source === 'EMS' ? 'bg-blue-100 text-blue-800' :
            row.source === 'LUQRA' ? 'bg-purple-100 text-purple-800' :
            row.source === 'ELAVON' ? 'bg-green-100 text-green-800' :
            row.source === 'NEXIO' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {row.source || 'N/A'}
          </span>
        </div>
      )
    },
    {
      id: 'rep',
      header: 'Rep',
      accessor: 'rep',
      width: '140px',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-azure100 to-periwinkle50 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {row.rep ? row.rep.split(' ').map(n => n[0]).join('').toUpperCase() : 'N/A'}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-black50">{row.rep || 'Unassigned'}</p>
          </div>
        </div>
      )
    },
    {
      id: 'mca',
      header: 'MCA',
      width: '180px',
      cell: (row) => {
        if (!row.mca) {
          return (
            <div className="text-center">
              <span className="text-sm text-gray-400">No MCA</span>
            </div>
          );
        }
        
        const { total_amount, paid_amount } = row.mca;
        const percentage = (paid_amount / total_amount) * 100;
        
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-black50">${(paid_amount / 1000).toFixed(0)}K</span>
              <span className="text-gray-500">${(total_amount / 1000).toFixed(0)}K</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-center text-gray-600">
              {percentage.toFixed(1)}% paid
            </div>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: '',
      width: '120px',
      cell: renderActions
    }
  ];

  return (
    <div className="rounded-xl shadow-md shadow-[rgba(13,10,44,0.08)] bg-white" data-testid="merchant-table">
      {/* Header with Title and Actions using Twill AI UI design */}
      <TableHeader 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onRefresh={onRefresh}
      >
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray80 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure100 focus:border-azure100"
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
      </TableHeader>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray40">
          <thead className="bg-gray40">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.id} 
                  className={`px-4 py-3 text-left text-sm font-medium text-black50 uppercase tracking-wider ${column.width ? `w-${column.width}` : ''}`}
                  onClick={() => column.sortable && requestSort(column.accessor)}
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="ml-1">
                        {sortConfig.key === column.accessor ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-black50" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-black50" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray40">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                    <span>Loading merchants...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedMerchants.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center justify-center py-6">
                    <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">No data available</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm ? 'Try adjusting your search' : 'No merchants found'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedMerchants.map((merchant) => (
                <tr 
                  key={merchant.id || merchant.merchant_id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewMerchant(merchant)}
                >
                  {columns.map((column) => (
                    <td 
                      key={`${merchant.id}-${column.id}`} 
                      className="px-4 py-3 whitespace-nowrap"
                      onClick={column.id === 'actions' ? (e) => e.stopPropagation() : undefined}
                    >
                      {column.cell(merchant)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="bg-gray40">
            <tr>
              <td colSpan={columns.length} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-black50">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredMerchants.length)} of {filteredMerchants.length} merchants
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    {/* Page size selector */}
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-black50">Show</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setPage(1); // Reset to first page when changing page size
                        }}
                        className="text-sm border border-gray80 rounded px-1 py-0.5 bg-white text-black50"
                      >
                        {[10, 25, 50, 100].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Pagination controls */}
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 p-0 border-gray80"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        <ChevronDown className="h-4 w-4 rotate-90" />
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                          let pageNum = i + 1;
                          if (pageCount > 5 && page > 3) {
                            pageNum = page - 3 + i;
                            if (pageNum > pageCount) pageNum = pageCount - (4 - i);
                          }
                          return (
                            <Button
                              key={i}
                              variant={page === pageNum ? "default" : "outline"}
                              size="icon"
                              className={`h-7 w-7 p-0 ${
                                page === pageNum 
                                  ? 'bg-azure100 hover:bg-azure100 text-white' 
                                  : 'border-gray80 text-black50'
                              }`}
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        
                        {pageCount > 5 && page < pageCount - 2 && (
                          <>
                            <span className="text-gray-400">...</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 p-0 border-gray80 text-black50"
                              onClick={() => setPage(pageCount)}
                            >
                              {pageCount}
                            </Button>
                          </>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 p-0 border-gray80"
                        onClick={() => setPage(Math.min(pageCount, page + 1))}
                        disabled={page === pageCount || pageCount === 0}
                      >
                        <ChevronUp className="h-4 w-4 rotate-90" />
                      </Button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MerchantTable;
