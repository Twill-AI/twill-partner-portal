
import React from 'react';
import { CheckCircle, Circle, Clock } from "lucide-react";

export default function OnboardingProgress({ currentStep, completedSteps, onStepClick }) {
  const steps = [
    { id: 1, title: 'Business Info', description: 'Basic business details' },
    { id: 2, title: 'Legal Details', description: 'Legal entity information' },
    { id: 3, title: 'Processing', description: 'Payment processing setup' },
    { id: 4, title: 'Owners', description: 'Owner & officer details' },
    { id: 5, title: 'Banking', description: 'Bank account information' },
    { id: 6, title: 'Pricing', description: 'Fee schedule & equipment' },
    { id: 7, title: 'Documents', description: 'Upload required documents' },
    { id: 8, title: 'Review', description: 'Final review & send' }
  ];

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Application Progress</h3>
        <span className="text-sm text-slate-500">
          Step {currentStep} of {steps.length}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          ></div>
        </div>
        <span className="ml-4 text-sm font-medium text-slate-700">
          {Math.round((completedSteps.length / steps.length) * 100)}%
        </span>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className="flex flex-col items-center text-center p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200 hover:bg-slate-50"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                status === 'current' ? 'bg-blue-100 text-blue-600' :
                'bg-slate-100 text-slate-400'
              }`}>
                {status === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : status === 'current' ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <span className={`text-xs text-center font-medium ${
                status === 'completed' ? 'text-emerald-600' :
                status === 'current' ? 'text-blue-600' :
                'text-slate-400'
              }`}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
