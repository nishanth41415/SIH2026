import React from 'react';
import { Card } from '../ui/Primitives';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Line,
  ComposedChart
} from 'recharts';
import { LatencyScalingPoint } from '../../types/analytics';
import { Clock } from 'lucide-react';

interface LatencyRuntimeChartProps {
  data?: LatencyScalingPoint[];
}

export const LatencyRuntimeChart: React.FC<LatencyRuntimeChartProps> = ({ data = [] }) => {
  const safeData = data || [];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Measurement Shot Scaling vs Verification Latency
          </h3>
          <p className="text-[11px] text-slate-400">
            Computational latency scaling vs statistical sampling precision
          </p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={safeData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="shots"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              fontFamily="JetBrains Mono"
              tickFormatter={(val) => `${val / 1000}k`}
            />
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              unit="ms"
              tickLine={false}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              fontSize={11}
              unit="%"
              domain={[90, 100]}
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
            <Bar
              yAxisId="left"
              dataKey="latencyMs"
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              name="Verification Latency (ms)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="statisticalAccuracy"
              stroke="#10b981"
              strokeWidth={2}
              name="Statistical Precision (%)"
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
