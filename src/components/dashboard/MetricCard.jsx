import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection,
  subtitle,
  className = "",
  href
}) {
  const CardWrapper = href ? Link : 'div';
  const cardProps = href ? { to: href } : {};
  
  return (
    <CardWrapper {...cardProps} className={href ? 'block' : ''}>
      <Card className={`relative overflow-hidden border-0 shadow-md shadow-[rgba(13,10,44,0.08)] bg-white ${href ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''} ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-azure100/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
      <CardHeader className="p-6 pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray100 mb-1">{title}</p>
            <p className="text-2xl font-bold text-black50">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray100 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-azure100 to-periwinkle50 shadow-lg">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardHeader>
      {trend && (
        <CardContent className="px-6 pb-6">
          <div className="flex items-center gap-1 text-sm">
            {trendDirection === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green" />
            ) : (
              <TrendingDown className="w-4 h-4 text-error" />
            )}
            <span className={`font-medium ${trendDirection === 'up' ? 'text-green' : 'text-error'}`}>
              {trend}
            </span>
            <span className="text-gray100">vs last month</span>
          </div>
        </CardContent>
      )}
      </Card>
    </CardWrapper>
  );
}