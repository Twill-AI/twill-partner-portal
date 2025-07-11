
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useDataSource, DataSource } from "@/contexts/DataSourceContext";
import { 
  LayoutDashboard, 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp,
  Shield,
  FileText,
  Settings
} from "lucide-react";
import { CompactDataSourceToggle } from "@/components/ui/DataSourceToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Merchants",
    url: createPageUrl("Merchants"),
    icon: Building2,
  },
  {
    title: "Commission Reports",
    url: createPageUrl("CommissionReports"),
    icon: DollarSign,
  },
  {
    title: "Pipeline",
    url: createPageUrl("Pipeline"),
    icon: Users,
  },
  {
    title: "Risk Management",
    url: createPageUrl("RiskManagement"),
    icon: Shield,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { dataSource } = useDataSource();
  const isPayEngineMode = dataSource === DataSource.PAYENGINE_SANDBOX;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray40">
        <Sidebar className="border-r border-gray40 bg-white">
          <SidebarHeader className="border-b border-gray40 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/twill-logo.svg" alt="Twill AI" className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-bold text-black50 text-lg">Twill Partner Hub</h2>
                <p className="text-xs text-gray100 font-medium">Partner Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => {
                    // Disable Pipeline and Risk Management in PayEngine mode
                    const isDisabled = isPayEngineMode && (item.title === 'Pipeline' || item.title === 'Risk Management');
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild={!isDisabled}
                          className={`transition-all duration-200 rounded-lg ${
                            isDisabled 
                              ? 'text-slate-400 cursor-not-allowed opacity-50'
                              : `hover:bg-blue-50 hover:text-blue-700 ${
                                  location.pathname === item.url ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600'
                                }`
                          }`}
                        >
                          {isDisabled ? (
                            <div className="flex items-center gap-3 px-3 py-2.5 font-medium">
                              <item.icon className="w-5 h-5" />
                              <span>{item.title}</span>
                            </div>
                          ) : (
                            <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5 font-medium">
                              <item.icon className="w-5 h-5" />
                              <span>{item.title}</span>
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-100 p-4 space-y-3">
            {/* Data Source Toggle */}
            <div className="px-2">
              <CompactDataSourceToggle className="w-full justify-center" />
            </div>
            
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">Partner User</p>
                <p className="text-xs text-slate-500 truncate">Sales Team</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">Twill Portal</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-slate-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
