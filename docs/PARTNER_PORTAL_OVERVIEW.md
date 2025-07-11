# Twill Partner Portal: Project Overview & Status

## 1. What Are We Trying to Do? (Vision & Goals)

We are building a **Partner Portal** for the Twill payment/fintech ecosystem. The goal is to provide partners (ISOs, agents, aggregators) with a web-based dashboard to:

- **View and manage merchants**: See a searchable, filterable, sortable table of merchants, with statuses, risk, volume, and more.
- **Onboard new merchants**: Add merchants via a multi-step onboarding form, with support for draft, review, and submission flows.
- **View commission reports**: See commission earnings, trends, and breakdowns by merchant and business type.
- **Track pipeline and risk**: Visualize merchant pipeline stages, conversion rates, and risk alerts.
- **Access insights and alerts**: (Planned) KPIs, trends, and alerting for key business metrics.
- **Integrate with multiple data sources**: Not just PayEngine, but potentially others (e.g., Lucra, POS systems).
- **Support multi-tenancy and hierarchy**: Each partner/tenant sees only their merchants, with possible hierarchy (e.g., master tenant can see all).

**Key Principles:**
- **No vendor lock-in**: We are moving away from “Base44”/no-code platforms that restrict customization and data access.
- **Custom backend**: All sensitive operations (auth, data fetching, API keys) go through our backend for security and flexibility.
- **Extensible architecture**: Easy to add new data sources, features, and customizations as partners’ needs evolve.

---

## 2. What’s Already Done? (Current State)

### **Frontend**

- **Modern React app** with modular structure and clear separation of concerns.
- **Sidebar navigation** with Dashboard, Merchants, Commission Reports, Pipeline, Risk Management, and (planned) Insights & Alerts.
- **Merchant Table**: 
  - Search, filter, sort, paginate.
  - Status, risk, business type, volume, transactions, metrics, and actions.
  - Tabbed by status (active, pending, in review, rejected).
- **Merchant Onboarding Form**:
  - Multi-step (business info, legal, processing, owners, banking, pricing, documents, review).
  - Save draft, send to merchant, or submit to Twill.
  - Validates required fields and document uploads.
- **Commission Reports**:
  - KPIs: total commission, average rate, active merchants.
  - Charts: monthly trends, commission by business type.
  - Top earning merchants table.
  - (Planned) Fee schedule integration.
- **Dashboard**:
  - KPIs: total processing volume, total commission, active merchants, risk alerts.
  - Charts: processing volume, top merchants.
  - Business type performance, pipeline status, recent activity.
- **Pipeline**:
  - Pipeline stages (lead, application, underwriting, action needed, approved, active, etc.).
  - KPIs: total pipeline value, conversion rate, volume realization.
  - Tabs for overview, volume analysis, follow-up required.
- **Risk Management**: (Page exists, details not included here.)
- **Data source toggle**: Switch between mock data and PayEngine sandbox for development/demo.
- **Branding/Styling**: Custom Twill branding, responsive design, modern UI components.

### **Backend/Data Layer**

- **Unified data service** (`dataService.js`):
  - Abstracts between mock data and PayEngine integration.
  - All data fetching, creation, and updates go through this service.
- **Mock data service**:
  - Realistic mock data for merchants, commissions, fee schedules, and user.
  - Used for development, demo, and sandbox mode.
- **PayEngine integration**:
  - Fetches merchants, commissions, and fee schedules from PayEngine API.
  - Transforms PayEngine data to the app’s standard format.
  - Handles API key securely (not exposed to frontend).
  - Caches fee schedules for performance.
- **Extensible for new sources**: Architecture allows plugging in new data sources (e.g., Lucra) with minimal changes.

### **DevOps/Infra**

- **Standalone repo**: Can be merged with main UI repo if desired.
- **Sandbox/mock mode**: For rapid prototyping and design iteration.

---

## 3. What Needs to Be Done? (Gaps & Next Steps)

### **Backend**
- **Complete authentication/authorization**: Finalize secure login, tenant isolation, and access control.
- **Backend caching/persistence**: Implement caching or periodic sync for merchant data to improve performance (avoid slow direct API calls).
- **Commission & fee schedule logic**: Define and implement backend tables/APIs for commissions, fee schedules, and other business logic not supported by PayEngine.
- **Support for multiple data sources**: Design backend to ingest and serve data from Lucra, POS systems, etc., not just PayEngine.

### **Frontend**
- **Insights & Alerts page**: The page is referenced in navigation but not yet implemented.
- **Document upload & analysis**: Implement flow for uploading merchant statements, extracting data, and generating proposals (PDFs).
- **Role-based views**: Differentiate between partner users and merchant users (e.g., via special links with limited permissions).
- **Dynamic feature toggling**: Hide/show features based on backend capabilities and partner needs.
- **Enhanced error handling and feedback**: For all user actions.
- **UI/UX polish**: More design work, especially for new features and mobile responsiveness.

### **Product/Design**
- **Finalize feature list for V1**: Agree on what’s in/out for the first release (avoid scope creep).
- **Define data models**: Especially for commissions, fee schedules, and merchant hierarchy.
- **Clarify user journeys**: For both partner admins and merchants (including onboarding, document upload, etc.).
- **Decide on repo structure**: Whether to keep this as a standalone repo or merge with main UI.

### **Other**
- **Testing & QA**: Automated and manual testing, especially for onboarding and data flows.
- **Documentation**: For both devs and end-users.
- **Deployment pipeline**: For staging and production environments.

---

## 4. Key Decisions & Open Questions

- **Backend-first for all sensitive logic**: All API keys, data fetching, and business logic must go through our backend.
- **Tenant/partner model**: Each partner sees only their merchants; master tenant can see all.
- **Caching vs. direct proxy**: For V0, direct proxying is OK (even if slow); for V1+, implement caching for performance.
- **Extensibility**: Design so new data sources (e.g., Lucra) can be added quickly.
- **Feature prioritization**: Focus on core flows (merchant table, onboarding, commission report) for V1; advanced features (document analysis, proposal gen, loan tracking) can follow.

---

## 5. Summary Table

| Area                | Done / In Progress                | To Do / Gaps                          |
|---------------------|-----------------------------------|---------------------------------------|
| **Frontend**        | Merchant table, onboarding, commission, dashboard, pipeline, data source toggle, branding | Insights/alerts, document upload/analysis, proposal gen, role-based views, UI polish, error handling |
| **Backend**         | PayEngine proxy, mock data, data service abstraction | Full auth, caching, commission/fee logic, multi-source support, error handling      |
| **Product/Design**  | Initial flows, sandbox, some mock data | Finalize V1 features, data models, user journeys, repo structure decision           |
| **Infra/DevOps**    | Standalone repo, sandbox mode     | Deployment pipeline, testing, docs     |

---

## 6. How to Present to the Team

- **Context**: We started with a no-code platform (Base44), but hit limits on customization, security, and data access. We’re now building a custom, extensible portal.
- **Current State**: We have a working UI and backend integration, but much is still mock or in early stages.
- **What’s Next**: Focus on core flows, backend robustness, and extensibility. Avoid scope creep for V1.
- **How to Help**: Review the repo, give feedback on flows, help define data models, and pick up tasks as we break them down.

---

*This document is generated from a deep review of the codebase and current implementation. Please reach out if you want this as a slide deck, a README, or a Confluence page, or if you want to break down the next steps into specific tickets!* 