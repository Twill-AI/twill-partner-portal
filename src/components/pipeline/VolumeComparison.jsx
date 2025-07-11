import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function VolumeComparison({ merchants }) {
  const activeMerchants = merchants.filter(m => m.status === 'active');
  
  const totalActualVolume = activeMerchants.reduce((sum, m) => sum + (m.monthly_volume || 0), 0);
  const totalProjectedVolume = activeMerchants.reduce((sum, m) => sum + (m.projected_monthly_volume || 0), 0);
  
  const volumeRealization = totalProjectedVolume > 0 ? (totalActualVolume / totalProjectedVolume) * 100 : 0;
  const volumeGap = totalProjectedVolume - totalActualVolume;
  
  const underperformingMerchants = activeMerchants.filter(m => {
    const actualVolume = m.monthly_volume || 0;
    const projectedVolume = m.projected_monthly_volume || 0;
    return projectedVolume > 0 && (actualVolume / projectedVolume) < 0.7;
  });

  const overperformingMerchants = activeMerchants.filter(m => {
    const actualVolume = m.monthly_volume || 0;
    const projectedVolume = m.projected_monthly_volume || 0;
    return projectedVolume > 0 && (actualVolume / projectedVolume) > 1.2;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Volume Realization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">{volumeRealization.toFixed(1)}%</span>
                {volumeRealization >= 80 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <Progress value={volumeRealization} className="h-2" />
              <p className="text-sm text-slate-500">Actual vs Projected</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Volume Gap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <span className="text-2xl font-bold text-slate-900">
                ${Math.abs(volumeGap).toLocaleString()}
              </span>
              <p className="text-sm text-slate-500">
                {volumeGap > 0 ? 'Under projected' : 'Over projected'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Performance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900">{underperformingMerchants.length}</span>
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-sm text-slate-500">Underperforming merchants</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Underperforming Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {underperformingMerchants.slice(0, 5).map((merchant) => {
                const actualVolume = merchant.monthly_volume || 0;
                const projectedVolume = merchant.projected_monthly_volume || 0;
                const performance = projectedVolume > 0 ? (actualVolume / projectedVolume) * 100 : 0;
                
                return (
                  <div key={merchant.id} className="p-4 rounded-lg bg-amber-50/50 border border-amber-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900">{merchant.business_name}</p>
                      <span className="text-sm text-amber-600 font-medium">{performance.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Actual: ${actualVolume.toLocaleString()}</span>
                      <span>Projected: ${projectedVolume.toLocaleString()}</span>
                    </div>
                    <Progress value={performance} className="h-1 mt-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Overperforming Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overperformingMerchants.slice(0, 5).map((merchant) => {
                const actualVolume = merchant.monthly_volume || 0;
                const projectedVolume = merchant.projected_monthly_volume || 0;
                const performance = projectedVolume > 0 ? (actualVolume / projectedVolume) * 100 : 0;
                
                return (
                  <div key={merchant.id} className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900">{merchant.business_name}</p>
                      <span className="text-sm text-emerald-600 font-medium">{performance.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Actual: ${actualVolume.toLocaleString()}</span>
                      <span>Projected: ${projectedVolume.toLocaleString()}</span>
                    </div>
                    <Progress value={Math.min(performance, 100)} className="h-1 mt-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}