
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Notification, 
  NotificationTemplate,
  NotificationPriority,
  NotificationType,
  getTemplates,
  replaceVariables,
  sendEmailNotification,
  sendSmsNotification
} from "@/services/notificationService";
import { toast } from "sonner";
import { AtSign, Send, Plus, MessageSquare, Users } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const MOCK_RECIPIENTS: Recipient[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1987654321' },
  { id: '3', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1122334455' },
  { id: '4', name: 'Bob Williams', email: 'bob@example.com', phone: '+1555666777' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1888999000' },
];

const NotificationComposer: React.FC = () => {
  const [messageType, setMessageType] = useState<NotificationType>("email");
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [templates, setTemplates] = useState(() => getTemplates());
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<NotificationPriority>("medium");
  
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [recipientSearchTerm, setRecipientSearchTerm] = useState("");
  const [recipientsOpen, setRecipientsOpen] = useState(false);

  // Filter templates based on message type
  const filteredTemplates = templates.filter(template => template.type === messageType);

  // Get available variables when a template is selected
  const availableVariables = selectedTemplate?.variables || [];
  
  // Filter recipients based on search term
  const filteredRecipients = MOCK_RECIPIENTS.filter(recipient => {
    const searchValue = recipientSearchTerm.toLowerCase();
    return (
      recipient.name.toLowerCase().includes(searchValue) ||
      recipient.email?.toLowerCase().includes(searchValue) || 
      recipient.phone?.toLowerCase().includes(searchValue)
    );
  }).filter(recipient => !selectedRecipients.some(r => r.id === recipient.id));

  // Load template data when selected
  useEffect(() => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject || "");
      setMessage(selectedTemplate.body || "");
    }
  }, [selectedTemplate]);

  // Function to get cursor position in textarea
  const getCursorPosition = () => {
    if (textareaRef.current) {
      return textareaRef.current.selectionStart;
    }
    return 0;
  };

  // Function to update cursor position in state
  const updateCursorPosition = () => {
    setCursorPosition(getCursorPosition());
  };

  // Function to calculate command popover position
  const updateCommandPosition = () => {
    if (textareaRef.current) {
      const curPos = getCursorPosition();
      const textarea = textareaRef.current;
      
      // Create a hidden div to calculate the position
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.visibility = 'hidden';
      div.style.height = 'auto';
      div.style.width = textarea.offsetWidth + 'px';
      div.style.fontSize = window.getComputedStyle(textarea).fontSize;
      div.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
      div.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordBreak = 'break-word';
      div.style.padding = window.getComputedStyle(textarea).padding;
      
      // Add text content up to cursor position
      div.textContent = message.substring(0, curPos);
      
      // Add a span at cursor position to get coordinates
      const span = document.createElement('span');
      span.textContent = '|';
      div.appendChild(span);
      
      // Add to DOM, get position, then remove
      document.body.appendChild(div);
      const rect = span.getBoundingClientRect();
      const textareaRect = textarea.getBoundingClientRect();
      
      // Calculate position relative to textarea
      const top = rect.top - textareaRect.top + 20; // Add offset for better visibility
      const left = rect.left - textareaRect.left;
      
      document.body.removeChild(div);
      
      setCommandPosition({ top, left });
    }
  };

  // Handle keydown in textarea
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for '/' to trigger command
    if (e.key === '/' && !commandOpen) {
      updateCommandPosition();
      setCommandOpen(true);
      setSearchTerm("");
      e.preventDefault();
    }
    // Close command with Escape
    else if (e.key === 'Escape' && commandOpen) {
      setCommandOpen(false);
      e.preventDefault();
    }
  };

  // Insert variable at cursor position
  const insertVariable = (variable: string) => {
    const newMessage = 
      message.substring(0, cursorPosition) + 
      `{{${variable}}}` + 
      message.substring(cursorPosition);
    
    setMessage(newMessage);
    setCommandOpen(false);
    
    // Set focus back to textarea and move cursor past the inserted variable
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = cursorPosition + variable.length + 4; // +4 for {{ }}
        textareaRef.current.setSelectionRange(newPos, newPos);
        updateCursorPosition();
      }
    }, 0);
  };

  // Handle selecting a recipient
  const handleSelectRecipient = (recipient: Recipient) => {
    setSelectedRecipients([...selectedRecipients, recipient]);
    setRecipientSearchTerm("");
  };

  // Handle removing a recipient
  const handleRemoveRecipient = (id: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== id));
  };

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
      const notification: Notification = {
        id: String(Math.floor(Math.random() * 10000)),
        templateId: selectedTemplate?.id || '0',
        recipient: messageType === "email" ? recipient.email! : recipient.phone!,
        variables: {}, // In a real app, we would extract variables from message
        priority,
        status: "sent",
        triggerType: "manual",
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
          <div className="space-y-2">
            <Label>Template</Label>
            <Select 
              value={selectedTemplate?.id || ""} 
              onValueChange={(value) => {
                const template = templates.find(t => t.id === value);
                setSelectedTemplate(template || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Create from scratch</SelectItem>
                {filteredTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipients selection */}
          <div className="space-y-2">
            <Label>Recipients</Label>
            <Popover open={recipientsOpen} onOpenChange={setRecipientsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {selectedRecipients.length === 0 
                      ? "Select recipients" 
                      : `${selectedRecipients.length} recipient(s) selected`}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search recipients..." 
                    value={recipientSearchTerm}
                    onValueChange={setRecipientSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>No recipients found</CommandEmpty>
                    <CommandGroup heading="Recipients">
                      {filteredRecipients.map(recipient => (
                        <CommandItem 
                          key={recipient.id}
                          onSelect={() => handleSelectRecipient(recipient)}
                        >
                          {recipient.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {messageType === "email" ? recipient.email : recipient.phone}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {selectedRecipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedRecipients.map(recipient => (
                  <Badge key={recipient.id} variant="secondary" className="flex items-center gap-1">
                    {recipient.name}
                    <button 
                      type="button"
                      className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center text-xs"
                      onClick={() => handleRemoveRecipient(recipient.id)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Subject field for email */}
          {messageType === "email" && (
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="Email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          )}

          {/* Message field with variables support */}
          <div className="space-y-2 relative">
            <div className="flex justify-between">
              <Label>Message</Label>
              <span className="text-xs text-muted-foreground">
                Type / to insert variables
              </span>
            </div>
            <Textarea
              ref={textareaRef}
              placeholder={`${messageType === "email" ? "Email" : "SMS"} body content...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={updateCursorPosition}
              onKeyUp={updateCursorPosition}
              className="min-h-[200px]"
            />

            {/* Command popover for variables */}
            {commandOpen && availableVariables.length > 0 && (
              <div 
                className="absolute bg-popover shadow-md rounded-md border border-border z-10 w-[200px] overflow-hidden"
                style={{ 
                  top: `${commandPosition.top}px`,
                  left: `${commandPosition.left}px`,
                }}
              >
                <Command>
                  <CommandInput 
                    placeholder="Search variables..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    className="h-9"
                  />
                  <CommandList className="max-h-[200px]">
                    <CommandEmpty>No variables found</CommandEmpty>
                    <CommandGroup heading="Available Variables">
                      {availableVariables
                        .filter(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(variable => (
                          <CommandItem 
                            key={variable}
                            onSelect={() => insertVariable(variable)}
                          >
                            {variable}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
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
