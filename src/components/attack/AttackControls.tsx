import React from 'react';
import { AttackControlConfig, AttackType } from '../../types/attack';
import { Card, Button, Badge } from '../ui/Primitives';
import { Sliders, RotateCcw, Flame, Sparkles } from 'lucide-react';

interface AttackControlsProps {
  config: AttackControlConfig;
  onChange: (config: AttackControlConfig) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isSimulating: boolean;
}

export const AttackControls: React.FC<AttackControlsProps> = ({
  config,
  onChange,
  onRunSimulation,
  onReset,
  isSimulating
}) => {
  const updateField = <K extends keyof AttackControlConfig>(
    field: K,
    value: AttackControlConfig[K]
  ) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  return (
    <Card className="space-y-5 bg-[#0a0e16]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 font-mono">
            Attack Injection Parameters
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Attack Intensity Slider */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex justify-between items-center text-xs font-mono">
            <label className="text-slate-300 font-semibold">Attack Intensity</label>
            <span className="text-rose-400 font-bold text-sm">{config.intensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={config.intensity}
            onChange={e => updateField('intensity', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Subtle Probing)</span>
            <span>50%</span>
            <span>100% (Aggressive Hijack)</span>
          </div>
        </div>

        {/* Channel Noise Slider */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex justify-between items-center text-xs font-mono">
            <label className="text-slate-300 font-semibold">Quantum Channel Noise / Depolarization</label>
            <span className="text-amber-300 font-bold text-sm">{config.channelNoise}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={config.channelNoise}
            onChange={e => updateField('channelNoise', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Pure Vacuum)</span>
            <span>50%</span>
            <span>100% (High Thermal Decoherence)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Measurement Shots */}
        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1.5">
            Measurement Shots [N]
          </label>
          <select
            value={config.measurementShots}
            onChange={e => updateField('measurementShots', Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/80"
          >
            <option value={1000}>1,000 Shots</option>
            <option value={5000}>5,000 Shots</option>
            <option value={10000}>10,000 Shots (Standard Baseline)</option>
            <option value={25000}>25,000 Shots</option>
            <option value={50000}>50,000 Shots</option>
            <option value={100000}>100,000 Shots (Ultra High Precision)</option>
          </select>
        </div>

        {/* Security Threshold */}
        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1.5">
            Security Threshold [τ]
          </label>
          <select
            value={config.securityThreshold}
            onChange={e => updateField('securityThreshold', Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-cyan-500/80"
          >
            <option value={0.020}>0.020 (Strict / Low-tolerance)</option>
            <option value={0.035}>0.035 (Sensitive)</option>
            <option value={0.050}>0.050 (Recommended Standard)</option>
            <option value={0.080}>0.080 (Optical Fiber Tolerant)</option>
            <option value={0.120}>0.120 (Permissive)</option>
          </select>
        </div>

        {/* PRNG Seed */}
        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1.5">
            PRNG Quantum Seed
          </label>
          <input
            type="text"
            value={config.seed}
            onChange={e => updateField('seed', e.target.value)}
            placeholder="AUTO (Hardware PRNG)"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80"
          />
        </div>
      </div>

      {/* Execute simulation button */}
      <div className="pt-2 flex justify-end">
        <Button
          type="button"
          disabled={isSimulating}
          variant="danger"
          size="lg"
          onClick={onRunSimulation}
          className="w-full sm:w-auto px-8"
        >
          {isSimulating ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span>SIMULATING ATTACK DISPERSION...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 mr-1 text-white" />
              <span>RUN ATTACK SIMULATION</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
