"use client";

import type { AuditLogDateRange } from "@shared/dto/admin.dto";

import {
  DATA_TABLE_DATE_RANGE_OPTIONS,
  DATA_TABLE_DATE_RANGE_SELECT_ID,
} from "../constants";
import {
  DataTableFilterSelect,
  type DataTableFilterOption,
} from "../DataTableFilterSelect";

const DATE_RANGE_OPTIONS: DataTableFilterOption[] =
  DATA_TABLE_DATE_RANGE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

type DataTableDateRangeSelectProps = {
  value: AuditLogDateRange;
  onChange: (value: AuditLogDateRange) => void;
  label: string;
  disabled?: boolean;
};

export function DataTableDateRangeSelect({
  value,
  onChange,
  label,
  disabled = false,
}: DataTableDateRangeSelectProps) {
  return (
    <DataTableFilterSelect
      id={DATA_TABLE_DATE_RANGE_SELECT_ID}
      label={label}
      value={value}
      onChange={(next) => onChange(next as AuditLogDateRange)}
      options={DATE_RANGE_OPTIONS}
      disabled={disabled}
      includeAllOption={false}
    />
  );
}
