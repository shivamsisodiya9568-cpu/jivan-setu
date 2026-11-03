import React from 'react';
import { PriorityLevel } from '../../types/emergency';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  size = 'md',
  showDescription = false 
}) => {
  const configs = {
    RED: {
      bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      dot: 'bg-red-500 animate-ping',
      solidDot: 'bg-red-600',
      icon: AlertCircle,
      label: 'CRITICAL (RED)',
      desc: 'Immediate resuscitation & ALS required'
    },
    YELLOW: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500 animate-ping',
      solidDot: 'bg-amber-600',
      icon: AlertTriangle,
      label: 'URGENT (YELLOW)',
      desc: 'Prompt medical assessment needed'
    },
    GREEN: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-500',
      solidDot: 'bg-emerald-600',
      icon: CheckCircle2,
      label: 'LOWER URGENCY (GREEN)',
      desc: 'Stable vitals; clinical care advised'
    }
  };

  const config = configs[priority] || configs.GREEN;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs md:text-sm px-3 py-1.5 gap-2',
    lg: 'text-sm md:text-base px-4 py-2 gap-2.5 font-bold'
  };

  return (
    <div className="inline-flex flex-col">
      <div className={`inline-flex items-center rounded-full font-semibold border ${config.bg} ${sizeClasses[size]}`}>
        <span className="relative flex h-2 w-2">
          {priority === 'RED' && (
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.solidDot}`} />
        </span>
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        <span>{config.label}</span>
      </div>
      {showDescription && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-1">
          {config.desc}
        </span>
      )}
    </div>
  );
};
