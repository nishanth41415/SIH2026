import React from 'react';
import { VerificationResult } from '../../types/verification';
import { Card, Badge, Button } from '../ui/Primitives';
import { MeasurementResultsView } from '../quantum/MeasurementResultsView';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Activity,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';

interface VerificationResultCardProps {
  result: VerificationResult;
  onInspectAudit?: (sessionId: string) => void;
}

export const VerificationResultCard: React.FC<VerificationResultCardProps> = ({
  result,
  onInspectAudit
}) => {
  const isLegitimate = result.status === 'LEGITIMATE';
  const isSuspicious = result.status === 'SUSPICIOUS';
  const isAttack = result.status === 'ATTACK';

  const statusConfig = {
    LEGITIMATE: {
      title: 'VERIFICATION PASSED: SIGNATURE AUTHENTIC',
      badgeVariant: 'success' as const,
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20 border-emerald-800/60',
      textColor: 'text-emerald-300'
    },
    SUSPICIOUS: {
      title: 'SUSPICIOUS ACTIVITY: THRESHOLD MARGINAL DRIFT',
      badgeVariant: 'warning' as const,
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-950/20 border-amber-800/60',
      textColor: 'text-amber-300'
    },
    ATTACK: {
      title: 'ATTACK DETECTED: QUANTUM SIGNATURE COMPROMISED',
      badgeVariant: 'danger' as const,
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      bgColor: 'bg-rose-950/20 border-rose-800/60',
      textColor: 'text-rose-300'
    }
  }[result.status];

  const Icon = statusConfig.icon;

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
      {/* Primary Result Banner */}
      <div
        className={`rounded-xl border p-5 ${statusConfig.bgColor} shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner ${statusConfig.iconColor}`}>
            <Icon className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">SESSION: {result.sessionId}</span>
              <Badge variant={statusConfig.badgeVariant}>{result.status}</Badge>
            </div>
            <h2 className={`text-lg sm:text-xl font-bold font-mono tracking-tight mt-0.5 ${statusConfig.textColor}`}>
              {statusConfig.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-mono">
              Signer: <strong className="text-slate-100">{result.signerId}</strong> | Signature: <strong className="text-slate-100">{result.signatureId}</strong>
            </p>
          </div>
        </div>

        {onInspectAudit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onInspectAudit(result.sessionId)}
            className="text-xs font-mono whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 mr-1" /> View Audit Entry
          </Button>
        )}
      </div>

      {/* Scientific Evidence Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Statistical Deviation (TVD)
          </span>
          <div className="text-lg font-bold text-slate-100 flex items-center gap-1.5">
            <span className={result.decision.deviation > result.decision.threshold ? 'text-rose-400' : 'text-emerald-400'}>
              {result.decision.deviation.toFixed(4)}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              / τ {result.decision.threshold.toFixed(3)}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            {result.decision.deviation <= result.decision.threshold ? '✓ Within tolerance' : '⚠ Threshold exceeded'}
          </span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Quantum State Fidelity (F)
          </span>
          <div className="text-lg font-bold text-cyan-300">
            {(result.telemetry.fidelity * 100).toFixed(2)}%
          </div>
          <span className="text-[10px] text-slate-400">
            F(ρ_teleport, ρ_target)
          </span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Estimated Forgery Prob.
          </span>
          <div className={`text-lg font-bold ${result.decision.forgeryProbability > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {result.decision.forgeryProbability.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">
            Hypothesis confidence
          </span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
            Verification Latency
          </span>
          <div className="text-lg font-bold text-amber-300">
            {result.decision.detectionLatencyMs} ms
          </div>
          <span className="text-[10px] text-slate-400">
            N = {result.distribution.shots.toLocaleString()} shots
          </span>
        </Card>
      </div>

      {/* Measurement Distribution Chart */}
      <MeasurementResultsView
        distribution={result.distribution}
        threshold={result.decision.threshold}
        title="Teleported State Verification Measurement (Pauli Z Basis)"
      />

      {/* Detailed Scientific Reasoning Card */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 font-mono pb-2 border-b border-slate-800">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Scientific Threat Assessment & Quantum Evidence</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          {result.decision.scientificReason}
        </p>

        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase block">
            Empirical Evidence Points:
          </span>
          <ul className="space-y-1 text-[11px] font-mono text-slate-400">
            {(result.decision?.evidence || []).map((ev, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};
