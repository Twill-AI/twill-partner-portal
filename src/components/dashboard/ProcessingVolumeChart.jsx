import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function ProcessingVolumeChart({ data }) {
  return (
    <Card className="border-0 shadow-md shadow-[rgba(13,10,44,0.08)]" data-testid="processing-volume-chart">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-black50">Processing Volume Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#387094" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7994DD" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F6F8" />
            <XAxis 
              dataKey="month" 
              stroke="#7B8294"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#7B8294"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Volume']}
              labelStyle={{ color: '#222E48' }}
              contentStyle={{
                background: 'white',
                border: '1px solid #F3F6F8',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(13, 10, 44, 0.08)'
              }}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#387094"
              strokeWidth={2}
              fill="url(#volumeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}