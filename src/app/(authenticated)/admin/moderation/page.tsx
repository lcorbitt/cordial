import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ADMIN_MODERATION_COPY } from "./constants";

/**
 * Moderation admin stub. Proves the admin sidebar route works. Full tooling
 * lands in a later phase.
 */
export default function AdminModerationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {ADMIN_MODERATION_COPY.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {ADMIN_MODERATION_COPY.subtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ADMIN_MODERATION_COPY.cardTitle}</CardTitle>
          <CardDescription>
            {ADMIN_MODERATION_COPY.cardDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-base">
            {ADMIN_MODERATION_COPY.body}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
