"use client";

import type { ReactNode } from "react";

import {
  DATA_TABLE_TOOLBAR_ACTIONS_CLASS,
  DATA_TABLE_TOOLBAR_CLASS,
  DATA_TABLE_TOOLBAR_FILTERS_CLASS,
} from "../constants";

type DataTableToolbarProps = {
  filters?: ReactNode;
  actions?: ReactNode;
};

export function DataTableToolbar({ filters, actions }: DataTableToolbarProps) {
  return (
    <div className={DATA_TABLE_TOOLBAR_CLASS}>
      {filters ? (
        <div className={DATA_TABLE_TOOLBAR_FILTERS_CLASS}>{filters}</div>
      ) : null}
      {actions ? (
        <div className={DATA_TABLE_TOOLBAR_ACTIONS_CLASS}>{actions}</div>
      ) : null}
    </div>
  );
}
