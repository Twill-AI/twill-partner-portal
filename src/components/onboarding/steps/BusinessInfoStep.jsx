
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Building2, Mail, Phone, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import { cn } from "@/lib/utils";

export default function BusinessInfoStep({ data, onChange }) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mccOpen, setMccOpen] = useState(false);

  const businessTypes = [
    { value: 'PR', label: 'Sole Proprietorship', mcc: '5999' },
    { value: 'PA', label: 'Partnership', mcc: '5999' },
    { value: 'LLS', label: 'Single Member LLC', mcc: '5999' },
    { value: 'LLM', label: 'Multiple Member LLC', mcc: '5999' },
    { value: 'COC', label: 'C Corporation', mcc: '5999' },
    { value: 'COS', label: 'S Corporation', mcc: '5999' },
    { value: 'NPC', label: 'Nonprofit Corporation', mcc: '8398' },
    { value: 'COP', label: 'Public Corporation', mcc: '5999' }
  ];

  const mccCodes = [
    { value: '5812', label: '5812 - Eating Places, Restaurants' },
    { value: '5814', label: '5814 - Fast Food Restaurants' },
    { value: '5411', label: '5411 - Grocery Stores, Supermarkets' },
    { value: '5311', label: '5311 - Department Stores' },
    { value: '5732', label: '5732 - Electronics Stores' },
    { value: '5734', label: '5734 - Computer Software Stores' },
    { value: '5912', label: '5912 - Drug Stores and Pharmacies' },
    { value: '5541', label: '5541 - Service Stations' },
    { value: '5511', label: '5511 - Car and Truck Dealers' },
    { value: '7011', label: '7011 - Hotels, Motels, and Resorts' },
    { value: '8011', label: '8011 - Doctors' },
    { value: '8021', label: '8021 - Dentists and Orthodontists' },
    { value: '8398', label: '8398 - Organizations, Charitable and Social Service' },
    { value: '5964', label: '5964 - Direct Marketing - Catalog Merchant' },
    { value: '5968', label: '5968 - Direct Marketing - Continuity/Subscription' },
    { value: '5999', label: '5999 - Miscellaneous Specialty Retail' },
    { value: '7372', label: '7372 - Computer Programming' },
    { value: '7379', label: '7379 - Computer Maintenance and Repair' },
    { value: '4816', label: '4816 - Computer Network Services' },
    { value: '5045', label: '5045 - Computers and Computer Equipment' },
    { value: '5942', label: '5942 - Book Stores' },
    { value: '5943', label: '5943 - Stationery, Office Supply Stores' },
    { value: '5944', label: '5944 - Jewelry Stores' },
    { value: '5945', label: '5945 - Hobby, Toy, and Game Shops' },
    { value: '5992', label: '5992 - Florists' },
    { value: '7230', label: '7230 - Barber and Beauty Shops' },
    { value: '7298', label: '7298 - Health and Beauty Spas' },
    { value: '7311', label: '7311 - Advertising Services' },
    { value: '1520', label: '1520 - General Contractors' },
    { value: '1711', label: '1711 - Heating, Plumbing, A/C' },
    { value: '1731', label: '1731 - Electrical Contractors' }
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

          <div className="space-y-2">
            <Label htmlFor="mcc_code">MCC Code *</Label>
            <Popover open={mccOpen} onOpenChange={setMccOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={mccOpen}
                  className="h-12 w-full justify-between"
                >
                  {data.business_details?.mcc_code
                    ? mccCodes.find((mcc) => mcc.value === data.business_details.mcc_code)?.label
                    : "Select MCC code..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search MCC codes..." />
                  <CommandList>
                    <CommandEmpty>No MCC code found.</CommandEmpty>
                    <CommandGroup>
                      {mccCodes.map((mcc) => (
                        <CommandItem
                          key={mcc.value}
                          value={mcc.value}
                          onSelect={(currentValue) => {
                            const selectedMcc = currentValue === data.business_details?.mcc_code ? "" : currentValue;
                            handleInputChange('business_details', {
                              ...data.business_details,
                              mcc_code: selectedMcc
                            });
                            setMccOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              data.business_details?.mcc_code === mcc.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {mcc.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
