import React, { useState } from 'react';
import { SystemSettings, StatisticalTestMethod } from '../../types/settings';
import { Card, Button, Badge } from '../ui/Primitives';
import { Sliders, Save, CheckCircle2, Server, Activity, RotateCcw, AlertTriangle } from 'lucide-react';

interface SystemSettingsViewProps {
  settings: SystemSettings;
  onSave: (newSettings: SystemSettings) => void;
  onResetDefaults: () => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  settings,
  onSave,
  onResetDefaults
}) => {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            System & Quantum Simulator Settings
          </h2>
          <p className="text-xs text-slate-400">
            Configure telemetry defaults, statistical decision parameters, and backend FastAPI connectivity
          </p>
        </div>

        {savedSuccess && (
          <Badge variant="success" className="animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> SETTINGS PERSISTED
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Backend Connectivity */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200 font-mono flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              FastAPI / Backend Server Integration
            </h3>
            <Badge variant="cyan">CLIENT-SIDE EMULATION READY</Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Backend FastAPI API Endpoint</label>
              <input
                type="text"
                value={formData.backendUrl}
                onChange={e => setFormData({ ...formData, backendUrl: e.target.value })}
                placeholder="http://localhost:8000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/80"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                The frontend uses internal high-precision mathematical simulation services by default, ready to proxy to a live FastAPI container if activated.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="enableFastApiProxy"
                checked={formData.enableFastApiProxy}
                onChange={e => setFormData({ ...formData, enableFastApiProxy: e.target.checked })}
                className="rounded border-slate-800 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="enableFastApiProxy" className="text-slate-300 cursor-pointer">
                Route telemetry queries to live backend endpoint when available
              </label>
            </div>
          </div>
        </Card>

        {/* Statistical Decision Settings */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Statistical Hypothesis Decision Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Default Security Threshold (τ)</label>
              <select
                value={formData.defaultThreshold}
                onChange={e => setFormData({ ...formData, defaultThreshold: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300 focus:outline-none"
              >
                <option value={0.020}>0.020 (Strict / Zero Tolerance)</option>
                <option value={0.035}>0.035 (High Sensitivity)</option>
                <option value={0.050}>0.050 (Recommended Standard)</option>
                <option value={0.080}>0.080 (Optical Fiber Tolerant)</option>
                <option value={0.100}>0.100 (Loose / Demo Mode)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Default Measurement Shots (N)</label>
              <select
                value={formData.defaultShots}
                onChange={e => setFormData({ ...formData, defaultShots: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-cyan-300 focus:outline-none"
              >
                <option value={1000}>1,000 Shots (Fast)</option>
                <option value={5000}>5,000 Shots</option>
                <option value={10000}>10,000 Shots (Standard Precision)</option>
                <option value={25000}>25,000 Shots</option>
                <option value={50000}>50,000 Shots</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Statistical Test Algorithm</label>
              <select
                value={formData.statisticalMethod}
                onChange={e => setFormData({ ...formData, statisticalMethod: e.target.value as StatisticalTestMethod })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="TVD">Total Variation Distance (D_TV)</option>
                <option value="CHI_SQUARE">Pearson's Chi-Square Test (χ²)</option>
                <option value="KOLMOGOROV_SMIRNOV">Kolmogorov-Smirnov Test (KS)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Default Entangled Bell Pair</label>
              <select
                value={formData.teleportationEntanglementPair}
                onChange={e => setFormData({ ...formData, teleportationEntanglementPair: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="PHI_PLUS">|Φ⁺⟩ = 1/√2 (|00⟩ + |11⟩)</option>
                <option value="PHI_MINUS">|Φ⁻⟩ = 1/√2 (|00⟩ - |11⟩)</option>
                <option value="PSI_PLUS">|Ψ⁺⟩ = 1/√2 (|01⟩ + |10⟩)</option>
                <option value="PSI_MINUS">|Ψ⁻⟩ = 1/√2 (|01⟩ - |10⟩)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* UI & Audit Options */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200 font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-400" />
              UI & Audit Retention
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Simulation Visual Effects Level</label>
              <select
                value={formData.animationLevel}
                onChange={e => setFormData({ ...formData, animationLevel: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="FULL">Full Circuit Pulse & Glow</option>
                <option value="REDUCED">Reduced Motion</option>
                <option value="MINIMAL">Minimalist (High Performance)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Audit Log Retention (Days)</label>
              <input
                type="number"
                value={formData.dataRetentionDays}
                onChange={e => setFormData({ ...formData, dataRetentionDays: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="autoAuditLogging"
              checked={formData.autoAuditLogging}
              onChange={e => setFormData({ ...formData, autoAuditLogging: e.target.checked })}
              className="rounded border-slate-800 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="autoAuditLogging" className="text-xs font-mono text-slate-300 cursor-pointer">
              Automatically persist all quantum verification and attack simulation results into audit ledger
            </label>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="secondary" size="md" onClick={onResetDefaults} className="text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset to Factory Defaults
          </Button>

          <Button type="submit" variant="primary" size="md" className="px-6">
            <Save className="w-4 h-4 mr-1 text-slate-950" /> Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
