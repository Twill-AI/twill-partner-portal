
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, Loader2 } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";

export default function BusinessInfoStep({ data, onChange }) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const businessTypes = [
    { value: 'RE', label: 'Retail', mcc: '5999' },
    { value: 'RS', label: 'Restaurant', mcc: '5812' },
    { value: 'PR', label: 'Professional Services', mcc: '5734' },
    { value: 'HC', label: 'Healthcare', mcc: '8011' },
    { value: 'AU', label: 'Automotive', mcc: '5511' },
    { value: 'EC', label: 'E-commerce', mcc: '5964' },
    { value: 'NP', label: 'Nonprofit', mcc: '8398' },
    { value: 'SB', label: 'Subscription', mcc: '5968' },
    { value: 'MP', label: 'Marketplace', mcc: '5967' },
    { value: 'OT', label: 'Other', mcc: '5999' }
  ];

  const handleInputChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleBusinessTypeChange = (value) => {
    const selectedType = businessTypes.find(t => t.value === value);
    onChange({
      ...data,
      business_type: {
        type: value,
        mcc_sic: selectedType?.mcc || '5999'
      }
    });
  };

  const handleGenerateDescription = async () => {
    if (!websiteUrl) return;
    setIsGenerating(true);
    try {
      const result = await InvokeLLM({
        prompt: `Visit the website ${websiteUrl} and write a concise, one-paragraph business description suitable for a merchant services application. The description should clearly summarize what products the business sells or what services it provides.`,
        add_context_from_internet: true,
      });
      // The output from InvokeLLM can be a string or an object with an 'output' property
      const description = typeof result === 'string' ? result : result.output;
      handleInputChange('business_details', {
        ...data.business_details,
        business_description: description
      });
    } catch (error) {
      console.error("Error generating description:", error);
      // Optionally, set an error state to show to the user
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Building2 className="w-6 h-6 text-blue-600" />
            Business Information
          </CardTitle>
          <p className="text-slate-600">Tell us about your business</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={data.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your business name"
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_type">Business Type *</Label>
              <Select 
                value={data.business_type?.type || ''} 
                onValueChange={handleBusinessTypeChange}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Business Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="business@example.com"
                  className="pl-10 h-12"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Business Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="phone"
                  value={data.business_details?.business_phone_no || ''}
                  onChange={(e) => handleInputChange('business_details', {
                    ...data.business_details,
                    business_phone_no: e.target.value
                  })}
                  placeholder="(555) 123-4567"
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description *</Label>
            <Textarea
              id="description"
              value={data.business_details?.business_description || ''}
              onChange={(e) => handleInputChange('business_details', {
                ...data.business_details,
                business_description: e.target.value
              })}
              placeholder="Describe your products or services..."
              className="min-h-[120px]"
            />
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Give us the website and let us describe it</Label>
            <div className="flex gap-2">
                <Input
                  id="website_url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-12"
                />
                <Button 
                  onClick={handleGenerateDescription} 
                  disabled={isGenerating || !websiteUrl} 
                  className="h-12 w-32"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
                </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="business_age_years">Business Age (Years)</Label>
              <Input
                id="business_age_years"
                type="number"
                value={data.business_details?.business_age_years || ''}
                onChange={(e) => handleInputChange('business_details', {
                  ...data.business_details,
                  business_age_years: parseInt(e.target.value) || 0
                })}
                placeholder="0"
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_age_months">Additional Months</Label>
              <Input
                id="business_age_months"
                type="number"
                value={data.business_details?.business_age_months || ''}
                onChange={(e) => handleInputChange('business_details', {
                  ...data.business_details,
                  business_age_months: parseInt(e.target.value) || 0
                })}
                placeholder="0"
                max="11"
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_revenue">Annual Revenue</Label>
            <Input
              id="annual_revenue"
              type="number"
              value={data.business_details?.company_annual_revenue || ''}
              onChange={(e) => handleInputChange('business_details', {
                ...data.business_details,
                company_annual_revenue: parseInt(e.target.value) || 0
              })}
              placeholder="1000000"
              className="h-12"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
