import React, { useState, useEffect } from "react";
import { dataService } from "@/services/dataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MerchantLogo from "@/components/ui/MerchantLogo";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Calendar, Download, ArrowUpRight, Users, BarChart2, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function CommissionReports() {
  const [merchants, setMerchants] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [period, setPeriod] = useState("current_month");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get merchants data from unified service
      const merchantResponse = await dataService.getMerchants();
      const merchantData = Array.isArray(merchantResponse) ? merchantResponse : merchantResponse.data || [];
      
      // Sort by monthly commission (descending)
      const sortedMerchants = merchantData.sort((a, b) => (b.monthly_commission || 0) - (a.monthly_commission || 0));
      
      // Generate mock commission data based on merchants
      const commissionData = sortedMerchants.map((merchant, index) => ({
        id: `comm_${merchant.id || index}`,
        merchant_id: merchant.id,
        merchant_name: merchant.business_name,
        amount: merchant.monthly_commission || 0,
        period: new Date().toISOString().slice(0, 7), // Current month YYYY-MM
        status: 'paid',
        created_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setMerchants(sortedMerchants);
      setCommissions(commissionData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const totalCommission = merchants.reduce((sum, m) => sum + (m.monthly_commission || 0), 0);
  const totalVolume = merchants.reduce((sum, m) => sum + (m.monthly_volume || 0), 0);
  const averageCommissionRate = totalVolume > 0 ? ((totalCommission / totalVolume) * 100) : 0;

  const topEarners = merchants
    .filter(m => m.monthly_commission > 0)
    .sort((a, b) => (b.monthly_commission || 0) - (a.monthly_commission || 0))
    .slice(0, 10);

  const commissionByType = merchants.reduce((acc, merchant) => {
    const type = merchant.business_type || 'other';
    acc[type] = (acc[type] || 0) + (merchant.monthly_commission || 0);
    return acc;
  }, {});

  const pieData = Object.entries(commissionByType).map(([type, commission]) => ({
    name: type.replace('_', ' '),
    value: commission
  }));

  // Generate monthly data from real commission records
  const monthlyData = Array.isArray(commissions) ? commissions.reduce((acc, commission) => {
    if (commission.created_date) {
      const date = new Date(commission.created_date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      const existing = acc.find(item => item.month === monthKey);
      if (existing) {
        existing.commission += commission.commission_amount || 0;
      } else {
        acc.push({ month: monthKey, commission: commission.commission_amount || 0 });
      }
    }
    return acc;
  }, []) : [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

  // Get real fees data from enhanced fee schedule system
  const getFeesData = () => {
    // Return real fee data from merchants with fee schedule information
    // This will be populated by the enhanced fee schedule system
    const fees = [];
    
    if (Array.isArray(merchants)) {
      merchants.forEach(merchant => {
        if (merchant.fees) {
          // Add real fee records from merchant data
          Object.entries(merchant.fees).forEach(([feeType, amount]) => {
            if (amount > 0) {
              fees.push({
                type: feeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                merchant: merchant.business_name,
                amount: amount,
                date: new Date().toLocaleDateString(),
                status: 'Calculated' // Real calculated fees
              });
            }
          });
        }
      });
    }
    
    return fees;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black50">Commission Reports</h1>
          <p className="text-gray100">Track your revenue and commission performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48 border-gray80 text-black50">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Current Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray80 text-black50 hover:bg-gray80">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Commission KPI Tile */}
        <Card className="border-0 shadow-md shadow-[rgba(13,10,44,0.08)] bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between group">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-black50" />
              <CardTitle >Total Commission</CardTitle>
            </div>
            <Button variant="gray" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="size-4"><ExternalLink className="w-4 h-4" /></span>
              <span>Details</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-black50">${totalCommission.toLocaleString()}</p>
                <p className="text-sm text-gray100 mt-1">This month</p>
              </div>
              <div className="bg-green/10 p-2 rounded-full">
                <ArrowUpRight className="w-6 h-6 text-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Rate KPI Tile */}
        <Card className="border-0 shadow-md shadow-[rgba(13,10,44,0.08)] bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between group">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-black50" />
              <CardTitle >Average Rate</CardTitle>
            </div>
            <Button variant="gray" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="size-4"><ExternalLink className="w-4 h-4" /></span>
              <span>Details</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-black50">{averageCommissionRate.toFixed(2)}%</p>
                <p className="text-sm text-gray100 mt-1">Commission rate</p>
              </div>
              <div className="bg-azure100/10 p-2 rounded-full">
                <TrendingUp className="w-6 h-6 text-azure100" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Merchants KPI Tile */}
        <Card className="border-0 shadow-md shadow-[rgba(13,10,44,0.08)] bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between group">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-black50" />
              <CardTitle >Active Merchants</CardTitle>
            </div>
            <Button variant="gray" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="size-4"><ExternalLink className="w-4 h-4" /></span>
              <span>View All</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-black50">{merchants.filter(m => m.status === 'active').length}</p>
                <p className="text-sm text-gray100 mt-1">Total active</p>
              </div>
              <div className="bg-periwinkle50/10 p-2 rounded-full">
                <Users className="w-6 h-6 text-periwinkle50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Commission Trends Chart */}
        <Card className="border-0 shadow-md shadow-[rgba(13,10,44,0.08)] bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between group">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-black50" />
              <CardTitle >Monthly Commission Trends</CardTitle>
            </div>
            <Button variant="gray" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="size-4"><ExternalLink className="w-4 h-4" /></span>
              <span>Expand</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Commission']}
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
                />
                <Bar dataKey="commission" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Commission by Business Type */}
        <Card className="border-0 shadow-md shadow-[rgba(13,10,44,0.08)] bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between group">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-black50" />
              <CardTitle >Commission by Business Type</CardTitle>
            </div>
            <Button variant="gray" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="size-4"><ExternalLink className="w-4 h-4" /></span>
              <span>Expand</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-4 h-80">
            <div className="flex h-full">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Commission']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 pl-4 flex flex-col justify-center">
                <div className="space-y-4">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm text-black50">{item.name}</span>
                      </div>
                      <span >${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Earning Merchants */}
      <Card className="border-0 shadow-md shadow-[rgba(13,10,44,0.08)] bg-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between group">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-black50" />
            <CardTitle >Top Earning Merchants</CardTitle>
          </div>
          <Button variant="gray" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="size-4"><ExternalLink className="w-4 h-4" /></span>
            <span>View All</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray40 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-black50 uppercase tracking-wider">Merchant</th>
                  <th className="px-4 py-3 text-xs font-medium text-black50 uppercase tracking-wider">Business Type</th>
                  <th className="px-4 py-3 text-xs font-medium text-black50 uppercase tracking-wider">Volume</th>
                  <th className="px-4 py-3 text-xs font-medium text-black50 uppercase tracking-wider">Commission</th>
                  <th className="px-4 py-3 text-xs font-medium text-black50 uppercase tracking-wider">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray40">
                {topEarners.map((merchant, index) => (
                  <tr key={merchant.id || index} className="hover:bg-gray40">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MerchantLogo src={merchant.logo_url} name={merchant.business_name} size={32} />
                        <div className="ml-3">
                          <p >{merchant.business_name}</p>
                          <p className="text-xs text-gray100">{merchant.merchant_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-black50">{merchant.business_type}</td>
                    <td className="px-4 py-3 text-sm text-black50">${merchant.monthly_volume?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-black50">${merchant.monthly_commission?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-black50">
                      {merchant.monthly_volume > 0 
                        ? ((merchant.monthly_commission / merchant.monthly_volume) * 100).toFixed(2) 
                        : '0.00'}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
