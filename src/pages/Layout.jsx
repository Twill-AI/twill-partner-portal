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
  Bell,
  Shield,
  FileText,
  Settings,
  UserCheck,
  Plus
} from "lucide-react";
import { CompactDataSourceToggle } from "@/components/ui/DataSourceToggle";
import { TwillPaymentLogoFull } from "@/components/ui/TwillLogo";
import AddUserModal from "@/components/users/AddUserModal";
import AddMerchantModal from "@/components/merchants/AddMerchantModal";
import { Button } from "@/components/ui/button";
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
    title: "Users",
    url: createPageUrl("Users"),
    icon: UserCheck,
  },
  {
    title: "Commission Reports",
    url: createPageUrl("CommissionReports"),
    icon: DollarSign,
  },
  {
    title: "Insights & Alerts",
    url: createPageUrl("InsightsAlerts"),
    icon: Bell,
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

  const [showAddMenu, setShowAddMenu] = React.useState(false);
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);
  const [showAddMerchantModal, setShowAddMerchantModal] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowAddMenu(false);
      }
    };
    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddMenu]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full linear-background">
        <Sidebar className="border-r border-gray40 bg-card">
          <SidebarHeader className="border-b border-gray40 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center">
                <TwillPaymentLogoFull className="h-10 w-auto" />
              </div>
              <div className="relative">
                <Button
                  variant="iconButton"
                  aria-label="Add"
                  onClick={() => setShowAddMenu((prev) => !prev)}
                  style={{marginLeft: 12}}
                >
                  <Plus />
                </Button>
                {showAddMenu && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setShowAddMenu(false); setShowAddUserModal(true); }}>Add User</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => { setShowAddMenu(false); setShowAddMerchantModal(true); }}>Add Merchant</button>
                  </div>
                )}
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => {
                    // Disable Commission Reports, Pipeline, Risk Management, and Insights & Alerts in PayEngine mode
                    const isDisabled = isPayEngineMode && (item.title === 'Commission Reports' || item.title === 'Pipeline' || item.title === 'Risk Management' || item.title === 'Insights & Alerts');
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild={!isDisabled}
                          className={`transition-all duration-200 rounded-lg ${
                            isDisabled 
                              ? 'text-gray100 cursor-not-allowed opacity-50'
                              : `hover:bg-azure100/10 hover:text-azure100 ${
                                  location.pathname === item.url ? 'bg-azure100/10 text-azure100 shadow-sm' : 'text-black50'
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

          <SidebarFooter className="border-t border-gray40 p-4 space-y-3">
            {/* Data Source Toggle */}
            <div className="px-2">
              <CompactDataSourceToggle className="w-full justify-center" />
            </div>
            
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-azure100 to-periwinkle50 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">P</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black50 text-sm truncate">Partner User</p>
                <p className="text-xs text-gray100 truncate">Sales Team</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col linear-background">
          <header className="bg-card border-b border-gray40 px-6 py-4 md:hidden">
            <h1 className="text-xl font-semibold text-black50">{currentPageName}</h1>
          </header>
          <div className="flex-1 overflow-auto px-4 md:px-8 pb-8">
            <div className="max-w-[2000px] w-full h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
