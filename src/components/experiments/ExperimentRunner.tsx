import React, { useState } from 'react';
import { ExperimentConfig, ExperimentRunResult } from '../../types/experiment';
import { Card, Button, Badge } from '../ui/Primitives';
import { FlaskConical, Play, Sparkles, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

interface ExperimentRunnerProps {
  onRunExperiment: (
    config: ExperimentConfig,
    onProgress: (done: number, total: number) => void
  ) => Promise<ExperimentRunResult>;
  isExecuting: boolean;
}

export const ExperimentRunner: React.FC<ExperimentRunnerProps> = ({
  onRunExperiment,
  isExecuting
}) => {
  const [name, setName] = useState('EPR Teleportation Noise Permutation Test');
  const [attackType, setAttackType] = useState<ExperimentConfig['attackType']>('CHANNEL_MANIPULATION');
  const [attackIntensity, setAttackIntensity] = useState(50);
  const [noiseLevel, setNoiseLevel] = useState(30);
  const [measurementShots, setMeasurementShots] = useState(10000);
  const [securityThreshold, setSecurityThreshold] = useState(0.050);
  const [repetitions, setRepetitions] = useState(40);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const presets = [
    {
      name: 'Replay Attack Sensitivity Sweep',
      attack: 'REPLAY' as const,
      intensity: 75,
      noise: 10,
      shots: 10000,
      threshold: 0.050,
      reps: 50
    },
    {
      name: 'Decoherence Noise Baseline Test',
      attack: 'CHANNEL_MANIPULATION' as const,
      intensity: 30,
      noise: 45,
      shots: 15000,
      threshold: 0.050,
      reps: 40
    },
    {
      name: 'Authentic Signatures Control Group',
      attack: 'BENIGN_TEST' as const,
      intensity: 0,
      noise: 5,
      shots: 20000,
      threshold: 0.050,
      reps: 100
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setName(p.name);
    setAttackType(p.attack);
    setAttackIntensity(p.intensity);
    setNoiseLevel(p.noise);
    setMeasurementShots(p.shots);
    setSecurityThreshold(p.threshold);
    setRepetitions(p.reps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProgress({ done: 0, total: repetitions });
    try {
      await onRunExperiment(
        {
          name,
          attackType,
          attackIntensity,
          noiseLevel,
          measurementShots,
          securityThreshold,
          repetitions
        },
        (done, total) => {
          setProgress({ done, total });
        }
      );
    } finally {
      setProgress(null);
    }
  };

  return (
    <Card className="space-y-4 bg-[#0a0e16]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-700/60">
            <FlaskConical className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 font-mono">
              Research Experiment Runner
            </h3>
            <p className="text-[11px] text-slate-400">
              Run Monte Carlo statistical parameter sweeps across repeated quantum measurement trials
            </p>
          </div>
        </div>

        <Badge variant="purple">RESEARCH SUITE</Badge>
      </div>

      {/* Preset configurations */}
      <div>
        <label className="text-[10px] font-mono text-slate-400 block mb-1.5 font-semibold uppercase">
          Experiment Benchmark Presets:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyPreset(p)}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-left text-xs transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-200 truncate">{p.name}</div>
              <div className="text-[10px] text-indigo-300 font-mono mt-0.5">
                {p.attack} | {p.reps} Trials
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1">
            Experiment Protocol Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Attack Vector</label>
            <select
              value={attackType}
              onChange={e => setAttackType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
            >
              <option value="BENIGN_TEST">Benign Control Group (No Attack)</option>
              <option value="FORGERY">FORGERY (State Fabrication)</option>
              <option value="REPLAY">REPLAY (Stale EPR Reuse)</option>
              <option value="IMPERSONATION">IMPERSONATION (Identity Hijack)</option>
              <option value="CHANNEL_MANIPULATION">CHANNEL_MANIPULATION (Fiber Noise)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Trial Repetitions: <strong className="text-cyan-300">{repetitions}</strong>
            </label>
            <select
              value={repetitions}
              onChange={e => setRepetitions(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
            >
              <option value={20}>20 Iterations (Quick Sweep)</option>
              <option value={40}>40 Iterations</option>
              <option value={50}>50 Iterations (Standard Sample)</option>
              <option value={100}>100 Iterations (Cryptographic Sample)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Shots per Iteration: <strong className="text-cyan-300">{measurementShots.toLocaleString()}</strong>
            </label>
            <select
              value={measurementShots}
              onChange={e => setMeasurementShots(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
            >
              <option value={5000}>5,000 Shots</option>
              <option value={10000}>10,000 Shots</option>
              <option value={20000}>20,000 Shots</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Attack Intensity</span>
              <span className="text-rose-400 font-bold">{attackIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={attackIntensity}
              onChange={e => setAttackIntensity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded accent-rose-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Channel Noise Level</span>
              <span className="text-amber-300 font-bold">{noiseLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={noiseLevel}
              onChange={e => setNoiseLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded accent-amber-500"
            />
          </div>
        </div>

        {/* Progress bar during run */}
        {progress && (
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-700/60 space-y-2">
            <div className="flex justify-between text-xs font-mono text-indigo-200">
              <span>Executing Monte Carlo Quantum Run...</span>
              <span>
                {progress.done} / {progress.total} Trials (
                {Math.round((progress.done / progress.total) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-400 h-full transition-all duration-150"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isExecuting}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
          >
            {isExecuting ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2" />
                <span>COMPUTING BATCH SIMULATION...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1 text-slate-950" />
                <span>RUN RESEARCH EXPERIMENT</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
