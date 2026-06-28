import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ADMIN_USERS_COPY } from "./constants";

/**
 * User management admin stub. Proves the admin sidebar route works. Full CRUD
 * UI lands in a later phase.
 */
export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {ADMIN_USERS_COPY.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {ADMIN_USERS_COPY.subtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{ADMIN_USERS_COPY.cardTitle}</CardTitle>
          <CardDescription>{ADMIN_USERS_COPY.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-base">
            {ADMIN_USERS_COPY.body}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
