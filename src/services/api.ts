import { SystemSettings } from '../types/settings';
import { runSignatureVerification, DEFAULT_PIPELINE_STAGES } from './verificationApi';
import { runAttackSimulation, ATTACK_CATALOG } from './attackApi';
import { auditService } from './auditApi';
import { experimentService } from './experimentApi';
import {
  getSecurityOverviewMetrics,
  getThreatDistribution,
  getDetectionVsIntensityData,
  getThresholdSensitivityData,
  getLatencyScalingData,
  getFidelityTimeSeries
} from './analyticsApi';
import { PipelineStage, VerificationRequest } from '../types/verification';
import { AttackControlConfig, AttackType } from '../types/attack';
import { ExperimentConfig } from '../types/experiment';

const SETTINGS_KEY = 'qds_sentinel_settings';

export const DEFAULT_SETTINGS: SystemSettings = {
  defaultShots: 10000,
  defaultThreshold: 0.050,
  statisticalMethod: 'TVD',
  backendUrl: 'http://localhost:8000',
  enableFastApiProxy: false,
  simulationFidelityMode: 'HIGH_PRECISION',
  animationLevel: 'FULL',
  dataRetentionDays: 30,
  teleportationEntanglementPair: 'PHI_PLUS',
  autoAuditLogging: true,
  alertSoundEnabled: false
};

export function loadSystemSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSystemSettings(settings: SystemSettings): SystemSettings {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save system settings', e);
  }
  return settings;
}

export function resetSystemSettings(): SystemSettings {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (e) {
    console.warn('Failed to clear settings', e);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Unified API Client for QDS Sentinel
 * Easily swappable with FastAPI backend endpoints
 */
export const qdsApi = {
  verification: {
    run: runSignatureVerification,
    verify: runSignatureVerification,
    getStages: async (): Promise<PipelineStage[]> => {
      return DEFAULT_PIPELINE_STAGES.map(s => ({ ...s, status: 'idle' }));
    }
  },
  attack: {
    simulate: async (
      typeOrConfig: AttackType | AttackControlConfig,
      optionalConfig?: AttackControlConfig,
      customHash?: string
    ) => {
      let finalConfig: AttackControlConfig;
      if (typeof typeOrConfig === 'string') {
        finalConfig = {
          ...(optionalConfig || {
            intensity: 75,
            channelNoise: 15,
            measurementShots: 10000,
            securityThreshold: 0.050,
            seed: 'AUTO'
          }),
          attackType: typeOrConfig
        };
      } else {
        finalConfig = typeOrConfig;
      }
      return runAttackSimulation(finalConfig, customHash);
    },
    getCatalog: async () => ATTACK_CATALOG
  },
  audit: {
    getAll: (filters?: Parameters<typeof auditService.getLogs>[0]) => auditService.getLogs(filters),
    getLogs: async (filters?: Parameters<typeof auditService.getLogs>[0]) => auditService.getLogs(filters),
    record: (event: Parameters<typeof auditService.recordEvent>[0]) => auditService.recordEvent(event),
    clear: () => auditService.clearLogs(),
    exportJSON: () => auditService.exportAsJSON(),
    exportCSV: () => auditService.exportAsCSV(),
    exportLogs: async (format: 'JSON' | 'CSV') =>
      format === 'JSON' ? auditService.exportAsJSON() : auditService.exportAsCSV()
  },
  analytics: {
    getOverview: getSecurityOverviewMetrics,
    getMetrics: async () => getSecurityOverviewMetrics(),
    getThreatDistribution,
    getDetectionVsIntensityData,
    getThresholdSensitivityData,
    getLatencyScalingData,
    getFidelityTimeSeries
  },
  experiment: {
    getHistory: async () => experimentService.getExperiments(),
    getAll: () => experimentService.getExperiments(),
    runExperiment: (config: ExperimentConfig, progress?: (done: number, total: number) => void) =>
      experimentService.runExperiment(config, progress)
  },
  experiments: {
    getAll: () => experimentService.getExperiments(),
    getHistory: async () => experimentService.getExperiments(),
    run: (config: ExperimentConfig, progress?: (done: number, total: number) => void) =>
      experimentService.runExperiment(config, progress),
    runExperiment: (config: ExperimentConfig, progress?: (done: number, total: number) => void) =>
      experimentService.runExperiment(config, progress)
  },
  settings: {
    get: loadSystemSettings,
    getSettings: async () => loadSystemSettings(),
    save: saveSystemSettings,
    updateSettings: async (settings: SystemSettings) => saveSystemSettings(settings),
    resetToDefaults: async () => resetSystemSettings()
  }
};
