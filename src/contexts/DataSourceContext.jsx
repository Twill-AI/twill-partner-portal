// Data Source Management Context
// Allows switching between mock data and PayEngine sandbox

import React, { createContext, useContext, useState, useEffect } from 'react';

const DataSourceContext = createContext();

export const DataSource = {
  MOCK: 'mock',
  PAYENGINE_SANDBOX: 'payengine_sandbox'
};

export const DataSourceProvider = ({ children }) => {
  // Load from localStorage or default to mock
  const [dataSource, setDataSource] = useState(() => {
    const saved = localStorage.getItem('twill_data_source');
    return saved || DataSource.MOCK;
  });

  const [isOnline, setIsOnline] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Persist to localStorage when changed
  useEffect(() => {
    localStorage.setItem('twill_data_source', dataSource);
  }, [dataSource]);

  // Toggle between data sources
  const toggleDataSource = () => {
    const newSource = dataSource === DataSource.MOCK 
      ? DataSource.PAYENGINE_SANDBOX 
      : DataSource.MOCK;
    setDataSource(newSource);
  };

  // Switch to specific data source
  const switchToDataSource = (source) => {
    if (Object.values(DataSource).includes(source)) {
      // Update localStorage immediately to avoid timing issues
      localStorage.setItem('twill_data_source', source);
      setDataSource(source);
    }
  };

  // Check connection status for PayEngine
  const checkPayEngineConnection = async () => {
    if (dataSource === DataSource.PAYENGINE_SANDBOX) {
      try {
        setConnectionStatus('connecting');
        // TODO: Add actual PayEngine health check when implemented
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate check
        setConnectionStatus('connected');
        setIsOnline(true);
      } catch (error) {
        console.error('PayEngine connection failed:', error);
        setConnectionStatus('error');
        setIsOnline(false);
      }
    } else {
      setConnectionStatus('connected');
      setIsOnline(true);
    }
  };

  useEffect(() => {
    checkPayEngineConnection();
  }, [dataSource]);

  const value = {
    dataSource,
    isOnline,
    connectionStatus,
    setDataSource,
    toggleDataSource,
    switchToDataSource,
    checkPayEngineConnection,
    // Helper booleans
    isMockMode: dataSource === DataSource.MOCK,
    isPayEngineMode: dataSource === DataSource.PAYENGINE_SANDBOX,
    // Status info
    getDataSourceLabel: () => {
      switch (dataSource) {
        case DataSource.MOCK:
          return 'Mock Data';
        case DataSource.PAYENGINE_SANDBOX:
          return 'PayEngine Sandbox';
        default:
          return 'Unknown';
      }
    },
    getStatusColor: () => {
      if (!isOnline) return 'red';
      switch (connectionStatus) {
        case 'connected': return 'green';
        case 'connecting': return 'yellow';
        case 'error': return 'red';
        default: return 'gray';
      }
    }
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
};

export default DataSourceContext;
