
import { Notification, getNotifications } from "@/services/notificationService";

/**
 * Updates a notification in the local state
 * This is a client-side mock since we can't modify the notificationService.ts
 */
export const updateNotification = (updatedNotification: Notification): Notification => {
  // In a real application, this would make an API call to update the notification
  return updatedNotification;
}
