import React from "react";
import { cn } from "@/lib/utils";

export function TableHeader({ 
  name, 
  loading = false, 
  data = [], 
  children, 
  className = "",
  ...props 
}) {
  const isEmpty = (value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'string') return value.trim() === '';
    return value == null;
  };

  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-shrink">
          <div className="text-[12px] font-medium" data-testid="table_title">
            {(isEmpty(name) && loading && isEmpty(data))
              ? <div className="h-3 rounded bg-gray-200 animated-pulse w-16"/>
              : name
            }
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default TableHeader;
