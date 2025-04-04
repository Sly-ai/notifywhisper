
import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import VariableInserter from "./VariableInserter";
import { STANDARD_VARIABLES } from "./types";
import { NotificationTemplate, NotificationType } from "@/services/notificationService";

interface MessageEditorProps {
  messageType: NotificationType;
  subject: string;
  setSubject: (subject: string) => void;
  message: string;
  setMessage: (message: string) => void;
  selectedTemplate: NotificationTemplate | null;
}

const MessageEditor = ({
  messageType,
  subject,
  setSubject,
  message,
  setMessage,
  selectedTemplate
}: MessageEditorProps) => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Get available variables, combining standard variables with template-specific ones
  const availableVariables = [
    ...STANDARD_VARIABLES,
    ...(selectedTemplate?.variables || [])
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

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
      e.preventDefault();
      updateCursorPosition();
      updateCommandPosition();
      setCommandOpen(true);
      setSearchTerm("");
    }
    // Close command with Escape
    else if (e.key === 'Escape' && commandOpen) {
      e.preventDefault();
      setCommandOpen(false);
    }
  };

  // Insert variable at cursor position
  const insertVariable = (variable: string) => {
    if (textareaRef.current) {
      const curPos = getCursorPosition();
      const newMessage = 
        message.substring(0, curPos) + 
        `{{${variable}}}` + 
        message.substring(curPos);
      
      setMessage(newMessage);
      setCommandOpen(false);
      
      // Set focus back to textarea and move cursor past the inserted variable
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPos = curPos + variable.length + 4; // +4 for {{ }}
          textareaRef.current.setSelectionRange(newPos, newPos);
          setCursorPosition(newPos);
        }
      }, 0);
    }
  };

  return (
    <>
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

        <VariableInserter
          availableVariables={availableVariables}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onVariableSelect={insertVariable}
          position={commandPosition}
          isOpen={commandOpen}
        />
      </div>
    </>
  );
};

export default MessageEditor;
