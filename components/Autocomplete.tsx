
import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteProps<T> {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  onBlur?: () => void;
  options: T[];
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string;
  placeholder?: string;
  className?: string;
}

export function Autocomplete<T>({ 
  value, 
  onChange, 
  onSelect, 
  onBlur,
  options, 
  getLabel, 
  getSubLabel,
  placeholder, 
  className 
}: AutocompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [filteredOptions, setFilteredOptions] = useState<T[]>([]);

  useEffect(() => {
    // Filter options based on input
    if (!value.trim()) {
      setFilteredOptions([]);
      return;
    }
    
    const lowerValue = value.toLowerCase();
    const filtered = options.filter(opt => 
      getLabel(opt).toLowerCase().includes(lowerValue)
    );
    setFilteredOptions(filtered);
  }, [value, options, getLabel]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              // Use onMouseDown instead of onClick to prevent blur from firing first
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                handleSelect(option);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0"
            >
              <div className="text-sm font-medium text-slate-800">{getLabel(option)}</div>
              {getSubLabel && (
                <div className="text-xs text-slate-500 truncate">{getSubLabel(option)}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
