
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface VariableInserterProps {
  availableVariables: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onVariableSelect: (variable: string) => void;
  position: { top: number; left: number };
  isOpen: boolean;
}

const VariableInserter = ({
  availableVariables,
  searchTerm,
  setSearchTerm,
  onVariableSelect,
  position,
  isOpen
}: VariableInserterProps) => {
  if (!isOpen || availableVariables.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute bg-popover shadow-md rounded-md border border-border z-10 w-[200px] overflow-hidden"
      style={{ 
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <Command>
        <CommandInput 
          placeholder="Search variables..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
          autoFocus
        />
        <CommandList className="max-h-[200px]">
          <CommandEmpty>No variables found</CommandEmpty>
          <CommandGroup heading="Available Variables">
            {availableVariables
              .filter(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(variable => (
                <CommandItem 
                  key={variable}
                  onSelect={() => onVariableSelect(variable)}
                >
                  {variable}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default VariableInserter;
