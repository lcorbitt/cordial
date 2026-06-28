import {
  DESCRIPTION,
  DESCRIPTION_CLASS,
  PAGE_CLASS,
  TITLE,
  TITLE_CLASS,
} from "./constants";

/**
 * Help page in the shared group (guest + signed-in, minimal chrome). Phase 1
 * stub — proves the shared route group renders for everyone.
 */
export default function HelpPage() {
  return (
    <div className={PAGE_CLASS}>
      <h1 className={TITLE_CLASS}>{TITLE}</h1>
      <p className={DESCRIPTION_CLASS}>{DESCRIPTION}</p>
    </div>
  );
}
