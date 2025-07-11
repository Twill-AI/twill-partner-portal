
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Upload, Check, X, Eye, Download, Plus } from "lucide-react";
import { UploadFile } from "@/api/integrations";

export default function DocumentsStep({ data, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadingDocType, setUploadingDocType] = useState(null);

  const requiredDocuments = [
    {
      id: 'bank_statement',
      name: 'Bank Statement',
      description: 'Most recent bank statement (last 3 months)',
      required: true,
      category: 'financial'
    },
    {
      id: 'tax_return',
      name: 'Tax Return',
      description: 'Previous year tax return or financial statements',
      required: true,
      category: 'financial'
    },
    {
      id: 'voided_check',
      name: 'Voided Check',
      description: 'Voided check or bank letter for verification',
      required: true,
      category: 'banking'
    },
    {
      id: 'drivers_license',
      name: "Driver's License",
      description: 'Valid government-issued ID for all owners',
      required: true,
      category: 'identification'
    },
    {
      id: 'business_license',
      name: 'Business License',
      description: 'Current business license or registration',
      required: false,
      category: 'business'
    },
    {
      id: 'articles_incorporation',
      name: 'Articles of Incorporation',
      description: 'Legal formation documents',
      required: false,
      category: 'business'
    },
    {
      id: 'lease_agreement',
      name: 'Lease Agreement',
      description: 'Current lease or mortgage statement',
      required: false,
      category: 'business'
    },
    {
      id: 'processing_statements',
      name: 'Processing Statements',
      description: 'Last 3 months of processing statements (if applicable)',
      required: false,
      category: 'financial'
    }
  ];

  const documents = data.documents || {};

  const handleFileUpload = async (event, docType) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setUploading(true);
    setUploadingDocType(docType);

    try {
      const uploadPromises = files.map(file => UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      
      const existingDocs = documents[docType] || [];
      const newDocs = results.map((result, index) => ({
        file_url: result.file_url,
        file_name: files[index].name,
        file_size: files[index].size,
        upload_date: new Date().toISOString(),
        status: 'uploaded',
        id: Date.now() + index
      }));

      const updatedDocuments = {
        ...documents,
        [docType]: [...existingDocs, ...newDocs]
      };

      onChange({
        ...data,
        documents: updatedDocuments
      });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setUploadingDocType(null);
    }
  };

  const handleRemoveDocument = (docType, docId) => {
    const updatedDocuments = { ...documents };
    if (updatedDocuments[docType]) {
      updatedDocuments[docType] = updatedDocuments[docType].filter(doc => doc.id !== docId);
      if (updatedDocuments[docType].length === 0) {
        delete updatedDocuments[docType];
      }
    }
    
    onChange({
      ...data,
      documents: updatedDocuments
    });
  };

  const handleRequiredToggle = (docType, checked) => {
    // Ensure updatedRequiredDocs is a new object to avoid direct mutation of `data.required_documents`
    // Handle cases where data.required_documents might be null or undefined
    const updatedRequiredDocs = { ...(data.required_documents || {}) };
    if (checked) {
      updatedRequiredDocs[docType] = true;
    } else {
      delete updatedRequiredDocs[docType];
    }

    onChange({
      ...data,
      required_documents: updatedRequiredDocs
    });
  };

  const getDocumentsByCategory = (category) => {
    return requiredDocuments.filter(doc => doc.category === category);
  };

  const getUploadedCount = (category) => {
    const categoryDocs = getDocumentsByCategory(category);
    return categoryDocs.filter(doc => documents[doc.id] && documents[doc.id].length > 0).length;
  };

  const categories = [
    { id: 'financial', name: 'Financial Documents', icon: FileText, color: 'emerald' },
    { id: 'banking', name: 'Banking Information', icon: FileText, color: 'blue' },
    { id: 'identification', name: 'Identification', icon: FileText, color: 'purple' },
    { id: 'business', name: 'Business Documents', icon: FileText, color: 'amber' }
  ];

  return (
    <div className="space-y-6">
      {/* Document Categories */}
      {categories.map((category) => {
        const categoryDocs = getDocumentsByCategory(category.id);
        const uploadedCount = getUploadedCount(category.id);
        
        return (
          <Card key={category.id} className="border-0 shadow-lg">
            <CardHeader className={`bg-gradient-to-r from-${category.color}-50 to-${category.color}-100 rounded-t-xl`}>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
                <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                {category.name}
                <Badge className={`bg-${category.color}-100 text-${category.color}-800 ml-auto`}>
                  {uploadedCount}/{categoryDocs.length} with uploads
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {categoryDocs.map((doc) => {
                  const uploadedDocs = documents[doc.id] || [];
                  const hasUploads = uploadedDocs.length > 0;
                  const isUploading = uploading && uploadingDocType === doc.id;
                  // isRequired check now strictly reflects if the document is marked as required in the data prop
                  const isRequired = data.required_documents?.[doc.id] === true;
                  
                  return (
                    <div key={doc.id} className={`p-4 rounded-lg border-2 ${
                      hasUploads ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            hasUploads ? 'bg-emerald-100' : 'bg-slate-100'
                          }`}>
                            {hasUploads ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 flex items-center gap-2">
                              {doc.name}
                              {/* Badge visibility also tied to the updated isRequired logic */}
                              {isRequired && <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>}
                            </h4>
                            <p className="text-sm text-slate-600">{doc.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`required-${doc.id}`}
                              checked={isRequired}
                              onCheckedChange={(checked) => handleRequiredToggle(doc.id, checked)}
                            />
                            <label htmlFor={`required-${doc.id}`} className="text-sm text-slate-600 cursor-pointer">
                              Required for merchant
                            </label>
                          </div>

                          <input
                            type="file"
                            id={`file-${doc.id}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, doc.id)}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            multiple
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUploading}
                            onClick={() => document.getElementById(`file-${doc.id}`).click()}
                          >
                            {isUploading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Files
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Show uploaded documents */}
                      {uploadedDocs.length > 0 && (
                        <div className="space-y-2">
                          {uploadedDocs.map((uploadedDoc) => (
                            <div key={uploadedDoc.id} className="p-3 bg-white rounded-lg border border-emerald-200">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 font-medium">{uploadedDoc.file_name}</span>
                                    <span className="text-slate-500">
                                      {(uploadedDoc.file_size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1">
                                    Uploaded: {new Date(uploadedDoc.upload_date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveDocument(doc.id, uploadedDoc.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Upload Instructions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <FileText className="w-6 h-6 text-slate-600" />
            Upload Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <span>Accepted file formats: PDF, DOC, DOCX, JPG, JPEG, PNG</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <span>Maximum file size: 10MB per document</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <span>You can upload multiple files for each document type</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <span>Check "Required for merchant" to make documents mandatory when sent to merchant</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <span>Ensure all documents are clear and legible</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
