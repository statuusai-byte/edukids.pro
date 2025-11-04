import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Gamepad2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type NodeStatus = 'locked' | 'unlocked' | 'completed';

interface MapNodeProps {
  title: string;
  status: NodeStatus;
  onClick: () => void;
}

const MapNode = ({ title, status, onClick }: MapNodeProps) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  const Icon = isLocked ? Lock : isCompleted ? Check : Gamepad2;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={onClick}
            disabled={isLocked}
            className={cn(
              'absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full border-4 shadow-lg transition-all duration-300',
              {
                'bg-slate-700 border-slate-500 cursor-not-allowed': isLocked,
                'bg-primary border-purple-400 hover:scale-110': !isLocked && !isCompleted,
                'bg-green-600 border-green-400': isCompleted,
              }
            )}
            whileHover={{ scale: isLocked ? 1 : 1.1 }}
            whileTap={{ scale: isLocked ? 1 : 0.95 }}
          >
            {status === 'unlocked' && (
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
            )}
            <Icon className="w-8 h-8 text-white" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white border-primary/50">
          <p>{title} ({status})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MapNode;