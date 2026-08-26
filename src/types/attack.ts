import { MeasurementDistribution, TeleportationTelemetry } from './quantum';
import { ThreatDecision } from './verification';

export type AttackType = 'FORGERY' | 'REPLAY' | 'IMPERSONATION' | 'CHANNEL_MANIPULATION';

export interface AttackCardInfo {
  type: AttackType;
  title: string;
  subtitle: string;
  description: string;
  quantumMechanism: string;
  defaultSeverity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  vulnerabilityTarget: string;
  tag: string;
}

export interface AttackControlConfig {
  attackType: AttackType;
  intensity: number; // 0 - 100%
  channelNoise: number; // 0 - 100%
  measurementShots: number; // 1,000 to 100,000
  securityThreshold: number; // e.g. 0.050
  seed: string;
}

export interface AttackSimulationResult {
  sessionId: string;
  attackType: AttackType;
  config: AttackControlConfig;
  distribution: MeasurementDistribution;
  decision: ThreatDecision;
  telemetry: TeleportationTelemetry;
  anomalyDetected: boolean;
  statisticalMetrics: {
    deviation: number;
    threshold: number;
    deltaShift0: number; // percentage shift on outcome 0
    deltaShift1: number; // percentage shift on outcome 1
    pVal: number;
    chiSq: number;
    quantumFidelity: number;
    entropyIncrease: number;
  };
  interceptionLatencyMs: number;
  timestamp: string;
}
