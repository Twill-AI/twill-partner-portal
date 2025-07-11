import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MerchantLogo from "@/components/ui/MerchantLogo";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, ExternalLink, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopMerchants({ merchants }) {
  const riskColors = {
    low: "bg-green/20 text-green",
    medium: "bg-yellow75/20 text-yellow75",
    high: "bg-error/20 text-error",
    critical: "bg-error/30 text-error"
  };

  return (
    <Card className="border-0 shadow-md shadow-[rgba(13,10,44,0.08)] bg-white" data-testid="top-merchants">
      <CardHeader className="flex flex-row items-center justify-between group">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-black50" />
          <CardTitle>Top Performing Merchants</CardTitle>
        </div>
        <Link to={createPageUrl("Merchants")}> 
          <Button variant="gray" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="size-4"><ExternalLink className="w-4 h-4" /></span>
          <span>View All</span>
        </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {merchants.map((merchant, index) => (
            <div key={merchant.merchant_id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray40 transition-colors border-b border-gray40 last:border-b-0">
              <div className="flex items-center gap-3">
                <MerchantLogo src={merchant.logo_url} name={merchant.business_name} size={40} />
                
              </div>
              <div>
                <p className="font-medium text-black50">{merchant.business_name}</p>
                <p className="text-sm text-gray100">{merchant.business_type}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-black50">
                  ${merchant.monthly_volume?.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${riskColors[merchant.risk_level]} px-2 py-0.5 text-xs font-medium rounded-md`}>
                    {merchant.risk_level}
                  </Badge>
                  <div className="flex items-center">
                    <TrendingUp className="mr-1 w-3 h-3 text-green" />
                    <span className="text-xs text-green">${merchant.monthly_commission?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}