import { useRef, useState, MouseEvent, ReactNode } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export const TiltCard = ({ children, className }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const reduceMotion = usePrefersReducedMotion();

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    setRotate({
      x: yPct * -12,
      y: xPct * 12,
    });

    ref.current.style.setProperty('--glow-x', `${mouseX}px`);
    ref.current.style.setProperty('--glow-y', `${mouseY}px`);
  };

  const onMouseLeave = () => {
    if (reduceMotion) return;
    setRotate({ x: 0, y: 0 });
    if (ref.current) {
      ref.current.style.setProperty('--glow-x', `-100%`);
      ref.current.style.setProperty('--glow-y', `-100%`);
    }
  };

  const style = reduceMotion
    ? undefined
    : {
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.05, 1.05, 1.05)`,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
      } as CSSProperties;

  return (
    <div
      ref={ref}
      onMouseMove={reduceMotion ? undefined : onMouseMove}
      onMouseLeave={reduceMotion ? undefined : onMouseLeave}
      style={style}
      className={cn(
        "glass-card",
        reduceMotion ? "" : "will-change-transform interactive-glow",
        className
      )}
    >
      {children}
    </div>
  );
};