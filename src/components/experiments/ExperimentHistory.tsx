import React from 'react';
import { ExperimentRunResult } from '../../types/experiment';
import { Card, Badge, Button } from '../ui/Primitives';
import { FlaskConical, CheckCircle2, ShieldAlert, Clock, Activity, FileText } from 'lucide-react';

interface ExperimentHistoryProps {
  experiments?: ExperimentRunResult[];
}

export const ExperimentHistory: React.FC<ExperimentHistoryProps> = ({ experiments = [] }) => {
  const safeExperiments = experiments || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Experiment Log History ({safeExperiments.length})
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">Statistical Artifacts</span>
      </div>

      <div className="space-y-3">
        {safeExperiments.map(exp => {
          const isCompromised = exp.finalVerdict === 'SYSTEM_COMPROMISED';
          const isIntercepted = exp.finalVerdict === 'ANOMALIES_INTERCEPTED';
          const isPassed = exp.finalVerdict === 'PASSED_SECURE';

          return (
            <Card
              key={exp.id}
              className="p-4 space-y-3 hover:border-slate-700 transition-colors bg-[#090d14]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <FlaskConical className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 font-mono">{exp.name}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ID: {exp.id} | Date: {exp.date}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={isCompromised ? 'danger' : isIntercepted ? 'warning' : 'success'}
                  className="self-start sm:self-auto"
                >
                  {exp.finalVerdict.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Threat Detection Rate</span>
                  <span className="text-sm font-bold text-cyan-400">{exp.detectionRate}%</span>
                  <span className="text-[10px] text-slate-500 block">
                    ({exp.detectedThreats}/{exp.totalTrials} Trials)
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Mean TVD Deviation</span>
                  <span className="text-sm font-bold text-amber-300">{exp.avgDeviation.toFixed(4)}</span>
                  <span className="text-[10px] text-slate-500 block">
                    Max: {exp.maxDeviation.toFixed(4)}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Mean State Fidelity</span>
                  <span className="text-sm font-bold text-indigo-300">{(exp.avgFidelity * 100).toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 block">Overlap metric</span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Avg Iteration Latency</span>
                  <span className="text-sm font-bold text-slate-200">{exp.avgLatencyMs} ms</span>
                  <span className="text-[10px] text-slate-500 block">N = {exp.config.measurementShots}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>
                  Config: Vector=<strong>{exp.config.attackType}</strong> | Intensity=<strong>{exp.config.attackIntensity}%</strong> | Noise=<strong>{exp.config.noiseLevel}%</strong>
                </span>
                <span className="text-slate-500">τ = {exp.config.securityThreshold.toFixed(3)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
