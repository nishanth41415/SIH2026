import { MeasurementDistribution, TeleportationTelemetry } from './quantum';

export type VerificationStatus = 'LEGITIMATE' | 'SUSPICIOUS' | 'ATTACK' | 'IDLE' | 'PROCESSING';

export interface PipelineStage {
  id: number;
  name: string;
  shortName: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  timestamp?: string;
  telemetryNote?: string;
}

export interface VerificationRequest {
  signatureId: string;
  signerId: string;
  messageHash: string;
  measurementShots: number;
  securityThreshold: number;
  bellState?: 'PHI_PLUS' | 'PHI_MINUS' | 'PSI_PLUS' | 'PSI_MINUS';
  attackInjection?: {
    type: 'FORGERY' | 'REPLAY' | 'IMPERSONATION' | 'CHANNEL_MANIPULATION';
    intensity: number;
    noiseLevel: number;
  };
}

export interface ThreatDecision {
  decision: 'LEGITIMATE' | 'SUSPICIOUS' | 'ATTACK';
  deviation: number;
  threshold: number;
  attackProbability: number;
  forgeryProbability: number;
  fidelity: number;
  evidence: string[];
  scientificReason: string;
  detectionLatencyMs: number;
  timestamp: string;
}

export interface VerificationResult {
  sessionId: string;
  signatureId: string;
  signerId: string;
  messageHash: string;
  status: 'LEGITIMATE' | 'SUSPICIOUS' | 'ATTACK';
  distribution: MeasurementDistribution;
  decision: ThreatDecision;
  telemetry: TeleportationTelemetry;
  pipelineStages: PipelineStage[];
  completedAt: string;
}
