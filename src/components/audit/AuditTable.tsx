import React, { useState } from 'react';
import { AuditEvent, AuditFilterParams } from '../../types/audit';
import { Card, Badge, Button } from '../ui/Primitives';
import { AuditDrawer } from './AuditDrawer';
import {
  Search,
  Download,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
  RotateCcw
} from 'lucide-react';

interface AuditTableProps {
  logs?: AuditEvent[];
  onExportJSON: () => void;
  onExportCSV: () => void;
  initialSelectedSessionId?: string | null;
}

export const AuditTable: React.FC<AuditTableProps> = ({
  logs = [],
  onExportJSON,
  onExportCSV,
  initialSelectedSessionId
}) => {
  const safeLogs = logs || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [attackFilter, setAttackFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(() => {
    if (initialSelectedSessionId) {
      return safeLogs.find(l => l.sessionId === initialSelectedSessionId) || null;
    }
    return null;
  });

  const filteredLogs = safeLogs.filter(log => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        log.sessionId.toLowerCase().includes(q) ||
        log.signerId.toLowerCase().includes(q) ||
        log.signatureId.toLowerCase().includes(q) ||
        log.messageHash.toLowerCase().includes(q) ||
        log.notes.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (severityFilter !== 'ALL' && log.severity !== severityFilter) return false;
    if (decisionFilter !== 'ALL' && log.decision !== decisionFilter) return false;
    if (attackFilter !== 'ALL' && log.attackType !== attackFilter) return false;

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('ALL');
    setDecisionFilter('ALL');
    setAttackFilter('ALL');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <Card className="p-4 space-y-3 bg-[#0a0e16]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search session ID, signer, hash..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80"
            />
          </div>

          {/* Export and Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportJSON}
              className="text-xs font-mono"
              title="Export as JSON file"
            >
              <FileCode className="w-3.5 h-3.5 mr-1" /> JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportCSV}
              className="text-xs font-mono"
              title="Export as CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> CSV
            </Button>
            {(searchQuery || severityFilter !== 'ALL' || decisionFilter !== 'ALL' || attackFilter !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-slate-400"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs font-mono">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Decision Filter</label>
            <select
              value={decisionFilter}
              onChange={e => setDecisionFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Decisions</option>
              <option value="LEGITIMATE">LEGITIMATE</option>
              <option value="SUSPICIOUS">SUSPICIOUS</option>
              <option value="ATTACK">ATTACK</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Severity Filter</label>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Attack Type</label>
            <select
              value={attackFilter}
              onChange={e => setAttackFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Vector Types</option>
              <option value="NONE">None (Benign)</option>
              <option value="FORGERY">FORGERY</option>
              <option value="REPLAY">REPLAY</option>
              <option value="IMPERSONATION">IMPERSONATION</option>
              <option value="CHANNEL_MANIPULATION">CHANNEL_MANIPULATION</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090d14]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Timestamp (UTC)</th>
              <th className="px-4 py-3">Session ID</th>
              <th className="px-4 py-3">Event Type</th>
              <th className="px-4 py-3">Attack Type</th>
              <th className="px-4 py-3 text-right">Deviation (TVD)</th>
              <th className="px-4 py-3 text-right">Threshold (τ)</th>
              <th className="px-4 py-3 text-center">Decision</th>
              <th className="px-4 py-3 text-center">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500 italic">
                  No matching quantum security audit events found.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => {
                const isAttack = log.decision === 'ATTACK';
                const isSuspicious = log.decision === 'SUSPICIOUS';

                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedEvent(log)}
                    className="hover:bg-slate-900/80 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {log.timestamp.replace('T', ' ').slice(0, 19)}
                    </td>

                    <td className="px-4 py-3 font-bold text-cyan-300 whitespace-nowrap">
                      {log.sessionId}
                    </td>

                    <td className="px-4 py-3 text-slate-300">
                      {log.eventType.replace('_', ' ')}
                    </td>

                    <td className="px-4 py-3">
                      <span className={log.attackType !== 'NONE' ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                        {log.attackType === 'NONE' ? 'None' : log.attackType}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className={log.deviation > log.threshold ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                        {log.deviation.toFixed(4)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right text-amber-300">
                      {log.threshold.toFixed(3)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant={isAttack ? 'danger' : isSuspicious ? 'warning' : 'success'}>
                        {log.decision}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={
                          log.severity === 'CRITICAL'
                            ? 'danger'
                            : log.severity === 'HIGH'
                            ? 'warning'
                            : 'cyan'
                        }
                      >
                        {log.severity}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Event Slide-over Drawer */}
      <AuditDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};
