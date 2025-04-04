
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { MOCK_RECIPIENTS, Recipient } from "./types";

interface RecipientSelectorProps {
  selectedRecipients: Recipient[];
  setSelectedRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>;
  messageType: "email" | "sms";
}

const RecipientSelector = ({ 
  selectedRecipients, 
  setSelectedRecipients,
  messageType
}: RecipientSelectorProps) => {
  const [recipientSearchTerm, setRecipientSearchTerm] = useState("");
  const [recipientsOpen, setRecipientsOpen] = useState(false);

  // Filter recipients based on search term
  const filteredRecipients = MOCK_RECIPIENTS.filter(recipient => {
    const searchValue = recipientSearchTerm.toLowerCase();
    return (
      recipient.name.toLowerCase().includes(searchValue) ||
      recipient.email?.toLowerCase().includes(searchValue) || 
      recipient.phone?.toLowerCase().includes(searchValue)
    );
  }).filter(recipient => !selectedRecipients.some(r => r.id === recipient.id));

  // Handle selecting a recipient
  const handleSelectRecipient = (recipient: Recipient) => {
    setSelectedRecipients([...selectedRecipients, recipient]);
    setRecipientSearchTerm("");
  };

  // Handle removing a recipient
  const handleRemoveRecipient = (id: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== id));
  };

  return (
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
  );
};

export default RecipientSelector;
