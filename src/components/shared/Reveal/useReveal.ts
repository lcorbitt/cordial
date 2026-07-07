"use client";

import { useEffect, useState } from "react";
import type { ElementType } from "react";

import { useIntersectionReveal } from "@/hooks/use-intersection-reveal";

export interface UseRevealOptions {
  threshold?: number;
  once?: boolean;
  delay?: number;
  immediate?: boolean;
}

export function useReveal({
  threshold = 0.1,
  once = true,
  delay = 0,
  immediate = false,
}: UseRevealOptions) {
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
  const [canTransition, setCanTransition] = useState(immediate);
  const [delayedVisible, setDelayedVisible] = useState(immediate);
  const visible =
    shouldMount && (prefersReducedMotion || delayedVisible || immediate);

  useEffect(() => {
    if (!shouldMount || prefersReducedMotion || immediate) {
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
  }, [shouldMount, prefersReducedMotion, delay, immediate]);

  return {
    ref,
    shouldMount,
    prefersReducedMotion,
    canTransition,
    visible,
  };
}

export type RevealElement = ElementType;
