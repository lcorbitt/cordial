"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AdminMembersTable } from "../AdminMembersTable";
import {
  LIST_CARD_DESCRIPTION,
  LIST_CARD_TITLE,
  PAGE_CLASS,
  SUBTITLE,
  SUBTITLE_CLASS,
  TITLE,
  TITLE_CLASS,
} from "./constants";

export function AdminMembers() {
  return (
    <div className={PAGE_CLASS}>
      <div>
        <h1 className={TITLE_CLASS}>{TITLE}</h1>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{LIST_CARD_TITLE}</CardTitle>
          <CardDescription>{LIST_CARD_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <AdminMembersTable />
        </CardContent>
      </Card>
    </div>
  );
}
