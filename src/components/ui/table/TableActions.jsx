import React from "react";
import { cn } from "@/lib/utils";
import { 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const TableActions = ({ 
  item, 
  onView, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject,
  additionalActions = []
}) => {
  // Determine which actions to show based on item status
  const showApproveReject = item.status === 'pending' || item.status === 'in_review';
  
  return (
    <div className="flex items-center justify-end space-x-1">
      {/* View button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 text-gray100 hover:text-black50 hover:bg-gray40"
        onClick={() => onView(item)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {/* Edit button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 text-gray100 hover:text-black50 hover:bg-gray40"
        onClick={() => onEdit(item)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      {/* Dropdown for more actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-gray100 hover:text-black50 hover:bg-gray40"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-md border border-gray40">
          <DropdownMenuLabel className="text-xs font-medium text-gray100">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray40" />
          
          {/* Conditional approve/reject actions */}
          {showApproveReject && (
            <>
              <DropdownMenuItem 
                className="text-sm flex items-center text-green-600 hover:bg-gray40"
                onClick={() => onApprove(item)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-sm flex items-center text-red-600 hover:bg-gray40"
                onClick={() => onReject(item)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray40" />
            </>
          )}
          
          {/* Additional actions */}
          {additionalActions.map((action, index) => (
            <DropdownMenuItem 
              key={index}
              className={cn([
                "text-sm flex items-center hover:bg-gray40",
                action.className || ""
              ])}
              onClick={() => action.onClick(item)}
            >
              {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          ))}
          
          {/* Delete action */}
          <DropdownMenuItem 
            className="text-sm flex items-center text-red-600 hover:bg-gray40"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TableActions;
