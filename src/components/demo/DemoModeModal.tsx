import React, { useState } from 'react';
import { Card, Badge, Button } from '../ui/Primitives';
import {
  X,
  Play,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Repeat
} from 'lucide-react';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (view: string) => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView
}) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. SYSTEM ARCHITECTURE & QUANTUM TELEPORTATION',
      subtitle: 'Teleportation-based Quantum Digital Signatures (QDS)',
      badge: 'FOUNDATION',
      badgeVariant: 'cyan' as const,
      content: (
        <div className="space-y-3 font-mono text-xs text-slate-300">
          <p className="leading-relaxed">
            QDS Sentinel replaces classical asymmetric crypto vulnerabilities with unconditional security guaranteed by the laws of quantum mechanics.
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-300 font-bold block">Quantum Verification Flow:</span>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="p-1 px-1.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">1. Alice</span>
              <span>→ Prepares Signature State |ψ⟩</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="p-1 px-1.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">2. EPR</span>
              <span>→ Distributes Bell Pair |Φ⁺⟩ = 1/√2 (|00⟩ + |11⟩)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="p-1 px-1.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">3. Bob</span>
              <span>→ Receives Classical BSM bits & applies Pauli correction (X^m2 Z^m1)</span>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            The receiver reconstructs the quantum state and projects onto measurement bases to build empirical probability distributions.
          </p>
        </div>
      ),
      actionLabel: 'Explore Quantum Circuits',
      actionView: 'quantum-state'
    },
    {
      title: '2. LEGITIMATE SIGNATURE VERIFICATION',
      subtitle: 'Statistical Hypothesis Validation Within Error Bounds',
      badge: 'VERIFICATION',
      badgeVariant: 'success' as const,
      content: (
        <div className="space-y-3 font-mono text-xs text-slate-300">
          <p className="leading-relaxed">
            When an authentic signer transmits a quantum token across a low-loss channel, the reconstructed state exhibits near-unity fidelity.
          </p>
          <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 block">Observed TVD</span>
              <span className="text-emerald-400 font-bold text-base">0.0034</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Security Threshold (τ)</span>
              <span className="text-amber-300 font-bold text-base">0.0500</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">State Fidelity (F)</span>
              <span className="text-cyan-400 font-bold text-base">99.8%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Decision</span>
              <span className="text-emerald-400 font-bold text-base">LEGITIMATE</span>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            Statistical Total Variation Distance (TVD) remains well below the boundary τ = 0.050. The signature is confirmed cryptographically authentic.
          </p>
        </div>
      ),
      actionLabel: 'Open Verification Workflow',
      actionView: 'verification'
    },
    {
      title: '3. CYBER ATTACK INJECTION & ANOMALY DETECTION',
      subtitle: 'Teleportation Collapse Under Quantum Forgery & Replay',
      badge: 'ATTACK LAB',
      badgeVariant: 'danger' as const,
      content: (
        <div className="space-y-3 font-mono text-xs text-slate-300">
          <p className="leading-relaxed">
            By the <strong className="text-rose-400">No-Cloning Theorem</strong>, an adversary attempting signature forgery or replaying stale EPR pairs perturbs the entangled state.
          </p>
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Statistical Deviation (TVD):</span>
              <span className="text-rose-400 font-bold text-sm">0.2847 (5.7x Exceeded)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Estimated Attack Probability:</span>
              <span className="text-rose-300 font-bold text-sm">94.7%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Automated Verdict:</span>
              <span className="text-rose-400 font-bold text-sm">ATTACK DETECTED</span>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            No machine learning heuristics needed: the mathematical disturbance in projective measurement frequencies provides mathematical certainty of interference.
          </p>
        </div>
      ),
      actionLabel: 'Launch Attack Laboratory',
      actionView: 'attack-lab'
    },
    {
      title: '4. AUDIT FORENSICS & RESEARCH EXPERIMENTATION',
      subtitle: 'Immutable Provenance & Statistical Parameter Sweeps',
      badge: 'ANALYTICS & AUDIT',
      badgeVariant: 'purple' as const,
      content: (
        <div className="space-y-3 font-mono text-xs text-slate-300">
          <p className="leading-relaxed">
            Every quantum verification event is logged with full cryptographic token hashes, measurement counts, TVD scores, and p-values.
          </p>
          <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 block">Overall Accuracy</span>
              <span className="text-cyan-300 font-bold text-base">99.4%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">False Positive Rate</span>
              <span className="text-emerald-400 font-bold text-base">0.6%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Mean Latency</span>
              <span className="text-amber-300 font-bold text-base">8.4 ms</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Audit Export</span>
              <span className="text-slate-200 font-bold text-base">JSON / CSV</span>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            Researchers can run batch Monte Carlo experiments in the Experiments suite to evaluate detection robustness under fiber noise.
          </p>
        </div>
      ),
      actionLabel: 'View Security Analytics',
      actionView: 'security-analytics'
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#090d14] border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/80 p-6 sm:p-7 space-y-5 z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-700 text-cyan-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  QDS Sentinel Guided Judge Demonstration
                </span>
                <Badge variant={currentStep.badgeVariant} className="text-[9px]">
                  {currentStep.badge}
                </Badge>
              </div>
              <h2 className="text-base font-bold font-mono text-slate-100 mt-0.5">
                {currentStep.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center justify-between gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                i === step
                  ? 'bg-cyan-400 shadow-sm shadow-cyan-400'
                  : i < step
                  ? 'bg-cyan-800'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="py-2">{currentStep.content}</div>

        {/* Navigation Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onNavigateToView(currentStep.actionView);
              onClose();
            }}
            className="w-full sm:w-auto text-xs font-mono text-cyan-300 border-cyan-800/60"
          >
            <Play className="w-3.5 h-3.5 mr-1" /> {currentStep.actionLabel}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {step > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
              </Button>
            )}

            {step < steps.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(step + 1)}
                className="text-xs font-mono"
              >
                Next Step ({step + 2}/{steps.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
                className="text-xs font-mono"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete Walkthrough
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
