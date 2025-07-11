import React, { useState, useEffect } from "react";
import { dataService } from "@/services/dataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, XCircle, CheckCircle, Clock, Eye } from "lucide-react";
import { format } from "date-fns";

export default function RiskManagement() {
  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    setIsLoading(true);
    try {
      // Get merchants data from unified service
      const response = await dataService.getMerchants();
      const data = Array.isArray(response) ? response : response.data || [];
      
      // Sort by created date (descending - newest first)
      const sortedData = data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      
      setMerchants(sortedData);
    } catch (error) {
      console.error("Error loading merchants:", error);
    }
    setIsLoading(false);
  };

  const riskLevels = [
    { key: 'critical', label: 'Critical Risk', color: 'bg-red-200 text-red-900', icon: XCircle },
    { key: 'high', label: 'High Risk', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    { key: 'medium', label: 'Medium Risk', color: 'bg-amber-100 text-amber-800', icon: Clock },
    { key: 'low', label: 'Low Risk', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  ];

  const getMerchantsByRisk = (risk) => {
    return merchants.filter(merchant => merchant.risk_level === risk);
  };

  const criticalMerchants = getMerchantsByRisk('critical');
  const highRiskMerchants = getMerchantsByRisk('high');
  const stoppedProcessing = merchants.filter(m => {
    if (!m.last_processing_date) return false;
    const lastProcessing = new Date(m.last_processing_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastProcessing < thirtyDaysAgo;
  });

  const irregularProcessing = merchants.filter(m => 
    m.status === 'active' && m.monthly_volume && m.monthly_volume < (m.average_ticket * 10)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Risk Management</h1>
          <p className="text-slate-500">Monitor merchant risk levels and processing issues</p>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalMerchants.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalMerchants.length} merchants</strong> require immediate attention due to critical risk factors.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskLevels.map((risk) => {
          const riskMerchants = getMerchantsByRisk(risk.key);
          const riskVolume = riskMerchants.reduce((sum, m) => sum + (m.monthly_volume || 0), 0);
          
          return (
            <Card key={risk.key} className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <risk.icon className="w-5 h-5" />
                    {risk.label}
                  </CardTitle>
                  <Badge className={risk.color}>{riskMerchants.length}</Badge>
                </div>
                <p className="text-sm text-slate-500">
                  ${riskVolume.toLocaleString()} monthly volume
                </p>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              High Priority Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalMerchants.concat(highRiskMerchants).slice(0, 8).map((merchant) => (
                <div key={merchant.id} className="flex items-center justify-between p-4 rounded-lg bg-red-50/50 border border-red-100">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{merchant.business_name}</p>
                    <p className="text-sm text-slate-600">{merchant.business_type?.replace('_', ' ')}</p>
                    {merchant.risk_notes && (
                      <p className="text-sm text-red-600 mt-1">{merchant.risk_notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={merchant.risk_level === 'critical' ? 'bg-red-200 text-red-900' : 'bg-red-100 text-red-800'}>
                      {merchant.risk_level}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Processing Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-100">
                <h4 className="font-medium text-slate-900 mb-2">Stopped Processing ({stoppedProcessing.length})</h4>
                <p className="text-sm text-slate-600">Merchants with no activity in 30+ days</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
                <h4 className="font-medium text-slate-900 mb-2">Irregular Processing ({irregularProcessing.length})</h4>
                <p className="text-sm text-slate-600">Active merchants with unusually low volume</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100">
                <h4 className="font-medium text-slate-900 mb-2">Pending Reviews (3)</h4>
                <p className="text-sm text-slate-600">Merchants awaiting risk assessment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Recent Risk Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {merchants.filter(m => m.risk_notes).slice(0, 10).map((merchant) => (
              <div key={merchant.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50/50">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{merchant.business_name}</p>
                    <span className="text-sm text-slate-500">
                      {format(new Date(merchant.created_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{merchant.risk_notes}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={
                      merchant.risk_level === 'critical' ? 'bg-red-200 text-red-900' :
                      merchant.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                      merchant.risk_level === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }>
                      {merchant.risk_level} risk
                    </Badge>
                    <span className="text-sm text-slate-500">
                      ${merchant.monthly_volume?.toLocaleString()} monthly
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}