import { ExperimentConfig, ExperimentRunResult } from '../types/experiment';
import { qubitFromMessageHash, simulateQuantumTeleportation } from './quantumEngine';

const EXPERIMENT_STORAGE_KEY = 'qds_sentinel_experiments';

const INITIAL_EXPERIMENTS: ExperimentRunResult[] = [
  {
    id: 'EXP-2026-081',
    name: 'Replay Attack Sensitivity Sweep',
    date: '2026-08-26 03:45',
    config: {
      name: 'Replay Attack Sensitivity Sweep',
      attackType: 'REPLAY',
      attackIntensity: 75,
      noiseLevel: 10,
      measurementShots: 10000,
      securityThreshold: 0.050,
      repetitions: 50
    },
    totalTrials: 50,
    detectedThreats: 50,
    detectionRate: 100.0,
    falsePositiveRate: 0.0,
    avgDeviation: 0.278,
    maxDeviation: 0.342,
    avgFidelity: 0.584,
    avgLatencyMs: 14.8,
    finalVerdict: 'ANOMALIES_INTERCEPTED',
    severity: 'CRITICAL'
  },
  {
    id: 'EXP-2026-080',
    name: 'Decoherence Noise Baseline Test',
    date: '2026-08-25 21:10',
    config: {
      name: 'Decoherence Noise Baseline Test',
      attackType: 'CHANNEL_MANIPULATION',
      attackIntensity: 30,
      noiseLevel: 45,
      measurementShots: 15000,
      securityThreshold: 0.050,
      repetitions: 40
    },
    totalTrials: 40,
    detectedThreats: 37,
    detectionRate: 92.5,
    falsePositiveRate: 2.5,
    avgDeviation: 0.076,
    maxDeviation: 0.114,
    avgFidelity: 0.862,
    avgLatencyMs: 17.2,
    finalVerdict: 'ANOMALIES_INTERCEPTED',
    severity: 'HIGH'
  },
  {
    id: 'EXP-2026-079',
    name: 'Benign Quantum Teleportation Baseline',
    date: '2026-08-25 18:30',
    config: {
      name: 'Benign Quantum Teleportation Baseline',
      attackType: 'BENIGN_TEST',
      attackIntensity: 0,
      noiseLevel: 5,
      measurementShots: 20000,
      securityThreshold: 0.050,
      repetitions: 100
    },
    totalTrials: 100,
    detectedThreats: 0,
    detectionRate: 0.0,
    falsePositiveRate: 0.0,
    avgDeviation: 0.0034,
    maxDeviation: 0.0089,
    avgFidelity: 0.998,
    avgLatencyMs: 15.6,
    finalVerdict: 'PASSED_SECURE',
    severity: 'LOW'
  }
];

class ExperimentService {
  private experiments: ExperimentRunResult[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(EXPERIMENT_STORAGE_KEY);
      if (stored) {
        this.experiments = JSON.parse(stored);
      } else {
        this.experiments = [...INITIAL_EXPERIMENTS];
        this.save();
      }
    } catch {
      this.experiments = [...INITIAL_EXPERIMENTS];
    }
  }

  private save() {
    try {
      localStorage.setItem(EXPERIMENT_STORAGE_KEY, JSON.stringify(this.experiments));
    } catch (e) {
      console.warn('Failed to save experiments', e);
    }
  }

  public getExperiments(): ExperimentRunResult[] {
    return [...this.experiments];
  }

  public async runExperiment(
    config: ExperimentConfig,
    onProgress?: (completedTrials: number, total: number) => void
  ): Promise<ExperimentRunResult> {
    const trials = config.repetitions || 20;
    let detected = 0;
    let totalDeviation = 0;
    let maxDev = 0;
    let totalFidelity = 0;
    let totalLatency = 0;

    const sourceQubit = qubitFromMessageHash('0xexp_research_seed_4a8b2c');

    for (let i = 1; i <= trials; i++) {
      const { distribution, decision } = simulateQuantumTeleportation({
        sourceQubit,
        shots: config.measurementShots,
        threshold: config.securityThreshold,
        attackType: config.attackType === 'BENIGN_TEST' ? 'NONE' : config.attackType,
        attackIntensity: config.attackType === 'BENIGN_TEST' ? 0 : config.attackIntensity,
        channelNoise: config.noiseLevel
      });

      if (decision.decision !== 'LEGITIMATE') {
        detected++;
      }

      totalDeviation += distribution.tvd;
      if (distribution.tvd > maxDev) maxDev = distribution.tvd;
      totalFidelity += distribution.fidelity;
      totalLatency += decision.detectionLatencyMs;

      if (onProgress) {
        onProgress(i, trials);
      }

      // Small tick for non-blocking UI
      if (i % 5 === 0) {
        await new Promise(r => setTimeout(r, 20));
      }
    }

    const detectionRate = Number(((detected / trials) * 100).toFixed(1));
    const avgDeviation = Number((totalDeviation / trials).toFixed(4));
    const avgFidelity = Number((totalFidelity / trials).toFixed(4));
    const avgLatencyMs = Number((totalLatency / trials).toFixed(1));

    let finalVerdict: 'PASSED_SECURE' | 'ANOMALIES_INTERCEPTED' | 'SYSTEM_COMPROMISED' = 'PASSED_SECURE';
    if (config.attackType !== 'BENIGN_TEST') {
      finalVerdict = detectionRate >= 80 ? 'ANOMALIES_INTERCEPTED' : 'SYSTEM_COMPROMISED';
    } else {
      finalVerdict = detected === 0 ? 'PASSED_SECURE' : 'ANOMALIES_INTERCEPTED';
    }

    const result: ExperimentRunResult = {
      id: `EXP-${Date.now().toString().slice(-6)}`,
      name: config.name,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      config,
      totalTrials: trials,
      detectedThreats: detected,
      detectionRate,
      falsePositiveRate: config.attackType === 'BENIGN_TEST' ? Number(((detected / trials) * 100).toFixed(1)) : 0.0,
      avgDeviation,
      maxDeviation: Number(maxDev.toFixed(4)),
      avgFidelity,
      avgLatencyMs,
      finalVerdict,
      severity: config.attackType === 'BENIGN_TEST' ? 'LOW' : detectionRate > 80 ? 'CRITICAL' : 'HIGH'
    };

    this.experiments.unshift(result);
    this.save();
    return result;
  }
}

export const experimentService = new ExperimentService();
