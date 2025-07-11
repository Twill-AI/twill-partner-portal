import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { ArrowLeft, ArrowRight, Send, Save, X, CheckCircle, AlertCircle, Mail, FileText, Eye, Download, Copy, Check } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import OnboardingProgress from "./OnboardingProgress";
import BusinessInfoStep from "./steps/BusinessInfoStep";
import LegalDetailsStep from "./steps/LegalDetailsStep";
import ProcessingStep from "./steps/ProcessingStep";
import OwnersOfficersStep from "./steps/OwnersOfficersStep";
import BankingStep from "./steps/BankingStep";
import PricingStep from "./steps/PricingStep";
import DocumentsStep from "./steps/DocumentsStep";

export default function MerchantOnboardingForm({ onClose, onSave }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false); 
  const [emailAddress, setEmailAddress] = useState(''); 
  const [submissionType, setSubmissionType] = useState(''); 
  const [applicationLink, setApplicationLink] = useState(''); 
  const [linkCopied, setLinkCopied] = useState(false); 

  const totalSteps = 8;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    console.log("Saving application as draft:", formData);
    onSave({ ...formData, submission_type: 'draft', status: 'draft' });
  };

  const handleSendToMerchant = () => {
    setEmailAddress(formData.email || '');
    setSubmissionType('merchant');
    setApplicationLink(`https://portal.twill.com/merchant/application/${formData.id || Date.now()}`); 
    setShowEmailModal(true);
  };

  const handleCompleteAndSend = () => {
    setEmailAddress(formData.email || '');
    setSubmissionType('complete');
    setApplicationLink(`https://portal.twill.com/merchant/application/${formData.id || Date.now()}`);
    setShowEmailModal(true);
  };

  const handleConfirmSend = () => {
    console.log(`Sending application type '${submissionType}' to: ${emailAddress}`);
    onSave({ 
      ...formData, 
      submission_type: submissionType, 
      email_sent_to: emailAddress,
      application_link: applicationLink,
      status: submissionType === 'complete' ? 'submitted_to_twill' : 'sent_to_merchant'
    });
    setShowEmailModal(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(applicationLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000); 
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const validateFormData = () => {
    const validation = {
      isComplete: true,
      missingFields: [],
      completedSections: []
    };

    if (!formData.name || !formData.email || !formData.business_type?.type) {
      validation.missingFields.push('Business Information (name, email, business type)');
      validation.isComplete = false;
    } else {
      validation.completedSections.push('Business Information');
    }

    if (!formData.business_details?.legal?.name || !formData.business_details?.legal?.address_street || 
        !formData.business_details?.tax_identification_number) {
      validation.missingFields.push('Legal Details (legal name, address, tax ID)');
      validation.isComplete = false;
    } else {
      validation.completedSections.push('Legal Details');
    }

    if (!formData.business_details?.accepted_transaction_types?.length) {
      validation.missingFields.push('Processing Information (transaction types)');
      validation.isComplete = false;
    } else {
      validation.completedSections.push('Processing Information');
    }

    const officers = formData.owner_officers?.officers || [];
    const totalOwnership = officers.reduce((sum, officer) => sum + (officer.ownership || 0), 0);
    if (officers.length === 0 || totalOwnership !== 100) {
      validation.missingFields.push('Owners & Officers (must total 100% ownership)');
      validation.isComplete = false;
    } else {
      validation.completedSections.push('Owners & Officers');
    }

    const accounts = formData.bank_details?.accounts || [];
    if (accounts.length === 0) {
      validation.missingFields.push('Banking Information (at least one bank account)');
      validation.isComplete = false;
    } else {
      validation.completedSections.push('Banking Information');
    }

    if (!formData.fee_schedule_id && !formData.custom_pricing) {
      validation.missingFields.push('Pricing (fee schedule or custom pricing)');
      validation.isComplete = false;
    } else {
      validation.completedSections.push('Pricing Information');
    }

    const requiredDocs = formData.required_documents || {}; 
    const uploadedDocs = formData.documents || {}; 
    
    const implicitRequiredDocs = ['articles_of_incorporation', 'business_license']; 
    const missingRequiredDocs = implicitRequiredDocs.filter(docType => 
      !uploadedDocs[docType] || uploadedDocs[docType].length === 0
    );
    
    if (missingRequiredDocs.length > 0) {
      validation.missingFields.push('Required Documents');
      validation.isComplete = false;
    } else {
      validation.completedSections.push('Documents');
    }

    return validation;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoStep data={formData} onChange={setFormData} />;
      case 2:
        return <LegalDetailsStep data={formData} onChange={setFormData} />;
      case 3:
        return <ProcessingStep data={formData} onChange={setFormData} />;
      case 4:
        return <OwnersOfficersStep data={formData} onChange={setFormData} />;
      case 5:
        return <BankingStep data={formData} onChange={setFormData} />;
      case 6:
        return <PricingStep data={formData} onChange={setFormData} />;
      case 7:
        return <DocumentsStep data={formData} onChange={setFormData} />;
      case 8:
        const validation = validateFormData();
        const uploadedDocs = formData.documents || {};
        const requiredDocs = formData.required_documents || {};
        
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Application Review</h3>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Review the application status below and choose how to proceed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Completed Sections ({validation.completedSections.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {validation.completedSections.map((section, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-emerald-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {section}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className={`rounded-t-xl ${
                  validation.missingFields.length > 0 
                    ? 'bg-gradient-to-r from-amber-50 to-amber-100' 
                    : 'bg-gradient-to-r from-emerald-50 to-emerald-100'
                }`}>
                  <CardTitle className={`flex items-center gap-2 text-lg text-slate-900`}>
                    {validation.missingFields.length > 0 ? (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                    {validation.missingFields.length > 0 ? 'Incomplete Sections' : 'All Complete!'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {validation.missingFields.length > 0 ? (
                    <div className="space-y-2">
                      {validation.missingFields.map((field, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-amber-700">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          {field}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-emerald-700">
                      All required sections have been completed. You can submit directly to Twill or send to the merchant for final review.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {Object.keys(uploadedDocs).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(uploadedDocs).map(([docType, docs]) => (
                      <div key={docType} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-900 capitalize">
                            {docType.replace(/_/g, ' ')}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {docs.length} file{docs.length > 1 ? 's' : ''}
                            </Badge>
                            {requiredDocs[docType] && (
                              <Badge className="bg-red-100 text-red-800">Required</Badge>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {docs.map((doc, index) => (
                            <div key={doc.id || index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{doc.file_name}</p>
                                  <p className="text-xs text-slate-500">
                                    {(doc.file_size / 1024 / 1024).toFixed(2)} MB • 
                                    Uploaded {new Date(doc.upload_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No documents have been uploaded yet</p>
                  </div>
                )}

                {Object.keys(requiredDocs).length > 0 && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h5 className="font-medium text-amber-800 mb-2">Required Documents for Merchant</h5>
                    <div className="space-y-1">
                      {Object.keys(requiredDocs).map((docType) => {
                        const hasUpload = uploadedDocs[docType] && uploadedDocs[docType].length > 0;
                        return (
                          <div key={docType} className="flex items-center gap-2 text-sm">
                            {hasUpload ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                            <span className={hasUpload ? 'text-emerald-700' : 'text-amber-700'}>
                              {docType.replace(/_/g, ' ')}
                              {hasUpload ? ' (Uploaded)' : ' (Required from merchant)'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
                <CardTitle className="text-lg text-slate-900">Submission Options</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {validation.isComplete ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-emerald-800 mb-2">Application Complete</h4>
                      <p className="text-sm text-emerald-700">
                        All required information has been provided. You can submit this application directly to Twill for processing, 
                        or send it to the merchant for their review and digital signature.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        onClick={handleCompleteAndSend} 
                        className="bg-emerald-600 hover:bg-emerald-700 h-12"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit to Twill
                      </Button>
                      <Button 
                        onClick={handleSendToMerchant} 
                        variant="outline" 
                        className="h-12"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send to Merchant for Review
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2">Application Incomplete</h4>
                      <p className="text-sm text-amber-700">
                        Some required information is missing. The application will be sent to the merchant 
                        to complete the remaining fields and provide any required documents.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleSendToMerchant} 
                      className="bg-blue-600 hover:bg-blue-700 h-12 w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send to Merchant to Complete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <div>Step not implemented</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Section */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <OnboardingProgress 
          currentStep={currentStep} 
          completedSteps={completedSteps}
          onStepClick={setCurrentStep}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderCurrentStep()}
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
        <Button 
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSave}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          
          {currentStep === totalSteps ? (
            <Button 
              onClick={handleSendToMerchant}
              className="bg-gradient-to-r from-azure100 to-periwinkle50 text-white hover:from-azure100/90 hover:to-periwinkle50/90 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Application
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-azure100 to-periwinkle50 text-white hover:from-azure100/90 hover:to-periwinkle50/90 flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Application</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Merchant Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="merchant@example.com"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={() => setShowEmailModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmSend}
                  className="bg-gradient-to-r from-azure100 to-periwinkle50 text-white"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
