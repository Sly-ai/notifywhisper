
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationCard from "./notification/NotificationCard";
import NotificationFilters from "./notification/NotificationFilters";
import EmptyNotifications from "./notification/EmptyNotifications";
import EditNotificationModal from "./EditNotificationModal";
import { Notification } from "@/services/notificationService";

const NotificationQueue: React.FC = () => {
  const { 
    filteredNotifications,
    statusFilter,
    typeFilter,
    setStatusFilter,
    setTypeFilter,
    handleSendNow,
    handleDeleteNotification,
    handleSaveEdit
  } = useNotifications();
  
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
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
        
        <NotificationFilters 
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </div>

      <div className="space-y-6">
        {filteredNotifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          filteredNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onSendNow={handleSendNow}
              onEdit={handleEdit}
              onDelete={handleDeleteNotification}
            />
          ))
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
