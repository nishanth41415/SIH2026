import React from 'react';
import { Card } from '../ui/Primitives';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { ThresholdSensitivityPoint } from '../../types/analytics';
import { Sliders } from 'lucide-react';

interface ThresholdSensitivityChartProps {
  data?: ThresholdSensitivityPoint[];
}

export const ThresholdSensitivityChart: React.FC<ThresholdSensitivityChartProps> = ({ data = [] }) => {
  const safeData = data || [];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Security Threshold (τ) Sensitivity & ROC Analysis
          </h3>
          <p className="text-[11px] text-slate-400">
            True Positive Rate vs False Positive Rate trade-off across threshold limits
          </p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="threshold"
              stroke="#64748b"
              fontSize={11}
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
            />
            <Legend
              wrapperStyle={{
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                paddingTop: '8px'
              }}
            />
            <ReferenceLine x={0.05} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Optimal τ=0.050', fill: '#10b981', fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="truePositiveRate"
              stroke="#10b981"
              strokeWidth={2}
              name="True Positive Rate (TPR %)"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="falsePositiveRate"
              stroke="#ef4444"
              strokeWidth={2}
              name="False Positive Rate (FPR %)"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="f1Score"
              stroke="#818cf8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              name="F1 Score (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
