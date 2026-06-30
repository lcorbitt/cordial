"use client";

import { cn } from "@/lib/utils";

import {
  DATA_TABLE_FILTER_ALL_LABEL,
  DATA_TABLE_FILTER_ALL_VALUE,
  DATA_TABLE_FILTER_FIELD_CLASS,
  DATA_TABLE_FILTER_LABEL_CLASS,
  DATA_TABLE_FILTER_SELECT_CLASS,
} from "../constants";

export type DataTableFilterOption = {
  value: string;
  label: string;
};

type DataTableFilterSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DataTableFilterOption[];
  disabled?: boolean;
  includeAllOption?: boolean;
  allLabel?: string;
  className?: string;
};

export function DataTableFilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
  includeAllOption = true,
  allLabel = DATA_TABLE_FILTER_ALL_LABEL,
  className,
}: DataTableFilterSelectProps) {
  return (
    <div className={cn(DATA_TABLE_FILTER_FIELD_CLASS, className)}>
      <label htmlFor={id} className={DATA_TABLE_FILTER_LABEL_CLASS}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={DATA_TABLE_FILTER_SELECT_CLASS}
      >
        {includeAllOption ? (
          <option value={DATA_TABLE_FILTER_ALL_VALUE}>{allLabel}</option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
