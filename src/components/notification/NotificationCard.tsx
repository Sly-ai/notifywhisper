
import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Notification,
  NotificationStatus,
  NotificationPriority,
  getTemplate,
} from "@/services/notificationService";
import { CheckCircle, Clock, XCircle, Edit, MoreHorizontal, Send, Trash2 } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
  onSendNow: (notification: Notification) => void;
  onEdit: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onSendNow,
  onEdit,
  onDelete
}) => {
  const template = getTemplate(notification.templateId);
  const notificationType = template?.type || "email";

  const getStatusColor = (status: NotificationStatus): string => {
    switch (status) {
      case "sent":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      case "draft":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: NotificationPriority): string => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatRecipient = (recipient: string, type: "email" | "sms") => {
    if (type === "email") {
      return recipient;
    }
    return recipient.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="bg-secondary/30 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`${getStatusColor(notification.status)} p-2 rounded-full text-white`}>
              {notification.status === "sent" && <CheckCircle className="h-4 w-4" />}
              {notification.status === "scheduled" && <Clock className="h-4 w-4" />}
              {notification.status === "failed" && <XCircle className="h-4 w-4" />}
              {notification.status === "draft" && <Edit className="h-4 w-4" />}
            </div>
            <div>
              <CardTitle className="text-base">{template?.name || "Unknown Template"}</CardTitle>
              <CardDescription>
                {notificationType === "email" ? "Email" : "SMS"} • {notification.triggerType === "automatic" ? "Automatic" : "Manual"}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${getPriorityColor(notification.priority)} text-white`}>
              {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
            </Badge>
            
            {notification.status !== "sent" && (
              <Button 
                variant="outline"
                size="sm"
                className="gap-1 flex items-center"
                onClick={() => onSendNow(notification)}
              >
                <Send className="h-3 w-3" />
                <span>Send</span>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {notification.status !== "sent" && (
                  <DropdownMenuItem onClick={() => onSendNow(notification)}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Now
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onEdit(notification)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(notification.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Recipient</p>
            <p className="text-sm text-muted-foreground">
              {formatRecipient(notification.recipient, notificationType)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">
              {notification.status === "sent" ? "Sent At" : "Scheduled For"}
            </p>
            <p className="text-sm text-muted-foreground">
              {notification.sentAt 
                ? format(notification.sentAt, "PPP p") 
                : notification.scheduledAt 
                  ? format(notification.scheduledAt, "PPP p")
                  : "Not scheduled"}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Content Preview</p>
          <p className="text-sm text-muted-foreground">
            {notificationType === "email" && template?.subject && (
              <span className="font-medium block mb-1">Subject: {template.subject}</span>
            )}
            {template?.body
              ? template.body.substring(0, 100) + (template.body.length > 100 ? "..." : "")
              : "No content available"}
          </p>
        </div>
        
        {notification.status !== "sent" && (
          <div className="mt-4 pt-4 border-t flex justify-end">
            <Button 
              size="sm" 
              onClick={() => onSendNow(notification)}
              className="button-animation"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
