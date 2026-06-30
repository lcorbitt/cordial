"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  DATA_TABLE_SEARCH_ICON_CLASS,
  DATA_TABLE_SEARCH_INPUT_CLASS,
  DATA_TABLE_SEARCH_WRAPPER_CLASS,
} from "../constants";

type DataTableSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export function DataTableSearchInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  disabled = false,
  className,
}: DataTableSearchInputProps) {
  return (
    <div className={cn(DATA_TABLE_SEARCH_WRAPPER_CLASS, className)}>
      <Search className={DATA_TABLE_SEARCH_ICON_CLASS} aria-hidden />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        className={DATA_TABLE_SEARCH_INPUT_CLASS}
      />
    </div>
  );
}
