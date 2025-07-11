import React, { useState, useEffect } from "react";
import { dataService } from "@/services/dataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ArrowRight, Plus, Eye, TrendingUp, Clock } from "lucide-react";

import VolumeComparison from "../components/pipeline/VolumeComparison";
import ApprovedNotProcessing from "../components/pipeline/ApprovedNotProcessing";

export default function Pipeline() {
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

  const pipelineStages = [
    { key: 'lead', label: 'Leads', color: 'bg-gray40 text-gray100' },
    { key: 'application', label: 'Application', color: 'bg-azure100/10 text-azure100' },
    { key: 'underwriting', label: 'Underwriting', color: 'bg-yellow75/10 text-yellow75' },
    { key: 'action_needed', label: 'Action Needed', color: 'bg-error/10 text-error' },
    { key: 'approved', label: 'Approved', color: 'bg-green/10 text-green' },
    { key: 'approved_not_processing', label: 'Approved Not Processing', color: 'bg-periwinkle50/10 text-periwinkle50' },
    { key: 'declined', label: 'Declined', color: 'bg-error/20 text-error' },
    { key: 'active', label: 'Active', color: 'bg-green/10 text-green' },
  ];

  const getMerchantsByStage = (stage) => {
    return merchants.filter(merchant => merchant.status === stage);
  };

  const totalValue = merchants.reduce((sum, m) => sum + (m.annual_volume || m.projected_annual_volume || 0), 0);
  const conversionRate = merchants.length > 0 ? 
    ((merchants.filter(m => m.status === 'active').length / merchants.length) * 100) : 0;

  // Calculate actual vs projected for active merchants
  const activeMerchants = getMerchantsByStage('active');
  const totalActualVolume = activeMerchants.reduce((sum, m) => sum + (m.monthly_volume || 0), 0);
  const totalProjectedVolume = activeMerchants.reduce((sum, m) => sum + (m.projected_monthly_volume || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black50">Sales Pipeline</h1>
          <p className="text-gray100">Track merchant progress and performance analytics</p>
        </div>
        <Button className="bg-azure100 hover:bg-black100">
          <Plus className="w-4 h-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-black50">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black50">${totalValue.toLocaleString()}</p>
            <p className="text-sm text-gray100 mt-1">Annual processing volume</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-black50">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black50">{conversionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray100 mt-1">Lead to active</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-black50">Volume Realization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black50">
              {totalProjectedVolume > 0 ? ((totalActualVolume / totalProjectedVolume) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-gray100 mt-1">Actual vs projected</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-black50">Active Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black50">{getMerchantsByStage('active').length}</p>
            <p className="text-sm text-gray100 mt-1">Currently processing</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Pipeline Overview</TabsTrigger>
          <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          <TabsTrigger value="followup">Follow-up Required</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pipelineStages.map((stage, index) => {
              const stageMerchants = getMerchantsByStage(stage.key);
              const stageValue = stageMerchants.reduce((sum, m) => 
                sum + (m.annual_volume || m.projected_annual_volume || 0), 0
              );
              
              return (
                <Card key={stage.key} className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-black50">{stage.label}</CardTitle>
                      <Badge className={stage.color}>{stageMerchants.length}</Badge>
                    </div>
                    <p className="text-sm text-gray100">
                      ${stageValue.toLocaleString()} potential
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {stageMerchants.slice(0, 5).map((merchant) => (
                        <div key={`merchant-${merchant.id || Math.random()}`} className="p-3 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-black50 truncate">{merchant.business_name}</p>
                              <p className="text-sm text-gray100">{merchant.business_type?.replace('_', ' ')}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray100 mt-1">
                            ${(merchant.annual_volume || merchant.projected_annual_volume || 0).toLocaleString()} annual
                          </p>
                        </div>
                      ))}
                      {stageMerchants.length > 5 && (
                        <div className="text-center pt-2">
                          <Button variant="ghost" size="sm" className="text-azure100">
                            View all {stageMerchants.length} merchants
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-black50">Pipeline Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between overflow-x-auto">
                {pipelineStages.slice(0, -1).map((stage, index) => (
                  <React.Fragment key={stage.key}>
                    <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getMerchantsByStage(stage.key).length}
                      </div>
                      <p className="text-sm font-medium text-black50 mt-2 text-center">{stage.label}</p>
                    </div>
                    {index < pipelineStages.length - 2 && (
                      <ArrowRight className="w-6 h-6 text-gray100 mx-2 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume">
          <VolumeComparison merchants={merchants} />
        </TabsContent>

        <TabsContent value="followup">
          <ApprovedNotProcessing merchants={merchants} />
        </TabsContent>
      </Tabs>
    </div>
  );
}