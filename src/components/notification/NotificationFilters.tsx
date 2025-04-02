
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { NotificationStatus } from "@/services/notificationService";

interface NotificationFiltersProps {
  statusFilter: NotificationStatus | "all";
  typeFilter: "all" | "email" | "sms";
  onStatusFilterChange: (value: NotificationStatus | "all") => void;
  onTypeFilterChange: (value: "all" | "email" | "sms") => void;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Status:</span>
        <Select 
          value={statusFilter} 
          onValueChange={(value) => onStatusFilterChange(value as NotificationStatus | "all")}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Type:</span>
        <Select 
          value={typeFilter} 
          onValueChange={(value) => onTypeFilterChange(value as "all" | "email" | "sms")}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default NotificationFilters;
