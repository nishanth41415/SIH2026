import React from 'react';
import { MeasurementDistribution } from '../../types/quantum';
import { Card, Badge } from '../ui/Primitives';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { BarChart2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MeasurementResultsViewProps {
  distribution: MeasurementDistribution;
  threshold?: number;
  title?: string;
}

export const MeasurementResultsView: React.FC<MeasurementResultsViewProps> = ({
  distribution,
  threshold = 0.050,
  title = 'Measurement Outcome Distribution (Z-Basis)'
}) => {
  const chartData = [
    {
      outcome: '|0⟩ Outcome',
      Expected: distribution.expected.outcome0,
      Observed: distribution.observed.outcome0,
      expectedCount: distribution.expected.count0,
      observedCount: distribution.observed.count0
    },
    {
      outcome: '|1⟩ Outcome',
      Expected: distribution.expected.outcome1,
      Observed: distribution.observed.outcome1,
      expectedCount: distribution.expected.count1,
      observedCount: distribution.observed.count1
    }
  ];

  const isAnomalous = distribution.tvd > threshold;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 font-mono flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            {title}
          </h3>
          <p className="text-[11px] text-slate-400">
            N = {distribution.shots.toLocaleString()} Projective Observable Samples
          </p>
        </div>

        {isAnomalous ? (
          <Badge variant="danger" className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            STATISTICAL DRIFT (TVD &gt; τ)
          </Badge>
        ) : (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            WITHIN ERROR BOUNDS (TVD ≤ τ)
          </Badge>
        )}
      </div>

      {/* Chart visualization */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="outcome"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              unit="%"
              domain={[0, 100]}
              tickLine={false}
              fontFamily="JetBrains Mono"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0c1017',
                borderColor: '#334155',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
                fontSize: '11px'
              }}
              formatter={(val: any, name: any) => [`${val}%`, name]}
            />
            <Legend
              wrapperStyle={{
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                paddingTop: '8px'
              }}
            />
            <Bar dataKey="Expected" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Expected Theoretical (%)" />
            <Bar
              dataKey="Observed"
              fill={isAnomalous ? '#ef4444' : '#06b6d4'}
              radius={[4, 4, 0, 0]}
              name="Observed Empirical (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistical Summary Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 block">Total Variation Dist. (TVD)</span>
          <span className={`text-sm font-bold ${isAnomalous ? 'text-rose-400' : 'text-slate-200'}`}>
            {distribution.tvd.toFixed(4)}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 block">Configured Threshold (τ)</span>
          <span className="text-sm font-bold text-amber-300">
            {threshold.toFixed(4)}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 block">Quantum State Fidelity (F)</span>
          <span className="text-sm font-bold text-cyan-400">
            {(distribution.fidelity * 100).toFixed(2)}%
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 block">χ² Goodness-of-Fit</span>
          <span className="text-sm font-bold text-slate-200">
            {distribution.chiSquare.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">(p={distribution.pValue < 0.001 ? '<0.001' : distribution.pValue.toFixed(3)})</span>
          </span>
        </div>
      </div>
    </Card>
  );
};
