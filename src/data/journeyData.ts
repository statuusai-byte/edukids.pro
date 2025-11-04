import type { PlayPlusGame } from './playPlusData';

export type JourneyNode = {
  id: string;
  title: string;
  gameId: PlayPlusGame['id'];
  position: { top: string; left: string };
  requires?: string; // ID of the node that must be completed first
};

// Let's define the first island: "Ilha da Sabedoria Inicial"
export const journeyNodes: JourneyNode[] = [
  {
    id: 'node-1',
    title: 'Ponte da Memória',
    gameId: 'memory-match',
    position: { top: '75%', left: '15%' },
  },
  {
    id: 'node-2',
    title: 'Trilha dos Cálculos',
    gameId: 'mission-math',
    position: { top: '50%', left: '35%' },
    requires: 'node-1',
  },
  {
    id: 'node-3',
    title: 'Pico da Lógica',
    gameId: 'memory-match', // Placeholder, can be a new game later
    position: { top: '25%', left: '55%' },
    requires: 'node-2',
  },
  {
    id: 'node-4',
    title: 'Caverna dos Enigmas',
    gameId: 'mission-math', // Placeholder
    position: { top: '45%', left: '78%' },
    requires: 'node-3',
  },
];