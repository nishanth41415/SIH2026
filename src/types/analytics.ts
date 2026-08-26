export interface SecurityMetrics {
  totalSignatures: number;
  verifiedSignatures: number;
  threatsDetected: number;
  activeSessions: number;
  overallSecurityStatus: 'SECURE' | 'ELEVATED_THREAT' | 'UNDER_ATTACK';
  falsePositiveRate: number; // e.g. 0.4%
  falseNegativeRate: number; // e.g. 0.1%
  accuracyRate: number;      // e.g. 99.8%
  meanDetectionLatencyMs: number; // e.g. 14.2ms
  meanQuantumFidelity: number;   // e.g. 0.994
}

export interface ThreatDistributionItem {
  name: string;
  count: number;
  percentage: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
}

export interface DetectionVsIntensityPoint {
  intensity: number;
  detectionRate: number;
  forgeryRate: number;
  replayRate: number;
  channelNoiseRate: number;
}

export interface ThresholdSensitivityPoint {
  threshold: number;
  truePositiveRate: number;
  falsePositiveRate: number;
  precision: number;
  f1Score: number;
}

export interface LatencyScalingPoint {
  shots: number;
  latencyMs: number;
  statisticalAccuracy: number;
}

export interface QuantumFidelityTimeSeriesPoint {
  timestamp: string;
  fidelity: number;
  deviation: number;
  threshold: number;
}
