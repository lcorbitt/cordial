export const notificationQueryKeyRoot = ["notifications"] as const;

export const notificationQueryKeys = {
  list: (limit = 20) => [...notificationQueryKeyRoot, "list", limit] as const,
};
