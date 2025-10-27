"use client";

import { useRef, useState, MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export const TiltCard = ({ children, className }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    setRotate({
      x: yPct * -12, // Invert for natural feel
      y: xPct * 12,
    });

    ref.current.style.setProperty('--glow-x', `${mouseX}px`);
    ref.current.style.setProperty('--glow-y', `${mouseY}px`);
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    if (ref.current) {
      ref.current.style.setProperty('--glow-x', `-100%`);
      ref.current.style.setProperty('--glow-y', `-100%`);
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.05, 1.05, 1.05)`,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={cn("glass-card will-change-transform interactive-glow", className)}
    >
      {children}
    </div>
  );
};