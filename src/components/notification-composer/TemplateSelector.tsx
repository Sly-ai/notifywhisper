
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationTemplate, NotificationType } from "@/services/notificationService";

interface TemplateSelectorProps {
  selectedTemplate: NotificationTemplate | null;
  templates: NotificationTemplate[];
  messageType: NotificationType;
  onTemplateChange: (template: NotificationTemplate | null) => void;
}

const TemplateSelector = ({
  selectedTemplate,
  templates,
  messageType,
  onTemplateChange
}: TemplateSelectorProps) => {
  // Filter templates based on message type
  const filteredTemplates = templates.filter(template => template.type === messageType);

  return (
    <div className="space-y-2">
      <Label>Template</Label>
      <Select 
        value={selectedTemplate?.id || "none"} 
        onValueChange={(value) => {
          const template = templates.find(t => t.id === value);
          onTemplateChange(template || null);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a template (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Create from scratch</SelectItem>
          {filteredTemplates.map(template => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateSelector;
