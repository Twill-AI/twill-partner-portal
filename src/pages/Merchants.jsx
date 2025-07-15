import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useDataSource } from '../contexts/DataSourceContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import MerchantTable from "../components/merchants/MerchantTable";
import MerchantOnboardingForm from "../components/onboarding/MerchantOnboardingForm";

export default function Merchants() {
  const [merchants, setMerchants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const { dataSource } = useDataSource();
  const [searchParams] = useSearchParams();
  
  // Get initial tab from URL parameters
  const initialTab = searchParams.get('tab') || 'all';

  useEffect(() => {
    loadMerchants();
  }, [dataSource]); // React to dataSource changes

  const loadMerchants = async () => {
    setIsLoading(true);
    try {
      const response = await dataService.getMerchants({ sort: 'monthly_volume' });
      // Handle both response.data and direct array response
      const merchantsData = response.data || response;
      const transformedData = merchantsData.map(merchant => ({
        ...merchant,
        updated_at: merchant.updated_at || merchant.created_date,
        created_at: merchant.created_date,
        name: merchant.business_name || merchant.name,
        status_message: merchant.status_message || (merchant.status === 'in_review' ? getStatusMessage(merchant) : null),
        fee_schedule_name: merchant.fee_schedule_name || 'Standard',
        total_payment_volume: merchant.monthly_volume,
        transactions_count: merchant.transaction_count || Math.floor(Math.random() * 1000),
        email: merchant.contact_email || `${merchant.business_name?.toLowerCase().replace(/\s+/g, '')}@example.com`
      }));
      setMerchants(transformedData);
    } catch (error) {
      console.error("Error loading merchants:", error);
    }
    setIsLoading(false);
  };

  const getStatusMessage = (merchant) => {
    const messages = [
      'Please provide 3 months bank statements.',
      'Wrong EIN.',
      'Need more information about the business.',
      'Monthly turnover is not specified.',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleMerchantSelect = (merchant) => {
    console.log("Selected merchant:", merchant);
  };

  const handleSaveApplication = (applicationData) => {
    console.log("Saving application:", applicationData);
    setShowOnboardingForm(false);
    // Refresh merchants after adding new one
    loadMerchants();
  };

  const handleRefreshMerchants = async () => {
    await loadMerchants();
  };

  return (
    <div className="pt-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black50">Merchant Portfolio</h1>
          <p className="text-gray100">Manage and monitor your merchant accounts</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-azure100 to-periwinkle50 text-white hover:from-azure100/90 hover:to-periwinkle50/90"
          onClick={() => setShowOnboardingForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Merchant
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-md shadow-[rgba(13,10,44,0.08)] border-0">
        <MerchantTable 
          merchants={merchants}
          isLoading={isLoading}
          onMerchantSelect={handleMerchantSelect}
          onRefresh={handleRefreshMerchants}
          initialTab={initialTab}
        />
      </div>

      <Dialog open={showOnboardingForm} onOpenChange={setShowOnboardingForm}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold text-black50">
              Add New Merchant
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
            <MerchantOnboardingForm
              onClose={() => setShowOnboardingForm(false)}
              onSave={handleSaveApplication}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}