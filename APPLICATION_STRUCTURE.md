# Twill Partner Hub - Complete Application Structure & Data Flow

## 🏗️ Application Architecture Overview

```
main.jsx
├── App.jsx
    ├── DataSourceProvider (Context)
    ├── Pages (Router)
    └── Toaster (UI)
```

### Entry Point Flow
1. **main.jsx** → Renders React app to DOM
2. **App.jsx** → Wraps everything in DataSourceProvider context
3. **DataSourceProvider** → Manages data source switching (Mock ↔ PayEngine)
4. **Pages** → Router component handling all page navigation

---

## 🔄 Data Source Management

### DataSourceContext.jsx
**Purpose**: Central context for switching between Mock and PayEngine data sources

**Key Features**:
- Persists data source choice to localStorage (`twill_data_source`)
- Provides `useDataSource()` hook for components
- Manages connection status for PayEngine
- Supports toggling between `DataSource.MOCK` and `DataSource.PAYENGINE_SANDBOX`

**Used By**: All pages that need data (Dashboard, Merchants, etc.)

---

## 📊 Data Service Layer Architecture

### 1. Unified Data Service (`dataService.js`)
**Purpose**: Single interface that routes to appropriate data source

```javascript
// Data Flow Pattern:
Component → dataService → (mockDataService | payEngineDataService) → API/Mock Data
```

**Key Methods**:
- `getMerchants(options)` - Fetch merchant list
- `getMerchant(merchantId)` - Fetch single merchant
- `createMerchant(merchantData)` - Create new merchant
- `updateMerchant(merchantId, updates)` - Update merchant
- `getCommissions(options)` - Fetch commission data
- `getCurrentUser()` - Get current user info
- `getConnectionStatus()` - Check API connectivity

### 2. Mock Data Service (`mockDataService.js`)
**Purpose**: Provides realistic mock data for development/testing

**Data Structure**:
- **Merchants**: 5 sample merchants with complete business data
- **Commissions**: Sample commission records
- **User**: Mock user profile

**Features**:
- Simulates API delays (500ms)
- Supports sorting, filtering, pagination
- Consistent data format matching PayEngine structure

### 3. PayEngine Data Service (`payEngineDataService.js`)
**Purpose**: Real PayEngine API integration

**API Configuration**:
- **Base URL**: `https://console.payengine.dev/api`
- **Authentication**: Basic Auth with API key
- **Timeout**: 30 seconds
- **Environment Variables**: 
  - `VITE_PAYENGINE_BASE_URL`
  - `VITE_PAYENGINE_API_KEY`

**Key Endpoints**:
- `GET /merchant?size=100` - Fetch merchants
- `GET /fee-schedules` - Fetch fee schedules
- `GET /merchant/{id}` - Single merchant
- `POST /merchant` - Create merchant
- `PUT /merchant/{id}` - Update merchant

**Data Transformation**:
- Converts PayEngine format to standardized internal format
- Maps fee schedules to merchants
- Handles status message generation for `in_review` merchants

---

## 🖥️ Page Components & Data Flow

### 1. Dashboard (`Dashboard.jsx`)
**Data Dependencies**:
```javascript
// Data Flow:
Dashboard → dataService.getMerchants() → Array of merchants
Dashboard → dataService.getCommissions() → Array of commissions
```

**Data Usage**:
- Calculates total volume: `merchants.reduce((sum, m) => sum + m.monthly_volume)`
- Calculates total commission: `merchants.reduce((sum, m) => sum + m.monthly_commission)`
- Counts active merchants: `merchants.filter(m => m.status === 'active')`
- Counts risk merchants: `merchants.filter(m => m.risk_level === 'high|critical')`
- Groups by business type for performance metrics

**Components Used**:
- `MetricCard` - KPI display cards
- `ProcessingVolumeChart` - Volume trend chart
- `TopMerchants` - Top performing merchants list

### 2. Merchants (`Merchants.jsx`)
**Data Dependencies**:
```javascript
// Data Flow:
Merchants → dataService.getMerchants() → MerchantTable component
```

**Data Transformation**:
```javascript
const transformedData = response.data.map(merchant => ({
  ...merchant,
  updated_at: merchant.updated_at || merchant.created_date,
  name: merchant.business_name || merchant.name,
  status_message: merchant.status === 'in_review' ? getStatusMessage(merchant) : null
}));
```

**Components Used**:
- `MerchantTable` - Main data table with filtering/sorting
- `MerchantOnboardingForm` - New merchant creation form

### 3. MerchantTable (`MerchantTable.jsx`)
**Purpose**: Main data display component with advanced features

**Data Processing**:
- Tab-based filtering (All, Active, Editing, In Review, To Do)
- Status-based merchant counting
- Real-time data refresh
- Sorting and pagination support

**UI Features**:
- Authentic Twill AI design system
- Status badges with color coding
- Risk level indicators
- Action buttons for merchant management

---

## 🔌 API Integration Details

### PayEngine Integration
**Authentication Flow**:
1. API key stored in environment variable
2. Basic Auth header: `Authorization: Basic ${btoa(apiKey + ':')}`
3. Request timeout: 30 seconds
4. Error handling for network/API failures

**Data Fetching Pattern** (matches Twill AI exactly):
```javascript
// Dual API calls for complete merchant data
const [merchantsResponse, feeSchedulesResponse] = await Promise.all([
  client.request('GET', '/merchant', { size: 100 }),
  client.request('GET', '/fee-schedules')
]);
```

**Data Transformation Pipeline**:
1. Raw PayEngine data → `transformMerchantData()`
2. Fee schedule mapping → Enhanced merchant objects
3. Status message generation → UI-ready data
4. Standardized format → Component consumption

### Mock Data Integration
**Simulation Features**:
- 500ms artificial delay to simulate network latency
- Realistic business data (names, addresses, financial metrics)
- Consistent data structure matching PayEngine format
- Support for all CRUD operations

---

## 🎨 UI Components & Design System

### Authentic Twill AI Design
**Color Palette**:
- Primary: `black50` (#222E48), `black100` (#161E2D)
- Secondary: `azure100` (#387094), `periwinkle50` (#7994DD)
- Background: `gray40` (#F3F6F8)
- Status Colors: `error` (#FF2753), `green` (#39E696), `yellow75` (#D1A400)

**Key UI Components**:
- `Table` components with Twill AI styling
- `Badge` components for status/risk indicators
- `Button` components with consistent theming
- `Card` components for metric display

---

## 🔄 State Management Flow

### Component State Pattern
```javascript
// Standard pattern used across components:
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const { dataSource } = useDataSource();

useEffect(() => {
  loadData();
}, [dataSource]); // Reload when data source changes
```

### Data Source Switching
1. User toggles data source in UI
2. `DataSourceContext` updates state
3. localStorage persists choice
4. All components re-fetch data from new source
5. UI updates with new data

---

## 📁 File Structure & Dependencies

```
src/
├── main.jsx                          # App entry point
├── App.jsx                           # Root component
├── contexts/
│   └── DataSourceContext.jsx         # Data source management
├── services/
│   ├── dataService.js                # Unified data interface
│   ├── mockDataService.js            # Mock data provider
│   └── payEngineDataService.js       # PayEngine API client
├── pages/
│   ├── index.jsx                     # Router configuration
│   ├── Dashboard.jsx                 # Dashboard page
│   ├── Merchants.jsx                 # Merchants page
│   ├── Layout.jsx                    # Page layout wrapper
│   └── [other pages...]
├── components/
│   ├── merchants/
│   │   └── MerchantTable.jsx         # Main merchant data table
│   ├── dashboard/
│   │   ├── MetricCard.jsx            # KPI cards
│   │   ├── ProcessingVolumeChart.jsx # Volume charts
│   │   └── TopMerchants.jsx          # Top merchants list
│   └── ui/                           # Reusable UI components
└── api/
    └── entities.js                   # Legacy API layer (being phased out)
```

---

## 🔍 Data Flow Tracing Examples

### Example 1: Dashboard Loading
```
1. Dashboard.jsx renders
2. useEffect() triggers loadData()
3. dataService.getMerchants() called
4. dataService checks localStorage for data source
5. Routes to mockDataService OR payEngineDataService
6. Mock: Returns static data with 500ms delay
   PayEngine: Makes HTTP request to /merchant endpoint
7. Data transformed to standard format
8. Component state updated: setMerchants(data)
9. UI re-renders with new data
10. Metrics calculated and displayed
```

### Example 2: Data Source Toggle
```
1. User clicks data source toggle
2. DataSourceContext.toggleDataSource() called
3. New source saved to localStorage
4. Context state updated
5. All subscribed components receive new dataSource value
6. useEffect([dataSource]) triggers in each component
7. Components re-fetch data from new source
8. UI updates with data from new source
```

### Example 3: Merchant Table Filtering
```
1. User clicks "Active" tab in MerchantTable
2. setActiveTab('active') called
3. filteredMerchants computed based on status
4. Table re-renders showing only active merchants
5. Tab counts updated based on filtered data
```

---

## 🧪 Testing Strategy

### Current Testing Approach
- **Playwright MCP**: Used for UI and integration testing
- **Manual Testing**: Data source switching verification
- **Console Logging**: PayEngine API connection validation

### Test Coverage Areas
1. **Data Source Switching**: Mock ↔ PayEngine toggle
2. **API Integration**: PayEngine connectivity and data fetching
3. **UI Components**: Table filtering, sorting, pagination
4. **Data Transformation**: PayEngine → Internal format conversion
5. **Error Handling**: Network failures, API errors

---

## 🚀 Production Readiness Checklist

### ✅ Completed
- [x] Unified data service architecture
- [x] PayEngine API integration
- [x] Authentic Twill AI design system
- [x] Data source switching functionality
- [x] Error handling and loading states
- [x] Responsive UI components

### 🔄 In Progress
- [ ] Comprehensive Playwright test suite
- [ ] Performance optimization
- [ ] Error boundary implementation
- [ ] Accessibility improvements

### 📋 Environment Variables Required
```bash
VITE_PAYENGINE_BASE_URL=https://console.payengine.dev
VITE_PAYENGINE_API_KEY=your_actual_api_key_here
```

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests (when implemented)
npm run test

# Preview production build
npm run preview
```

---

This documentation provides complete visibility into the Twill Partner Hub application structure, data flows, and all component connections. Every data point, import, and API call is mapped and traceable through this architecture.
