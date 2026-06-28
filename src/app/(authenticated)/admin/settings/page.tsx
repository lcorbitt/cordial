import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ADMIN_SETTINGS_COPY } from "./constants";

/**
 * Platform settings admin stub. Super-admin only. Full configuration UI lands
 * in a later phase.
 */
export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {ADMIN_SETTINGS_COPY.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {ADMIN_SETTINGS_COPY.subtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ADMIN_SETTINGS_COPY.cardTitle}</CardTitle>
          <CardDescription>
            {ADMIN_SETTINGS_COPY.cardDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-base">
            {ADMIN_SETTINGS_COPY.body}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
