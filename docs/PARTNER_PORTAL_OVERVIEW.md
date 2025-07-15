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
## 3b. Detailed Tasks Identified (Planning Call – July 11 2025)
Below is the granular work-breakdown captured during the call between Nader A. and Michael W.; these items expand on the high-level gaps listed above and directly feed the new EPIC board.
### Backend
- **Master-Tenant Merchant Table**
  - Create `tenants`, `merchants`, and `merchant_external_ids` tables.
  - Expose CRUD API and secure multi-tenant filtering.
- **Fee-Schedule Storage & Sync**
  - Persist custom fee templates locally when PayEngine cannot store them.
  - If PayEngine adds a `create fee-schedule` API in future, auto-sync.
- **Static Knowledge Tables**
  - Equipment, payment gateways, pricing templates – seeded from Google Sheets or CSV; editable by admins.
- **Status-Message Field**
  - Persist `status_message` from PayEngine `GET /merchant` response for each merchant.
- **Scheduled Data Sync Job**
  - 10-minute cron pulling fresh merchant/transaction data; uses cache-busting param.
- **Alert Workflow Stub**
  - Write table + API to queue "action needed" items (e.g., upload docs) for UI & Slack notifications.
### Frontend
- **Pricing Page (Onboarding)**
  - Pull fee types from knowledge table or PayEngine.
  - Support free-form entry when template missing.
- **Insights & Alerts Page**
  - List outstanding `action_needed` items with ability to upload docs / mark done.
- **Invite/Access Management**
  - Allow partner admins to invite sub-users; connect to auth provider.
- **Communication Stub**
  - MVP: send questions to a dedicated Slack channel; later replaced by in-app chat/LLM agent.
- **Surcharge Support**
  - Capture "credit-card surcharge" settings; show in merchant table and onboarding.
### DevOps / Process
- **Git-based Collaboration Flow**
  - Push repo to GitHub; team clones via Windsurf/Cursor; feature branches & PRs.
- **Playwright E2E Templates**
  - Record flows for onboarding, fee-template CRUD, and alert resolution.
These points have been converted into Jira tickets under the new *Partner Portal Enhancements* EPIC (see `EPIC_PARTNER_PORTAL_ENHANCEMENTS.md`).
---
## 4. Key Decisions & Open Questions
- **Backend-first for all sensitive logic**: All API keys, data fetching, and business logic must go through our backend.
- **Tenant/partner model**: Each partner sees only their merchants; master tenant can see all.
- **Caching vs. direct proxy**: For V0, direct proxying is OK (even if slow); for V1+, implement caching for performance.
- **Extensibility**: Design so new data sources (e.g., Lucra) can be added quickly.
- **Feature prioritization**: Focus on core flows (merchant table, onboarding, commission report) for V1; advanced features (document analysis, proposal gen, loan tracking) can follow.