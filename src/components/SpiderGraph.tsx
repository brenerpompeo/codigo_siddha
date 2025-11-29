import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { PILLARS, Task } from '../types';

interface SpiderGraphProps {
  tasks: Task[];
}

export const SpiderGraph: React.FC<SpiderGraphProps> = ({ tasks }) => {
  // Calculate scores based on COMPLETED tasks per pillar
  // We can normalize this: e.g., max score of 10? Or just count?
  // User wanted: "Balance must be fed by Actual Task Completion"
  // Let's cap it at 10 for visual balance, or relative to max.

  const completedTasks = tasks.filter(t => t.status === 'done');

  const data = PILLARS.map(pillar => {
    const count = completedTasks.filter(t => t.pillar === pillar).length;
    // We could also factor in total tasks to show "completion rate" vs "raw output".
    // For "Tactical" aspect, raw output (count) is better to encourage work.
    return {
      subject: pillar,
      A: count,
      fullMark: Math.max(completedTasks.length, 10), // Dynamic scale
    };
  });

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar
            name="Tasks Completed"
            dataKey="A"
            stroke="#F472B6"
            strokeWidth={2}
            fill="#F472B6"
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
            itemStyle={{ color: '#F472B6' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
