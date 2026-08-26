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
  CartesianGrid
} from 'recharts';
import { DetectionVsIntensityPoint } from '../../types/analytics';
import { TrendingUp } from 'lucide-react';

interface DetectionRateChartProps {
  data?: DetectionVsIntensityPoint[];
}

export const DetectionRateChart: React.FC<DetectionRateChartProps> = ({ data = [] }) => {
  const safeData = data || [];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Attack Intensity vs Detection Probability
          </h3>
          <p className="text-[11px] text-slate-400">
            Empirical intercept rate across varied perturbation strengths (0–100%)
          </p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safeData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="intensity"
              stroke="#64748b"
              fontSize={11}
              unit="%"
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
            <Line
              type="monotone"
              dataKey="detectionRate"
              stroke="#06b6d4"
              strokeWidth={2.5}
              name="Overall Detection Rate (%)"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="replayRate"
              stroke="#ef4444"
              strokeWidth={1.5}
              name="Replay Intercept (%)"
              strokeDasharray="4 4"
            />
            <Line
              type="monotone"
              dataKey="forgeryRate"
              stroke="#ec4899"
              strokeWidth={1.5}
              name="Forgery Intercept (%)"
            />
            <Line
              type="monotone"
              dataKey="channelNoiseRate"
              stroke="#f59e0b"
              strokeWidth={1.5}
              name="Channel Anomaly (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
