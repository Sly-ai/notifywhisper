
import { useState } from 'react';
import { 
  Notification, 
  NotificationStatus,
  getNotifications,
  getTemplate,
  sendEmailNotification,
  sendSmsNotification 
} from "@/services/notificationService";
import { toast } from "sonner";

// Standard variables for all notifications
const STANDARD_VARIABLES = ['borrower_name', 'loan_id', 'amount_due', 'due_date'];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => getNotifications());
  const [statusFilter, setStatusFilter] = useState<NotificationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "email" | "sms">("all");

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

  const getAvailableVariables = (notification: Notification): string[] => {
    const template = getTemplate(notification.templateId);
    return [...STANDARD_VARIABLES, ...(template?.variables || [])].filter(
      (value, index, self) => self.indexOf(value) === index
    );
  };

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

  const handleSaveEdit = (updatedNotification: Notification) => {
    const updatedNotifications = notifications.map(n => 
      n.id === updatedNotification.id ? updatedNotification : n
    );
    setNotifications(updatedNotifications);
  };

  return {
    notifications,
    filteredNotifications,
    statusFilter,
    typeFilter,
    setStatusFilter,
    setTypeFilter,
    getNotificationType,
    getAvailableVariables,
    handleSendNow,
    handleDeleteNotification,
    handleSaveEdit
  };
};
