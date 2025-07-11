
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Monitor, CreditCard, Percent, ShoppingCart, Gift, Globe, Upload, Save, FileText, Calculator } from "lucide-react";
import { UploadFile, InvokeLLM } from "@/api/integrations";

export default function PricingStep({ data, onChange }) {
  const [selectedEquipment, setSelectedEquipment] = useState(data.equipment || []);
  const [selectedFeeSchedule, setSelectedFeeSchedule] = useState(data.fee_schedule_id || '');
  const [isFreeTerminalOfferActive, setIsFreeTerminalOfferActive] = useState(false);
  const [customPricing, setCustomPricing] = useState(data.custom_pricing || {});
  const [pricingModel, setPricingModel] = useState(data.pricing_model || 'template');
  const [savedTemplates, setSavedTemplates] = useState([
    { id: '1', name: 'Restaurant Standard', model: 'interchange_plus', interchange: 0.10, card_not_present: 0.25, monthly_fee: 15 },
    { id: '2', name: 'Retail Low Volume', model: 'flat_rate', rate: 2.9, transaction_fee: 0.30 },
    { id: '3', name: 'E-commerce Plus', model: 'tiered', qualified: 2.19, mid_qualified: 2.49, non_qualified: 2.89 },
    { id: '4', name: 'High Volume Surcharge', model: 'surcharge', base_rate: 2.10, surcharge_rate: 3.5, transaction_fee: 0.25 }
  ]);
  const [templateName, setTemplateName] = useState('');
  const [uploadedStatement, setUploadedStatement] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [yourOffer, setYourOffer] = useState({ rate: '', monthly_fees: '' }); // New state for Your Offer
  const [requestConsult, setRequestConsult] = useState(data.request_consult || false);

  const feeSchedules = [
    { id: '1', name: 'Standard Retail', rate: '2.9% + $0.30', description: 'Best for retail businesses' },
    { id: '2', name: 'Restaurant', rate: '2.6% + $0.15', description: 'Optimized for food service' },
    { id: '3', name: 'E-commerce', rate: '2.9% + $0.30', description: 'Online transactions' },
    { id: '4', name: 'Professional Services', rate: '2.7% + $0.30', description: 'Service-based businesses' },
    { id: '5', name: 'Healthcare', rate: '2.5% + $0.20', description: 'Medical practices' },
    { id: '6', name: 'Non-profit', rate: '2.2% + $0.20', description: 'Non-profit organizations' }
  ];

  const equipmentOptions = [
    {
      id: 'terminal_1',
      name: 'Verifone VX 520',
      type: 'terminal',
      price: 299,
      description: 'Reliable, countertop terminal'
    },
    {
      id: 'terminal_2',
      name: 'Ingenico Desk/5000',
      type: 'terminal',
      price: 349,
      description: 'Smart terminal with touch screen'
    },
    {
      id: 'pos_1',
      name: 'Clover Station Duo',
      type: 'pos',
      price: 1699,
      description: 'Full-featured POS for retail'
    },
    {
      id: 'pos_2',
      name: 'Toast Flex',
      type: 'pos',
      price: 899,
      description: 'Restaurant-grade POS system'
    },
    {
      id: 'reader_1',
      name: 'Square Reader',
      type: 'reader',
      price: 49,
      description: 'Contactless and chip reader'
    },
    {
      id: 'reader_2',
      name: 'PayPal Here',
      type: 'reader',
      price: 149,
      description: 'Chip and swipe card reader'
    },
    {
      id: 'gateway_1',
      name: 'Authorize.Net',
      type: 'gateway',
      price: 25,
      description: 'Popular choice for e-commerce'
    },
    {
      id: 'gateway_2',
      name: 'NMI (Network Merchants Inc.)',
      type: 'gateway',
      price: 30,
      description: 'Flexible and feature-rich gateway'
    },
    {
      id: 'gateway_3',
      name: 'Stripe Gateway',
      type: 'gateway',
      price: 0,
      description: 'For modern online businesses (pricing per-transaction)'
    }
  ];

  const handleFeeScheduleChange = (scheduleId) => {
    setSelectedFeeSchedule(scheduleId);
    onChange({
      ...data,
      fee_schedule_id: scheduleId
    });
  };

  const handleEquipmentChange = (equipmentId, checked) => {
    let updatedEquipment;
    if (checked) {
      const equipment = equipmentOptions.find(e => e.id === equipmentId);
      updatedEquipment = [...selectedEquipment, equipment];
    } else {
      updatedEquipment = selectedEquipment.filter(e => e.id !== equipmentId);
    }
    
    setSelectedEquipment(updatedEquipment);
    onChange({
      ...data,
      equipment: updatedEquipment
    });
  };

  const handlePricingModelChange = (model) => {
    setPricingModel(model);
    onChange({
      ...data,
      pricing_model: model
    });
  };

  const handleRequestConsultChange = (checked) => {
    setRequestConsult(checked);
    onChange({
      ...data,
      request_consult: checked
    });
  };

  const handleCustomPricingChange = (field, value) => {
    const updated = { ...customPricing, [field]: value };
    setCustomPricing(updated);
    onChange({
      ...data,
      custom_pricing: updated
    });
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    
    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      model: pricingModel,
      ...customPricing
    };
    
    setSavedTemplates([...savedTemplates, newTemplate]);
    setTemplateName('');
    alert('Pricing template saved successfully!');
  };

  const handleLoadTemplate = (template) => {
    setCustomPricing(template);
    setPricingModel(template.model);
    onChange({
      ...data,
      custom_pricing: template,
      pricing_model: template.model
    });
  };

  const handleStatementUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const { file_url } = await UploadFile({ file });
      setUploadedStatement(file);

      const analysis = await InvokeLLM({
        prompt: `Analyze this merchant processing statement and provide a detailed cost breakdown. Extract the following information:
        - Current effective rate (overall percentage)
        - Monthly volume processed
        - Total fees paid
        - Interchange costs
        - Processor markup
        - Monthly/statement fees
        - Any other significant costs
        - Recommendations for improvement
        
        Provide a clear summary that helps understand their current costs and potential savings opportunities.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            current_effective_rate: { type: "number" },
            monthly_volume: { type: "number" },
            total_monthly_fees: { type: "number" },
            interchange_costs: { type: "number" },
            processor_markup: { type: "number" },
            monthly_fees: { type: "number" },
            key_findings: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            potential_savings: { type: "string" }
          }
        }
      });

      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Error analyzing statement:', error);
      alert('Error analyzing statement. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleYourOfferChange = (field, value) => {
    setYourOffer(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalSavings = () => {
    if (!analysisResult || !yourOffer.rate) return 0;
    const currentFees = analysisResult.total_monthly_fees || 0;
    const offerRate = parseFloat(yourOffer.rate) || 0;
    const volume = analysisResult.monthly_volume || 0;
    const offerFees = parseFloat(yourOffer.monthly_fees) || 0;
    
    // Calculate new total fees based on your offer
    const newTotalFees = (volume * offerRate / 100) + offerFees;
    return Math.max(0, currentFees - newTotalFees);
  };

  const copyOfferToPricing = () => {
    if (!yourOffer.rate) {
      alert('Please enter a rate for your offer.');
      return;
    }
    
    setPricingModel('flat_rate');
    setCustomPricing({
      rate: parseFloat(yourOffer.rate),
      transaction_fee: 0.30, // default transaction fee, can be made configurable if needed
      monthly_fee: parseFloat(yourOffer.monthly_fees) || 0
    });
    
    onChange({
      ...data,
      pricing_model: 'flat_rate',
      custom_pricing: {
        rate: parseFloat(yourOffer.rate),
        transaction_fee: 0.30,
        monthly_fee: parseFloat(yourOffer.monthly_fees) || 0
      }
    });
    
    alert('Pricing copied to Rates & Fees section!');
  };

  const monthlyVolume = data.credit_card_processing?.total_monthly_sales || 0;
  const eligibleFreeTerminals = Math.floor(monthlyVolume / 25000);

  const totalEquipmentCostRaw = selectedEquipment.reduce((sum, item) => sum + item.price, 0);
  
  let discount = 0;
  if (isFreeTerminalOfferActive && eligibleFreeTerminals > 0) {
    const selectedTerminals = selectedEquipment
      .filter(e => e.type === 'terminal')
      .sort((a, b) => a.price - b.price);
    
    const terminalsToDiscount = selectedTerminals.slice(0, eligibleFreeTerminals);
    discount = terminalsToDiscount.reduce((sum, item) => sum + item.price, 0);
  }

  const totalEquipmentCost = totalEquipmentCostRaw - discount;

  return (
    <div className="space-y-6">
      {/* Merchant Statement Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Calculator className="w-6 h-6 text-amber-600" />
            Need Pricing Help?
          </CardTitle>
          <p className="text-slate-600">Upload a merchant statement and we'll analyze their current costs</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="statement-upload"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleStatementUpload}
            />
            <label htmlFor="statement-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-lg font-medium text-slate-900 mb-2">
                  Upload Merchant Statement
                </p>
                <p className="text-sm text-slate-500">
                  Drag and drop or click to upload PDF, PNG, or JPG
                </p>
              </div>
            </label>
          </div>

          {isAnalyzing && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-blue-800">Analyzing statement...</span>
              </div>
            </div>
          )}

          {analysisResult && (
            <>
              <div className="mt-6 p-6 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-4">Statement Analysis Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">Current Effective Rate</p>
                    <p className="text-xl font-bold text-slate-900">{analysisResult.current_effective_rate}%</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">Monthly Volume</p>
                    <p className="text-xl font-bold text-slate-900">${analysisResult.monthly_volume?.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">Total Monthly Fees</p>
                    <p className="text-xl font-bold text-slate-900">${analysisResult.total_monthly_fees?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Key Findings:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                      {analysisResult.key_findings?.map((finding, index) => (
                        <li key={index}>{finding}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Recommendations:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                      {analysisResult.recommendations?.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {analysisResult.potential_savings && (
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="font-medium text-emerald-800">Potential Savings:</p>
                      <p className="text-sm text-emerald-700">{analysisResult.potential_savings}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Your Offer Section */}
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Your Offer</h4>
                  <Button 
                    onClick={copyOfferToPricing}
                    disabled={!yourOffer.rate}
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-emerald-50"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Copy to Pricing Section
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border-2 border-dashed border-emerald-300">
                    <p className="text-sm text-slate-600 mb-2">Your Rate (%)</p>
                    <Input
                      type="number"
                      step="0.01"
                      value={yourOffer.rate}
                      onChange={(e) => handleYourOfferChange('rate', e.target.value)}
                      placeholder="2.50"
                      className="text-center text-xl font-bold border-0 bg-transparent"
                    />
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">Monthly Volume</p>
                    <p className="text-xl font-bold text-slate-900">${analysisResult.monthly_volume?.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">Potential Savings</p>
                    <p className="text-xl font-bold text-emerald-600">
                      ${calculateTotalSavings().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="monthly_fees_offer" className="text-sm font-medium text-slate-700">
                    Monthly Fees (optional)
                  </Label>
                  <Input
                    id="monthly_fees_offer"
                    type="number"
                    step="0.01"
                    value={yourOffer.monthly_fees}
                    onChange={(e) => handleYourOfferChange('monthly_fees', e.target.value)}
                    placeholder="25.00"
                    className="mt-1 max-w-xs"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Processing Rates & Fees */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Percent className="w-6 h-6 text-blue-600" />
            Processing Rates & Fees
          </CardTitle>
          <p className="text-slate-600">Choose from templates or create custom pricing</p>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={pricingModel} onValueChange={handlePricingModelChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="flat_rate">Flat Rate</TabsTrigger>
              <TabsTrigger value="interchange_plus">Interchange+</TabsTrigger>
              <TabsTrigger value="surcharge">Surcharge</TabsTrigger>
              <TabsTrigger value="tiered">Tiered</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feeSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFeeSchedule === schedule.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => handleFeeScheduleChange(schedule.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{schedule.name}</h4>
                      <Badge className="bg-blue-100 text-blue-800">{schedule.rate}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{schedule.description}</p>
                  </div>
                ))}
              </div>

              {savedTemplates.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Saved Custom Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-all"
                        onClick={() => handleLoadTemplate(template)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-slate-900">{template.name}</h5>
                          <Badge variant="outline">{template.model.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-sm text-slate-600">Click to load this template</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="flat_rate" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="flat_rate">Processing Rate (%)</Label>
                  <Input
                    id="flat_rate"
                    type="number"
                    step="0.01"
                    value={customPricing.rate || ''}
                    onChange={(e) => handleCustomPricingChange('rate', parseFloat(e.target.value))}
                    placeholder="2.90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction_fee">Transaction Fee ($)</Label>
                  <Input
                    id="transaction_fee"
                    type="number"
                    step="0.01"
                    value={customPricing.transaction_fee || ''}
                    onChange={(e) => handleCustomPricingChange('transaction_fee', parseFloat(e.target.value))}
                    placeholder="0.30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_fee">Monthly Fee ($)</Label>
                <Input
                  id="monthly_fee"
                  type="number"
                  step="0.01"
                  value={customPricing.monthly_fee || ''}
                  onChange={(e) => handleCustomPricingChange('monthly_fee', parseFloat(e.target.value))}
                  placeholder="15.00"
                  className="max-w-xs"
                />
              </div>
            </TabsContent>

            <TabsContent value="interchange_plus" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="interchange">Interchange + (%)</Label>
                  <Input
                    id="interchange"
                    type="number"
                    step="0.01"
                    value={customPricing.interchange || ''}
                    onChange={(e) => handleCustomPricingChange('interchange', parseFloat(e.target.value))}
                    placeholder="0.15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card_not_present">Card Not Present + (%)</Label>
                  <Input
                    id="card_not_present"
                    type="number"
                    step="0.01"
                    value={customPricing.card_not_present || ''}
                    onChange={(e) => handleCustomPricingChange('card_not_present', parseFloat(e.target.value))}
                    placeholder="0.30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="auth_fee">Authorization Fee ($)</Label>
                  <Input
                    id="auth_fee"
                    type="number"
                    step="0.01"
                    value={customPricing.auth_fee || ''}
                    onChange={(e) => handleCustomPricingChange('auth_fee', parseFloat(e.target.value))}
                    placeholder="0.10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_fee_icp">Monthly Fee ($)</Label>
                  <Input
                    id="monthly_fee_icp"
                    type="number"
                    step="0.01"
                    value={customPricing.monthly_fee || ''}
                    onChange={(e) => handleCustomPricingChange('monthly_fee', parseFloat(e.target.value))}
                    placeholder="25.00"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="surcharge" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="base_rate">Base Rate (%)</Label>
                  <Input
                    id="base_rate"
                    type="number"
                    step="0.01"
                    value={customPricing.base_rate || ''}
                    onChange={(e) => handleCustomPricingChange('base_rate', parseFloat(e.target.value))}
                    placeholder="2.10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surcharge_rate">Surcharge Rate (%)</Label>
                  <Input
                    id="surcharge_rate"
                    type="number"
                    step="0.01"
                    value={customPricing.surcharge_rate || ''}
                    onChange={(e) => handleCustomPricingChange('surcharge_rate', parseFloat(e.target.value))}
                    placeholder="3.50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transaction_fee_surcharge">Transaction Fee ($)</Label>
                <Input
                  id="transaction_fee_surcharge"
                  type="number"
                  step="0.01"
                  value={customPricing.transaction_fee || ''}
                  onChange={(e) => handleCustomPricingChange('transaction_fee', parseFloat(e.target.value))}
                  placeholder="0.25"
                  className="max-w-xs"
                />
              </div>
            </TabsContent>

            <TabsContent value="tiered" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="qualified">Qualified Rate (%)</Label>
                  <Input
                    id="qualified"
                    type="number"
                    step="0.01"
                    value={customPricing.qualified || ''}
                    onChange={(e) => handleCustomPricingChange('qualified', parseFloat(e.target.value))}
                    placeholder="2.19"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mid_qualified">Mid-Qualified Rate (%)</Label>
                  <Input
                    id="mid_qualified"
                    type="number"
                    step="0.01"
                    value={customPricing.mid_qualified || ''}
                    onChange={(e) => handleCustomPricingChange('mid_qualified', parseFloat(e.target.value))}
                    placeholder="2.49"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="non_qualified">Non-Qualified Rate (%)</Label>
                  <Input
                    id="non_qualified"
                    type="number"
                    step="0.01"
                    value={customPricing.non_qualified || ''}
                    onChange={(e) => handleCustomPricingChange('non_qualified', parseFloat(e.target.value))}
                    placeholder="2.89"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_fee_tiered">Monthly Fee ($)</Label>
                <Input
                  id="monthly_fee_tiered"
                  type="number"
                  step="0.01"
                  value={customPricing.monthly_fee || ''}
                  onChange={(e) => handleCustomPricingChange('monthly_fee', parseFloat(e.target.value))}
                  placeholder="20.00"
                  className="max-w-xs"
                />
              </div>
            </TabsContent>
          </Tabs>

          {pricingModel !== 'template' && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Template name (optional)"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                  <Save className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Free Terminal Offer */}
      {eligibleFreeTerminals > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Gift className="w-8 h-8 text-teal-600" />
              <div>
                <h4 className="font-semibold text-teal-800">Free Terminal Offer!</h4>
                <p className="text-sm text-teal-700">
                  Congratulations! You qualify for {eligibleFreeTerminals} free terminal{eligibleFreeTerminals > 1 ? 's' : ''} based on your processing volume.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Label htmlFor="free-terminal-switch" className="font-medium text-teal-800">Activate Offer</Label>
              <Switch
                id="free-terminal-switch"
                checked={isFreeTerminalOfferActive}
                onCheckedChange={setIsFreeTerminalOfferActive}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <ShoppingCart className="w-6 h-6 text-emerald-600" />
            Equipment & Software
          </CardTitle>
          <p className="text-slate-600">Select terminals, POS systems, and payment gateways</p>
        </CardHeader>
        <CardContent className="p-6">
          {/* Request a Consult Toggle */}
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 mb-1">Request a Consult</h4>
                <p className="text-sm text-slate-600">Skip equipment selection and request a consultation to discuss your needs</p>
              </div>
              <Switch
                checked={requestConsult}
                onCheckedChange={handleRequestConsultChange}
                className="ml-4"
              />
            </div>
          </div>

          {!requestConsult && (
            <>
              <div className="mb-6 p-4 rounded-lg bg-slate-50 border">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Equipment Cost:</span>
                      <span className="text-slate-700 font-medium">
                        ${totalEquipmentCostRaw.toLocaleString()}
                      </span>
                    </div>
                    {isFreeTerminalOfferActive && discount > 0 && (
                      <div className="flex items-center justify-between text-emerald-600">
                        <span className="text-sm font-medium">Free Terminal Discount:</span>
                        <span className="font-medium">
                          -${discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t pt-2 mt-2">
                      <span className="text-lg font-semibold text-slate-900">Total:</span>
                      <Badge className="bg-emerald-100 text-emerald-800 text-lg px-3 py-1">
                        ${totalEquipmentCost.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </div>

          <div className="space-y-6">
            {/* Terminals */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-slate-500" />
                Terminals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentOptions.filter(e => e.type === 'terminal').map((equipment) => (
                  <div key={equipment.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment.id}
                          checked={selectedEquipment.some(e => e.id === equipment.id)}
                          onCheckedChange={(checked) => handleEquipmentChange(equipment.id, checked)}
                        />
                        <Label htmlFor={equipment.id} className="font-medium text-slate-900">
                          {equipment.name}
                        </Label>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">${equipment.price}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{equipment.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* POS Systems */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-500" />
                POS Systems
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentOptions.filter(e => e.type === 'pos').map((equipment) => (
                  <div key={equipment.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment.id}
                          checked={selectedEquipment.some(e => e.id === equipment.id)}
                          onCheckedChange={(checked) => handleEquipmentChange(equipment.id, checked)}
                        />
                        <Label htmlFor={equipment.id} className="font-medium text-slate-900">
                          {equipment.name}
                        </Label>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800">${equipment.price}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{equipment.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gateways */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-500" />
                Gateways
              </h4>
              <div className="space-y-4">
                {equipmentOptions.filter(e => e.type === 'gateway').map((equipment) => (
                  <div key={equipment.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id={equipment.id}
                      checked={selectedEquipment.some(e => e.id === equipment.id)}
                      onCheckedChange={(checked) => handleEquipmentChange(equipment.id, checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={equipment.id} className="font-medium text-slate-900">
                        {equipment.name}
                      </Label>
                      <p className="text-sm text-slate-500">{equipment.description}</p>
                    </div>
                    <Badge variant="secondary">${equipment.price}/mo</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Readers */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5 text-slate-500" />
                Card Readers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentOptions.filter(e => e.type === 'reader').map((equipment) => (
                  <div key={equipment.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment.id}
                          checked={selectedEquipment.some(e => e.id === equipment.id)}
                          onCheckedChange={(checked) => handleEquipmentChange(equipment.id, checked)}
                        />
                        <Label htmlFor={equipment.id} className="font-medium text-slate-900">
                          {equipment.name}
                        </Label>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">${equipment.price}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{equipment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Selected Equipment Summary */}
      {selectedEquipment.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-xl">
            <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
              <ShoppingCart className="w-6 h-6 text-amber-600" />
              Selected Equipment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {selectedEquipment.map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-900">{equipment.name}</span>
                  <span className="text-slate-600">
                    ${equipment.price}
                    {equipment.type === 'gateway' ? '/mo' : ''}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">Total Equipment Cost:</span>
                  <span className="text-lg font-bold text-emerald-600">${totalEquipmentCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
