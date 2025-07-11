import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Mail, AlertTriangle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function ApprovedNotProcessing({ merchants }) {
  const approvedNotProcessing = merchants.filter(m => m.status === 'approved_not_processing');
  
  const criticalMerchants = approvedNotProcessing.filter(m => {
    if (!m.approved_date) return false;
    const daysSinceApproval = differenceInDays(new Date(), new Date(m.approved_date));
    return daysSinceApproval > 14;
  });

  const totalLostRevenue = approvedNotProcessing.reduce((sum, m) => 
    sum + (m.projected_monthly_commission || 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Approved Not Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <span className="text-2xl font-bold text-slate-900">{approvedNotProcessing.length}</span>
              <p className="text-sm text-slate-500">Merchants approved but not active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Critical Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{criticalMerchants.length}</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm text-slate-500">14+ days since approval</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Lost Revenue Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <span className="text-2xl font-bold text-slate-900">${totalLostRevenue.toLocaleString()}</span>
              <p className="text-sm text-slate-500">Monthly commission at risk</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Action Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvedNotProcessing.map((merchant) => {
              const daysSinceApproval = merchant.approved_date ? 
                differenceInDays(new Date(), new Date(merchant.approved_date)) : 0;
              const isCritical = daysSinceApproval > 14;
              
              return (
                <div key={merchant.id} className={`p-4 rounded-lg border ${
                  isCritical ? 'bg-red-50/50 border-red-100' : 'bg-amber-50/50 border-amber-100'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-slate-900">{merchant.business_name}</p>
                      <p className="text-sm text-slate-500">{merchant.business_type?.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={isCritical ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}>
                        {daysSinceApproval} days
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="text-sm">
                      <p className="text-slate-600">Projected Monthly Volume</p>
                      <p className="font-medium">${merchant.projected_monthly_volume?.toLocaleString()}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-slate-600">Projected Commission</p>
                      <p className="font-medium text-emerald-600">${merchant.projected_monthly_commission?.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      {merchant.approved_date ? format(new Date(merchant.approved_date), 'MMM d') : 'N/A'}
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}