export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AuditDecision = 'LEGITIMATE' | 'SUSPICIOUS' | 'ATTACK';

export interface AuditEvent {
  id: string;
  timestamp: string;
  sessionId: string;
  eventType: 'SIGNATURE_VERIFICATION' | 'ATTACK_SIMULATION' | 'EXPERIMENT_RUN' | 'CHANNEL_AUDIT';
  signerId: string;
  signatureId: string;
  messageHash: string;
  attackType: 'NONE' | 'FORGERY' | 'REPLAY' | 'IMPERSONATION' | 'CHANNEL_MANIPULATION';
  deviation: number;
  threshold: number;
  decision: AuditDecision;
  severity: SeverityLevel;
  shots: number;
  fidelity: number;
  latencyMs: number;
  notes: string;
  rawPayload?: Record<string, unknown>;
}

export interface AuditFilterParams {
  searchQuery: string;
  severity: string;
  decision: string;
  attackType: string;
  dateRange: 'ALL' | 'TODAY' | '7D' | '30D';
}
