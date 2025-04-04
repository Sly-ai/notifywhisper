
import React, { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, Mail, MessageSquare } from "lucide-react";
import NotificationFilters from "./NotificationFilters";
import { getTemplate, NotificationType } from "@/services/notificationService";
import EmptyNotifications from "./EmptyNotifications";

const NotificationHistory: React.FC = () => {
  const { 
    filteredNotifications, 
    statusFilter, 
    typeFilter,
    setStatusFilter, 
    setTypeFilter,
    getNotificationType
  } = useNotifications();

  // Filter to show only sent notifications
  const sentNotifications = filteredNotifications.filter(
    notification => notification.status === "sent" && notification.sentAt
  );

  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  const formatRecipient = (recipient: string, type: NotificationType) => {
    if (type === "email") {
      return recipient;
    }
    // Format phone numbers like (123) 456-7890
    return recipient.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  const groupNotificationsByDate = () => {
    const groups: Record<string, typeof sentNotifications> = {};
    
    sentNotifications.forEach(notification => {
      if (!notification.sentAt) return;
      
      const dateKey = format(notification.sentAt, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });

    return Object.entries(groups)
      .map(([dateKey, notifications]) => ({
        date: new Date(dateKey),
        notifications: notifications.sort((a, b) => {
          return (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0);
        })
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold">Sent Notifications</h2>
        <NotificationFilters
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </div>

      {sentNotifications.length === 0 ? (
        <EmptyNotifications 
          title="No sent notifications"
          description="You haven't sent any notifications yet. Compose a notification to get started."
        />
      ) : (
        <div className="space-y-6">
          {groupedNotifications.map((group) => (
            <div key={format(group.date, "yyyy-MM-dd")} className="space-y-4">
              <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {format(group.date, "EEEE, MMMM d, yyyy")}
                </h3>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.notifications.map((notification) => {
                      const template = getTemplate(notification.templateId);
                      const notificationType = getNotificationType(notification);
                      
                      return (
                        <TableRow key={notification.id}>
                          <TableCell className="font-medium">
                            {notification.sentAt && formatTime(notification.sentAt)}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              {notificationType === "email" ? (
                                <Mail className="h-4 w-4 text-blue-500" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-green-500" />
                              )}
                              {notificationType.toUpperCase()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {formatRecipient(notification.recipient, notificationType)}
                          </TableCell>
                          <TableCell>{template?.name || "Custom Message"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                notification.priority === "high" 
                                  ? "destructive" 
                                  : notification.priority === "medium" 
                                    ? "default" 
                                    : "secondary"
                              }
                            >
                              {notification.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium">Content</h4>
                                    {notificationType === "email" && template?.subject && (
                                      <p className="text-sm font-semibold mt-1">Subject: {template.subject}</p>
                                    )}
                                    <p className="text-sm mt-1">
                                      {template?.body || "No content available"}
                                    </p>
                                  </div>
                                  
                                  {Object.entries(notification.variables).length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium">Variables</h4>
                                      <div className="grid grid-cols-2 gap-2 mt-1">
                                        {Object.entries(notification.variables).map(([key, value]) => (
                                          <div key={key} className="text-sm">
                                            <span className="font-medium">{key}:</span> {value}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationHistory;
