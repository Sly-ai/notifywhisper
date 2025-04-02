
import React from "react";
import { Bell } from "lucide-react";

const EmptyNotifications: React.FC = () => {
  return (
    <div className="text-center p-10 border border-dashed rounded-lg">
      <Bell className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-2">No notifications found</p>
      <p className="text-xs text-muted-foreground">
        Try changing your filter settings or create new notifications
      </p>
    </div>
  );
};

export default EmptyNotifications;
