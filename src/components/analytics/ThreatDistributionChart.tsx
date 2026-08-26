import React from 'react';
import { Card } from '../ui/Primitives';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ThreatDistributionItem } from '../../types/analytics';
import { PieChart as PieIcon } from 'lucide-react';

interface ThreatDistributionChartProps {
  data?: ThreatDistributionItem[];
}

export const ThreatDistributionChart: React.FC<ThreatDistributionChartProps> = ({ data = [] }) => {
  const safeData = data || [];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-400" />
            Intercepted Attack Distribution
          </h3>
          <p className="text-[11px] text-slate-400">
            Categorical taxonomy of detected quantum signature threats
          </p>
        </div>
      </div>

      <div className="h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="count"
              nameKey="name"
            >
              {safeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0c1017" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0c1017',
                borderColor: '#334155',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
                fontSize: '11px'
              }}
              formatter={(val: any, name: any, item: any) => [
                `${val} events (${item.payload?.percentage ?? 0}%)`,
                name
              ]}
            />
            <Legend
              wrapperStyle={{
                fontSize: '10px',
                fontFamily: 'JetBrains Mono',
                paddingTop: '6px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 font-mono text-[11px]">
        {safeData.map(item => (
          <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-slate-950/80">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 truncate">{item.name}</span>
            </div>
            <span className="text-slate-100 font-bold ml-2">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
