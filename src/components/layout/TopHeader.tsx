import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Cpu,
  Database,
  Bell,
  PlayCircle,
  HelpCircle,
  Menu,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Badge, Button } from '../ui/Primitives';

interface TopHeaderProps {
  onToggleSidebar?: () => void;
  onStartDemo?: () => void;
  onLaunchDemo?: () => void;
  activeView?: string;
  onNavigate?: (view: string) => void;
  activeSessionsCount?: number;
  securityStatus?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar = () => {},
  onStartDemo,
  onLaunchDemo,
  activeSessionsCount = 14,
  securityStatus = 'SECURE'
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const handleDemo = onStartDemo || onLaunchDemo || (() => {});

  const notifications = [
    {
      id: 'n1',
      title: 'Statistical Threshold Triggered',
      desc: 'Replay attack detected in session QDS-98244 (TVD 0.284 > τ 0.050)',
      time: '3m ago',
      type: 'critical'
    },
    {
      id: 'n2',
      title: 'High-Fidelity Teleportation Passed',
      desc: 'Authentic signature state verified for AUTH_QUANTUM_CORE_ALICE',
      time: '18m ago',
      type: 'success'
    },
    {
      id: 'n3',
      title: 'Channel Decoherence Warning',
      desc: 'Fiber link #3 reported 8.1% state dispersion on photon pulse',
      time: '31m ago',
      type: 'warning'
    }
  ];

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-[#0B0F17] border-b border-slate-800/50 shrink-0 sticky top-0 z-30">
      {/* Left side: Brand and Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-sm lg:hidden cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-950/60 border border-blue-600/40 flex items-center justify-center rounded-sm shadow-md shrink-0">
            <Cpu className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-widest text-slate-100 uppercase leading-none">
                QDS SENTINEL
              </span>
              <span className="px-1.5 py-0.5 rounded-sm bg-blue-500/10 border border-blue-500/30 text-[9px] font-mono text-blue-400 font-bold">
                SIH26141
              </span>
            </div>
            <div className="text-[10px] text-blue-400 font-mono leading-tight mt-0.5 hidden sm:block">
              <div>Quantum Digital</div>
              <div>Signature Framework</div>
            </div>
          </div>
        </div>
      </div>

      {/* Center/Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Judge Demo Mode Button */}
        <button
          onClick={handleDemo}
          className="bg-blue-950/70 hover:bg-blue-900/80 border border-blue-600/60 text-blue-300 font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-sm text-xs flex items-center gap-2 shadow-md shadow-blue-950/40 cursor-pointer transition-all"
          title="Launch step-by-step SIH Judge Demonstration"
        >
          <PlayCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <div className="text-left text-[11px] leading-tight font-mono">
            <div>DEMO</div>
            <div>MODE</div>
          </div>
        </button>

        {/* System info modal trigger */}
        <button
          onClick={() => setShowSystemInfo(!showSystemInfo)}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-sm transition-colors cursor-pointer"
          title="Quantum Protocol Information"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications flyout */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-sm transition-colors relative cursor-pointer"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B0F17] border border-slate-800 shadow-2xl p-4 z-50 rounded-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-blue-400" /> Security Notifications
                </span>
                <Badge variant="cyan">3 New</Badge>
              </div>
              <div className="space-y-2 mt-3 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-sm bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200 flex items-center gap-1.5 text-xs">
                        {n.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                        {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-800 hidden sm:block"></div>

        {/* Session and Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right text-[10px] font-mono leading-tight hidden sm:block">
            <div className="text-slate-500 font-bold uppercase tracking-wider">SESSION:</div>
            <div className="text-slate-400">QDS-98231-X</div>
            <div className="text-slate-500">Analyst: SR-4902</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
            SR
          </div>
        </div>
      </div>

      {/* System info modal */}
      {showSystemInfo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#0B0F17] border border-slate-800 rounded-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-slate-100 font-mono text-sm tracking-wider uppercase">
                  Quantum Digital Signature Protocol (SIH26141)
                </h3>
              </div>
              <button
                onClick={() => setShowSystemInfo(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong className="text-blue-400">Detection Methodology:</strong> QDS Sentinel does NOT rely on black-box heuristic machine learning classifiers. Security verification is grounded in the laws of quantum mechanics and statistical hypothesis testing:
              </p>
              <div className="p-3 rounded-sm bg-[#05070A] border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400">1. Quantum Teleportation of Signature Token |ψ_sig⟩ using EPR Bell Pairs (|Φ⁺⟩).</div>
                <div className="text-slate-400">2. Bell-State Measurement (BSM) and classical Pauli unitary correction (Xᵐ² Zᵐ¹).</div>
                <div className="text-slate-400">3. Projective Observable Sampling over N shots (N = 10,000 – 100,000).</div>
                <div className="text-slate-400">4. Calculation of Total Variation Distance: <span className="text-blue-400">D_TV = 0.5 × ∑ |p_exp - p_obs|</span>.</div>
                <div className="text-slate-400">5. Comparison against Security Boundary Threshold <span className="text-amber-400">τ = 0.050</span>.</div>
              </div>
              <p>
                Any eavesdropping, replay attempt, or state forgery irreversibly collapses the quantum wavefunction due to the <strong className="text-slate-100">Quantum No-Cloning Theorem</strong>, causing observed projective distributions to skew significantly beyond the allowable threshold.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => setShowSystemInfo(false)}>
                Acknowledge Protocol
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

