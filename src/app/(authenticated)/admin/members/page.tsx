import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BODY,
  BODY_CLASS,
  CARD_DESCRIPTION,
  CARD_TITLE,
  PAGE_CLASS,
  SUBTITLE,
  SUBTITLE_CLASS,
  TITLE,
  TITLE_CLASS,
} from "./constants";

/**
 * Community member management admin stub. Full CRUD UI lands in a later phase.
 */
export default function AdminMembersPage() {
  return (
    <div className={PAGE_CLASS}>
      <div>
        <h1 className={TITLE_CLASS}>{TITLE}</h1>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{CARD_TITLE}</CardTitle>
          <CardDescription>{CARD_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className={BODY_CLASS}>{BODY}</p>
        </CardContent>
      </Card>
    </div>
  );
}
