import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle, Radio } from 'lucide-react';
import { Badge, Button } from '../ui/Primitives';

interface QuantumCircuitProps {
  interactive?: boolean;
  activeStep?: number;
  highlightAttack?: boolean;
  bsmOutcomes?: [0 | 1, 0 | 1];
  pauliCorrection?: string;
  fidelity?: number;
}

export const QuantumCircuit: React.FC<QuantumCircuitProps> = ({
  interactive = true,
  activeStep = 0,
  highlightAttack = false,
  bsmOutcomes = [0, 1],
  pauliCorrection = 'X',
  fidelity = 0.998
}) => {
  const [hoveredGate, setHoveredGate] = useState<string | null>(null);

  const gateInfo: Record<string, { title: string; math: string; desc: string }> = {
    H1: {
      title: 'Hadamard Gate (H)',
      math: 'H = 1/√2 [ [1, 1], [1, -1] ]',
      desc: 'Creates a symmetric superposition state: H|0⟩ = (|0⟩ + |1⟩)/√2.'
    },
    CNOT1: {
      title: 'Controlled-NOT (CNOT) Entangler',
      math: '|x, y⟩ → |x, x ⊕ y⟩',
      desc: 'Entangles Alice & Bob qubits into EPR Bell state |Φ⁺⟩ = 1/√2(|00⟩ + |11⟩).'
    },
    BSM_CNOT: {
      title: 'Bell-State Measurement: CNOT',
      math: 'CNOT_{0→1}',
      desc: 'Disentangles state vector into Bell basis for parity discrimination.'
    },
    BSM_H: {
      title: 'Bell-State Measurement: Hadamard',
      math: 'H_0',
      desc: 'Rotates relative phase into computational Z basis.'
    },
    MEASURE_A: {
      title: 'Alice Projective Detector (m₁, m₂)',
      math: 'M_Z ⊗ M_Z',
      desc: `Yields classical bits (${bsmOutcomes[0]}, ${bsmOutcomes[1]}) for transmission via classical authenticated channel.`
    },
    PAULI: {
      title: `Pauli Correction Unit (${pauliCorrection})`,
      math: 'U = X^{m₂} Z^{m₁}',
      desc: `Applies conditional Pauli ${pauliCorrection} unitary transformation to reconstruct exact signature qubit.`
    },
    MEASURE_B: {
      title: 'Bob Verification Detector',
      math: 'P_{0,1} = |⟨0,1|ψ\'⟩|²',
      desc: 'Samples N projective shots to construct empirical probability distribution.'
    }
  };

  return (
    <div className="space-y-4">
      {/* Circuit Canvas Container */}
      <div className="relative overflow-x-auto rounded-sm border border-slate-800 bg-[#05070A] p-4 sm:p-5 shadow-inner">
        {/* Circuit Status Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">QUANTUM TELEPORTATION CIRCUIT</span>
            {highlightAttack && (
              <Badge variant="danger" className="text-[10px]">
                ANOMALY DETECTED ON FIBER
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Fidelity: <strong className={fidelity > 0.9 ? 'text-blue-400' : 'text-rose-400'}>{(fidelity * 100).toFixed(1)}%</strong></span>
            <span>Correction: <strong className="text-amber-400 font-mono">{pauliCorrection}</strong></span>
          </div>
        </div>

        {/* SVG Quantum Circuit Wire Diagram */}
        <svg
          viewBox="0 0 880 230"
          className="w-full min-w-[760px] h-auto select-none"
        >
          {/* Background Grid Accent */}
          <defs>
            <linearGradient id="wireGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="attackGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Section Dividers */}
          {/* Bell Pair Prep */}
          <rect x="130" y="10" width="160" height="210" rx="4" fill="#0B0F17" fillOpacity="0.5" stroke="#1e293b" strokeDasharray="3 3" />
          <text x="210" y="28" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">BELL PAIR PREP (EPR)</text>

          {/* Alice Bell-State Measurement */}
          <rect x="310" y="10" width="220" height="210" rx="4" fill="#0B0F17" fillOpacity="0.5" stroke="#1e293b" strokeDasharray="3 3" />
          <text x="420" y="28" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">BELL-STATE MEASUREMENT (BSM)</text>

          {/* Classical Feedforward Channel */}
          <rect x="550" y="10" width="130" height="210" rx="4" fill="#0B0F17" fillOpacity="0.5" stroke="#1e293b" strokeDasharray="3 3" />
          <text x="615" y="28" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">FEEDFORWARD (m₁,m₂)</text>

          {/* Bob Pauli Correction & Verification */}
          <rect x="700" y="10" width="170" height="210" rx="4" fill="#0B0F17" fillOpacity="0.5" stroke="#1e293b" strokeDasharray="3 3" />
          <text x="785" y="28" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">CORRECTION & VERIFICATION</text>

          {/* Wire 1: Alice Signature Qubit |psi_sig> */}
          <text x="30" y="65" fill="#60a5fa" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">q₀: |ψ_sig⟩</text>
          <line x1="110" y1="60" x2="510" y2="60" stroke="#334155" strokeWidth="2" />
          {/* Classical wire continuation */}
          <line x1="520" y1="58" x2="720" y2="58" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="520" y1="62" x2="720" y2="62" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Wire 2: Alice Entangled Qubit */}
          <text x="30" y="125" fill="#93c5fd" fontSize="12" fontFamily="JetBrains Mono">q₁: |0⟩_A</text>
          <line x1="110" y1="120" x2="510" y2="120" stroke="#334155" strokeWidth="2" />
          {/* Classical wire continuation */}
          <line x1="520" y1="118" x2="720" y2="118" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="520" y1="122" x2="720" y2="122" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Wire 3: Bob Qubit (Receives Teleported State) */}
          <text x="30" y="185" fill="#34d399" fontSize="12" fontFamily="JetBrains Mono">q₂: |0⟩_B</text>
          <line x1="110" y1="180" x2="840" y2="180" stroke={highlightAttack ? "url(#attackGlow)" : "url(#wireGlow)"} strokeWidth="2" />

          {/* GATES */}

          {/* Gate 1: H on q1 */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onMouseEnter={() => setHoveredGate('H1')}
            onMouseLeave={() => setHoveredGate(null)}
          >
            <rect x="150" y="102" width="36" height="36" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="168" y="125" fill="#e0e7ff" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">H</text>
          </g>

          {/* Gate 2: CNOT between q1 and q2 */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredGate('CNOT1')}
            onMouseLeave={() => setHoveredGate(null)}
          >
            <line x1="240" y1="120" x2="240" y2="180" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="240" cy="120" r="5" fill="#3b82f6" />
            <circle cx="240" cy="180" r="14" fill="#0B0F17" stroke="#3b82f6" strokeWidth="2" />
            <line x1="240" y1="168" x2="240" y2="192" stroke="#3b82f6" strokeWidth="2" />
            <line x1="228" y1="180" x2="252" y2="180" stroke="#3b82f6" strokeWidth="2" />
          </g>

          {/* Alice BSM: CNOT between q0 and q1 */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredGate('BSM_CNOT')}
            onMouseLeave={() => setHoveredGate(null)}
          >
            <line x1="340" y1="60" x2="340" y2="120" stroke="#60a5fa" strokeWidth="2" />
            <circle cx="340" cy="60" r="5" fill="#60a5fa" />
            <circle cx="340" cy="120" r="14" fill="#0B0F17" stroke="#60a5fa" strokeWidth="2" />
            <line x1="340" y1="108" x2="340" y2="132" stroke="#60a5fa" strokeWidth="2" />
            <line x1="328" y1="120" x2="352" y2="120" stroke="#60a5fa" strokeWidth="2" />
          </g>

          {/* Alice BSM: H on q0 */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onMouseEnter={() => setHoveredGate('BSM_H')}
            onMouseLeave={() => setHoveredGate(null)}
          >
            <rect x="400" y="42" width="36" height="36" rx="4" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
            <text x="418" y="65" fill="#dbeafe" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">H</text>
          </g>

          {/* Measurement Box for q0 */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredGate('MEASURE_A')}
            onMouseLeave={() => setHoveredGate(null)}
          >
            <rect x="470" y="42" width="36" height="36" rx="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 478 68 Q 488 50 498 68" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="488" y1="68" x2="495" y2="52" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x="488" y="38" fill="#60a5fa" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">m₁={bsmOutcomes[0]}</text>
          </g>

          {/* Measurement Box for q1 */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredGate('MEASURE_A')}
            onMouseLeave={() => setHoveredGate(null)}
          >
            <rect x="470" y="102" width="36" height="36" rx="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 478 128 Q 488 110 498 128" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="488" y1="128" x2="495" y2="112" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x="488" y="98" fill="#93c5fd" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">m₂={bsmOutcomes[1]}</text>
          </g>

          {/* Pauli Unitary Correction on q2 */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onMouseEnter={() => setHoveredGate('PAULI')}
            onMouseLeave={() => setHoveredGate(null)}
          >
            <line x1="590" y1="60" x2="590" y2="162" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="590" y1="162" x2="720" y2="162" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="715" y="162" width="46" height="36" rx="4" fill="#332200" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="738" y="185" fill="#fef3c7" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
              {pauliCorrection}
            </text>
          </g>

          {/* Bob Final Measurement */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHoveredGate('MEASURE_B')}
            onMouseLeave={() => setHoveredGate(null)}
          >
            <rect x="790" y="162" width="36" height="36" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <path d="M 798 188 Q 808 170 818 188" fill="none" stroke="#a7f3d0" strokeWidth="1.5" />
            <line x1="808" y1="188" x2="815" y2="172" stroke="#a7f3d0" strokeWidth="1.5" />
            <text x="808" y="212" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">|ψ'⟩</text>
          </g>

          {/* Active Animated Pulse */}
          <circle cx="200" cy="180" r="4" fill="#60a5fa" className="animate-ping" opacity="0.6" />
          <circle cx="750" cy="180" r="4" fill="#f59e0b" className="animate-ping" opacity="0.6" />
        </svg>

        {/* Dynamic Gate Information Card on hover */}
        {hoveredGate && gateInfo[hoveredGate] && (
          <div className="mt-3 p-3 rounded-sm bg-[#0B0F17] border border-slate-700 text-xs">
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
              <span className="font-semibold text-blue-400 font-mono">{gateInfo[hoveredGate].title}</span>
              <code className="text-slate-400 font-mono text-[11px]">{gateInfo[hoveredGate].math}</code>
            </div>
            <p className="text-slate-300 text-[11px]">{gateInfo[hoveredGate].desc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

