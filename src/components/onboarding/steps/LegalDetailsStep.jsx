import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Scale, MapPin, FileText } from "lucide-react";

export default function LegalDetailsStep({ data, onChange }) {
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleLegalAddressChange = (field, value) => {
    onChange({
      ...data,
      business_details: {
        ...data.business_details,
        legal: {
          ...data.business_details?.legal,
          [field]: value
        }
      }
    });
  };

  const handleDbaAddressChange = (field, value) => {
    onChange({
      ...data,
      business_details: {
        ...data.business_details,
        dba: {
          ...data.business_details?.dba,
          [field]: value
        }
      }
    });
  };

  const handleDbaSettingChange = (checked) => {
    onChange({
      ...data,
      business_details: {
        ...data.business_details,
        dba_same_as_legal: checked,
        dba: checked ? { ...data.business_details?.legal } : data.business_details?.dba
      }
    });
  };

  const handleTaxInfoChange = (field, value) => {
    onChange({
      ...data,
      business_details: {
        ...data.business_details,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Legal Entity Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Scale className="w-6 h-6 text-emerald-600" />
            Legal Entity Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="legal_name">Legal Business Name *</Label>
            <Input
              id="legal_name"
              value={data.business_details?.legal?.name || ''}
              onChange={(e) => handleLegalAddressChange('name', e.target.value)}
              placeholder="Legal registered business name"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="legal_address">Legal Address *</Label>
            <Input
              id="legal_address"
              value={data.business_details?.legal?.address_street || ''}
              onChange={(e) => handleLegalAddressChange('address_street', e.target.value)}
              placeholder="Street address"
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legal_unit">Unit/Suite</Label>
              <Input
                id="legal_unit"
                value={data.business_details?.legal?.address_unit || ''}
                onChange={(e) => handleLegalAddressChange('address_unit', e.target.value)}
                placeholder="Unit, Suite, etc."
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="legal_city">City *</Label>
              <Input
                id="legal_city"
                value={data.business_details?.legal?.address_city || ''}
                onChange={(e) => handleLegalAddressChange('address_city', e.target.value)}
                placeholder="City"
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="legal_state">State *</Label>
              <Select 
                value={data.business_details?.legal?.address_state || ''} 
                onValueChange={(value) => handleLegalAddressChange('address_state', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="legal_zip">ZIP Code *</Label>
            <Input
              id="legal_zip"
              value={data.business_details?.legal?.address_zip || ''}
              onChange={(e) => handleLegalAddressChange('address_zip', e.target.value)}
              placeholder="ZIP Code"
              className="h-12 max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* DBA Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <MapPin className="w-6 h-6 text-purple-600" />
            DBA (Doing Business As)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dba_same"
              checked={data.business_details?.dba_same_as_legal || false}
              onCheckedChange={handleDbaSettingChange}
            />
            <Label htmlFor="dba_same" className="text-sm font-medium">
              DBA information is the same as legal entity
            </Label>
          </div>

          {!data.business_details?.dba_same_as_legal && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dba_name">DBA Name</Label>
                <Input
                  id="dba_name"
                  value={data.business_details?.dba?.name || ''}
                  onChange={(e) => handleDbaAddressChange('name', e.target.value)}
                  placeholder="Doing business as name"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dba_address">DBA Address</Label>
                <Input
                  id="dba_address"
                  value={data.business_details?.dba?.address_street || ''}
                  onChange={(e) => handleDbaAddressChange('address_street', e.target.value)}
                  placeholder="Street address"
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dba_city">City</Label>
                  <Input
                    id="dba_city"
                    value={data.business_details?.dba?.address_city || ''}
                    onChange={(e) => handleDbaAddressChange('address_city', e.target.value)}
                    placeholder="City"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dba_state">State</Label>
                  <Select 
                    value={data.business_details?.dba?.address_state || ''} 
                    onValueChange={(value) => handleDbaAddressChange('address_state', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dba_zip">ZIP Code</Label>
                  <Input
                    id="dba_zip"
                    value={data.business_details?.dba?.address_zip || ''}
                    onChange={(e) => handleDbaAddressChange('address_zip', e.target.value)}
                    placeholder="ZIP Code"
                    className="h-12"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <FileText className="w-6 h-6 text-amber-600" />
            Tax Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tax_id_type">Type of Tax ID *</Label>
              <Select 
                value={data.business_details?.type_of_tax_id || ''} 
                onValueChange={(value) => handleTaxInfoChange('type_of_tax_id', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select tax ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SSN">Social Security Number (SSN)</SelectItem>
                  <SelectItem value="EIN">Employer Identification Number (EIN)</SelectItem>
                  <SelectItem value="ITIN">Individual Taxpayer Identification Number (ITIN)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax Identification Number *</Label>
              <Input
                id="tax_id"
                value={data.business_details?.tax_identification_number || ''}
                onChange={(e) => handleTaxInfoChange('tax_identification_number', e.target.value)}
                placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                className="h-12"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="tax_exempt"
              checked={data.business_details?.tax_exempt || false}
              onCheckedChange={(checked) => handleTaxInfoChange('tax_exempt', checked)}
            />
            <Label htmlFor="tax_exempt" className="text-sm font-medium">
              Tax exempt organization
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}