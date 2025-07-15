import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp
} from 'lucide-react';

export function UserTable({ users }) {
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterActive, setFilterActive] = useState('all');

  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(users.map(user => user.role))];

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesActive = filterActive === 'all' || 
                           (filterActive === 'active' && user.active) ||
                           (filterActive === 'inactive' && !user.active);
      
      return matchesSearch && matchesRole && matchesActive;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(0)}K`;
    } else {
      return formatCurrency(volume);
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-azure100" /> : 
      <ChevronDown className="w-4 h-4 text-azure100" />;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="p-6 border-b border-gray80/30">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray100 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray80 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure100/20 focus:border-azure100"
            />
          </div>
          
          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray100 w-4 h-4" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray80 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure100/20 focus:border-azure100 bg-white"
            >
              <option value="all">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          {/* Active Filter */}
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray100 w-4 h-4" />
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray80 rounded-lg focus:outline-none focus:ring-2 focus:ring-azure100/20 focus:border-azure100 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray80/30">
              <th 
                className="text-left p-4 font-medium text-gray100 cursor-pointer hover:text-black50 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  User Name
                  <SortIcon column="name" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-gray100 cursor-pointer hover:text-black50 transition-colors"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-2">
                  Role
                  <SortIcon column="role" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-gray100 cursor-pointer hover:text-black50 transition-colors"
                onClick={() => handleSort('submissions')}
              >
                <div className="flex items-center gap-2">
                  Submissions
                  <SortIcon column="submissions" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-gray100 cursor-pointer hover:text-black50 transition-colors"
                onClick={() => handleSort('active')}
              >
                <div className="flex items-center gap-2">
                  Active
                  <SortIcon column="active" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-gray100 cursor-pointer hover:text-black50 transition-colors"
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center gap-2">
                  Volume
                  <SortIcon column="volume" />
                </div>
              </th>
              <th 
                className="text-left p-4 font-medium text-gray100 cursor-pointer hover:text-black50 transition-colors"
                onClick={() => handleSort('commission_structure')}
              >
                <div className="flex items-center gap-2">
                  Commission Structure
                  <SortIcon column="commission_structure" />
                </div>
              </th>
              <th className="text-left p-4 font-medium text-gray100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.user_id} className="border-b border-gray80/20 hover:bg-gray40/10 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-azure100 to-periwinkle50 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-black50">{user.name}</p>
                      <p className="text-sm text-gray100">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-azure100/10 text-azure100">
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium text-black50">{user.submissions}</p>
                      <p className="text-sm text-gray100">{user.monthly_submissions} this month</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {user.active ? (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 font-medium">Inactive</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray100" />
                    <div>
                      <p className="font-medium text-black50">{formatVolume(user.volume)}</p>
                      <p className="text-sm text-gray100">{formatCurrency(user.total_commission)} commission</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray100" />
                    <span className="text-black50 font-medium">{user.commission_structure}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray40/20 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray100" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button className="p-2 hover:bg-gray40/20 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray100" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedUsers.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray100 text-lg">No users found</p>
            <p className="text-gray100 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {/* Table Footer */}
      <div className="px-6 py-4 border-t border-gray80/30 bg-gray40/10">
        <div className="flex items-center justify-between text-sm text-gray100">
          <p>Showing {filteredAndSortedUsers.length} of {users.length} users</p>
          <div className="flex items-center gap-4">
            <p>Total Volume: {formatVolume(users.reduce((sum, user) => sum + user.volume, 0))}</p>
            <p>Total Commissions: {formatCurrency(users.reduce((sum, user) => sum + user.total_commission, 0))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
