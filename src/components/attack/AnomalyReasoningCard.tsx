import React from 'react';
import { AttackSimulationResult } from '../../types/attack';
import { Card, Badge, Button } from '../ui/Primitives';
import { ShieldAlert, ShieldCheck, Activity, Info, FileText, CheckCircle2, Flame } from 'lucide-react';

interface AnomalyReasoningCardProps {
  result: AttackSimulationResult;
  onViewAudit?: () => void;
}

export const AnomalyReasoningCard: React.FC<AnomalyReasoningCardProps> = ({
  result,
  onViewAudit
}) => {
  const isAttack = result.decision.decision === 'ATTACK';
  const isSuspicious = result.decision.decision === 'SUSPICIOUS';

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Simulation Result Header Card */}
      <div className={`p-5 rounded-xl border ${isAttack ? 'bg-rose-950/30 border-rose-600/80 shadow-rose-950/60 shadow-xl' : 'bg-slate-900/80 border-slate-800'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl ${isAttack ? 'bg-rose-900/50 border border-rose-500/80 text-rose-300' : 'bg-cyan-950 border border-cyan-800 text-cyan-300'}`}>
              <Flame className="w-6 h-6 animate-threat-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">ATTACK SIMULATION COMPLETE</span>
                <Badge variant={isAttack ? 'danger' : 'warning'}>
                  {result.decision.decision}
                </Badge>
              </div>

              <h2 className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-0.5">
                {result.attackType.replace('_', ' ')} INJECTION RESULT
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Session ID: <strong className="text-slate-200">{result.sessionId}</strong> | Latency: <strong className="text-amber-300">{result.interceptionLatencyMs}ms</strong>
              </p>
            </div>
          </div>

          {onViewAudit && (
            <Button variant="secondary" size="sm" onClick={onViewAudit} className="text-xs font-mono">
              <FileText className="w-3.5 h-3.5 mr-1" /> Open Audit Record
            </Button>
          )}
        </div>
      </div>

      {/* 5 Main Metrics Specified in Prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Statistical Deviation
          </span>
          <div className="text-lg font-bold text-rose-400">
            {result.statisticalMetrics.deviation.toFixed(4)}
          </div>
          <span className="text-[10px] text-slate-400">
            Total Variation Dist.
          </span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Security Threshold
          </span>
          <div className="text-lg font-bold text-amber-300">
            {result.statisticalMetrics.threshold.toFixed(4)}
          </div>
          <span className="text-[10px] text-slate-400">
            Configured Limit [τ]
          </span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Threshold Status
          </span>
          <div className={`text-lg font-bold ${result.statisticalMetrics.deviation > result.statisticalMetrics.threshold ? 'text-rose-400' : 'text-emerald-400'}`}>
            {result.statisticalMetrics.deviation > result.statisticalMetrics.threshold ? 'EXCEEDED' : 'NORMAL'}
          </div>
          <span className="text-[10px] text-slate-400">
            {((result.statisticalMetrics.deviation / result.statisticalMetrics.threshold)).toFixed(1)}x Boundary
          </span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Estimated Attack Prob.
          </span>
          <div className="text-lg font-bold text-rose-300">
            {result.decision.attackProbability.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">
            Statistical confidence
          </span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Detection Decision
          </span>
          <div className={`text-sm font-bold mt-1 ${isAttack ? 'text-rose-400' : 'text-amber-300'}`}>
            {result.decision.decision === 'ATTACK' ? 'ATTACK DETECTED' : result.decision.decision}
          </div>
          <span className="text-[10px] text-slate-400">
            Automated verdict
          </span>
        </Card>
      </div>

      {/* Reasoning Chain: WHY was it detected? */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-slate-200 font-mono">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Why Was the Attack Detected? (Quantum-Statistical Reasoning)</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          {result.decision.scientificReason}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-300 font-semibold block">Quantum State Degradation:</span>
            <div className="text-slate-400">
              State Fidelity collapsed to <strong className="text-slate-200">{(result.statisticalMetrics.quantumFidelity * 100).toFixed(1)}%</strong> (Baseline: &gt;99.5%).
            </div>
            <div className="text-slate-400">
              Von Neumann Entropy Increase: <strong className="text-slate-200">+{result.statisticalMetrics.entropyIncrease}</strong>.
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-amber-300 font-semibold block">Hypothesis Testing Significance:</span>
            <div className="text-slate-400">
              Chi-Square χ² = <strong className="text-slate-200">{result.statisticalMetrics.chiSq}</strong> (p-value {result.statisticalMetrics.pVal < 0.001 ? '<0.001' : result.statisticalMetrics.pVal}).
            </div>
            <div className="text-slate-400">
              Probability of genuine signer occurrence is negligible.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
