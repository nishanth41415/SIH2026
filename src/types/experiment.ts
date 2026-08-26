import { AttackType } from './attack';
import { SeverityLevel } from './audit';

export interface ExperimentConfig {
  name: string;
  attackType: AttackType | 'BENIGN_TEST';
  attackIntensity: number;
  noiseLevel: number;
  measurementShots: number;
  securityThreshold: number;
  repetitions: number;
}

export interface ExperimentRunResult {
  id: string;
  name: string;
  date: string;
  config: ExperimentConfig;
  totalTrials: number;
  detectedThreats: number;
  detectionRate: number; // percentage
  falsePositiveRate: number;
  avgDeviation: number;
  maxDeviation: number;
  avgFidelity: number;
  avgLatencyMs: number;
  finalVerdict: 'PASSED_SECURE' | 'ANOMALIES_INTERCEPTED' | 'SYSTEM_COMPROMISED';
  severity: SeverityLevel;
}
