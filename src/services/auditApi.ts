import { AuditEvent, AuditFilterParams } from '../types/audit';

const AUDIT_STORAGE_KEY = 'qds_sentinel_audit_logs';

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'EVT-98244',
    timestamp: '2026-08-26T04:58:12Z',
    sessionId: 'QDS-98244',
    eventType: 'ATTACK_SIMULATION',
    signerId: 'NODE_ROGUE_7X',
    signatureId: 'SIG-98244-FORGE',
    messageHash: '0x3d9f1a8e2b7c4d5e6f0a1b2c3d4e5f6a',
    attackType: 'REPLAY',
    deviation: 0.2847,
    threshold: 0.050,
    decision: 'ATTACK',
    severity: 'CRITICAL',
    shots: 10000,
    fidelity: 0.584,
    latencyMs: 16.4,
    notes: 'Replayed stale Bell-state telemetry. Pauli correction mismatch caused 28.4% probability collapse against expected Z-basis outcome.',
  },
  {
    id: 'EVT-98240',
    timestamp: '2026-08-26T04:45:30Z',
    sessionId: 'QDS-98240',
    eventType: 'SIGNATURE_VERIFICATION',
    signerId: 'AUTH_QUANTUM_CORE_ALICE',
    signatureId: 'SIG-AUTH-4412',
    messageHash: '0x88f219c0b431e7d829aa7c88b901ec44',
    attackType: 'NONE',
    deviation: 0.0032,
    threshold: 0.050,
    decision: 'LEGITIMATE',
    severity: 'LOW',
    shots: 15000,
    fidelity: 0.998,
    latencyMs: 14.1,
    notes: 'Teleportation verification passed within expected Poissonian bounds. High fidelity reconstructed signature token.',
  },
  {
    id: 'EVT-98235',
    timestamp: '2026-08-26T04:32:04Z',
    sessionId: 'QDS-98235',
    eventType: 'ATTACK_SIMULATION',
    signerId: 'EVE_PROBE_INTERCEPT',
    signatureId: 'SIG-PROBE-009',
    messageHash: '0x55aa12fe8890bbcc1122334455667788',
    attackType: 'CHANNEL_MANIPULATION',
    deviation: 0.0812,
    threshold: 0.050,
    decision: 'SUSPICIOUS',
    severity: 'HIGH',
    shots: 10000,
    fidelity: 0.892,
    latencyMs: 18.2,
    notes: 'Depolarizing photon number splitting detected on quantum fiber repeater link #3. Anomaly exceeded threshold τ.',
  },
  {
    id: 'EVT-98231',
    timestamp: '2026-08-26T04:15:19Z',
    sessionId: 'QDS-98231',
    eventType: 'SIGNATURE_VERIFICATION',
    signerId: 'AUTH_QUANTUM_CORE_BOB',
    signatureId: 'SIG-AUTH-4409',
    messageHash: '0x123456789abcdef0123456789abcdef0',
    attackType: 'NONE',
    deviation: 0.0028,
    threshold: 0.050,
    decision: 'LEGITIMATE',
    severity: 'LOW',
    shots: 10000,
    fidelity: 0.997,
    latencyMs: 12.8,
    notes: 'Teleportation verification completed. Pauli Z-correction applied successfully.',
  },
  {
    id: 'EVT-98226',
    timestamp: '2026-08-26T03:54:11Z',
    sessionId: 'QDS-98226',
    eventType: 'ATTACK_SIMULATION',
    signerId: 'SPOOF_IMPERSONATOR_K',
    signatureId: 'SIG-SPOOF-332',
    messageHash: '0xdeadbeefcafebabe0102030405060708',
    attackType: 'IMPERSONATION',
    deviation: 0.3120,
    threshold: 0.050,
    decision: 'ATTACK',
    severity: 'CRITICAL',
    shots: 10000,
    fidelity: 0.512,
    latencyMs: 15.6,
    notes: 'Impersonation attempt with unentangled separable state. Total variation distance crossed security boundary by 6.2x.',
  },
  {
    id: 'EVT-98220',
    timestamp: '2026-08-26T03:30:45Z',
    sessionId: 'QDS-98220',
    eventType: 'SIGNATURE_VERIFICATION',
    signerId: 'AUTH_QUANTUM_CORE_ALICE',
    signatureId: 'SIG-AUTH-4401',
    messageHash: '0x9900aabbccddeeff1122334455667788',
    attackType: 'NONE',
    deviation: 0.0041,
    threshold: 0.050,
    decision: 'LEGITIMATE',
    severity: 'LOW',
    shots: 20000,
    fidelity: 0.999,
    latencyMs: 15.2,
    notes: 'High-shot measurement baseline verification confirmed legitimate cryptographic signature state.',
  },
  {
    id: 'EVT-98215',
    timestamp: '2026-08-26T03:12:08Z',
    sessionId: 'QDS-98215',
    eventType: 'ATTACK_SIMULATION',
    signerId: 'FORGERY_CLUSTER_ALPHA',
    signatureId: 'SIG-FORGE-774',
    messageHash: '0x4433221100ffeeddccbbaa9988776655',
    attackType: 'FORGERY',
    deviation: 0.1984,
    threshold: 0.050,
    decision: 'ATTACK',
    severity: 'CRITICAL',
    shots: 10000,
    fidelity: 0.689,
    latencyMs: 14.9,
    notes: 'Quantum signature state synthesized without legitimate private generator key. Statistical divergence detected in projective Z basis.',
  }
];

class AuditService {
  private logs: AuditEvent[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      } else {
        this.logs = [...INITIAL_AUDIT_LOGS];
        this.saveLogs();
      }
    } catch {
      this.logs = [...INITIAL_AUDIT_LOGS];
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to persist audit logs in localStorage', e);
    }
  }

  public getLogs(filters?: Partial<AuditFilterParams>): AuditEvent[] {
    let result = [...this.logs];

    if (!filters) return result;

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        l =>
          l.sessionId.toLowerCase().includes(q) ||
          l.signerId.toLowerCase().includes(q) ||
          l.signatureId.toLowerCase().includes(q) ||
          l.messageHash.toLowerCase().includes(q) ||
          l.notes.toLowerCase().includes(q)
      );
    }

    if (filters.severity && filters.severity !== 'ALL') {
      result = result.filter(l => l.severity === filters.severity);
    }

    if (filters.decision && filters.decision !== 'ALL') {
      result = result.filter(l => l.decision === filters.decision);
    }

    if (filters.attackType && filters.attackType !== 'ALL') {
      result = result.filter(l => l.attackType === filters.attackType);
    }

    return result;
  }

  public recordEvent(event: AuditEvent) {
    this.logs.unshift(event);
    if (this.logs.length > 500) {
      this.logs = this.logs.slice(0, 500);
    }
    this.saveLogs();
  }

  public clearLogs() {
    this.logs = [...INITIAL_AUDIT_LOGS];
    this.saveLogs();
  }

  public exportAsJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public exportAsCSV(): string {
    const headers = [
      'Timestamp',
      'Session ID',
      'Event Type',
      'Signer ID',
      'Signature ID',
      'Message Hash',
      'Attack Type',
      'Deviation (TVD)',
      'Threshold',
      'Decision',
      'Severity',
      'Shots',
      'Fidelity',
      'Latency (ms)',
      'Notes'
    ];

    const rows = this.logs.map(l => [
      `"${l.timestamp}"`,
      `"${l.sessionId}"`,
      `"${l.eventType}"`,
      `"${l.signerId}"`,
      `"${l.signatureId}"`,
      `"${l.messageHash}"`,
      `"${l.attackType}"`,
      l.deviation,
      l.threshold,
      `"${l.decision}"`,
      `"${l.severity}"`,
      l.shots,
      l.fidelity,
      l.latencyMs,
      `"${l.notes.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const auditService = new AuditService();
