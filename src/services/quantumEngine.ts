import {
  BellStateType,
  MeasurementDistribution,
  PauliCorrection,
  QubitState,
  TeleportationTelemetry
} from '../types/quantum';
import { ThreatDecision } from '../types/verification';
import { AttackType } from '../types/attack';

/**
 * Standard Bell State definitions
 */
export const BELL_STATES: Record<BellStateType, {
  name: string;
  ket: string;
  formula: string;
  description: string;
  amplitudes: [number, number, number, number];
}> = {
  PHI_PLUS: {
    name: 'Phi Plus (|Φ⁺⟩)',
    ket: '|Φ⁺⟩',
    formula: '1/√2 (|00⟩ + |11⟩)',
    description: 'Symmetric maximally entangled Bell state with even parity and zero phase.',
    amplitudes: [1 / Math.SQRT2, 0, 0, 1 / Math.SQRT2]
  },
  PHI_MINUS: {
    name: 'Phi Minus (|Φ⁻⟩)',
    ket: '|Φ⁻⟩',
    formula: '1/√2 (|00⟩ - |11⟩)',
    description: 'Maximally entangled Bell state with even parity and π phase flip.',
    amplitudes: [1 / Math.SQRT2, 0, 0, -1 / Math.SQRT2]
  },
  PSI_PLUS: {
    name: 'Psi Plus (|Ψ⁺⟩)',
    ket: '|Ψ⁺⟩',
    formula: '1/√2 (|01⟩ + |10⟩)',
    description: 'Symmetric maximally entangled Bell state with odd parity.',
    amplitudes: [0, 1 / Math.SQRT2, 1 / Math.SQRT2, 0]
  },
  PSI_MINUS: {
    name: 'Psi Minus (|Ψ⁻⟩)',
    ket: '|Ψ⁻⟩',
    formula: '1/√2 (|01⟩ - |10⟩)',
    description: 'Anti-symmetric singlet state with odd parity; invariant under SU(2) rotations.',
    amplitudes: [0, 1 / Math.SQRT2, -1 / Math.SQRT2, 0]
  }
};

/**
 * Generate a qubit state from angles theta and phi
 */
export function createQubitState(theta = Math.PI / 3, phi = 0, label?: string): QubitState {
  const alpha = Math.cos(theta / 2);
  const beta = Math.sin(theta / 2);
  const prob0 = Number((alpha * alpha).toFixed(6));
  const prob1 = Number((beta * beta).toFixed(6));
  return {
    alpha: Number(alpha.toFixed(6)),
    beta: Number(beta.toFixed(6)),
    prob0,
    prob1,
    phase: phi,
    label: label || `|ψ⟩ = ${alpha.toFixed(3)}|0⟩ + ${beta.toFixed(3)}|1⟩`
  };
}

/**
 * Deterministic hash-to-qubit generator for authenticating message signatures
 */
export function qubitFromMessageHash(hash: string): QubitState {
  let acc = 0;
  for (let i = 0; i < hash.length; i++) {
    acc = (acc * 31 + hash.charCodeAt(i)) >>> 0;
  }
  // Map hash into normalized theta angle in [0.2*pi, 0.8*pi]
  const normalized = (acc % 10000) / 10000;
  const theta = 0.2 * Math.PI + normalized * 0.6 * Math.PI;
  return createQubitState(theta, 0, `Hash-Encoded |ψ_sig⟩`);
}

/**
 * Teleportation & Statistical Measurement Engine
 */
export function simulateQuantumTeleportation(params: {
  sourceQubit: QubitState;
  bellState?: BellStateType;
  shots: number;
  threshold: number;
  attackType?: AttackType | 'NONE';
  attackIntensity?: number; // 0-100
  channelNoise?: number;    // 0-100
}): {
  distribution: MeasurementDistribution;
  telemetry: TeleportationTelemetry;
  decision: ThreatDecision;
} {
  const {
    sourceQubit,
    bellState = 'PHI_PLUS',
    shots = 10000,
    threshold = 0.050,
    attackType = 'NONE',
    attackIntensity = 0,
    channelNoise = 0
  } = params;

  // Expected ideal teleported state distribution
  const expectedP0 = sourceQubit.prob0;
  const expectedP1 = sourceQubit.prob1;

  // Simulate BSM outcome (m1, m2)
  const bsmOutcomes: [0 | 1, 0 | 1] = [
    Math.random() > 0.5 ? 1 : 0,
    Math.random() > 0.5 ? 1 : 0
  ];

  // Map BSM to Pauli correction needed: (0,0)->I, (0,1)->X, (1,0)->Z, (1,1)->XZ
  let pauliCorrection: PauliCorrection = 'I';
  if (bsmOutcomes[0] === 0 && bsmOutcomes[1] === 1) pauliCorrection = 'X';
  else if (bsmOutcomes[0] === 1 && bsmOutcomes[1] === 0) pauliCorrection = 'Z';
  else if (bsmOutcomes[0] === 1 && bsmOutcomes[1] === 1) pauliCorrection = 'XZ';

  // Compute perturbation on observed probabilities based on attacks and noise
  let probShift0 = 0;
  let fidelityDegradation = 0;
  const intensityFactor = (attackIntensity || 0) / 100;
  const noiseFactor = (channelNoise || 0) / 100;

  // Attack-specific quantum disturbance modeling
  if (attackType === 'FORGERY') {
    // Forgery attacker induces state rotation delta_theta due to lack of private signature key
    const deltaShift = 0.18 * intensityFactor + 0.05;
    probShift0 = Math.random() > 0.5 ? deltaShift : -deltaShift;
    fidelityDegradation = 0.35 * intensityFactor + 0.08;
  } else if (attackType === 'REPLAY') {
    // Replay attack: stale Pauli feedforward or expired entanglement pair causes fixed projection drift
    probShift0 = 0.24 * intensityFactor + 0.09;
    fidelityDegradation = 0.42 * intensityFactor + 0.12;
  } else if (attackType === 'IMPERSONATION') {
    // Attacker impersonates signer without shared Bell correlations
    const deltaShift = 0.28 * intensityFactor + 0.12;
    probShift0 = Math.random() > 0.4 ? deltaShift : -deltaShift;
    fidelityDegradation = 0.52 * intensityFactor + 0.15;
  } else if (attackType === 'CHANNEL_MANIPULATION') {
    // Quantum channel depolarization & eavesdropping (intercept-resend or photon number splitting)
    const depolarizingShift = (0.5 - expectedP0) * (0.45 * intensityFactor + 0.2 * noiseFactor);
    probShift0 = depolarizingShift + (Math.random() - 0.5) * 0.08 * intensityFactor;
    fidelityDegradation = 0.38 * intensityFactor + 0.25 * noiseFactor;
  }

  // Add realistic channel noise & shot noise fluctuation
  const noisePerturbation = (Math.random() - 0.5) * 0.04 * noiseFactor;
  const shotNoiseStdDev = Math.sqrt((expectedP0 * expectedP1) / shots);
  const shotFluctuation = (Math.random() + Math.random() - 1) * shotNoiseStdDev * 1.5;

  let observedP0 = expectedP0 + probShift0 + noisePerturbation + shotFluctuation;
  // Clamp probabilities
  observedP0 = Math.max(0.01, Math.min(0.99, observedP0));
  const observedP1 = 1 - observedP0;

  // Sample discrete outcome counts from binomial distribution
  const count0 = Math.round(observedP0 * shots);
  const count1 = shots - count0;
  const finalObservedP0 = count0 / shots;
  const finalObservedP1 = count1 / shots;

  const expectedCount0 = Math.round(expectedP0 * shots);
  const expectedCount1 = shots - expectedCount0;

  // Total Variation Distance (TVD) = 0.5 * sum(|p_exp - p_obs|)
  const tvd = 0.5 * (Math.abs(expectedP0 - finalObservedP0) + Math.abs(expectedP1 - finalObservedP1));

  // Chi-Square statistic
  const chi0 = Math.pow(count0 - expectedCount0, 2) / Math.max(1, expectedCount0);
  const chi1 = Math.pow(count1 - expectedCount1, 2) / Math.max(1, expectedCount1);
  const chiSquare = chi0 + chi1;

  // Approximate p-value for 1 degree of freedom
  const pValue = Math.max(0.00001, Math.min(1.0, Math.exp(-0.5 * chiSquare)));

  // Quantum state fidelity F = (sqrt(p0*q0) + sqrt(p1*q1))^2 - degradation
  const rawFidelity = Math.pow(
    Math.sqrt(expectedP0 * finalObservedP0) + Math.sqrt(expectedP1 * finalObservedP1),
    2
  );
  const finalFidelity = Math.max(0.35, Math.min(0.9998, rawFidelity - fidelityDegradation));

  // Decision determination
  let decisionStatus: 'LEGITIMATE' | 'SUSPICIOUS' | 'ATTACK' = 'LEGITIMATE';
  let attackProbability = 0;
  let forgeryProbability = 0;

  if (tvd > threshold * 1.4 || finalFidelity < 0.82) {
    decisionStatus = 'ATTACK';
    attackProbability = Math.min(99.4, 75 + (tvd / threshold) * 12);
    forgeryProbability = Math.min(98.8, 70 + (tvd / threshold) * 10);
  } else if (tvd > threshold || finalFidelity < 0.92) {
    decisionStatus = 'SUSPICIOUS';
    attackProbability = Math.min(74.9, 45 + (tvd / threshold) * 15);
    forgeryProbability = Math.min(68.5, 40 + (tvd / threshold) * 12);
  } else {
    decisionStatus = 'LEGITIMATE';
    attackProbability = Math.max(0.2, (tvd / threshold) * 4.5);
    forgeryProbability = Math.max(0.1, (tvd / threshold) * 3.8);
  }

  // Compile scientific evidence points
  const evidence: string[] = [];
  evidence.push(`Sampled ${shots.toLocaleString()} projective measurements across Pauli Z basis.`);
  evidence.push(
    `Expected state probability: |0⟩=${(expectedP0 * 100).toFixed(2)}%, |1⟩=${(expectedP1 * 100).toFixed(2)}%.`
  );
  evidence.push(
    `Observed distribution: |0⟩=${(finalObservedP0 * 100).toFixed(2)}%, |1⟩=${(finalObservedP1 * 100).toFixed(2)}%.`
  );
  evidence.push(
    `Total Variation Distance (TVD): ${tvd.toFixed(4)} (Configured Security Threshold τ: ${threshold.toFixed(4)}).`
  );
  evidence.push(
    `Quantum State Fidelity F(ρ_exp, ρ_obs): ${(finalFidelity * 100).toFixed(2)}% | χ² goodness-of-fit: ${chiSquare.toFixed(2)} (p=${pValue < 0.001 ? '<0.001' : pValue.toFixed(4)}).`
  );

  let scientificReason = '';
  if (decisionStatus === 'LEGITIMATE') {
    scientificReason = `Measurement statistics align with predicted Bell-state teleportation outcomes within expected Poissonian shot noise limits (TVD ${tvd.toFixed(4)} ≤ τ ${threshold.toFixed(4)}). Quantum fidelity remains high (${(finalFidelity * 100).toFixed(1)}%), confirming valid Pauli correction and authentic signer entanglement.`;
  } else if (decisionStatus === 'SUSPICIOUS') {
    scientificReason = `Observed statistical deviation (${tvd.toFixed(4)}) moderately exceeds the normal security threshold (τ ${threshold.toFixed(4)}), with fidelity dropping to ${(finalFidelity * 100).toFixed(1)}%. This indicates elevated channel decoherence, phase fluctuation, or low-intensity eavesdropping probing.`;
  } else {
    scientificReason = `Statistically significant deviation (${tvd.toFixed(4)} >> τ ${threshold.toFixed(4)}) detected with high confidence (χ² = ${chiSquare.toFixed(2)}, p < 0.001). Quantum fidelity collapsed to ${(finalFidelity * 100).toFixed(1)}%, proving that the teleported signature token was forged, replayed with invalid Pauli feedforward, or tampered in the quantum channel.`;
  }

  const distribution: MeasurementDistribution = {
    expected: {
      outcome0: Number((expectedP0 * 100).toFixed(2)),
      outcome1: Number((expectedP1 * 100).toFixed(2)),
      count0: expectedCount0,
      count1: expectedCount1
    },
    observed: {
      outcome0: Number((finalObservedP0 * 100).toFixed(2)),
      outcome1: Number((finalObservedP1 * 100).toFixed(2)),
      count0,
      count1
    },
    shots,
    tvd: Number(tvd.toFixed(4)),
    chiSquare: Number(chiSquare.toFixed(2)),
    pValue: Number(pValue.toFixed(4)),
    fidelity: Number(finalFidelity.toFixed(4))
  };

  const reconstructedQubit: QubitState = {
    alpha: Math.sqrt(finalObservedP0),
    beta: Math.sqrt(finalObservedP1),
    prob0: Number(finalObservedP0.toFixed(4)),
    prob1: Number(finalObservedP1.toFixed(4)),
    phase: sourceQubit.phase,
    label: `Reconstructed |ψ'⟩`
  };

  const telemetry: TeleportationTelemetry = {
    sourceQubit,
    bellPair: bellState,
    bsmOutcomes,
    pauliCorrectionApplied: pauliCorrection,
    channelNoiseDepolarization: Math.round(channelNoise),
    reconstructedQubit,
    fidelity: Number(finalFidelity.toFixed(4))
  };

  const decision: ThreatDecision = {
    decision: decisionStatus,
    deviation: Number(tvd.toFixed(4)),
    threshold: Number(threshold.toFixed(4)),
    attackProbability: Number(attackProbability.toFixed(1)),
    forgeryProbability: Number(forgeryProbability.toFixed(1)),
    fidelity: Number(finalFidelity.toFixed(4)),
    evidence,
    scientificReason,
    detectionLatencyMs: Math.round(12 + (shots / 10000) * 8 + Math.random() * 6),
    timestamp: new Date().toISOString()
  };

  return { distribution, telemetry, decision };
}
