import React, { useState } from "react";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
  getNotifications,
  getTemplate,
  sendEmailNotification,
  sendSmsNotification 
} from "@/services/notificationService";
import { Bell, CheckCircle, Clock, XCircle, MoreHorizontal, Send, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import EditNotificationModal from "./EditNotificationModal";

const NotificationQueue: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => getNotifications());
  const [statusFilter, setStatusFilter] = useState<NotificationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "email" | "sms">("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const getNotificationType = (notification: Notification): "email" | "sms" => {
    const template = getTemplate(notification.templateId);
    return template?.type || "email";
  };

  const filteredNotifications = notifications.filter(notification => {
    const type = getNotificationType(notification);
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter;
    const matchesType = typeFilter === "all" || type === typeFilter;
    return matchesStatus && matchesType;
  });

  const handleSendNow = async (notification: Notification) => {
    const type = getNotificationType(notification);
    
    toast.promise(
      type === "email" 
        ? sendEmailNotification(notification) 
        : sendSmsNotification(notification),
      {
        loading: `Sending ${type}...`,
        success: () => {
          const updatedNotifications = notifications.map(n => 
            n.id === notification.id 
              ? { ...n, status: "sent" as NotificationStatus, sentAt: new Date() } 
              : n
          );
          setNotifications(updatedNotifications);
          return `${type.charAt(0).toUpperCase() + type.slice(1)} sent successfully`;
        },
        error: `Failed to send ${type}`
      }
    );
  };

  const handleDeleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    toast.success("Notification removed from queue");
  };

  const formatRecipient = (recipient: string, type: "email" | "sms") => {
    if (type === "email") {
      return recipient;
    }
    return recipient.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedNotification: Notification) => {
    const updatedNotifications = notifications.map(n => 
      n.id === updatedNotification.id ? updatedNotification : n
    );
    setNotifications(updatedNotifications);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-light">Notification Queue</h1>
          <p className="text-muted-foreground">
            Manage scheduled and pending notifications.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Status:</span>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as NotificationStatus | "all")}
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
              onValueChange={(value) => setTypeFilter(value as "all" | "email" | "sms")}
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
      </div>

      <div className="space-y-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center p-10 border border-dashed rounded-lg">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No notifications found</p>
            <p className="text-xs text-muted-foreground">
              Try changing your filter settings or create new notifications
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => {
            const template = getTemplate(notification.templateId);
            const notificationType = template?.type || "email";
            return (
              <Card key={notification.id} className="overflow-hidden card-hover">
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
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {notification.status !== "sent" && (
                            <DropdownMenuItem onClick={() => handleSendNow(notification)}>
                              <Send className="mr-2 h-4 w-4" />
                              Send Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleEdit(notification)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteNotification(notification.id)}
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
                        onClick={() => handleSendNow(notification)}
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
          })
        )}
      </div>
      
      <EditNotificationModal
        notification={selectedNotification}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default NotificationQueue;
