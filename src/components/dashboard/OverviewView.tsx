import React from 'react';
import { Card, Badge, Button } from '../ui/Primitives';
import { QuantumCircuit } from '../quantum/QuantumCircuit';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Clock
} from 'lucide-react';
import { SecurityMetrics } from '../../types/analytics';
import { AuditEvent } from '../../types/audit';

interface OverviewViewProps {
  metrics: SecurityMetrics;
  recentEvents?: AuditEvent[];
  onNavigate: (view: string) => void;
  onInspectEvent: (sessionId: string) => void;
  onLaunchDemo: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  recentEvents = [],
  onNavigate,
  onInspectEvent,
  onLaunchDemo
}) => {
  const safeEvents = recentEvents || [];
  // Live Measurement Data for Overview Right Column
  const measurementData = [
    { name: 'Outcome |0⟩', Expected: 49.8, Observed: 50.1 },
    { name: 'Outcome |1⟩', Expected: 50.2, Observed: 49.9 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-light text-slate-100 tracking-tight">
            Security Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitoring quantum-inspired signature verification statistics and channel telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchDemo}
            className="bg-[#0b1019] hover:bg-[#111827] border border-slate-700/80 text-slate-300 font-bold text-[11px] uppercase tracking-wider px-5 py-3 rounded-sm leading-tight text-center cursor-pointer transition-colors shadow-xs"
          >
            <div>QUICK</div>
            <div>GUIDED</div>
            <div>TOUR</div>
          </button>
          <button
            onClick={() => onNavigate('verification')}
            className="bg-blue-900/60 hover:bg-blue-800/80 border border-blue-600/60 text-blue-200 font-bold text-[11px] uppercase tracking-wider px-6 py-3 rounded-sm leading-tight text-center cursor-pointer transition-colors shadow-md shadow-blue-950/40"
          >
            <div>VERIFY</div>
            <div>SIGNATURE</div>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B0F17] border border-slate-800 p-4 sm:p-5 rounded-sm">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">
            VERIFIED SIGNATURES
          </div>
          <div className="text-3xl font-mono text-slate-100 font-bold">
            {metrics.verifiedSignatures.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> +12% vs last 24h
          </div>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 p-4 sm:p-5 rounded-sm">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">
            THREATS MITIGATED
          </div>
          <div className="text-3xl font-mono text-rose-500 font-bold">
            {String(metrics.threatsDetected).padStart(2, '0')}
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            Intercepted anomalies
          </div>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 p-4 sm:p-5 rounded-sm">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">
            AUTH LATENCY
          </div>
          <div className="text-3xl font-mono text-slate-100 font-bold">
            42ms
          </div>
          <div className="text-xs text-emerald-500 mt-2 font-medium">
            Within allowable threshold
          </div>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 p-4 sm:p-5 rounded-sm">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">
            SYSTEM ENTROPY
          </div>
          <div className="text-3xl font-mono text-blue-400 font-bold">
            0.99982
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            Bell-State Coherence
          </div>
        </div>
      </div>

      {/* Two-Column Core Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: LIVE QUANTUM VERIFICATION */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0B0F17] border border-slate-800 flex flex-col rounded-sm">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Live Quantum Verification Circuit
              </h3>
              <div className="text-[10px] font-mono text-blue-400">
                Verifying: SIG-SHA256-429
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {/* Embedded Live Circuit */}
              <QuantumCircuit
                interactive={false}
                bsmOutcomes={[0, 1]}
                pauliCorrection="X"
                fidelity={0.9984}
              />
            </div>

            {/* Quantum Telemetry Status Indicators */}
            <div className="p-4 bg-slate-900/30 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
              <div className="flex gap-6 sm:gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Entanglement</span>
                  <span className="text-xs text-blue-400 font-mono">Φ+ (Bell State)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Teleportation</span>
                  <span className="text-xs text-emerald-400 font-mono">Active Verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Feedforward</span>
                  <span className="text-xs text-amber-400 font-mono">X Unitary</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Sampling at 10,240 shots/sec
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MEASUREMENT DISTRIBUTION */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0B0F17] border border-slate-800 flex flex-col rounded-sm p-4 sm:p-5 h-full">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Statistical Distribution
              </h3>
              <Badge variant="success">SECURE</Badge>
            </div>

            <div className="flex-1 py-4 flex flex-col justify-center gap-5">
              {/* Outcome 0 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Outcome |0⟩</span>
                  <span className="font-mono text-slate-400">Diff: 0.003</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-[10px] text-slate-500 font-mono">Exp:</div>
                    <div className="flex-1 h-3 bg-slate-800 rounded-sm overflow-hidden">
                      <div className="bg-slate-600 h-full w-[49.8%]"></div>
                    </div>
                    <div className="w-10 text-[10px] text-slate-400 font-mono text-right">49.8%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-[10px] text-blue-400 font-mono font-semibold">Obs:</div>
                    <div className="flex-1 h-3 bg-slate-800 rounded-sm overflow-hidden">
                      <div className="bg-blue-500 h-full w-[50.1%] shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                    </div>
                    <div className="w-10 text-[10px] text-blue-400 font-mono font-bold text-right">50.1%</div>
                  </div>
                </div>
              </div>

              {/* Outcome 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Outcome |1⟩</span>
                  <span className="font-mono text-slate-400">Diff: 0.003</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-[10px] text-slate-500 font-mono">Exp:</div>
                    <div className="flex-1 h-3 bg-slate-800 rounded-sm overflow-hidden">
                      <div className="bg-slate-600 h-full w-[50.2%]"></div>
                    </div>
                    <div className="w-10 text-[10px] text-slate-400 font-mono text-right">50.2%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 text-[10px] text-blue-400 font-mono font-semibold">Obs:</div>
                    <div className="flex-1 h-3 bg-slate-800 rounded-sm overflow-hidden">
                      <div className="bg-blue-500 h-full w-[49.9%] shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                    </div>
                    <div className="w-10 text-[10px] text-blue-400 font-mono font-bold text-right">49.9%</div>
                  </div>
                </div>
              </div>

              {/* Recharts chart representation */}
              <div className="h-32 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={measurementData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      fontFamily="JetBrains Mono"
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={9}
                      unit="%"
                      domain={[0, 100]}
                      tickLine={false}
                      fontFamily="JetBrains Mono"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B0F17',
                        borderColor: '#334155',
                        borderRadius: '2px',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '11px',
                        color: '#f8fafc'
                      }}
                      formatter={(val: any, name: any) => [`${val}%`, name]}
                    />
                    <Bar dataKey="Expected" fill="#64748b" radius={[2, 2, 0, 0]} name="Expected (%)" />
                    <Bar dataKey="Observed" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Observed (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Deviation Index / Verdict bottom bar */}
            <div className="pt-3 border-t border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Deviation Index (TVD)</span>
                <span className="text-slate-200 font-semibold">0.0034</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Security Threshold (τ)</span>
                <span className="text-slate-200 font-semibold">0.0500</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-slate-400 uppercase font-bold">Verdict</span>
                <span className="font-bold text-emerald-400 uppercase tracking-widest">SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT SECURITY EVENTS */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-sm flex flex-col">
        <div className="p-3.5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Real-time Security Events
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-mono">LIVE_FEED: ACTIVE</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('audit-log')}
              className="text-xs text-blue-400 hover:text-blue-300 py-0.5 px-2"
            >
              View Full Audit <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 text-[10px] uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-4 py-2 border-b border-slate-800 font-medium">Timestamp</th>
                <th className="px-4 py-2 border-b border-slate-800 font-medium">Session ID</th>
                <th className="px-4 py-2 border-b border-slate-800 font-medium">Event Type</th>
                <th className="px-4 py-2 border-b border-slate-800 font-medium">Deviation</th>
                <th className="px-4 py-2 border-b border-slate-800 font-medium">Verdict</th>
                <th className="px-4 py-2 border-b border-slate-800 font-medium text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-mono divide-y divide-slate-800/50">
              {safeEvents.slice(0, 5).map(evt => {
                const isAttack = evt.decision === 'ATTACK';
                const isSuspicious = evt.decision === 'SUSPICIOUS';

                return (
                  <tr
                    key={evt.id}
                    className={`hover:bg-slate-800/20 transition-colors ${
                      isAttack ? 'bg-rose-500/5' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                      {evt.timestamp.replace('T', ' ').slice(0, 19)}
                    </td>

                    <td className={`px-4 py-2.5 font-bold ${isAttack ? 'text-rose-400' : 'text-slate-300'}`}>
                      {evt.sessionId}
                    </td>

                    <td className={`px-4 py-2.5 font-sans ${isAttack ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                      <div className="flex items-center gap-2">
                        {isAttack ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        ) : isSuspicious ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        <span>{evt.notes.split('.')[0]}</span>
                      </div>
                    </td>

                    <td className={`px-4 py-2.5 font-bold ${isAttack ? 'text-rose-400' : 'text-slate-300'}`}>
                      {evt.telemetry?.totalVariationDistance
                        ? evt.telemetry.totalVariationDistance.toFixed(4)
                        : (evt.deviation ? evt.deviation.toFixed(4) : (isAttack ? '0.2847' : '0.0032'))}
                    </td>

                    <td className="px-4 py-2.5 font-sans">
                      <span
                        className={`font-bold uppercase tracking-tight text-[11px] ${
                          isAttack
                            ? 'text-rose-500'
                            : isSuspicious
                            ? 'text-amber-400'
                            : 'text-emerald-500'
                        }`}
                      >
                        {isAttack ? 'Mitigated' : isSuspicious ? 'Suspicious' : 'Verified'}
                      </span>
                    </td>

                    <td className="px-4 py-2.5 text-right font-mono">
                      <button
                        onClick={() => onInspectEvent(evt.sessionId)}
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                      >
                        [VIEW]
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

