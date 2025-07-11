import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Banknote, Plus, Trash2, Edit3, CreditCard } from "lucide-react";

export default function BankingStep({ data, onChange }) {
  const [editingAccount, setEditingAccount] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const accounts = data.bank_details?.accounts || [];

  const handleAddAccount = () => {
    setEditingAccount({
      account_name: '',
      account_type: 'N',
      routing_number: '',
      account_number: ''
    });
    setShowAddForm(true);
  };

  const handleSaveAccount = () => {
    const updatedAccounts = editingAccount.id 
      ? accounts.map(a => a.id === editingAccount.id ? editingAccount : a)
      : [...accounts, { ...editingAccount, id: Date.now() }];

    onChange({
      ...data,
      bank_details: {
        ...data.bank_details,
        accounts: updatedAccounts
      }
    });

    setEditingAccount(null);
    setShowAddForm(false);
  };

  const handleDeleteAccount = (accountId) => {
    const updatedAccounts = accounts.filter(a => a.id !== accountId);
    onChange({
      ...data,
      bank_details: {
        ...data.bank_details,
        accounts: updatedAccounts
      }
    });
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowAddForm(true);
  };

  const handleAccountChange = (field, value) => {
    setEditingAccount({
      ...editingAccount,
      [field]: value
    });
  };

  const getAccountTypeLabel = (type) => {
    switch(type) {
      case 'N': return 'Checking';
      case 'S': return 'Savings';
      case 'C': return 'Corporate';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <Banknote className="w-6 h-6 text-emerald-600" />
            Bank Account Details
          </CardTitle>
          <p className="text-slate-600">Add bank accounts for deposits and withdrawals</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Total Accounts: </span>
              <Badge className="bg-emerald-100 text-emerald-800">
                {accounts.length}
              </Badge>
            </div>
            <Button onClick={handleAddAccount} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>
          </div>

          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-medium text-slate-900">{account.account_name}</h4>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {getAccountTypeLabel(account.account_type)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <span>Routing: {account.routing_number}</span>
                      <span>Account: ****{account.account_number.slice(-4)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAccount(account)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
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

      {/* Add/Edit Account Form */}
      {showAddForm && editingAccount && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              {editingAccount.id ? 'Edit' : 'Add'} Bank Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="account_name">Account Name *</Label>
              <Input
                id="account_name"
                value={editingAccount.account_name}
                onChange={(e) => handleAccountChange('account_name', e.target.value)}
                placeholder="Main Business Account"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_type">Account Type *</Label>
              <Select
                value={editingAccount.account_type}
                onValueChange={(value) => handleAccountChange('account_type', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">Checking</SelectItem>
                  <SelectItem value="S">Savings</SelectItem>
                  <SelectItem value="C">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="routing_number">Routing Number *</Label>
                <Input
                  id="routing_number"
                  value={editingAccount.routing_number}
                  onChange={(e) => handleAccountChange('routing_number', e.target.value)}
                  placeholder="123456789"
                  className="h-12"
                  maxLength="9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_number">Account Number *</Label>
                <Input
                  id="account_number"
                  value={editingAccount.account_number}
                  onChange={(e) => handleAccountChange('account_number', e.target.value)}
                  placeholder="1234567890"
                  className="h-12"
                />
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">Important Security Notice</h4>
              <p className="text-sm text-amber-700">
                Bank account information is encrypted and securely stored. This information will be used for payment processing and deposits only.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingAccount(null);
                  setShowAddForm(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAccount} className="bg-blue-600 hover:bg-blue-700">
                Save Account
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}