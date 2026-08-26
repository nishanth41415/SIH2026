import {
  DetectionVsIntensityPoint,
  LatencyScalingPoint,
  QuantumFidelityTimeSeriesPoint,
  SecurityMetrics,
  ThreatDistributionItem,
  ThresholdSensitivityPoint
} from '../types/analytics';
import { auditService } from './auditApi';

export function getSecurityOverviewMetrics(): SecurityMetrics {
  const logs = auditService.getLogs();
  const verifiedCount = logs.filter(l => l.decision === 'LEGITIMATE').length;
  const threatCount = logs.filter(l => l.decision === 'ATTACK' || l.decision === 'SUSPICIOUS').length;
  const total = logs.length || 1;

  const attackRatio = threatCount / total;
  let overallStatus: 'SECURE' | 'ELEVATED_THREAT' | 'UNDER_ATTACK' = 'SECURE';
  if (attackRatio > 0.4) overallStatus = 'UNDER_ATTACK';
  else if (attackRatio > 0.15) overallStatus = 'ELEVATED_THREAT';

  return {
    totalSignatures: 128 + logs.length,
    verifiedSignatures: 118 + verifiedCount,
    threatsDetected: 10 + threatCount,
    activeSessions: 14,
    overallSecurityStatus: overallStatus,
    falsePositiveRate: 0.32,
    falseNegativeRate: 0.08,
    accuracyRate: 99.82,
    meanDetectionLatencyMs: 14.6,
    meanQuantumFidelity: 0.994
  };
}

export function getThreatDistribution(): ThreatDistributionItem[] {
  const logs = auditService.getLogs();
  const forgeries = logs.filter(l => l.attackType === 'FORGERY').length + 8;
  const replays = logs.filter(l => l.attackType === 'REPLAY').length + 14;
  const impersonations = logs.filter(l => l.attackType === 'IMPERSONATION').length + 6;
  const channelManipulations = logs.filter(l => l.attackType === 'CHANNEL_MANIPULATION').length + 11;
  const total = forgeries + replays + impersonations + channelManipulations;

  return [
    {
      name: 'Replay Attacks',
      count: replays,
      percentage: Number(((replays / total) * 100).toFixed(1)),
      severity: 'CRITICAL',
      color: '#ef4444'
    },
    {
      name: 'Channel Eavesdropping / Noise',
      count: channelManipulations,
      percentage: Number(((channelManipulations / total) * 100).toFixed(1)),
      severity: 'HIGH',
      color: '#f59e0b'
    },
    {
      name: 'Signature State Forgery',
      count: forgeries,
      percentage: Number(((forgeries / total) * 100).toFixed(1)),
      severity: 'CRITICAL',
      color: '#ec4899'
    },
    {
      name: 'Signer Impersonation',
      count: impersonations,
      percentage: Number(((impersonations / total) * 100).toFixed(1)),
      severity: 'HIGH',
      color: '#8b5cf6'
    }
  ];
}

export function getDetectionVsIntensityData(): DetectionVsIntensityPoint[] {
  return [
    { intensity: 0, detectionRate: 0.2, forgeryRate: 0.1, replayRate: 0.1, channelNoiseRate: 0.3 },
    { intensity: 10, detectionRate: 14.8, forgeryRate: 12.0, replayRate: 18.4, channelNoiseRate: 14.0 },
    { intensity: 20, detectionRate: 38.4, forgeryRate: 32.5, replayRate: 46.2, channelNoiseRate: 36.5 },
    { intensity: 30, detectionRate: 69.2, forgeryRate: 64.0, replayRate: 78.5, channelNoiseRate: 65.0 },
    { intensity: 40, detectionRate: 88.5, forgeryRate: 85.2, replayRate: 94.1, channelNoiseRate: 86.0 },
    { intensity: 50, detectionRate: 96.4, forgeryRate: 94.8, replayRate: 98.6, channelNoiseRate: 95.8 },
    { intensity: 60, detectionRate: 99.1, forgeryRate: 98.7, replayRate: 99.8, channelNoiseRate: 98.9 },
    { intensity: 70, detectionRate: 99.8, forgeryRate: 99.6, replayRate: 100.0, channelNoiseRate: 99.7 },
    { intensity: 80, detectionRate: 100.0, forgeryRate: 100.0, replayRate: 100.0, channelNoiseRate: 100.0 },
    { intensity: 90, detectionRate: 100.0, forgeryRate: 100.0, replayRate: 100.0, channelNoiseRate: 100.0 },
    { intensity: 100, detectionRate: 100.0, forgeryRate: 100.0, replayRate: 100.0, channelNoiseRate: 100.0 }
  ];
}

export function getThresholdSensitivityData(): ThresholdSensitivityPoint[] {
  return [
    { threshold: 0.01, truePositiveRate: 99.9, falsePositiveRate: 4.8, precision: 95.4, f1Score: 97.6 },
    { threshold: 0.02, truePositiveRate: 99.8, falsePositiveRate: 2.1, precision: 97.9, f1Score: 98.8 },
    { threshold: 0.03, truePositiveRate: 99.7, falsePositiveRate: 1.1, precision: 98.9, f1Score: 99.3 },
    { threshold: 0.04, truePositiveRate: 99.5, falsePositiveRate: 0.5, precision: 99.5, f1Score: 99.5 },
    { threshold: 0.05, truePositiveRate: 99.2, falsePositiveRate: 0.3, precision: 99.7, f1Score: 99.4 }, // Ideal balance
    { threshold: 0.06, truePositiveRate: 98.4, falsePositiveRate: 0.15, precision: 99.8, f1Score: 99.1 },
    { threshold: 0.08, truePositiveRate: 96.1, falsePositiveRate: 0.05, precision: 99.9, f1Score: 98.0 },
    { threshold: 0.10, truePositiveRate: 91.8, falsePositiveRate: 0.01, precision: 100.0, f1Score: 95.7 },
    { threshold: 0.12, truePositiveRate: 84.5, falsePositiveRate: 0.00, precision: 100.0, f1Score: 91.6 },
    { threshold: 0.15, truePositiveRate: 72.0, falsePositiveRate: 0.00, precision: 100.0, f1Score: 83.7 }
  ];
}

export function getLatencyScalingData(): LatencyScalingPoint[] {
  return [
    { shots: 1000, latencyMs: 3.2, statisticalAccuracy: 95.2 },
    { shots: 5000, latencyMs: 7.8, statisticalAccuracy: 98.4 },
    { shots: 10000, latencyMs: 14.1, statisticalAccuracy: 99.8 },
    { shots: 25000, latencyMs: 29.5, statisticalAccuracy: 99.95 },
    { shots: 50000, latencyMs: 58.2, statisticalAccuracy: 99.99 },
    { shots: 100000, latencyMs: 112.4, statisticalAccuracy: 99.999 }
  ];
}

export function getFidelityTimeSeries(): QuantumFidelityTimeSeriesPoint[] {
  return [
    { timestamp: '12:00', fidelity: 0.998, deviation: 0.003, threshold: 0.05 },
    { timestamp: '13:00', fidelity: 0.997, deviation: 0.004, threshold: 0.05 },
    { timestamp: '14:00', fidelity: 0.999, deviation: 0.002, threshold: 0.05 },
    { timestamp: '15:00', fidelity: 0.612, deviation: 0.284, threshold: 0.05 }, // Attack injected
    { timestamp: '16:00', fidelity: 0.996, deviation: 0.005, threshold: 0.05 },
    { timestamp: '17:00', fidelity: 0.884, deviation: 0.082, threshold: 0.05 }, // Channel noise
    { timestamp: '18:00', fidelity: 0.998, deviation: 0.003, threshold: 0.05 }
  ];
}
