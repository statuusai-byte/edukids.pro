import { journeyNodes, JourneyNode } from '@/data/journeyData';
import MapNode from './MapNode';

interface JourneyMapProps {
  completedNodes: Set<string>;
  onNodeClick: (node: JourneyNode) => void;
}

const JourneyMap = ({ completedNodes, onNodeClick }: JourneyMapProps) => {
  const getNodeStatus = (node: JourneyNode) => {
    if (completedNodes.has(node.id)) {
      return 'completed';
    }
    if (!node.requires || completedNodes.has(node.requires)) {
      return 'unlocked';
    }
    return 'locked';
  };

  const nodePositions: { [key: string]: { top: number; left: number } } = {};
  journeyNodes.forEach(node => {
    nodePositions[node.id] = {
      top: parseFloat(node.position.top),
      left: parseFloat(node.position.left),
    };
  });

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-800">
      <img
        src="https://images.unsplash.com/photo-1564399580073-5fe86027a0eb?q=80&w=2000&auto=format&fit=crop"
        alt="Mapa da Jornada do Conhecimento"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        {journeyNodes.map(node => {
          if (!node.requires) return null;
          const from = nodePositions[node.requires];
          const to = nodePositions[node.id];
          if (!from || !to) return null;

          const isPathUnlocked = completedNodes.has(node.requires);

          return (
            <line
              key={`${node.requires}-${node.id}`}
              x1={`${from.left}%`}
              y1={`${from.top}%`}
              x2={`${to.left}%`}
              y2={`${to.top}%`}
              stroke={isPathUnlocked ? '#a78bfa' : '#475569'}
              strokeWidth="6"
              strokeDasharray={isPathUnlocked ? 'none' : '10 10'}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      {journeyNodes.map(node => (
        <div key={node.id} style={{ top: node.position.top, left: node.position.left }}>
          <MapNode
            title={node.title}
            status={getNodeStatus(node)}
            onClick={() => onNodeClick(node)}
          />
        </div>
      ))}
    </div>
  );
};

export default JourneyMap;