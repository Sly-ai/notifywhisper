
import React from "react";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyNotificationsProps {
  title?: string;
  description?: string;
  onCompose?: () => void;
}

const EmptyNotifications: React.FC<EmptyNotificationsProps> = ({ 
  title = "No notifications found", 
  description = "Try changing your filter settings or create new notifications", 
  onCompose 
}) => {
  return (
    <div className="text-center p-10 border border-dashed rounded-lg">
      <Bell className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-2">{title}</p>
      <p className="text-xs text-muted-foreground mb-4">
        {description}
      </p>
      
      {onCompose ? (
        <Button variant="outline" onClick={onCompose} className="mt-2">
          <MessageSquare className="mr-2 h-4 w-4" />
          Compose New Message
        </Button>
      ) : (
        <Button variant="outline" asChild className="mt-2">
          <Link to="/notifications" onClick={() => document.querySelector('[data-value="composer"]')?.dispatchEvent(
            new MouseEvent('click', { bubbles: true })
          )}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Compose New Message
          </Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyNotifications;
