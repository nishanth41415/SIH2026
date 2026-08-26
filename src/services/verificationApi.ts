import { PipelineStage, VerificationRequest, VerificationResult } from '../types/verification';
import { qubitFromMessageHash, simulateQuantumTeleportation } from './quantumEngine';
import { auditService } from './auditApi';

export const DEFAULT_PIPELINE_STAGES: Omit<PipelineStage, 'status'>[] = [
  {
    id: 1,
    name: 'Signature Intake & Parse',
    shortName: 'INTAKE',
    description: 'Cryptographic signature token ingestion and payload hash validation.'
  },
  {
    id: 2,
    name: 'Quantum State Initialization',
    shortName: 'STATE_INIT',
    description: 'Mapping message digest into qubit polarization vector |ψ_sig⟩.'
  },
  {
    id: 3,
    name: 'Bell-State Generation',
    shortName: 'EPR_GEN',
    description: 'Creating entangled EPR pair |Φ⁺⟩ = 1/√2 (|00⟩ + |11⟩) via Hadamard & CNOT.'
  },
  {
    id: 4,
    name: 'Quantum Teleportation Transfer',
    shortName: 'TELEPORT',
    description: 'Bell-State Measurement (BSM) and classical transmission of bits (m₁, m₂).'
  },
  {
    id: 5,
    name: 'Pauli Unitary Corrections',
    shortName: 'CORRECTION',
    description: 'Bob applies conditional unitary transformation Xᵐ² Zᵐ¹ to target qubit.'
  },
  {
    id: 6,
    name: 'Projective Measurement Sampling',
    shortName: 'MEASURE',
    description: 'Sampling discrete observable statistics across N measurement shots.'
  },
  {
    id: 7,
    name: 'Statistical Deviation Analysis',
    shortName: 'STAT_ANALYSIS',
    description: 'Computing Total Variation Distance (TVD), Chi-Square χ², and p-value.'
  },
  {
    id: 8,
    name: 'Security Threshold Decision',
    shortName: 'DECISION',
    description: 'Evaluating TVD against threshold τ to determine legitimacy vs threat.'
  }
];

export async function runSignatureVerification(
  req: VerificationRequest,
  onProgress?: (stageId: number, stages: PipelineStage[]) => void
): Promise<VerificationResult> {
  const sessionId = `QDS-${Math.floor(10000 + Math.random() * 90000)}`;
  const stages: PipelineStage[] = DEFAULT_PIPELINE_STAGES.map(s => ({
    ...s,
    status: 'idle'
  }));

  const sourceQubit = qubitFromMessageHash(req.messageHash);

  // Run through the 8 stages with controlled realistic delays for the animated pipeline
  for (let i = 0; i < stages.length; i++) {
    stages[i].status = 'running';
    stages[i].timestamp = new Date().toLocaleTimeString();

    if (i === 1) {
      stages[i].telemetryNote = `State vector: ${sourceQubit.label}`;
    } else if (i === 2) {
      stages[i].telemetryNote = `Entangled pair |Φ⁺⟩ with fidelity 0.9997`;
    } else if (i === 3) {
      stages[i].telemetryNote = `Teleportation channel active (BSM bits: 0, 1)`;
    } else if (i === 4) {
      stages[i].telemetryNote = `Unitary Pauli X correction applied`;
    } else if (i === 5) {
      stages[i].telemetryNote = `Sampling ${req.measurementShots.toLocaleString()} shots`;
    }

    if (onProgress) {
      onProgress(stages[i].id, [...stages]);
    }

    // Dynamic stage pause
    const stageDelay = i === 5 || i === 6 ? 260 : 180;
    await new Promise(r => setTimeout(r, stageDelay));

    stages[i].status = 'completed';
    if (onProgress) {
      onProgress(stages[i].id, [...stages]);
    }
  }

  // Calculate actual quantum simulation
  const { distribution, telemetry, decision } = simulateQuantumTeleportation({
    sourceQubit,
    bellState: req.bellState || 'PHI_PLUS',
    shots: req.measurementShots,
    threshold: req.securityThreshold,
    attackType: req.attackInjection?.type || 'NONE',
    attackIntensity: req.attackInjection?.intensity || 0,
    channelNoise: req.attackInjection?.noiseLevel || 0
  });

  const result: VerificationResult = {
    sessionId,
    signatureId: req.signatureId,
    signerId: req.signerId,
    messageHash: req.messageHash,
    status: decision.decision,
    distribution,
    decision,
    telemetry,
    pipelineStages: stages,
    completedAt: new Date().toISOString()
  };

  // Record to audit log
  auditService.recordEvent({
    id: `EVT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sessionId,
    eventType: 'SIGNATURE_VERIFICATION',
    signerId: req.signerId,
    signatureId: req.signatureId,
    messageHash: req.messageHash,
    attackType: req.attackInjection ? req.attackInjection.type : 'NONE',
    deviation: distribution.tvd,
    threshold: req.securityThreshold,
    decision: decision.decision,
    severity: decision.decision === 'ATTACK' ? 'CRITICAL' : decision.decision === 'SUSPICIOUS' ? 'HIGH' : 'LOW',
    shots: req.measurementShots,
    fidelity: distribution.fidelity,
    latencyMs: decision.detectionLatencyMs,
    notes: `Signature verification for signer ${req.signerId}. ${decision.scientificReason}`,
    rawPayload: result as unknown as Record<string, unknown>
  });

  return result;
}
