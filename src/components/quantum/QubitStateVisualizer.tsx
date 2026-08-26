import React from 'react';
import { QubitState } from '../../types/quantum';
import { createQubitState } from '../../services/quantumEngine';
import { Card, Badge } from '../ui/Primitives';

interface QubitStateVisualizerProps {
  state?: QubitState | null;
  title?: string;
  subtitle?: string;
  onStateChange?: (state: QubitState) => void;
  onThetaChange?: (theta: number) => void;
}

export const QubitStateVisualizer: React.FC<QubitStateVisualizerProps> = ({
  state,
  title = 'Quantum State Vector |ψ⟩',
  subtitle = 'Superposition amplitudes and projective probability',
  onStateChange,
  onThetaChange
}) => {
  // Safe extraction of numeric amplitudes
  const safeAlpha = typeof state?.alpha === 'number'
    ? state.alpha
    : (typeof (state?.alpha as unknown as { real?: number })?.real === 'number'
      ? (state?.alpha as unknown as { real: number }).real
      : Math.cos(Math.PI / 6));

  const safeBeta = typeof state?.beta === 'number'
    ? state.beta
    : (typeof (state?.beta as unknown as { real?: number })?.real === 'number'
      ? (state?.beta as unknown as { real: number }).real
      : Math.sin(Math.PI / 6));

  const prob0 = typeof state?.prob0 === 'number'
    ? state.prob0
    : Math.min(1, Math.max(0, safeAlpha * safeAlpha));

  const prob1 = typeof state?.prob1 === 'number'
    ? state.prob1
    : Math.min(1, Math.max(0, safeBeta * safeBeta));

  const normalization = (safeAlpha ** 2) + (safeBeta ** 2);
  const theta = Math.acos(Math.min(1, Math.max(-1, Math.abs(safeAlpha)))) * 2;

  const handleAngleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTheta = parseFloat(e.target.value);
    if (onThetaChange) {
      onThetaChange(newTheta);
    }
    if (onStateChange) {
      const newState = createQubitState(newTheta, state?.phase || 0, `Polar |ψ(θ=${newTheta.toFixed(2)})⟩`);
      onStateChange(newState);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            {title}
          </h3>
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        </div>
        <Badge variant="cyan">POLAR: θ={theta.toFixed(2)} rad</Badge>
      </div>

      {/* Mathematical wavefunction formula */}
      <div className="p-3 rounded-sm bg-[#05070A] border border-slate-800 text-center">
        <div className="text-sm sm:text-base font-mono font-bold text-blue-400">
          |ψ⟩ = {safeAlpha >= 0 ? '' : '-'}{Math.abs(safeAlpha).toFixed(3)} |0⟩ + {safeBeta >= 0 ? '' : '-'}{Math.abs(safeBeta).toFixed(3)} |1⟩
        </div>
        <div className="text-[11px] text-slate-500 font-mono mt-1">
          Normalisation: |α|² + |β|² = {normalization.toFixed(3)} ≡ 1.000
        </div>
      </div>

      {/* Interactive Angle Slider if changeable */}
      {(onStateChange || onThetaChange) && (
        <div className="p-2.5 rounded-sm bg-slate-900/40 border border-slate-800/80 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span>Bloch Polar Angle (θ)</span>
            <span className="text-blue-400 font-bold">{(theta / Math.PI).toFixed(2)}π rad ({((theta * 180) / Math.PI).toFixed(0)}°)</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.PI.toString()}
            step="0.02"
            value={theta}
            onChange={handleAngleSlider}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      )}

      {/* Probability Amplitude Breakdown */}
      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-sm bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Amplitude α</span>
            <span className="text-slate-200 font-bold">{safeAlpha.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>P(|0⟩) = |α|²</span>
            <span className="text-blue-400 font-bold">{(prob0 * 100).toFixed(2)}%</span>
          </div>
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, prob0 * 100))}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-sm bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Amplitude β</span>
            <span className="text-slate-200 font-bold">{safeBeta.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>P(|1⟩) = |β|²</span>
            <span className="text-indigo-400 font-bold">{(prob1 * 100).toFixed(2)}%</span>
          </div>
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, prob1 * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

