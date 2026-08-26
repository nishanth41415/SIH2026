export type StatisticalTestMethod = 'TVD' | 'CHI_SQUARE' | 'KOLMOGOROV_SMIRNOV';

export interface SystemSettings {
  defaultShots: number;
  defaultThreshold: number;
  statisticalMethod: StatisticalTestMethod;
  backendUrl: string;
  enableFastApiProxy: boolean;
  simulationFidelityMode: 'HIGH_PRECISION' | 'FAST_APPROX';
  animationLevel: 'FULL' | 'REDUCED' | 'MINIMAL';
  dataRetentionDays: number;
  teleportationEntanglementPair: 'PHI_PLUS' | 'PHI_MINUS' | 'PSI_PLUS' | 'PSI_MINUS';
  autoAuditLogging: boolean;
  alertSoundEnabled: boolean;
}
