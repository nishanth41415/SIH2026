import { AttackCardInfo, AttackControlConfig, AttackSimulationResult, AttackType } from '../types/attack';
import { simulateQuantumTeleportation, qubitFromMessageHash } from './quantumEngine';
import { auditService } from './auditApi';

export const ATTACK_CATALOG: AttackCardInfo[] = [
  {
    type: 'FORGERY',
    title: 'Signature Forgery',
    subtitle: 'Unauthorized quantum state fabrication',
    description: 'An adversary attempts to synthesize a valid signature quantum state |ψ_sig⟩ without possessing the legitimate signer private quantum key generator.',
    quantumMechanism: 'Forces arbitrary basis alignment |θ_forge⟩ ≠ |θ_sig⟩; causes measurable projective statistical skew.',
    defaultSeverity: 'HIGH',
    vulnerabilityTarget: 'State Preparation & Private Key Generator',
    tag: 'Cryptographic Attack'
  },
  {
    type: 'REPLAY',
    title: 'Replay Attack',
    subtitle: 'Stale Bell-state & Pauli feedforward reuse',
    description: 'An attacker intercepts and replays previously verified teleportation telemetry and classical Pauli correction bits (m₁, m₂) in a new session.',
    quantumMechanism: 'Entanglement correlation is expired; projective measurement against uncorrected basis produces severe probability collapse (ΔP > 25%).',
    defaultSeverity: 'CRITICAL',
    vulnerabilityTarget: 'Classical Feedforward & Nonce Freshness',
    tag: 'Protocol Level Attack'
  },
  {
    type: 'IMPERSONATION',
    title: 'Signer Impersonation',
    subtitle: 'Masquerading as verified quantum authority',
    description: 'An untrusted node attempts to establish a teleportation verification session using forged identity credentials and spoofed Bell-pair identifiers.',
    quantumMechanism: 'Lacks shared EPR entanglement with verifier; state fidelity collapses below theoretical classical limit (F < 0.667).',
    defaultSeverity: 'CRITICAL',
    vulnerabilityTarget: 'Entity Authentication & EPR Distribution',
    tag: 'Identity Hijack'
  },
  {
    type: 'CHANNEL_MANIPULATION',
    title: 'Quantum Channel Manipulation',
    subtitle: 'Decoherence, intercept-resend & photon splitting',
    description: 'Active optical fiber eavesdropping where an attacker probes the quantum channel, introducing depolarizing noise and phase kicks.',
    quantumMechanism: 'No-cloning theorem guarantees measurement induces irreversible state collapse and non-Poissonian statistical dispersion.',
    defaultSeverity: 'MEDIUM',
    vulnerabilityTarget: 'Quantum Fiber Link & Photonic Channel',
    tag: 'Physical Layer Eavesdropping'
  }
];

export async function runAttackSimulation(
  config: AttackControlConfig,
  customHash?: string
): Promise<AttackSimulationResult> {
  const sessionId = `QDS-ATK-${Math.floor(10000 + Math.random() * 90000)}`;
  const messageHash = customHash || '0x9f83a4b7e21c60d8e4f1a5b8c9d0e2f3';
  const sourceQubit = qubitFromMessageHash(messageHash);

  const { distribution, telemetry, decision } = simulateQuantumTeleportation({
    sourceQubit,
    bellState: 'PHI_PLUS',
    shots: config.measurementShots,
    threshold: config.securityThreshold,
    attackType: config.attackType,
    attackIntensity: config.intensity,
    channelNoise: config.channelNoise
  });

  const deltaShift0 = Number((distribution.observed.outcome0 - distribution.expected.outcome0).toFixed(2));
  const deltaShift1 = Number((distribution.observed.outcome1 - distribution.expected.outcome1).toFixed(2));
  const anomalyDetected = decision.decision !== 'LEGITIMATE';

  const result: AttackSimulationResult = {
    sessionId,
    attackType: config.attackType,
    config,
    distribution,
    decision,
    telemetry,
    anomalyDetected,
    statisticalMetrics: {
      deviation: distribution.tvd,
      threshold: config.securityThreshold,
      deltaShift0,
      deltaShift1,
      pVal: distribution.pValue,
      chiSq: distribution.chiSquare,
      quantumFidelity: distribution.fidelity,
      entropyIncrease: Number((config.intensity * 0.012 + config.channelNoise * 0.008).toFixed(3))
    },
    interceptionLatencyMs: decision.detectionLatencyMs,
    timestamp: new Date().toISOString()
  };

  // Record into audit log
  auditService.recordEvent({
    id: `EVT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sessionId,
    eventType: 'ATTACK_SIMULATION',
    signerId: 'SIMULATED_ATTACKER_NODE_0x7',
    signatureId: `SIG-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
    messageHash,
    attackType: config.attackType,
    deviation: distribution.tvd,
    threshold: config.securityThreshold,
    decision: decision.decision,
    severity: decision.decision === 'ATTACK' ? 'CRITICAL' : decision.decision === 'SUSPICIOUS' ? 'HIGH' : 'LOW',
    shots: config.measurementShots,
    fidelity: distribution.fidelity,
    latencyMs: decision.detectionLatencyMs,
    notes: `Simulated ${config.attackType} at ${config.intensity}% intensity with ${config.channelNoise}% noise. ${decision.scientificReason}`,
    rawPayload: result as unknown as Record<string, unknown>
  });

  return result;
}
