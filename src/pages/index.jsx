import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Merchants from "./Merchants";

import Users from "./Users";

import CommissionReports from "./CommissionReports";

import Pipeline from "./Pipeline";

import RiskManagement from "./RiskManagement";

// import InsightsAlerts from "./InsightsAlerts";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Dashboard: Dashboard,
    Merchants: Merchants,
    Users: Users,
    CommissionReports: CommissionReports,
    Pipeline: Pipeline,
    RiskManagement: RiskManagement
};

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    try {
        return (
            <Layout currentPageName={currentPage}>
                <Routes>            
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Merchants" element={<Merchants />} />
                    <Route path="/Users" element={<Users />} />
                    <Route path="/CommissionReports" element={<CommissionReports />} />
                    <Route path="/Pipeline" element={<Pipeline />} />
                    <Route path="/RiskManagement" element={<RiskManagement />} />
                </Routes>
            </Layout>
        );
    } catch (error) {
        return (
            <div style={{ color: 'red', padding: 32 }}>
                <h2>Runtime error in PagesContent:</h2>
                <pre>{error.message}</pre>
                <pre>{error.stack}</pre>
            </div>
        );
    }
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}