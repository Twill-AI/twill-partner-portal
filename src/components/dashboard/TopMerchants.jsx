import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp } from "lucide-react";

export default function TopMerchants({ merchants }) {
  const riskColors = {
    low: "bg-emerald-100 text-emerald-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-200 text-red-900"
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">Top Performing Merchants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {merchants.map((merchant, index) => (
            <div key={merchant.merchant_id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  ['bg-blue-100', 'bg-emerald-100', 'bg-amber-100', 'bg-purple-100', 'bg-pink-100'][index]
                }`}>
                  <Building2 className={`w-5 h-5 ${
                    ['text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-purple-600', 'text-pink-600'][index]
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{merchant.business_name}</p>
                  <p className="text-sm text-slate-500">{merchant.business_type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  ${merchant.monthly_volume?.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={riskColors[merchant.risk_level]}>
                    {merchant.risk_level}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    ${merchant.monthly_commission?.toLocaleString()} comm.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}