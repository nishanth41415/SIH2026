import React from 'react';
import { MeasurementDistribution } from '../../types/quantum';
import { Card, Badge } from '../ui/Primitives';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell } from 'recharts';
import { ArrowRight, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface DistributionComparisonProps {
  distribution: MeasurementDistribution;
  threshold: number;
  attackName: string;
}

export const DistributionComparison: React.FC<DistributionComparisonProps> = ({
  distribution,
  threshold,
  attackName
}) => {
  const isAnomalous = distribution.tvd > threshold;
  const delta0 = Number((distribution.observed.outcome0 - distribution.expected.outcome0).toFixed(2));
  const delta1 = Number((distribution.observed.outcome1 - distribution.expected.outcome1).toFixed(2));

  const chartData = [
    {
      name: 'Outcome |0⟩',
      Expected: distribution.expected.outcome0,
      Observed: distribution.observed.outcome0,
      delta: delta0
    },
    {
      name: 'Outcome |1⟩',
      Expected: distribution.expected.outcome1,
      Observed: distribution.observed.outcome1,
      delta: delta1
    }
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            EXPECTED VS OBSERVED QUANTUM MEASUREMENT DISTRIBUTION
          </h3>
          <p className="text-[11px] text-slate-400">
            Projective measurement comparison under {attackName} injection
          </p>
        </div>

        <Badge variant={isAnomalous ? 'danger' : 'success'}>
          {isAnomalous ? 'THRESHOLD EXCEEDED' : 'WITHIN BOUNDS'}
        </Badge>
      </div>

      {/* Recharts Comparison Visualization */}
      <div className="h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 30, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="name"
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

      {/* Direct Numerical Probabilities Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono text-xs">
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-slate-400 font-semibold flex items-center justify-between">
            <span>Expected Probabilities:</span>
            <span className="text-blue-400 font-mono">Theoretical</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>|0⟩ Outcome:</span>
            <span className="font-bold text-sm text-blue-300">{distribution.expected.outcome0}%</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>|1⟩ Outcome:</span>
            <span className="font-bold text-sm text-blue-300">{distribution.expected.outcome1}%</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-slate-400 font-semibold flex items-center justify-between">
            <span>Observed Probabilities:</span>
            <span className={isAnomalous ? 'text-rose-400 font-mono' : 'text-cyan-400 font-mono'}>
              Empirical
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>|0⟩ Outcome:</span>
            <span className={`font-bold text-sm ${isAnomalous ? 'text-rose-300' : 'text-cyan-300'}`}>
              {distribution.observed.outcome0}%
              <span className="text-[10px] ml-1.5 text-slate-400 font-normal">
                ({delta0 >= 0 ? `+${delta0}` : delta0}%)
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>|1⟩ Outcome:</span>
            <span className={`font-bold text-sm ${isAnomalous ? 'text-rose-300' : 'text-cyan-300'}`}>
              {distribution.observed.outcome1}%
              <span className="text-[10px] ml-1.5 text-slate-400 font-normal">
                ({delta1 >= 0 ? `+${delta1}` : delta1}%)
              </span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
