import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Banknote, Percent } from "lucide-react";

export default function ProcessingStep({ data, onChange }) {
  const handleCreditCardChange = (field, value) => {
    onChange({
      ...data,
      credit_card_processing: {
        ...data.credit_card_processing,
        [field]: value
      }
    });
  };

  const handleAchChange = (field, value) => {
    onChange({
      ...data,
      ach_processing: {
        ...data.ach_processing,
        [field]: value
      }
    });
  };

  const handleTransactionTypeChange = (type, checked) => {
    const currentTypes = data.business_details?.accepted_transaction_types || [];
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    onChange({
      ...data,
      business_details: {
        ...data.business_details,
        accepted_transaction_types: updatedTypes
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Transaction Types */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Transaction Types
          </CardTitle>
          <p className="text-slate-600">Select which payment methods you want to accept</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cc_dc"
                checked={data.business_details?.accepted_transaction_types?.includes('CC_DC') || false}
                onCheckedChange={(checked) => handleTransactionTypeChange('CC_DC', checked)}
              />
              <Label htmlFor="cc_dc" className="text-sm font-medium">
                Credit & Debit Cards
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ach"
                checked={data.business_details?.accepted_transaction_types?.includes('ACH') || false}
                onCheckedChange={(checked) => handleTransactionTypeChange('ACH', checked)}
              />
              <Label htmlFor="ach" className="text-sm font-medium">
                ACH/Bank Transfers
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Card Processing */}
      {data.business_details?.accepted_transaction_types?.includes('CC_DC') && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
              <CreditCard className="w-6 h-6 text-emerald-600" />
              Credit Card Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-4">Transaction Mix (must total 100%)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card_swiped">Card Swiped %</Label>
                  <div className="relative">
                    <Input
                      id="card_swiped"
                      type="number"
                      value={data.credit_card_processing?.card_swiped || ''}
                      onChange={(e) => handleCreditCardChange('card_swiped', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="h-12"
                      max="100"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manually_keyed_cp">Manual Key (Card Present) %</Label>
                  <div className="relative">
                    <Input
                      id="manually_keyed_cp"
                      type="number"
                      value={data.credit_card_processing?.manually_keyed_cp || ''}
                      onChange={(e) => handleCreditCardChange('manually_keyed_cp', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="h-12"
                      max="100"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manually_keyed_cnp">Manual Key (Card Not Present) %</Label>
                  <div className="relative">
                    <Input
                      id="manually_keyed_cnp"
                      type="number"
                      value={data.credit_card_processing?.manually_keyed_cnp || ''}
                      onChange={(e) => handleCreditCardChange('manually_keyed_cnp', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="h-12"
                      max="100"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ecommerce">E-commerce %</Label>
                  <div className="relative">
                    <Input
                      id="ecommerce"
                      type="number"
                      value={data.credit_card_processing?.ecommerce || ''}
                      onChange={(e) => handleCreditCardChange('ecommerce', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="h-12"
                      max="100"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="avg_transaction">Average Transaction Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    id="avg_transaction"
                    type="number"
                    value={data.credit_card_processing?.avg_transaction_amount || ''}
                    onChange={(e) => handleCreditCardChange('avg_transaction_amount', parseFloat(e.target.value) || 0)}
                    placeholder="25.00"
                    className="pl-8 h-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly_sales">Total Monthly Sales</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    id="monthly_sales"
                    type="number"
                    value={data.credit_card_processing?.total_monthly_sales || ''}
                    onChange={(e) => handleCreditCardChange('total_monthly_sales', parseFloat(e.target.value) || 0)}
                    placeholder="10000.00"
                    className="pl-8 h-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="highest_transaction">Highest Transaction Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    id="highest_transaction"
                    type="number"
                    value={data.credit_card_processing?.highest_transaction_amount || ''}
                    onChange={(e) => handleCreditCardChange('highest_transaction_amount', parseFloat(e.target.value) || 0)}
                    placeholder="250.00"
                    className="pl-8 h-12"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accept_cc_before"
                checked={data.credit_card_processing?.accept_cc_before || false}
                onCheckedChange={(checked) => handleCreditCardChange('accept_cc_before', checked)}
              />
              <Label htmlFor="accept_cc_before" className="text-sm font-medium">
                Have you accepted credit cards before?
              </Label>
            </div>

            {data.credit_card_processing?.accept_cc_before && (
              <div className="space-y-2">
                <Label htmlFor="previous_processor">Previous Processor Name</Label>
                <Input
                  id="previous_processor"
                  value={data.credit_card_processing?.previous_processor_name || ''}
                  onChange={(e) => handleCreditCardChange('previous_processor_name', e.target.value)}
                  placeholder="Previous processor name"
                  className="h-12"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ACH Processing */}
      {data.business_details?.accepted_transaction_types?.includes('ACH') && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
              <Banknote className="w-6 h-6 text-purple-600" />
              ACH Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="max_check_amount">Max Check Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    id="max_check_amount"
                    type="number"
                    value={data.ach_processing?.max_check_amount || ''}
                    onChange={(e) => handleAchChange('max_check_amount', e.target.value)}
                    placeholder="1000"
                    className="pl-8 h-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avg_check_amount">Average Check Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    id="avg_check_amount"
                    type="number"
                    value={data.ach_processing?.avg_check_amount || ''}
                    onChange={(e) => handleAchChange('avg_check_amount', e.target.value)}
                    placeholder="30"
                    className="pl-8 h-12"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="monthly_checks">Average Number of Checks Monthly</Label>
                <Input
                  id="monthly_checks"
                  type="number"
                  value={data.ach_processing?.avg_number_checks_monthly || ''}
                  onChange={(e) => handleAchChange('avg_number_checks_monthly', e.target.value)}
                  placeholder="3000"
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly_volume">Estimated Monthly Check Volume</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    id="monthly_volume"
                    type="number"
                    value={data.ach_processing?.est_monthly_check_volume || ''}
                    onChange={(e) => handleAchChange('est_monthly_check_volume', e.target.value)}
                    placeholder="30000"
                    className="pl-8 h-12"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-4">ACH Transaction Mix (must total 100%)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="web">Web %</Label>
                  <div className="relative">
                    <Input
                      id="web"
                      type="number"
                      value={data.ach_processing?.web || ''}
                      onChange={(e) => handleAchChange('web', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="h-12"
                      max="100"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tel">Telephone %</Label>
                  <div className="relative">
                    <Input
                      id="tel"
                      type="number"
                      value={data.ach_processing?.tel || ''}
                      onChange={(e) => handleAchChange('tel', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="h-12"
                      max="100"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ppd">PPD %</Label>
                  <div className="relative">
                    <Input
                      id="ppd"
                      type="number"
                      value={data.ach_processing?.ppd || ''}
                      onChange={(e) => handleAchChange('ppd', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="h-12"
                      max="100"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ccd">CCD %</Label>
                  <div className="relative">
                    <Input
                      id="ccd"
                      type="number"
                      value={data.ach_processing?.ccd || ''}
                      onChange={(e) => handleAchChange('ccd', parseInt(e.target.value) || 0)}
                      placeholder="25"
                      className="h-12"
                      max="100"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}