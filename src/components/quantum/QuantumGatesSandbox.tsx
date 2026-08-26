import React, { useState, useEffect } from 'react';
import { QuantumGateType, QubitState } from '../../types/quantum';
import { createQubitState } from '../../services/quantumEngine';
import { Card, Badge, Button } from '../ui/Primitives';
import { RotateCcw, Zap, Info } from 'lucide-react';

interface QuantumGatesSandboxProps {
  currentState?: QubitState;
  onApplyTransformation?: (state: QubitState) => void;
}

export const QuantumGatesSandbox: React.FC<QuantumGatesSandboxProps> = ({
  currentState,
  onApplyTransformation
}) => {
  const [internalQubit, setInternalQubit] = useState<QubitState>(() => 
    currentState || createQubitState(0, 0, '|0⟩ Ground State')
  );
  const [appliedGates, setAppliedGates] = useState<QuantumGateType[]>([]);
  const [activeInfoGate, setActiveInfoGate] = useState<QuantumGateType | null>('H');

  useEffect(() => {
    if (currentState) {
      setInternalQubit(currentState);
    }
  }, [currentState]);

  const qubit = currentState || internalQubit;

  const safeAlpha = typeof qubit?.alpha === 'number'
    ? qubit.alpha
    : (typeof (qubit?.alpha as unknown as { real?: number })?.real === 'number'
      ? (qubit?.alpha as unknown as { real: number }).real
      : 1);

  const safeBeta = typeof qubit?.beta === 'number'
    ? qubit.beta
    : (typeof (qubit?.beta as unknown as { real?: number })?.real === 'number'
      ? (qubit?.beta as unknown as { real: number }).real
      : 0);

  const gateMatrixInfo: Record<QuantumGateType, { name: string; matrix: string; effect: string }> = {
    H: {
      name: 'Hadamard Gate (H)',
      matrix: '1/√2 [[1, 1], [1, -1]]',
      effect: 'Maps computational basis |0⟩ → (|0⟩+|1⟩)/√2 and |1⟩ → (|0⟩-|1⟩)/√2.'
    },
    X: {
      name: 'Pauli-X (Bit Flip / NOT)',
      matrix: '[[0, 1], [1, 0]]',
      effect: 'Flips |0⟩ to |1⟩ and |1⟩ to |0⟩. Equivalent to classical NOT.'
    },
    Y: {
      name: 'Pauli-Y (Bit & Phase Flip)',
      matrix: '[[0, -i], [i, 0]]',
      effect: 'Performs bit-flip and applies imaginary phase rotation π around Y-axis.'
    },
    Z: {
      name: 'Pauli-Z (Phase Flip)',
      matrix: '[[1, 0], [0, -1]]',
      effect: 'Leaves |0⟩ unchanged and maps |1⟩ → -|1⟩ (π phase shift).'
    },
    S: {
      name: 'Phase Gate (S)',
      matrix: '[[1, 0], [0, i]]',
      effect: 'Applies π/2 phase shift to |1⟩. (Square root of Z gate).'
    },
    T: {
      name: 'T-Gate (π/8 Gate)',
      matrix: '[[1, 0], [0, e^{iπ/4}]]',
      effect: 'Applies π/4 phase shift. Essential for universal quantum computation.'
    },
    CNOT: {
      name: 'Controlled-NOT (CNOT)',
      matrix: '[[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]]',
      effect: 'Flips target qubit if control qubit is |1⟩. Generates maximal Bell entanglement.'
    }
  };

  const applyGate = (gate: QuantumGateType) => {
    let newAlpha = safeAlpha;
    let newBeta = safeBeta;

    if (gate === 'H') {
      newAlpha = (safeAlpha + safeBeta) / Math.SQRT2;
      newBeta = (safeAlpha - safeBeta) / Math.SQRT2;
    } else if (gate === 'X') {
      newAlpha = safeBeta;
      newBeta = safeAlpha;
    } else if (gate === 'Z') {
      newAlpha = safeAlpha;
      newBeta = -safeBeta;
    } else if (gate === 'Y') {
      newAlpha = -safeBeta;
      newBeta = safeAlpha;
    } else if (gate === 'S' || gate === 'T') {
      newBeta = safeBeta * 0.98; // Simulated phase rotation effect
    }

    const p0 = Number((newAlpha * newAlpha).toFixed(4));
    const p1 = Number((1 - p0).toFixed(4));

    const updatedState: QubitState = {
      alpha: Number(newAlpha.toFixed(4)),
      beta: Number(newBeta.toFixed(4)),
      prob0: Math.max(0, Math.min(1, p0)),
      prob1: Math.max(0, Math.min(1, p1)),
      phase: qubit.phase || 0,
      label: `Transformed by ${gate}`
    };

    setInternalQubit(updatedState);
    if (onApplyTransformation) {
      onApplyTransformation(updatedState);
    }

    setAppliedGates(prev => [...prev, gate]);
  };

  const resetState = () => {
    const defaultQubit = createQubitState(0, 0, '|0⟩ Ground State');
    setInternalQubit(defaultQubit);
    if (onApplyTransformation) {
      onApplyTransformation(defaultQubit);
    }
    setAppliedGates([]);
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            Interactive Quantum Gate Sandbox
          </h3>
          <p className="text-[11px] text-slate-400">
            Apply unitary transformations and examine state evolution
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={resetState} className="text-xs">
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset |0⟩
        </Button>
      </div>

      {/* Applied Gates Sequence */}
      <div className="p-3 rounded-sm bg-[#05070A] border border-slate-800 flex items-center gap-2 overflow-x-auto min-h-[48px]">
        <span className="text-xs font-mono text-slate-500">|0⟩ ──</span>
        {appliedGates.length === 0 ? (
          <span className="text-xs text-slate-600 italic">No gates applied. Click below to transform state.</span>
        ) : (
          appliedGates.map((g, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded bg-blue-950 border border-blue-700/60 font-mono text-xs font-bold text-blue-300 shadow-xs"
            >
              {g}
            </span>
          ))
        )}
        <span className="text-xs font-mono text-slate-500">── ➔ |ψ_out⟩</span>
      </div>

      {/* Gate Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {(['H', 'X', 'Y', 'Z', 'S', 'T'] as QuantumGateType[]).map(gate => (
          <button
            key={gate}
            onClick={() => {
              applyGate(gate);
              setActiveInfoGate(gate);
            }}
            className="p-2.5 rounded-sm bg-slate-900 border border-slate-700/80 hover:border-blue-500 hover:bg-slate-800 text-slate-200 font-mono text-sm font-bold transition-all shadow-xs flex flex-col items-center gap-1 cursor-pointer"
          >
            <span>{gate}</span>
            <span className="text-[9px] text-slate-400 font-normal">Gate</span>
          </button>
        ))}
      </div>

      {/* Resulting state amplitudes */}
      <div className="p-3 rounded-sm bg-slate-900/60 border border-slate-800/80 grid grid-cols-2 gap-4 font-mono text-xs">
        <div>
          <div className="text-slate-400 text-[11px]">Current State Vector:</div>
          <div className="text-sm font-bold text-blue-400 mt-0.5">
            {safeAlpha >= 0 ? '' : '-'}{Math.abs(safeAlpha).toFixed(3)}|0⟩ + {safeBeta >= 0 ? '' : '-'}{Math.abs(safeBeta).toFixed(3)}|1⟩
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-[11px]">Measurement Probabilities:</div>
          <div className="text-xs font-bold text-slate-200 mt-0.5 flex gap-3">
            <span className="text-blue-400">P(0): {((qubit.prob0 ?? (safeAlpha * safeAlpha)) * 100).toFixed(1)}%</span>
            <span className="text-indigo-400">P(1): {((qubit.prob1 ?? (safeBeta * safeBeta)) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Selected Gate Math description */}
      {activeInfoGate && (
        <div className="p-2.5 rounded bg-[#05070A] border border-slate-800/80 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-mono">
            <strong className="text-amber-400">{gateMatrixInfo[activeInfoGate].name}</strong>
            <code className="text-slate-400">{gateMatrixInfo[activeInfoGate].matrix}</code>
          </div>
          <p className="text-slate-400">{gateMatrixInfo[activeInfoGate].effect}</p>
        </div>
      )}
    </Card>
  );
};
