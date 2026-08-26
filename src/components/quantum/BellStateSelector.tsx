import React from 'react';
import { BellStateType } from '../../types/quantum';
import { BELL_STATES } from '../../services/quantumEngine';
import { Card, Badge } from '../ui/Primitives';

interface BellStateSelectorProps {
  selected?: BellStateType;
  selectedState?: BellStateType;
  onSelect?: (state: BellStateType) => void;
  onSelectState?: (state: BellStateType) => void;
}

export const BellStateSelector: React.FC<BellStateSelectorProps> = ({
  selected,
  selectedState,
  onSelect,
  onSelectState
}) => {
  const currentSelected = selectedState || selected || 'PHI_PLUS';
  const handleSelect = (key: BellStateType) => {
    if (onSelectState) onSelectState(key);
    if (onSelect) onSelect(key);
  };
  const bellKeys: BellStateType[] = ['PHI_PLUS', 'PHI_MINUS', 'PSI_PLUS', 'PSI_MINUS'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Entangled Bell State (|β_xy⟩)
        </label>
        <span className="text-[11px] text-slate-500 font-mono">Maximally Entangled Basis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bellKeys.map(key => {
          const state = BELL_STATES[key];
          const isSelected = currentSelected === key;

          return (
            <div
              key={key}
              onClick={() => handleSelect(key)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/70 shadow-md shadow-cyan-950'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-cyan-300">
                    {state.ket}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">{state.name.split('(')[0]}</span>
                </div>
                {isSelected && <Badge variant="cyan">SELECTED</Badge>}
              </div>

              <div className="mt-2 py-1 px-2 rounded bg-slate-950/80 border border-slate-800 font-mono text-xs text-amber-300 text-center">
                {state.formula}
              </div>

              <p className="mt-2 text-[11px] text-slate-400 leading-snug">
                {state.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
