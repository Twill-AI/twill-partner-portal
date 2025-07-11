// @ts-check
import React from 'react';
import { test, expect } from '@playwright/experimental-ct-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock next/router
const mockPush = test.fn();
const mockRouter = {
  push: mockPush,
  pathname: '/merchants',
  query: {},
  events: {
    on: test.fn(),
    off: test.fn(),
  },
};

// Mock the useRouter hook
const useRouter = () => mockRouter;

// Mock the next/router module
Object.defineProperty(require('next/router'), 'useRouter', {
  value: useRouter,
  writable: true,
});
import MerchantTable from '../../src/components/merchants/MerchantTable.updated';

// Mock data
const mockMerchants = [
  {
    id: 'merch_1',
    business_name: 'Test Business 1',
    email: 'business1@example.com',
    status: 'active',
    risk_level: 'low',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metrics: {
      monthly_volume: 10000,
      transaction_count: 100,
      average_transaction: 100,
      approval_rate: 95,
      chargeback_rate: 0.5,
      volume_change_30d: 5,
    },
  },
  {
    id: 'merch_2',
    business_name: 'Test Business 2',
    email: 'business2@example.com',
    status: 'in_review',
    risk_level: 'medium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metrics: {
      monthly_volume: 20000,
      transaction_count: 200,
      average_transaction: 100,
      approval_rate: 90,
      chargeback_rate: 1.0,
      volume_change_30d: 0,
    },
  },
];

// Setup MSW server
const server = setupServer(
  rest.get('**/api/merchants', (req, res, ctx) => {
    const search = req.url.searchParams.get('search') || '';
    const status = req.url.searchParams.get('status');
    const page = parseInt(req.url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(req.url.searchParams.get('pageSize') || '10', 10);
    
    let filteredMerchants = [...mockMerchants];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMerchants = filteredMerchants.filter(
        m => m.business_name.toLowerCase().includes(searchLower) || 
             m.email.toLowerCase().includes(searchLower)
      );
    }
  })
);

// Test wrapper component
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test.beforeAll(() => {
  // Start the mock server
  server.listen({ onUnhandledRequest: 'bypass' });
});

test.afterEach(() => {
  // Reset handlers after each test
  server.resetHandlers();
});

test.afterAll(() => {
  // Clean up the mock server
  server.close();
});

test('renders merchant data', async ({ mount }) => {
  // Mock function for onMerchantSelect
  const onMerchantSelect = test.fn();
  
  // Mount the component
  const component = await mount(
    <TestWrapper>
      <MerchantTable onMerchantSelect={onMerchantSelect} />
    </TestWrapper>
  );

  // Wait for data to load and check if merchant data is displayed
  await expect(component.getByText('Test Business 1')).toBeVisible();
  await expect(component.getByText('Active')).toBeVisible();
  await expect(component.getByText('$10,000.00')).toBeVisible();
});

test('filters merchants by status', async ({ mount }) => {
  // Mock function for onMerchantSelect
  const onMerchantSelect = test.fn();
  
  // Mount the component
  const component = await mount(
    <TestWrapper>
      <MerchantTable onMerchantSelect={onMerchantSelect} />
    </TestWrapper>
  );

  // Test filtering by status
  await component.getByRole('tab', { name: 'Active' }).click();
  
  // Check if only active merchants are shown
  const rows = await component.$$('tbody tr');
  expect(rows.length).toBe(1); // Only one active merchant in mock data
  await expect(component.getByText('Test Business 1')).toBeVisible();
});

test('searches for merchants', async ({ mount }) => {
  // Mock function for onMerchantSelect
  const onMerchantSelect = test.fn();
  
  // Mount the component
  const component = await mount(
    <TestWrapper>
      <MerchantTable onMerchantSelect={onMerchantSelect} />
    </TestWrapper>
  );

  // Test search functionality
  const searchInput = await component.getByPlaceholder('Search merchants...');
  await searchInput.fill('Test Business 1');
  await searchInput.press('Enter');
  
  // Check if only matching merchant is shown
  const rows = await component.$$('tbody tr');
  expect(rows.length).toBe(1);
  await expect(component.getByText('Test Business 1')).toBeVisible();
  
  // Check that other merchants are not visible
  const otherMerchant = await component.$$('text=Test Business 2');
  expect(otherMerchant.length).toBe(0);
});

test('sorts merchants by column', async ({ mount }) => {
  // Mock function for onMerchantSelect
  const onMerchantSelect = test.fn();
  
  // Mount the component
  const component = await mount(
    <TestWrapper>
      <MerchantTable onMerchantSelect={onMerchantSelect} />
    </TestWrapper>
  );

  // Click on the 'Monthly Volume' column header to sort
  await component.getByRole('columnheader', { name: /monthly volume/i }).click();
  
  // Verify sorting indicator is visible
  await expect(component.getByLabel('sorted ascending')).toBeVisible();
  
  // Get all merchant names after sorting
  const merchantNames = await component.locator('tbody tr').allTextContents();
  
  // Verify merchants are sorted by name (ascending)
  const sortedNames = [...merchantNames].sort();
  expect(merchantNames).toEqual(sortedNames);
});

test('handles empty state', async ({ mount }) => {
  // Mock function for onMerchantSelect
  const onMerchantSelect = vi.fn();
  
  // Override the default mock to return no merchants
  server.use(
    http.get('**/api/merchants', () => {
      return HttpResponse.json({
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      }, { status: 200 });
    })
  );

  // Mount the component
  const component = await mount(
    <TestWrapper>
      <MerchantTable onMerchantSelect={onMerchantSelect} />
    </TestWrapper>
  );

  // Verify empty state is shown
  await expect(component.getByText('No merchants found')).toBeVisible();
});

test('handles API errors', async ({ mount }) => {
  // Mock function for onMerchantSelect
  const onMerchantSelect = vi.fn();
  
  // Override the default mock to return an error
  server.use(
    http.get('**/api/merchants', () => {
      return HttpResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    })
  );

  // Mount the component
  const component = await mount(
    <TestWrapper>
      <MerchantTable onMerchantSelect={onMerchantSelect} />
    </TestWrapper>
  );

  // Verify error state is shown
  await expect(component.getByText('Failed to load merchants')).toBeVisible();
  
  // Verify retry button is shown
  await expect(component.getByRole('button', { name: 'Retry' })).toBeVisible();
});
