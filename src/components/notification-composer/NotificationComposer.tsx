
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  NotificationTemplate,
  NotificationPriority,
  NotificationType,
  getTemplates,
  sendEmailNotification,
  sendSmsNotification
} from "@/services/notificationService";
import { toast } from "sonner";
import { Send } from "lucide-react";
import TemplateSelector from "./TemplateSelector";
import RecipientSelector from "./RecipientSelector";
import MessageEditor from "./MessageEditor";
import { Recipient } from "./types";

const NotificationComposer: React.FC = () => {
  const [messageType, setMessageType] = useState<NotificationType>("email");
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [templates, setTemplates] = useState(() => getTemplates());
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<NotificationPriority>("medium");
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);

  // Load template data when selected
  useEffect(() => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject || "");
      setMessage(selectedTemplate.body || "");
    }
  }, [selectedTemplate]);

  // Handle sending notification
  const handleSendNotification = async () => {
    if (!message) {
      toast.error("Please enter a message");
      return;
    }

    if (selectedRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    // Create a notification for each recipient
    const sendPromises = selectedRecipients.map(async (recipient) => {
      const notification = {
        id: String(Math.floor(Math.random() * 10000)),
        templateId: selectedTemplate?.id || '0',
        recipient: messageType === "email" ? recipient.email! : recipient.phone!,
        variables: {}, // In a real app, we would extract variables from message
        priority,
        status: "sent" as const,
        triggerType: "manual" as const,
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return messageType === "email" 
        ? sendEmailNotification(notification)
        : sendSmsNotification(notification);
    });

    toast.promise(Promise.all(sendPromises), {
      loading: `Sending ${messageType}s to ${selectedRecipients.length} recipients...`,
      success: () => {
        // Reset the form after sending
        setSelectedRecipients([]);
        if (!selectedTemplate) {
          setMessage("");
          setSubject("");
        }
        return `${selectedRecipients.length} ${messageType}(s) sent successfully`;
      },
      error: `Failed to send messages`
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light">Notification Composer</h1>
        <p className="text-muted-foreground">
          Create and send notifications to one or multiple recipients
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h2 className="text-xl font-medium">Create New Notification</h2>
              <Tabs defaultValue="email" value={messageType} onValueChange={(value) => {
                setMessageType(value as NotificationType);
                setSelectedTemplate(null);
              }} className="w-[300px]">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Select value={priority} onValueChange={(value) => setPriority(value as NotificationPriority)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Template selection */}
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            templates={templates}
            messageType={messageType}
            onTemplateChange={setSelectedTemplate}
          />

          {/* Recipients selection */}
          <RecipientSelector
            selectedRecipients={selectedRecipients}
            setSelectedRecipients={setSelectedRecipients}
            messageType={messageType}
          />

          {/* Message editor */}
          <MessageEditor
            messageType={messageType}
            subject={subject}
            setSubject={setSubject}
            message={message}
            setMessage={setMessage}
            selectedTemplate={selectedTemplate}
          />
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setMessage("");
            setSubject("");
            setSelectedTemplate(null);
            setSelectedRecipients([]);
          }}>
            Clear
          </Button>
          <Button onClick={handleSendNotification} disabled={!message || selectedRecipients.length === 0}>
            <Send className="mr-2 h-4 w-4" />
            Send {selectedRecipients.length > 0 ? `to ${selectedRecipients.length} recipient(s)` : ""}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationComposer;
