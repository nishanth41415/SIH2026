import React from 'react';
import { PipelineStage } from '../../types/verification';
import { Card, Badge } from '../ui/Primitives';
import { CheckCircle2, Clock, PlayCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface VerificationPipelineProps {
  stages?: PipelineStage[];
  currentStageId?: number;
}

export const VerificationPipeline: React.FC<VerificationPipelineProps> = ({
  stages = [],
  currentStageId
}) => {
  const safeStages = stages || [];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Verification Execution Pipeline
          </h3>
          <p className="text-[11px] text-slate-400">
            8-Stage Teleportation & Statistical Security Decision Flow
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/60">
          Stages 1 → 8
        </span>
      </div>

      {/* Pipeline Stages Grid / Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {safeStages.map((stage, idx) => {
          const isCompleted = stage.status === 'completed';
          const isRunning = stage.status === 'running';
          const isFailed = stage.status === 'failed';

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border text-xs transition-all relative ${
                isRunning
                  ? 'bg-cyan-950/50 border-cyan-500 shadow-md shadow-cyan-950/60 ring-1 ring-cyan-500'
                  : isCompleted
                  ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                  : 'bg-slate-950/60 border-slate-900 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/60">
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  STEP 0{stage.id}
                </span>

                {isCompleted && (
                  <Badge variant="success" className="text-[9px] px-1.5 py-0">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> DONE
                  </Badge>
                )}

                {isRunning && (
                  <Badge variant="cyan" className="text-[9px] px-1.5 py-0 animate-pulse">
                    <PlayCircle className="w-2.5 h-2.5 mr-1" /> RUNNING
                  </Badge>
                )}

                {!isCompleted && !isRunning && !isFailed && (
                  <span className="text-[10px] text-slate-600 font-mono">PENDING</span>
                )}
              </div>

              <div className="font-semibold text-slate-200 text-xs mb-1">
                {stage.name}
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {stage.description}
              </p>

              {stage.telemetryNote && (
                <div className="mt-2 pt-1.5 border-t border-slate-800/60 font-mono text-[10px] text-cyan-300 truncate">
                  &gt; {stage.telemetryNote}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
