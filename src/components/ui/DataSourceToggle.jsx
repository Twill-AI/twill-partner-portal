// Data Source Toggle Component
// Segmented control showing both Mock Data and PayEngine Sandbox options
// Uses authentic Twill AI design system

import React from 'react';
import { useDataSource, DataSource } from '../../contexts/DataSourceContext';

const DataSourceToggle = ({ className = "", compact = false }) => {
  const { 
    dataSource, 
    setDataSource, 
    connectionStatus,
    isMockMode,
    isPayEngineMode 
  } = useDataSource();

  const getStatusDot = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green';
      case 'connecting': return 'bg-yellow75 animate-pulse';
      case 'error': return 'bg-error';
      default: return 'bg-gray100';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${getStatusDot()}`} />
        <span className="text-gray100 text-xs font-medium">Data Source:</span>
        {/* Segmented Control Toggle */}
        <div className="relative inline-flex bg-gray40 rounded-lg p-1">
          <button
            onClick={() => setDataSource(DataSource.MOCK)}
            className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              isMockMode 
                ? 'bg-white text-black50 shadow-sm'
                : 'text-gray100 hover:text-black50'
            }`}
          >
            Mock Data
          </button>
          <button
            onClick={() => setDataSource(DataSource.PAYENGINE_SANDBOX)}
            className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              isPayEngineMode 
                ? 'bg-white text-black50 shadow-sm'
                : 'text-gray100 hover:text-black50'
            }`}
          >
            PayEngine
          </button>
        </div>
      </div>
    );
  }

  // Full size segmented control
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getStatusDot()}`} />
        <span className="text-black50 text-sm font-medium">Data Source</span>
      </div>

      {/* Segmented Control */}
      <div className="relative inline-flex bg-gray40 rounded-xl p-1 shadow-md shadow-[rgba(13,10,44,0.08)]">
        <button
          onClick={() => setDataSource(DataSource.MOCK)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure100/50 ${
            isMockMode 
              ? 'bg-white text-black50 shadow-sm'
              : 'text-gray100 hover:text-black50 hover:bg-white/50'
          }`}
        >
          Mock Data
        </button>
        <button
          onClick={() => setDataSource(DataSource.PAYENGINE_SANDBOX)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure100/50 ${
            isPayEngineMode 
              ? 'bg-white text-black50 shadow-sm'
              : 'text-gray100 hover:text-black50 hover:bg-white/50'
          }`}
        >
          PayEngine Sandbox
        </button>
      </div>

      {/* Connection Status */}
      <div className="text-xs text-gray100">
        {connectionStatus === 'connected' && isPayEngineMode && (
          <span className="text-green font-medium">✓ Connected</span>
        )}
        {connectionStatus === 'connecting' && isPayEngineMode && (
          <span className="text-yellow75 font-medium">⟳ Connecting...</span>
        )}
        {connectionStatus === 'error' && isPayEngineMode && (
          <span className="text-error font-medium">⚠ Connection Error</span>
        )}
        {isMockMode && (
          <span className="text-gray100 font-medium">Mock Mode</span>
        )}
      </div>
    </div>
  );
};

// Compact version for smaller spaces - Toggle Switch Style
export const CompactDataSourceToggle = ({ className = "" }) => {
  const { 
    switchToDataSource,
    isMockMode,
    isPayEngineMode 
  } = useDataSource();

  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => switchToDataSource('mock')}
        className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
          isMockMode
            ? 'bg-blue-500 text-white shadow-md font-bold'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isMockMode ? 'bg-white' : 'bg-green-500'
          }`} />
          <span>Mock</span>
        </div>
      </button>
      
      <button
        onClick={() => switchToDataSource('payengine_sandbox')}
        className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
          isPayEngineMode
            ? 'bg-blue-500 text-white shadow-md font-bold'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isPayEngineMode ? 'bg-white' : 'bg-orange-500'
          }`} />
          <span>PayEngine</span>
        </div>
      </button>
    </div>
  );
};

export default DataSourceToggle;
