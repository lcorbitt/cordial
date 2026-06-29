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
