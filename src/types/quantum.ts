export type BellStateType = 'PHI_PLUS' | 'PHI_MINUS' | 'PSI_PLUS' | 'PSI_MINUS';

export type QuantumGateType = 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'S' | 'T';

export type PauliCorrection = 'I' | 'X' | 'Z' | 'XZ';

export interface QubitState {
  alpha: number; // Real amplitude |0>
  beta: number;  // Real amplitude |1>
  prob0: number; // |\alpha|^2
  prob1: number; // |\beta|^2
  phase: number; // Phase angle in radians
  label?: string;
}

export interface BellStateInfo {
  type: BellStateType;
  name: string;
  ket: string;
  formula: string;
  description: string;
  stateVector: [number, number, number, number]; // amplitudes for |00>, |01>, |10>, |11>
}

export interface QuantumCircuitWire {
  id: string;
  label: string;
  initialState: string;
  gates: {
    step: number;
    gate: QuantumGateType | 'BSM' | 'CORRECTION' | 'MEASURE';
    targetWire?: string;
    controlWire?: string;
    isActive?: boolean;
  }[];
}

export interface MeasurementDistribution {
  expected: {
    outcome0: number;
    outcome1: number;
    count0: number;
    count1: number;
  };
  observed: {
    outcome0: number;
    outcome1: number;
    count0: number;
    count1: number;
  };
  shots: number;
  tvd: number; // Total Variation Distance: 0.5 * sum(|p_exp - p_obs|)
  chiSquare: number;
  pValue: number;
  fidelity: number; // Quantum State Fidelity F(\rho, \sigma)
}

export interface TeleportationTelemetry {
  sourceQubit: QubitState;
  bellPair: BellStateType;
  bsmOutcomes: [0 | 1, 0 | 1]; // Measurement on Alice's qubits
  pauliCorrectionApplied: PauliCorrection;
  channelNoiseDepolarization: number;
  reconstructedQubit: QubitState;
  fidelity: number;
}
