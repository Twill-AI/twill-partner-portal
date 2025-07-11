import React from "react";
import { cn } from "@/lib/utils";
import { RefreshCw, Filter, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeaderActions = ({ onRefresh }) => {
  return (
    <div className="flex items-center space-x-0">
      <button 
        className="transition p-2 px-3 font-semibold focus:outline-none flex items-center space-x-1 whitespace-nowrap rounded-lg clickable bg-white hover:bg-gray40 text-black50 stroke-black50 text-[14px] shadow-sm aspect-square"
        onClick={() => {}}
      >
        <FileText size={14} className="stroke-gray100" />
      </button>
      <button 
        className="transition p-2 px-3 font-semibold focus:outline-none flex items-center space-x-1 whitespace-nowrap rounded-lg clickable bg-white hover:bg-gray40 text-black50 stroke-black50 text-[14px] shadow-sm aspect-square"
        onClick={() => {}}
      >
        <Filter size={14} className="stroke-gray100" />
      </button>
      <button 
        className="transition p-2 px-3 font-semibold focus:outline-none flex items-center space-x-1 whitespace-nowrap rounded-lg clickable bg-white hover:bg-gray40 text-black50 stroke-black50 text-[14px] shadow-sm aspect-square"
        onClick={onRefresh}
      >
        <RefreshCw size={14} className="stroke-gray100" />
      </button>
    </div>
  );
};

export const FilterTabs = ({ tabs, activeTab, onTabChange }) => {
  if (!tabs || !tabs.length) return null;

  return (
    <div className="flex items-center space-x-2 pl-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn([
            "clickable rounded-lg p-2 px-4 text-xs font-semibold text-black50 transition-colors whitespace-nowrap tracking-wider uppercase shadow-sm",
            activeTab === tab.id ? "bg-gray60" : "bg-white hover:bg-gray40"
          ])}
        >
          {tab.label} {tab.count > 0 && `(${tab.count})`}
        </button>
      ))}
    </div>
  );
};

export const TableHeader = ({ title, tabs, activeTab, onTabChange, onRefresh, children }) => {
  const className = cn([
    "p-4 bg-gradient-to-b from-white/95 to-azure100/5 rounded-t-xl shadow-sm border-b border-gray80/30"
  ]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-shrink">
          {title && (
            <div className="text-[12px] font-medium" data-testid="table_title">
              {title}
            </div>
          )}
          <FilterTabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={onTabChange} 
          />
        </div>
        <div className="flex items-center space-x-2">
          {children && (
            <div className="w-64">{children}</div>
          )}
          <HeaderActions onRefresh={onRefresh} />
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
