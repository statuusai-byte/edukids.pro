import {
  Apple, Sigma, BookOpen, FlaskConical, Globe, Palette, Music, Brain, Code, Bot, PiggyBank, Landmark, SpellCheck,
  PlaySquare, Store, User, Settings, Gamepad2 // Adicionado Gamepad2
} from 'lucide-react';
import React from 'react';

const iconMap = {
  Apple,
  Sigma,
  BookOpen,
  FlaskConical,
  Globe,
  Palette,
  Music,
  Brain,
  Code,
  Bot,
  PiggyBank,
  Landmark,
  SpellCheck,
  PlaySquare,
  Store,
  User,
  Settings,
  Gamepad2, // Adicionado Gamepad2
};

export type IconName = keyof typeof iconMap;

interface IconProps extends React.ComponentProps<typeof Apple> {
  name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) {
    return null; // Or a fallback icon
  }
  return <LucideIcon {...props} />;
};