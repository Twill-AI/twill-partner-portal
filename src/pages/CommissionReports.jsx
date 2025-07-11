import React, { useState, useEffect } from "react";
import { dataService } from "@/services/dataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react";
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

  const monthlyData = [
    { month: 'Jan', commission: 45000 },
    { month: 'Feb', commission: 52000 },
    { month: 'Mar', commission: 48000 },
    { month: 'Apr', commission: 61000 },
    { month: 'May', commission: 67000 },
    { month: 'Jun', commission: 73000 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

  // Generate fees data based on merchants
  const generateFeesData = () => {
    const feeTypes = ['Processing Fee', 'Setup Fee', 'Monthly Fee', 'Transaction Fee'];
    const statuses = ['Paid', 'Pending', 'Overdue'];
    const fees = [];
    
    merchants.forEach((merchant, index) => {
      // Add 2-3 fees per merchant
      const numFees = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < numFees; i++) {
        const feeType = feeTypes[Math.floor(Math.random() * feeTypes.length)];
        const baseAmount = feeType === 'Setup Fee' ? 500 : 
                          feeType === 'Monthly Fee' ? 99 :
                          feeType === 'Processing Fee' ? Math.floor((merchant.monthly_volume || 0) * 0.025) :
                          Math.floor(Math.random() * 50) + 10;
        
        fees.push({
          type: feeType,
          merchant: merchant.business_name,
          amount: baseAmount,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: statuses[Math.floor(Math.random() * statuses.length)]
        });
      }
    });
    
    // Sort by date (newest first)
    return fees.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Commission Reports</h1>
          <p className="text-slate-500">Track your revenue and commission performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Current Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">${totalCommission.toLocaleString()}</p>
            <p className="text-sm text-slate-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Average Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{averageCommissionRate.toFixed(2)}%</p>
            <p className="text-sm text-slate-500 mt-1">Commission rate</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Active Merchants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{merchants.filter(m => m.status === 'active').length}</p>
            <p className="text-sm text-slate-500 mt-1">Generating revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Monthly Commission Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Commission']}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="commission" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Commission by Business Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Top Earning Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEarners.map((merchant, index) => (
              <div key={merchant.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{merchant.business_name}</p>
                    <p className="text-sm text-slate-500">{merchant.business_type?.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${merchant.monthly_commission?.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">${merchant.monthly_volume?.toLocaleString()} volume</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fees Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Fee Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Merchant</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {generateFeesData().map((fee, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        fee.type === 'Processing Fee' ? 'bg-blue-100 text-blue-800' :
                        fee.type === 'Setup Fee' ? 'bg-green-100 text-green-800' :
                        fee.type === 'Monthly Fee' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {fee.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900">{fee.merchant}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">${fee.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600">{fee.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        fee.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        fee.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {fee.status}
                      </span>
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