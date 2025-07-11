import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, Edit3 } from "lucide-react";

export default function OwnersOfficersStep({ data, onChange }) {
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const officers = data.owner_officers?.officers || [];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleAddOfficer = () => {
    setEditingOfficer({
      first_name: '',
      middle_name: '',
      last_name: '',
      ownership: 0,
      address_same_as_legal: false,
      address_street: '',
      address_unit: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      email: '',
      phone_no: '',
      birth_month: '',
      birth_day: '',
      birth_year: '',
      ssn: '',
      title: '',
      signing_app: false,
      personal_guarantor: false,
      country_of_citizenship: 'USA'
    });
    setShowAddForm(true);
  };

  const handleSaveOfficer = () => {
    const updatedOfficers = editingOfficer.id 
      ? officers.map(o => o.id === editingOfficer.id ? editingOfficer : o)
      : [...officers, { ...editingOfficer, id: Date.now() }];

    onChange({
      ...data,
      owner_officers: {
        ...data.owner_officers,
        officers: updatedOfficers
      }
    });

    setEditingOfficer(null);
    setShowAddForm(false);
  };

  const handleDeleteOfficer = (officerId) => {
    const updatedOfficers = officers.filter(o => o.id !== officerId);
    onChange({
      ...data,
      owner_officers: {
        ...data.owner_officers,
        officers: updatedOfficers
      }
    });
  };

  const handleEditOfficer = (officer) => {
    setEditingOfficer(officer);
    setShowAddForm(true);
  };

  const handleOfficerChange = (field, value) => {
    setEditingOfficer({
      ...editingOfficer,
      [field]: value
    });
  };

  const totalOwnership = officers.reduce((sum, officer) => sum + (officer.ownership || 0), 0);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Users className="w-6 h-6 text-purple-600" />
            Owners & Officers
          </CardTitle>
          <p className="text-slate-600">Add all owners with 25% or more ownership and key officers</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Total Ownership: </span>
              <Badge className={totalOwnership === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}>
                {totalOwnership}%
              </Badge>
            </div>
            <Button onClick={handleAddOfficer} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Owner/Officer
            </Button>
          </div>

          <div className="space-y-4">
            {officers.map((officer) => (
              <div key={officer.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-medium text-slate-900">
                        {officer.first_name} {officer.last_name}
                      </h4>
                      <Badge className="bg-purple-100 text-purple-800">
                        {officer.ownership}% ownership
                      </Badge>
                      <Badge variant="outline">{officer.title}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <span>Email: {officer.email}</span>
                      <span>Phone: {officer.phone_no}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditOfficer(officer)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteOfficer(officer.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Officer Form */}
      {showAddForm && editingOfficer && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-xl text-slate-900">
              {editingOfficer.id ? 'Edit' : 'Add'} Owner/Officer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={editingOfficer.first_name}
                  onChange={(e) => handleOfficerChange('first_name', e.target.value)}
                  placeholder="John"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={editingOfficer.middle_name}
                  onChange={(e) => handleOfficerChange('middle_name', e.target.value)}
                  placeholder="Michael"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={editingOfficer.last_name}
                  onChange={(e) => handleOfficerChange('last_name', e.target.value)}
                  placeholder="Doe"
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ownership">Ownership Percentage *</Label>
                <div className="relative">
                  <Input
                    id="ownership"
                    type="number"
                    value={editingOfficer.ownership}
                    onChange={(e) => handleOfficerChange('ownership', parseInt(e.target.value) || 0)}
                    placeholder="25"
                    className="h-12"
                    max="100"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title/Position *</Label>
                <Select
                  value={editingOfficer.title}
                  onValueChange={(value) => handleOfficerChange('title', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="President">President</SelectItem>
                    <SelectItem value="Vice President">Vice President</SelectItem>
                    <SelectItem value="CFO">CFO</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingOfficer.email}
                  onChange={(e) => handleOfficerChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_no">Phone Number *</Label>
                <Input
                  id="phone_no"
                  value={editingOfficer.phone_no}
                  onChange={(e) => handleOfficerChange('phone_no', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="birth_month">Birth Month *</Label>
                <Select
                  value={editingOfficer.birth_month?.toString()}
                  onValueChange={(value) => handleOfficerChange('birth_month', parseInt(value))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_day">Birth Day *</Label>
                <Select
                  value={editingOfficer.birth_day?.toString()}
                  onValueChange={(value) => handleOfficerChange('birth_day', parseInt(value))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_year">Birth Year *</Label>
                <Input
                  id="birth_year"
                  type="number"
                  value={editingOfficer.birth_year}
                  onChange={(e) => handleOfficerChange('birth_year', parseInt(e.target.value))}
                  placeholder="1990"
                  className="h-12"
                  min="1900"
                  max="2010"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssn">SSN *</Label>
                <Input
                  id="ssn"
                  value={editingOfficer.ssn}
                  onChange={(e) => handleOfficerChange('ssn', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  className="h-12"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="address_same_as_legal"
                checked={editingOfficer.address_same_as_legal}
                onCheckedChange={(checked) => handleOfficerChange('address_same_as_legal', checked)}
              />
              <Label htmlFor="address_same_as_legal">Address same as legal business address</Label>
            </div>

            {!editingOfficer.address_same_as_legal && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address_street">Street Address *</Label>
                  <Input
                    id="address_street"
                    value={editingOfficer.address_street}
                    onChange={(e) => handleOfficerChange('address_street', e.target.value)}
                    placeholder="123 Main Street"
                    className="h-12"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address_city">City *</Label>
                    <Input
                      id="address_city"
                      value={editingOfficer.address_city}
                      onChange={(e) => handleOfficerChange('address_city', e.target.value)}
                      placeholder="Los Angeles"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address_state">State *</Label>
                    <Select
                      value={editingOfficer.address_state}
                      onValueChange={(value) => handleOfficerChange('address_state', value)}
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
                    <Label htmlFor="address_zip">ZIP Code *</Label>
                    <Input
                      id="address_zip"
                      value={editingOfficer.address_zip}
                      onChange={(e) => handleOfficerChange('address_zip', e.target.value)}
                      placeholder="90210"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="signing_app"
                  checked={editingOfficer.signing_app}
                  onCheckedChange={(checked) => handleOfficerChange('signing_app', checked)}
                />
                <Label htmlFor="signing_app">Authorized to sign application</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal_guarantor"
                  checked={editingOfficer.personal_guarantor}
                  onCheckedChange={(checked) => handleOfficerChange('personal_guarantor', checked)}
                />
                <Label htmlFor="personal_guarantor">Personal guarantor</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingOfficer(null);
                  setShowAddForm(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveOfficer} className="bg-blue-600 hover:bg-blue-700">
                Save Officer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}