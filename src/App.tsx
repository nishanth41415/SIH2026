import React, { useState, useEffect, useMemo } from 'react';
import { qdsApi, loadSystemSettings } from './services/api';
import { ATTACK_CATALOG } from './services/attackApi';
import { DEFAULT_PIPELINE_STAGES } from './services/verificationApi';
import { auditService } from './services/auditApi';
import { experimentService } from './services/experimentApi';
import { getSecurityOverviewMetrics } from './services/analyticsApi';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';

// Dashboard Overview
import { OverviewView } from './components/dashboard/OverviewView';

// Verification Components
import { VerificationForm } from './components/verification/VerificationForm';
import { VerificationPipeline } from './components/verification/VerificationPipeline';
import { VerificationResultCard } from './components/verification/VerificationResultCard';
import { QuantumCircuit } from './components/quantum/QuantumCircuit';

// Attack Lab Components
import { AttackCard } from './components/attack/AttackCard';
import { AttackControls } from './components/attack/AttackControls';
import { DistributionComparison } from './components/attack/DistributionComparison';
import { AnomalyReasoningCard } from './components/attack/AnomalyReasoningCard';

// Analytics Components
import { ThreatMetricCards } from './components/analytics/ThreatMetricCards';
import { DetectionRateChart } from './components/analytics/DetectionRateChart';
import { ThresholdSensitivityChart } from './components/analytics/ThresholdSensitivityChart';
import { ThreatDistributionChart } from './components/analytics/ThreatDistributionChart';
import { LatencyRuntimeChart } from './components/analytics/LatencyRuntimeChart';

// Audit Components
import { AuditTable } from './components/audit/AuditTable';

// Quantum State Explorer
import { BellStateSelector } from './components/quantum/BellStateSelector';
import { QubitStateVisualizer } from './components/quantum/QubitStateVisualizer';
import { QuantumGatesSandbox } from './components/quantum/QuantumGatesSandbox';
import { createQubitState } from './services/quantumEngine';

// Experiment Components
import { ExperimentRunner } from './components/experiments/ExperimentRunner';
import { ExperimentHistory } from './components/experiments/ExperimentHistory';

// Settings Component
import { SystemSettingsView } from './components/settings/SystemSettingsView';

// Demo Modal
import { DemoModeModal } from './components/demo/DemoModeModal';

// Types
import { VerificationRequest, VerificationResult, PipelineStage } from './types/verification';
import { AttackCardInfo, AttackControlConfig, AttackSimulationResult, AttackType } from './types/attack';
import { SecurityMetrics } from './types/analytics';
import { AuditEvent } from './types/audit';
import { ExperimentRunResult, ExperimentConfig } from './types/experiment';
import { SystemSettings } from './types/settings';
import { BellStateType, QubitState } from './types/quantum';
import { Card, Badge, Button } from './components/ui/Primitives';
import { KeyRound, ShieldAlert, Cpu, Sparkles, Activity, Layers } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState('overview');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [targetAuditSessionId, setTargetAuditSessionId] = useState<string | null>(null);

  // Global App State from Services
  const [metrics, setMetrics] = useState<SecurityMetrics>(() => getSecurityOverviewMetrics());
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => auditService.getLogs());
  const [experiments, setExperiments] = useState<ExperimentRunResult[]>(() => experimentService.getExperiments());
  const [settings, setSettings] = useState<SystemSettings>(() => loadSystemSettings());

  // Verification View State
  const [verificationStages, setVerificationStages] = useState<PipelineStage[]>(() =>
    DEFAULT_PIPELINE_STAGES.map(s => ({ ...s, status: 'idle' }))
  );
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Attack Lab View State
  const [attackCatalog, setAttackCatalog] = useState<AttackCardInfo[]>(() => ATTACK_CATALOG);
  const [selectedAttackType, setSelectedAttackType] = useState<AttackType>('REPLAY');
  const [attackConfig, setAttackConfig] = useState<AttackControlConfig>({
    intensity: 75,
    channelNoise: 15,
    measurementShots: 10000,
    securityThreshold: 0.050,
    seed: 'AUTO'
  });
  const [attackResult, setAttackResult] = useState<AttackSimulationResult | null>(null);
  const [isSimulatingAttack, setIsSimulatingAttack] = useState(false);

  // Quantum State Sandbox View State
  const [sandboxBellState, setSandboxBellState] = useState<BellStateType>('PHI_PLUS');
  const [sandboxQubit, setSandboxQubit] = useState<QubitState>(() =>
    createQubitState(Math.PI / 3, 0, 'Interactive |ψ⟩')
  );

  // Experiment Execution State
  const [isExecutingExperiment, setIsExecutingExperiment] = useState(false);

  // Analytics Chart Data
  const threatDistribution = useMemo(() => qdsApi.analytics.getThreatDistribution(), [auditLogs, metrics]);
  const detectionVsIntensity = useMemo(() => qdsApi.analytics.getDetectionVsIntensityData(), []);
  const thresholdSensitivity = useMemo(() => qdsApi.analytics.getThresholdSensitivityData(), []);
  const latencyScaling = useMemo(() => qdsApi.analytics.getLatencyScalingData(), []);

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      const initialMetrics = await qdsApi.analytics.getMetrics();
      setMetrics(initialMetrics);

      const logs = await qdsApi.audit.getLogs();
      setAuditLogs(logs);

      const expList = await qdsApi.experiment.getHistory();
      setExperiments(expList);

      const appSettings = await qdsApi.settings.getSettings();
      setSettings(appSettings);

      const catalog = await qdsApi.attack.getCatalog();
      setAttackCatalog(catalog);

      const stages = await qdsApi.verification.getStages();
      setVerificationStages(stages);
    };

    loadInitialData();
  }, []);

  // Verification Handler
  const handleRunVerification = async (req: VerificationRequest) => {
    setIsVerifying(true);
    setVerificationResult(null);

    // Initial reset of pipeline stages to pending
    const baseStages = await qdsApi.verification.getStages();
    setVerificationStages(baseStages);

    try {
      const result = await qdsApi.verification.verify(req, (_stageId, updatedStages) => {
        setVerificationStages([...updatedStages]);
      });

      setVerificationResult(result);

      // Refresh metrics and audit logs
      const updatedLogs = await qdsApi.audit.getLogs();
      setAuditLogs(updatedLogs);
      const updatedMetrics = await qdsApi.analytics.getMetrics();
      setMetrics(updatedMetrics);
    } finally {
      setIsVerifying(false);
    }
  };

  // Attack Lab Simulation Handler
  const handleRunAttackSimulation = async (typeToRun?: AttackType) => {
    const targetType = typeToRun || selectedAttackType;
    setIsSimulatingAttack(true);

    try {
      const res = await qdsApi.attack.simulate(targetType, attackConfig);
      setAttackResult(res);

      // Update audit logs and metrics
      const updatedLogs = await qdsApi.audit.getLogs();
      setAuditLogs(updatedLogs);
      const updatedMetrics = await qdsApi.analytics.getMetrics();
      setMetrics(updatedMetrics);
    } finally {
      setIsSimulatingAttack(false);
    }
  };

  // Experiment Runner Handler
  const handleRunExperiment = async (
    config: ExperimentConfig,
    onProgress: (done: number, total: number) => void
  ) => {
    setIsExecutingExperiment(true);
    try {
      const result = await qdsApi.experiment.runExperiment(config, onProgress);
      const updatedHistory = await qdsApi.experiment.getHistory();
      setExperiments(updatedHistory);
      return result;
    } finally {
      setIsExecutingExperiment(false);
    }
  };

  // Settings Handlers
  const handleSaveSettings = async (newSettings: SystemSettings) => {
    const saved = await qdsApi.settings.updateSettings(newSettings);
    setSettings(saved);
  };

  const handleResetSettings = async () => {
    const defaults = await qdsApi.settings.resetToDefaults();
    setSettings(defaults);
  };

  // Audit Export Handlers
  const handleExportJSON = async () => {
    const jsonStr = await qdsApi.audit.exportLogs('JSON');
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qds-sentinel-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = async () => {
    const csvStr = await qdsApi.audit.exportLogs('CSV');
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qds-sentinel-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Navigate to Audit with specific session selected
  const handleInspectAuditSession = (sessionId: string) => {
    setTargetAuditSessionId(sessionId);
    setActiveView('audit-log');
  };

  return (
    <div className="flex h-screen bg-[#05070A] text-slate-300 overflow-hidden font-sans select-none">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeView}
        onTabChange={tab => {
          setActiveView(tab);
          setTargetAuditSessionId(null);
        }}
        threatCount={metrics?.threatsDetected || 7}
        securityStatus={metrics?.overallSecurityStatus || 'SECURE'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader
          activeSessionsCount={metrics?.activeSessions || 14}
          securityStatus={metrics?.overallSecurityStatus || 'SECURE'}
          onLaunchDemo={() => setIsDemoModalOpen(true)}
          onNavigate={tab => {
            setActiveView(tab);
            setTargetAuditSessionId(null);
          }}
        />

        {/* Dynamic Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* VIEW 1: OVERVIEW DASHBOARD */}
          {activeView === 'overview' && metrics && (
            <OverviewView
              metrics={metrics}
              recentEvents={auditLogs}
              onNavigate={setActiveView}
              onInspectEvent={handleInspectAuditSession}
              onLaunchDemo={() => setIsDemoModalOpen(true)}
            />
          )}

          {/* VIEW 2: QUANTUM SIGNATURE VERIFICATION */}
          {activeView === 'verification' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
                    <KeyRound className="w-6 h-6 text-cyan-400" />
                    QUANTUM SIGNATURE VERIFICATION
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Teleportation-based signature reconstruction and statistical hypothesis testing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column: Form & Teleportation Circuit */}
                <div className="lg:col-span-6 space-y-5">
                  <VerificationForm
                    onVerify={handleRunVerification}
                    isProcessing={isVerifying}
                  />

                  <QuantumCircuit
                    interactive={true}
                    bsmOutcomes={verificationResult?.telemetry.bellMeasurement}
                    pauliCorrection={verificationResult?.telemetry.pauliCorrection}
                    fidelity={verificationResult?.telemetry.fidelity}
                  />
                </div>

                {/* Right Column: Execution Pipeline & Result Evidence Card */}
                <div className="lg:col-span-6 space-y-5">
                  <VerificationPipeline
                    stages={verificationStages}
                  />

                  {verificationResult ? (
                    <VerificationResultCard
                      result={verificationResult}
                      onInspectAudit={handleInspectAuditSession}
                    />
                  ) : (
                    <Card className="p-8 text-center space-y-3 bg-[#0a0e16]">
                      <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                        <KeyRound className="w-6 h-6" />
                      </div>
                      <div className="font-mono text-sm font-semibold text-slate-300">
                        Awaiting Verification Execution
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto font-mono">
                        Select a quick preset or configure payload parameters on the left, then trigger quantum state teleportation.
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: ATTACK LABORATORY */}
          {activeView === 'attack-lab' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-rose-500" />
                    ATTACK LABORATORY
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Inject controlled attacks into the QDS verification pipeline and observe statistical anomalies.
                  </p>
                </div>
              </div>

              {/* 4 Attack Vector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {attackCatalog.map(att => (
                  <AttackCard
                    key={att.type}
                    attack={att}
                    isSelected={selectedAttackType === att.type}
                    onSelect={() => setSelectedAttackType(att.type)}
                    onQuickSimulate={() => {
                      setSelectedAttackType(att.type);
                      handleRunAttackSimulation(att.type);
                    }}
                  />
                ))}
              </div>

              {/* Attack Controls Bar */}
              <AttackControls
                config={attackConfig}
                onChange={setAttackConfig}
                onRunSimulation={() => handleRunAttackSimulation(selectedAttackType)}
                onReset={() =>
                  setAttackConfig({
                    intensity: 75,
                    channelNoise: 15,
                    measurementShots: 10000,
                    securityThreshold: 0.050,
                    seed: 'AUTO'
                  })
                }
                isSimulating={isSimulatingAttack}
              />

              {/* Attack Simulation Results */}
              {attackResult ? (
                <div className="space-y-5">
                  <AnomalyReasoningCard
                    result={attackResult}
                    onViewAudit={() => handleInspectAuditSession(attackResult.sessionId)}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-7">
                      <DistributionComparison
                        distribution={attackResult.measurementDistribution}
                        threshold={attackResult.statisticalMetrics.threshold}
                        attackName={attackResult.attackType}
                      />
                    </div>
                    <div className="lg:col-span-5">
                      <QuantumCircuit
                        interactive={false}
                        fidelity={attackResult.statisticalMetrics.quantumFidelity}
                        fidelityWarning={attackResult.decision.decision === 'ATTACK'}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Card className="p-8 text-center space-y-3 bg-[#0a0e16]">
                  <div className="w-12 h-12 rounded-full bg-rose-950/40 border border-rose-800/60 flex items-center justify-center mx-auto text-rose-400">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="font-mono text-sm font-semibold text-slate-200">
                    Attack Injection Engine Ready
                  </div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
                    Select an attack vector above, tune perturbation parameters, and execute the simulation to observe quantum statistical deviation.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* VIEW 4: SECURITY ANALYTICS */}
          {activeView === 'security-analytics' && metrics && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-cyan-400" />
                    QUANTUM SECURITY ANALYTICS
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Statistical telemetry, threshold trade-offs, and empirical threat distributions.
                  </p>
                </div>
              </div>

              {/* 6 Metric KPI Cards */}
              <ThreatMetricCards metrics={metrics} />

              {/* Analytics Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <DetectionRateChart data={detectionVsIntensity} />
                <ThresholdSensitivityChart data={thresholdSensitivity} />
                <ThreatDistributionChart data={threatDistribution} />
                <LatencyRuntimeChart data={latencyScaling} />
              </div>
            </div>
          )}

          {/* VIEW 5: AUDIT LOG */}
          {activeView === 'audit-log' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-cyan-400" />
                    SECURITY AUDIT LOG &amp; CRYPTOGRAPHIC PROVENANCE
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Immutable verification events, statistical test results, and forensic traces.
                  </p>
                </div>
              </div>

              <AuditTable
                logs={auditLogs}
                onExportJSON={handleExportJSON}
                onExportCSV={handleExportCSV}
                initialSelectedSessionId={targetAuditSessionId}
              />
            </div>
          )}

          {/* VIEW 6: QUANTUM STATE SANDBOX */}
          {activeView === 'quantum-state' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-cyan-400" />
                    QUANTUM STATE EXPLORER &amp; TELEPORTATION SANDBOX
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Interactive Bloch sphere state preparation, Bell-basis entanglement, and unitary quantum gates.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-6 space-y-5">
                  <QubitStateVisualizer
                    state={sandboxQubit}
                    onStateChange={setSandboxQubit}
                  />

                  <BellStateSelector
                    selectedState={sandboxBellState}
                    onSelectState={setSandboxBellState}
                  />
                </div>

                <div className="lg:col-span-6 space-y-5">
                  <QuantumGatesSandbox
                    currentState={sandboxQubit}
                    onApplyTransformation={setSandboxQubit}
                  />

                  <QuantumCircuit
                    interactive={true}
                    fidelity={0.999}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: RESEARCH EXPERIMENTS */}
          {activeView === 'experiments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                    RESEARCH EXPERIMENTATION SUITE
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Batch Monte Carlo trials, sensitivity sweeps, and statistical benchmark analysis.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-6">
                  <ExperimentRunner
                    onRunExperiment={handleRunExperiment}
                    isExecuting={isExecutingExperiment}
                  />
                </div>
                <div className="lg:col-span-6">
                  <ExperimentHistory experiments={experiments} />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 8: SYSTEM SETTINGS */}
          {activeView === 'settings' && settings && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-slate-300" />
                    SYSTEM CONFIGURATION &amp; FASTAPI INTEGRATION
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Telemetry thresholds, statistical algorithms, and backend connection endpoint.
                  </p>
                </div>
              </div>

              <SystemSettingsView
                settings={settings}
                onSave={handleSaveSettings}
                onResetDefaults={handleResetSettings}
              />
            </div>
          )}
        </main>
      </div>

      {/* Guided Judge Walkthrough Modal */}
      <DemoModeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateToView={view => {
          setActiveView(view);
          setTargetAuditSessionId(null);
        }}
      />
    </div>
  );
}
