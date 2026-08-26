import React from 'react';
import { AuditEvent } from '../../types/audit';
import { Badge, Button } from '../ui/Primitives';
import { X, ShieldAlert, ShieldCheck, Activity, Copy, Download, Hash } from 'lucide-react';

interface AuditDrawerProps {
  event: AuditEvent | null;
  onClose: () => void;
}

export const AuditDrawer: React.FC<AuditDrawerProps> = ({ event, onClose }) => {
  if (!event) return null;

  const isAttack = event.decision === 'ATTACK';
  const isSuspicious = event.decision === 'SUSPICIOUS';

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#090d14] border-l border-slate-800 shadow-2xl p-6 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg border ${
                  isAttack
                    ? 'bg-rose-950/60 border-rose-600/80 text-rose-300'
                    : isSuspicious
                    ? 'bg-amber-950/60 border-amber-600/80 text-amber-300'
                    : 'bg-emerald-950/60 border-emerald-600/80 text-emerald-300'
                }`}
              >
                {isAttack ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400">AUDIT EVENT INSPECTOR</span>
                <h3 className="text-base font-bold font-mono text-slate-100">
                  {event.sessionId}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Decision Summary */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Security Decision:</span>
              <Badge
                variant={isAttack ? 'danger' : isSuspicious ? 'warning' : 'success'}
                className="text-xs"
              >
                {event.decision}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Severity Classification:</span>
              <Badge
                variant={
                  event.severity === 'CRITICAL'
                    ? 'danger'
                    : event.severity === 'HIGH'
                    ? 'warning'
                    : 'cyan'
                }
              >
                {event.severity}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Attack Vector:</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {event.attackType === 'NONE' ? 'None (Benign Authentic)' : event.attackType}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Timestamp (UTC):</span>
              <span className="text-xs font-mono text-slate-300">{event.timestamp}</span>
            </div>
          </div>

          {/* Statistical Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Quantum Telemetry & Hypothesis Metrics
            </h4>
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Observed TVD (Deviation)</span>
                <span className={`text-base font-bold ${event.deviation > event.threshold ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {event.deviation.toFixed(4)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Security Threshold (τ)</span>
                <span className="text-base font-bold text-amber-300">
                  {event.threshold.toFixed(4)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">State Fidelity (F)</span>
                <span className="text-base font-bold text-cyan-400">
                  {(event.fidelity * 100).toFixed(2)}%
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Detection Latency</span>
                <span className="text-base font-bold text-slate-200">
                  {event.latencyMs} ms
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic Identifiers */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Cryptographic Tokens
            </h4>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">Signer Authority Node</span>
              <div className="flex items-center justify-between text-slate-200">
                <code className="text-cyan-300">{event.signerId}</code>
                <button
                  onClick={() => copyToClipboard(event.signerId)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">Signature Identifier</span>
              <div className="flex items-center justify-between text-slate-200">
                <code className="text-slate-300">{event.signatureId}</code>
                <button
                  onClick={() => copyToClipboard(event.signatureId)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">Payload Digest Hash</span>
              <div className="flex items-center justify-between text-slate-200">
                <code className="text-amber-300 break-all text-[11px]">{event.messageHash}</code>
                <button
                  onClick={() => copyToClipboard(event.messageHash)}
                  className="text-slate-500 hover:text-slate-300 p-1 flex-shrink-0 ml-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Audit Notes */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Audit Notes & Cryptographic Evidence
            </h4>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
              {event.notes}
            </div>
          </div>

          {/* Raw Payload JSON */}
          {event.rawPayload && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Raw Telemetry Payload
              </h4>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-48">
                {JSON.stringify(event.rawPayload, null, 2)}
              </pre>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="secondary" onClick={onClose}>
              Close Inspector
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
