import React from 'react';
import { SecurityMetrics } from '../../types/analytics';
import { Card } from '../ui/Primitives';
import { ShieldCheck, ShieldAlert, Activity, CheckCircle, Clock, Zap } from 'lucide-react';

interface ThreatMetricCardsProps {
  metrics: SecurityMetrics;
}

export const ThreatMetricCards: React.FC<ThreatMetricCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
      <Card className="p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-semibold">Total Signatures</span>
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-xl font-bold text-slate-100">{metrics.totalSignatures}</div>
        <span className="text-[10px] text-emerald-400">Active QDS Sessions</span>
      </Card>

      <Card className="p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-semibold">Verified Valid</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-xl font-bold text-emerald-400">{metrics.verifiedSignatures}</div>
        <span className="text-[10px] text-slate-400">High-fidelity teleport</span>
      </Card>

      <Card className="p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-semibold">Threats Intercepted</span>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div className="text-xl font-bold text-rose-400">{metrics.threatsDetected}</div>
        <span className="text-[10px] text-slate-400">Anomalies blocked</span>
      </Card>

      <Card className="p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-semibold">Verification Accuracy</span>
          <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-xl font-bold text-cyan-300">{metrics.accuracyRate}%</div>
        <span className="text-[10px] text-slate-400">FPR: {metrics.falsePositiveRate}%</span>
      </Card>

      <Card className="p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-semibold">Detection Latency</span>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-xl font-bold text-amber-300">{metrics.meanDetectionLatencyMs} ms</div>
        <span className="text-[10px] text-slate-400">Avg execution time</span>
      </Card>

      <Card className="p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-semibold">Mean State Fidelity</span>
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="text-xl font-bold text-indigo-300">{(metrics.meanQuantumFidelity * 100).toFixed(1)}%</div>
        <span className="text-[10px] text-slate-400">Target state overlap</span>
      </Card>
    </div>
  );
};
