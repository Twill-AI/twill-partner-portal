import React, { useState, useEffect } from 'react';
import { Plus, UserCheck, TrendingUp, Target, Award, DollarSign, Users as UsersIcon, Calendar, UserPlus } from 'lucide-react';
import { useDataSource } from '@/contexts/DataSourceContext';
import { mockDataService } from '@/services/mockDataService';
import MetricCard from '@/components/dashboard/MetricCard';
import { UserTable } from '@/components/users/UserTable';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dataSource } = useDataSource();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, merchantsResponse] = await Promise.all([
          mockDataService.getUsers(),
          mockDataService.getMerchants()
        ]);
        setUsers(usersResponse.data);
        setMerchants(Array.isArray(merchantsResponse) ? merchantsResponse : merchantsResponse?.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  // Calculate dashboard metrics
  const activeUsers = users.filter(user => user.active).length;
  const totalSubmissions = users.reduce((sum, user) => sum + user.submissions, 0);
  const monthlySubmissions = users.reduce((sum, user) => sum + user.monthly_submissions, 0);
  const avgSubmissionsPerRep = users.length > 0 ? Math.round(totalSubmissions / users.length) : 0;
  const totalVolume = users.reduce((sum, user) => sum + user.volume, 0);
  const totalCommissions = users.reduce((sum, user) => sum + user.total_commission, 0);
  
  // Calculate new merchants this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newMerchantsThisMonth = Array.isArray(merchants) ? merchants.filter(m => {
    const createdDate = new Date(m.created_date);
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length : 0;
  
  // Calculate processing potential (volume from new merchants not yet processing)
  const processingPotential = Array.isArray(merchants) ? merchants
    .filter(m => {
      const createdDate = new Date(m.created_date);
      const isThisMonth = createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      const notProcessingYet = m.status !== 'active'; // Not yet processing
      return isThisMonth && notProcessingYet;
    })
    .reduce((sum, m) => sum + (m.monthly_volume || 0), 0) : 0;
  
  // Top performers
  const topRepsBySubmissions = [...users]
    .filter(user => user.active)
    .sort((a, b) => b.monthly_submissions - a.monthly_submissions)
    .slice(0, 3);

  const topRepsByVolume = [...users]
    .filter(user => user.active)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 3);

  const handleAddUser = () => {
    // TODO: Implement add user modal
    console.log('Add user clicked');
  };

  if (loading) {
    return (
      <div className="pt-6 space-y-6 min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black50">Users</h1>
            <p className="text-gray100 mt-1">Manage your sales team and track performance</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray100">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-6 space-y-6 min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black50">Users</h1>
            <p className="text-gray100 mt-1">Manage your sales team and track performance</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading users: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black50">Users</h1>
          <p className="text-gray100 mt-1">Manage your sales team and track performance</p>
        </div>

      </div>

      {/* Sales Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={activeUsers}
          icon={UserCheck}
          trend={`${Math.round((activeUsers / users.length) * 100)}%`}
          trendDirection="up"
          subtitle="Currently active"
        />
        <MetricCard
          title="Monthly Submissions"
          value={monthlySubmissions}
          icon={Calendar}
          trend={`${avgSubmissionsPerRep} avg per rep`}
          trendDirection="up"
          subtitle="This month"
        />
        <MetricCard
          title="New Merchants This Month"
          value={newMerchantsThisMonth}
          icon={UserPlus}
          trend={newMerchantsThisMonth > 0 ? `${Math.round(newMerchantsThisMonth / users.length * 100)}% of team` : 'No new merchants'}
          trendDirection="up"
          subtitle="Added this month"
        />
        <MetricCard
          title="Processing Potential"
          value={`$${(processingPotential / 1000).toFixed(0)}K`}
          icon={Target}
          trend={processingPotential > 0 ? `${Math.round(processingPotential / newMerchantsThisMonth / 1000)}K avg` : 'No pending volume'}
          trendDirection="up"
          subtitle="Pending volume"
        />
      </div>

      {/* Top Performers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Reps by Monthly Submissions */}
        <div className="bg-white rounded-xl shadow-md shadow-[rgba(13,10,44,0.08)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-azure100 to-periwinkle50">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black50">Top Performers - Monthly</h3>
              <p className="text-sm text-gray100">Based on submissions this month</p>
            </div>
          </div>
          <div className="space-y-3">
            {topRepsBySubmissions.map((user, index) => (
              <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray40/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-azure100 to-periwinkle50 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-black50">{user.name}</p>
                    <p className="text-sm text-gray100">{user.role}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-black50">{user.monthly_submissions}</p>
                    <p className="text-sm text-gray100">submissions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">{user.active_this_month || 0}</p>
                    <p className="text-sm text-emerald-500">active</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Reps by Volume */}
        <div className="bg-white rounded-xl shadow-md shadow-[rgba(13,10,44,0.08)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black50">Top Performers - Volume</h3>
              <p className="text-sm text-gray100">Based on total processing volume</p>
            </div>
          </div>
          <div className="space-y-3">
            {topRepsByVolume.map((user, index) => (
              <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray40/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-black50">{user.name}</p>
                    <p className="text-sm text-gray100">{user.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black50">${(user.volume / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray100">volume</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md shadow-[rgba(13,10,44,0.08)]">
        <div className="p-6 border-b border-gray80/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-azure100 to-periwinkle50">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black50">Sales Team</h3>
                <p className="text-sm text-gray100">Manage users and track performance metrics</p>
              </div>
            </div>
            <button
              onClick={handleAddUser}
              className="transition p-1.5 px-2 font-medium focus:outline-none flex items-center space-x-0.5 whitespace-nowrap hover:bg-gray100 stroke-black50 rounded-md clickable shadow-sm text-[13px] bg-gradient-to-r from-azure100 to-periwinkle50 text-white hover:from-azure100/90 hover:to-periwinkle50/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
        <UserTable users={users} />
      </div>
    </div>
  );
}
