
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Notification, NotificationPriority, getTemplate } from "@/services/notificationService";
import { updateNotification } from "@/utils/notificationUtils";
import { toast } from "sonner";

interface EditNotificationModalProps {
  notification: Notification | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedNotification: Notification) => void;
}

const EditNotificationModal: React.FC<EditNotificationModalProps> = ({ 
  notification, 
  open, 
  onClose, 
  onSave 
}) => {
  const [recipient, setRecipient] = useState("");
  const [priority, setPriority] = useState<NotificationPriority>("medium");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  
  useEffect(() => {
    if (notification) {
      setRecipient(notification.recipient);
      setPriority(notification.priority);
      
      if (notification.scheduledAt) {
        const date = new Date(notification.scheduledAt);
        setScheduledDate(date.toISOString().split('T')[0]);
        setScheduledTime(date.toTimeString().slice(0, 5));
      } else {
        setScheduledDate("");
        setScheduledTime("");
      }
      
      const template = getTemplate(notification.templateId);
      if (template) {
        setMessage(template.body || "");
        setSubject(template.subject || "");
      }
    }
  }, [notification]);
  
  const handleSave = () => {
    if (!notification) return;
    
    // Combine date and time into a single Date object
    let scheduledAt = notification.scheduledAt;
    if (scheduledDate && scheduledTime) {
      scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
    }
    
    const updatedNotification: Notification = {
      ...notification,
      recipient,
      priority,
      scheduledAt
    };
    
    try {
      const result = updateNotification(updatedNotification);
      onSave(result);
      toast.success("Notification updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };
  
  const getNotificationType = (): "email" | "sms" => {
    if (!notification) return "email";
    const template = getTemplate(notification.templateId);
    return template?.type || "email";
  };
  
  const isEmail = getNotificationType() === "email";
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Notification</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipient" className="text-right">
              {isEmail ? "Email" : "Phone"}
            </Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="col-span-3"
              placeholder={isEmail ? "email@example.com" : "(555) 123-4567"}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as NotificationPriority)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scheduled-date" className="text-right">
              Schedule Date
            </Label>
            <Input
              id="scheduled-date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scheduled-time" className="text-right">
              Schedule Time
            </Label>
            <Input
              id="scheduled-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {isEmail && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="col-span-3"
                disabled
              />
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              rows={4}
              disabled
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNotificationModal;
