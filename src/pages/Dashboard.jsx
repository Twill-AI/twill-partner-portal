import React, { useState, useEffect } from "react";
import { dataService } from "@/services/dataService";
import { Building2, DollarSign, TrendingUp, Users, AlertTriangle, Zap } from "lucide-react";
import { useDataSource } from "../contexts/DataSourceContext";

import MetricCard from "../components/dashboard/MetricCard";
import ProcessingVolumeChart from "../components/dashboard/ProcessingVolumeChart";
import TopMerchants from "../components/dashboard/TopMerchants";

export default function Dashboard() {
  const [merchants, setMerchants] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dataSource, getDataSourceLabel } = useDataSource();

  useEffect(() => {
    loadData();
  }, [dataSource]); // React to dataSource changes

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [merchantData, commissionData] = await Promise.all([
        dataService.getMerchants({ sort: '-monthly_volume' }),
        dataService.getCommissions({ sort: '-created_date' })
      ]);
      // Handle response structure - could be direct array or wrapped in response object
      const merchants = Array.isArray(merchantData) ? merchantData : merchantData?.data || [];
      const commissions = Array.isArray(commissionData) ? commissionData : commissionData?.data || [];
      
      console.log('Dashboard loaded merchants:', merchants.length, merchants);
      console.log('Dashboard loaded commissions:', commissions.length, commissions);
      
      setMerchants(merchants);
      setCommissions(commissions);
    } catch (error) {
      console.error("Error loading data:", error);
      // Set empty arrays on error to prevent undefined issues
      setMerchants([]);
      setCommissions([]);
    }
    setIsLoading(false);
  };

  // Calculate metrics from real data
  const totalVolume = Array.isArray(merchants) ? merchants.reduce((sum, m) => sum + (m.monthly_volume || 0), 0) : 0;
  const totalCommission = Array.isArray(commissions) ? commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0) : 0;
  const activeMerchants = Array.isArray(merchants) ? merchants.filter(m => m.status === 'active').length : 0;
  const underwritingAlerts = Array.isArray(merchants) ? merchants.filter(m => m.status === 'in_review').length : 0;

  // Generate real volume chart data from commissions
  const generateVolumeChartData = () => {
    if (Array.isArray(commissions) && commissions.length > 0) {
      // Group commissions by month and sum volumes
      const monthlyData = {};
      commissions.forEach(commission => {
        const date = new Date(commission.created_date || commission.period + '-01');
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += commission.volume || 0;
      });
      
      // Convert to chart format and sort by month
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthOrder
        .filter(month => monthlyData[month])
        .map(month => ({
          month,
          volume: monthlyData[month]
        }));
    }
    
    // Return empty data when no real commissions are available
    return [];
  };

  const volumeChartData = generateVolumeChartData();

  const topMerchants = Array.isArray(merchants) ? merchants
    .filter(m => m.status === 'active')
    .sort((a, b) => (b.monthly_volume || 0) - (a.monthly_volume || 0))
    .slice(0, 5) : [];

  // Calculate trends for comparison metrics (placeholder logic)
  const calculateTrend = (current, type) => {
    // Placeholder: simulate a trend for demo
    if (type === 'volume') return { percent: 12, period: 'vs last month' };
    if (type === 'commission') return { percent: -5, period: 'vs last month' };
    if (type === 'merchants') return { percent: 3, period: 'vs last month' };
    if (type === 'underwriting') return { percent: -1, period: 'vs last month' };
    return null;
  };

  // Generate recent activity from real data
  const generateRecentActivity = () => {
    const activities = [];
    
    if (Array.isArray(merchants) && merchants.length > 0) {
      // Recent merchant approvals
      const recentActive = merchants.filter(m => m.status === 'active').slice(0, 2);
      recentActive.forEach(merchant => {
        activities.push({
          icon: 'emerald',
          text: `${merchant.business_name} merchant approved`
        });
      });
      
      // Risk alerts
      const highRiskMerchants = merchants.filter(m => m.risk_level === 'high' || m.risk_level === 'critical');
      if (highRiskMerchants.length > 0) {
        activities.push({
          icon: 'amber',
          text: `Risk alert: ${highRiskMerchants[0].business_name}`
        });
      }
      
      // New applications
      const newApplications = merchants.filter(m => m.status === 'application' || m.status === 'in_review');
      if (newApplications.length > 0) {
        activities.push({
          icon: 'purple',
          text: `New application: ${newApplications[0].business_name}`
        });
      }
    }
    
    if (Array.isArray(commissions) && commissions.length > 0) {
      // Recent commission payments
      const paidCommissions = commissions.filter(c => c.status === 'paid').slice(0, 1);
      paidCommissions.forEach(commission => {
        activities.push({
          icon: 'blue',
          text: `Commission payment: $${commission.commission_amount?.toLocaleString()}`
        });
      });
    }
    
    // No fallback activities - show empty state if no real data
    
    return activities.slice(0, 4); // Limit to 4 activities
  };

  const recentActivities = generateRecentActivity();

  return (
    <div className="pt-6 space-y-6 min-h-screen">
      {(!merchants || merchants.length === 0 || !commissions || commissions.length === 0) && (
        <div className="bg-yellow-100 text-yellow-900 p-4 rounded mb-4 text-center font-bold">
          No merchants or commissions data loaded. Check data source and API/service status.
        </div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black50">Partner Dashboard</h1>
          <p className="text-gray100 mt-1">Welcome back to your Twill partner portal</p>
        </div>
        <div className="text-sm text-gray100">
          Data Source: <span className="font-medium text-black50">{getDataSourceLabel()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Processing Volume"
          value={`$${totalVolume.toLocaleString()}`}
          icon={DollarSign}
          trend={calculateTrend(totalVolume, 'volume')}
          trendDirection={calculateTrend(totalVolume, 'volume')?.percent > 0 ? "up" : "down"}
          subtitle="Monthly"
          href="/commissionreports"
        />
        <MetricCard
          title="Total Commission"
          value={`$${totalCommission.toLocaleString()}`}
          icon={TrendingUp}
          trend={calculateTrend(totalCommission, 'commission')}
          trendDirection={calculateTrend(totalCommission, 'commission')?.percent > 0 ? "up" : "down"}
          subtitle="This month"
        />
        <MetricCard
          title="Active Merchants"
          value={activeMerchants}
          icon={Building2}
          trend={calculateTrend(activeMerchants, 'merchants')}
          trendDirection={calculateTrend(activeMerchants, 'merchants')?.percent > 0 ? "up" : "down"}
          subtitle="Currently processing"
          href="/merchants?tab=active"
        />
        <MetricCard
          title="Underwriting Alerts"
          value={underwritingAlerts}
          icon={AlertTriangle}
          trend={calculateTrend(underwritingAlerts, 'underwriting')}
          trendDirection={calculateTrend(underwritingAlerts, 'underwriting')?.percent > 0 ? "up" : "down"}
          subtitle="Needs attention"
          className={underwritingAlerts > 0 ? "border-l-4 border-amber-500" : ""}
          href="/merchants?tab=in_review"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ProcessingVolumeChart data={volumeChartData} />
        <TopMerchants merchants={topMerchants} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-md shadow-[rgba(13,10,44,0.08)] border-0">
          <h3 className="font-semibold text-black50 mb-4">Business Type Performance</h3>
          <div className="space-y-3">
            {[
              { key: 'Software', label: 'software' },
              { key: 'Retail', label: 'retail' },
              { key: 'Services', label: 'services' },
              { key: 'Restaurant', label: 'restaurant' }
            ].map(({ key, label }) => {
              const typeVolume = Array.isArray(merchants) ? merchants
                .filter(m => m.business_type === key)
                .reduce((sum, m) => sum + (m.monthly_volume || 0), 0) : 0;
              return (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray100 capitalize">{label}</span>
                  <span className="font-medium text-black50">${typeVolume.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-md shadow-[rgba(13,10,44,0.08)] border-0">
          <h3 className="font-semibold text-black50 mb-4">Pipeline Status</h3>
          <div className="space-y-3">
            {['lead', 'application', 'underwriting', 'approved', 'active'].map((status) => {
              const count = Array.isArray(merchants) ? merchants.filter(m => m.status === status).length : 0;
              return (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray100 capitalize">{status.replace('_', ' ')}</span>
                  <span className="font-medium text-black50">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-md shadow-[rgba(13,10,44,0.08)] border-0">
          <h3 className="font-semibold text-black50 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.icon === 'emerald' ? 'bg-green' :
                  activity.icon === 'blue' ? 'bg-azure100' :
                  activity.icon === 'amber' ? 'bg-yellow75' :
                  'bg-periwinkle50'
                }`}></div>
                <span className="text-sm text-gray100">{activity.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}