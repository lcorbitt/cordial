export const TITLE = "Communities";
export const SUBTITLE = "Create communities and invite members by email.";
export const CREATE_CARD_TITLE = "Create a Community";
export const CREATE_CARD_DESCRIPTION =
  "You will be added as a member automatically.";
export const NAME_LABEL = "Name";
export const SLUG_LABEL = "Slug";
export const CREATE_SUBMIT_LABEL = "Create Community";
export const CREATING_LABEL = "Creating…";
export const LIST_CARD_TITLE = "All Communities";
export const LIST_CARD_DESCRIPTION =
  "Send email invitations to add members to each community.";
export const LIST_LOADING_BODY = "Loading communities…";
export const LIST_ERROR_TITLE = "We Could Not Load Communities";
export const LIST_ERROR_DESCRIPTION =
  "Please check that your local stack is running, then try again.";
export const BACK_TO_DASHBOARD_LABEL = "Back to Dashboard";
export const LIST_EMPTY_BODY =
  "No communities yet. Create one above to get started.";
export const VIEW_HOME_LABEL = "View Home";
export const INVITE_LABEL = "Invite by Email";
export const INVITE_PLACEHOLDER = "member@example.com";
export const SEND_INVITE_LABEL = "Send Invite";
export const SENDING_INVITE_LABEL = "Sending…";
export const TOAST_CREATE_LOADING = "Creating community…";
export const TOAST_CREATE_SUCCESS = "Community created.";
export const TOAST_CREATE_ERROR =
  "We could not create that community. Please try again.";
export const TOAST_INVITE_LOADING = "Sending invitation…";
export const TOAST_INVITE_SUCCESS = "Invitation sent for {name}.";
export const TOAST_INVITE_ERROR =
  "We could not send that invitation. Please try again.";

export const CREATE_COMMUNITY_VALIDATION = {
  nameMin: "Please enter a name with at least 2 characters.",
  nameMax: "Please keep the name under 80 characters.",
  slugMin: "Please enter a slug with at least 3 characters.",
  slugMax: "Please keep the slug under 50 characters.",
  slugPattern: "Use lowercase letters, numbers, and hyphens only.",
} as const;

export const PAGE_CLASS = "flex flex-col gap-6";
export const TITLE_CLASS = "text-3xl font-bold tracking-tight";
export const SUBTITLE_CLASS = "text-muted-foreground text-lg";
export const FORM_CLASS = "flex max-w-md flex-col gap-4";
export const FIELD_CLASS = "flex flex-col gap-2";
export const LOADING_TEXT_CLASS = "text-muted-foreground";
export const EMPTY_TEXT_CLASS = "text-muted-foreground";
export const LIST_CLASS = "flex flex-col gap-6";
export const LIST_ITEM_CLASS = "border-b pb-6 last:border-b-0 last:pb-0";
export const LIST_ITEM_HEADER_CLASS =
  "mb-4 flex flex-wrap items-center justify-between gap-2";
export const COMMUNITY_NAME_CLASS = "text-lg font-semibold";
export const COMMUNITY_SLUG_CLASS = "text-muted-foreground text-sm";
export const INVITE_ROW_CLASS = "flex flex-col gap-2 sm:flex-row sm:items-end";
export const INVITE_FIELD_CLASS = "flex flex-1 flex-col gap-2";
