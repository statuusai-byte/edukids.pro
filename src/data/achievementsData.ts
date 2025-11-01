import { type IconName } from "@/components/Icon";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  secret?: boolean;
};

export const achievements: Achievement[] = [
  {
    id: 'first_step',
    title: 'Primeiro Passo',
    description: 'Complete sua primeira lição.',
    icon: 'Star',
  },
  {
    id: 'ten_lessons',
    title: 'Aprendiz',
    description: 'Complete 10 lições.',
    icon: 'Award',
  },
  {
    id: 'fifty_lessons',
    title: 'Estudante Dedicado',
    description: 'Complete 50 lições.',
    icon: 'Trophy',
  },
  {
    id: 'polymath',
    title: 'Polímata',
    description: 'Complete uma lição em 5 matérias diferentes.',
    icon: 'Brain',
  },
  {
    id: 'math_master_1',
    title: 'Mestre da Matemática I',
    description: 'Complete todas as lições de "Matemática para Pequenos".',
    icon: 'Sigma',
  },
  {
    id: 'portuguese_master_1',
    title: 'Mestre do Português I',
    description: 'Complete todas as lições de "Primeiras Letras".',
    icon: 'BookOpen',
  },
];