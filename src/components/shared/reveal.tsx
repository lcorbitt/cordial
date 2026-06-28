"use client";

import { useEffect, useState } from "react";
import type { ElementType, ReactNode } from "react";

import { useIntersectionReveal } from "@/hooks/use-intersection-reveal";
import { cn } from "@/lib/utils";

import {
  HIDDEN_CLASS,
  TRANSITION_ACTIVE_CLASS,
  VISIBLE_CLASS,
} from "./reveal/constants";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Fraction of element visible before reveal. Default 0.1 */
  threshold?: number;
  /** Keep children mounted after first reveal. Default true */
  once?: boolean;
  /** Delay before fade-in starts (ms). Useful for stagger. Default 0 */
  delay?: number;
  /**
   * Mount on first paint and animate in without waiting for scroll into view.
   * Use for above-the-fold content (e.g. landing hero).
   */
  immediate?: boolean;
  as?: ElementType;
}

/**
 * Lazy-mounts children when the wrapper enters the viewport, then fades them in.
 * Defers rendering until scroll brings the section into view for lighter pages.
 */
export function Reveal({
  children,
  className,
  threshold = 0.1,
  once = true,
  delay = 0,
  immediate = false,
  as: Component = "div",
}: RevealProps) {
  const {
    ref,
    shouldMount: inView,
    prefersReducedMotion,
  } = useIntersectionReveal({
    threshold,
    once,
    enabled: !immediate,
  });
  const shouldMount = immediate || inView;
  const [canTransition, setCanTransition] = useState(false);
  const [delayedVisible, setDelayedVisible] = useState(false);
  const visible = shouldMount && (prefersReducedMotion || delayedVisible);

  useEffect(() => {
    if (!shouldMount || prefersReducedMotion) {
      return;
    }

    let rafEnable = 0;
    let rafReveal = 0;
    const delayTimer = window.setTimeout(() => {
      rafEnable = window.requestAnimationFrame(() => {
        setCanTransition(true);
        rafReveal = window.requestAnimationFrame(() => {
          setDelayedVisible(true);
        });
      });
    }, delay);

    return () => {
      window.clearTimeout(delayTimer);
      window.cancelAnimationFrame(rafEnable);
      window.cancelAnimationFrame(rafReveal);
      setCanTransition(false);
      setDelayedVisible(false);
    };
  }, [shouldMount, prefersReducedMotion, delay]);

  return (
    <Component
      ref={ref}
      className={cn(
        className,
        shouldMount &&
          !prefersReducedMotion &&
          canTransition &&
          TRANSITION_ACTIVE_CLASS,
        shouldMount && !prefersReducedMotion && !visible && HIDDEN_CLASS,
        shouldMount && !prefersReducedMotion && visible && VISIBLE_CLASS,
      )}
    >
      {shouldMount ? children : null}
    </Component>
  );
}
