import React from 'react';
import { AttackCardInfo, AttackType } from '../../types/attack';
import { Card, Badge, Button } from '../ui/Primitives';
import { KeyRound, Repeat, UserX, Radio, ShieldAlert, Play } from 'lucide-react';

interface AttackCardProps {
  attack: AttackCardInfo;
  isSelected: boolean;
  onSelect: () => void;
  onQuickSimulate: () => void;
}

export const AttackCard: React.FC<AttackCardProps> = ({
  attack,
  isSelected,
  onSelect,
  onQuickSimulate
}) => {
  const iconMap: Record<AttackType, React.ComponentType<{ className?: string }>> = {
    FORGERY: KeyRound,
    REPLAY: Repeat,
    IMPERSONATION: UserX,
    CHANNEL_MANIPULATION: Radio
  };

  const Icon = iconMap[attack.type];

  return (
    <Card
      className={`relative p-5 transition-all cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-rose-950/20 border-rose-500/70 shadow-lg shadow-rose-950/50 ring-1 ring-rose-500/50'
          : 'bg-[#0c1017] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
      onClick={onSelect}
    >
      <div>
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-lg border ${
                isSelected
                  ? 'bg-rose-900/40 border-rose-500/80 text-rose-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 font-mono">
                {attack.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">{attack.tag}</p>
            </div>
          </div>

          <Badge variant={attack.defaultSeverity === 'CRITICAL' ? 'danger' : 'warning'}>
            {attack.defaultSeverity}
          </Badge>
        </div>

        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          {attack.description}
        </p>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 mb-3 space-y-1">
          <span className="text-[10px] font-mono text-cyan-300 font-semibold uppercase block">
            Quantum Vector & Mechanism:
          </span>
          <p className="text-[11px] text-slate-400 font-mono leading-snug">
            {attack.quantumMechanism}
          </p>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
          Target: {attack.vulnerabilityTarget}
        </span>

        <Button
          variant={isSelected ? 'danger' : 'secondary'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onQuickSimulate();
          }}
          className="text-xs font-mono py-1 px-2.5"
        >
          <Play className="w-3 h-3 mr-1" /> Simulate
        </Button>
      </div>
    </Card>
  );
};
