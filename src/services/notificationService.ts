export type NotificationType = 'email' | 'sms';
export type NotificationPriority = 'low' | 'medium' | 'high';
export type NotificationStatus = 'scheduled' | 'sent' | 'failed' | 'draft';
export type TriggerType = 'manual' | 'automatic';

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject?: string;
  body: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  templateId: string;
  recipient: string;
  variables: Record<string, string>;
  priority: NotificationPriority;
  status: NotificationStatus;
  triggerType: TriggerType;
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailConfig {
  serviceProvider: string;
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export interface SmsConfig {
  serviceProvider: string;
  apiKey: string;
  fromNumber: string;
}

// Standard variables that should be available in all templates
const STANDARD_VARIABLES = ['borrower_name', 'loan_id', 'amount_due', 'due_date'];

// Mock data
const emailTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Payment Reminder',
    type: 'email',
    subject: 'Your payment is due soon',
    body: 'Dear {{borrower_name}}, this is a reminder that your payment of {{amount_due}} for loan #{{loan_id}} is due on {{due_date}}.',
    variables: [...STANDARD_VARIABLES, 'name', 'amount', 'dueDate'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Payment Overdue',
    type: 'email',
    subject: 'Your payment is overdue',
    body: 'Dear {{borrower_name}}, your payment of {{amount_due}} for loan #{{loan_id}} was due on {{due_date}} and is now overdue. Please make your payment as soon as possible.',
    variables: [...STANDARD_VARIABLES, 'name', 'amount', 'dueDate'],
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02')
  },
  {
    id: '3',
    name: 'Payment Confirmation',
    type: 'email',
    subject: 'Payment Confirmation',
    body: 'Dear {{borrower_name}}, we have received your payment of {{amount_due}} for loan #{{loan_id}}. Thank you.',
    variables: [...STANDARD_VARIABLES, 'name', 'amount'],
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03')
  }
];

const smsTemplates: NotificationTemplate[] = [
  {
    id: '4',
    name: 'SMS Payment Reminder',
    type: 'sms',
    body: 'Hi {{borrower_name}}, reminder: payment of {{amount_due}} for loan #{{loan_id}} is due on {{due_date}}.',
    variables: [...STANDARD_VARIABLES, 'name', 'amount', 'dueDate'],
    createdAt: new Date('2023-01-04'),
    updatedAt: new Date('2023-01-04')
  },
  {
    id: '5',
    name: 'SMS Payment Overdue',
    type: 'sms',
    body: 'Hi {{borrower_name}}, your payment of {{amount_due}} for loan #{{loan_id}} due on {{due_date}} is overdue. Please pay ASAP.',
    variables: [...STANDARD_VARIABLES, 'name', 'amount', 'dueDate'],
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05')
  }
];

const notifications: Notification[] = [
  {
    id: '1',
    templateId: '1',
    recipient: 'user@example.com',
    variables: { name: 'John Doe', amount: '$100', dueDate: '2023-02-01' },
    priority: 'medium',
    status: 'sent',
    triggerType: 'automatic',
    scheduledAt: new Date('2023-01-25'),
    sentAt: new Date('2023-01-25'),
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-25')
  },
  {
    id: '2',
    templateId: '4',
    recipient: '+1234567890',
    variables: { name: 'Jane Smith', amount: '$200', dueDate: '2023-02-15' },
    priority: 'high',
    status: 'scheduled',
    triggerType: 'automatic',
    scheduledAt: new Date('2023-02-10'),
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01')
  }
];

// Service functions
export function getTemplates(type?: NotificationType): NotificationTemplate[] {
  if (!type) {
    return [...emailTemplates, ...smsTemplates];
  }
  return type === 'email' ? emailTemplates : smsTemplates;
}

export function getTemplate(id: string): NotificationTemplate | undefined {
  return [...emailTemplates, ...smsTemplates].find(template => template.id === id);
}

export function getNotifications(): Notification[] {
  return notifications;
}

export function getNotification(id: string): Notification | undefined {
  return notifications.find(notification => notification.id === id);
}

export async function sendEmailNotification(notification: Notification): Promise<boolean> {
  // This would be implemented with actual email service
  console.log('Sending email notification:', notification);
  
  // Mock success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export async function sendSmsNotification(notification: Notification): Promise<boolean> {
  // This would be implemented with actual SMS service
  console.log('Sending SMS notification:', notification);
  
  // Mock success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export async function scheduleNotification(notification: Notification): Promise<boolean> {
  // This would be implemented with a task scheduler
  console.log('Scheduling notification:', notification);
  
  // Mock success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export function replaceVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
}
