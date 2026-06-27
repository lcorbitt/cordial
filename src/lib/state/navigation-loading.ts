import { atom, getDefaultStore } from "jotai";

/**
 * Ephemeral client flag: true while an in-app navigation is in progress.
 * Scoped to authenticated routes via NavigationLoadingHost.
 */
export const navigationLoadingAtom = atom(false);

export function startNavigationLoading() {
  getDefaultStore().set(navigationLoadingAtom, true);
}

export function stopNavigationLoading() {
  getDefaultStore().set(navigationLoadingAtom, false);
}
