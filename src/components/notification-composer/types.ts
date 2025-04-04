
import { 
  Notification, 
  NotificationPriority, 
  NotificationType,
  NotificationTemplate
} from "@/services/notificationService";

export interface Recipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

// Define the standard variables available in all templates
export const STANDARD_VARIABLES = [
  'borrower_name',
  'loan_id',
  'amount_due',
  'due_date'
];

export const MOCK_RECIPIENTS: Recipient[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1987654321' },
  { id: '3', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1122334455' },
  { id: '4', name: 'Bob Williams', email: 'bob@example.com', phone: '+1555666777' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1888999000' },
];
