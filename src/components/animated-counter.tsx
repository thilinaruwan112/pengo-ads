
"use client";

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    className?: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export function AnimatedCounter({ value, className, prefix, suffix, decimals = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix || ''}${latest.toFixed(decimals)}${suffix || ''}`;
        }
      }),
    [springValue, prefix, suffix, decimals]
  );

  return <span ref={ref} className={className}>{prefix || ''}{value.toFixed(decimals)}{suffix || ''}</span>;
}
