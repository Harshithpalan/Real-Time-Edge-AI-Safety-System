import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DetectionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-panel border border-gray-700/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-4">Detections Over Time</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-panel border border-gray-700/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-4">Detections Over Time</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPerson" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
          />
          <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E1E2E',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="person"
            stroke="#3B82F6"
            fillOpacity={1}
            fill="url(#colorPerson)"
            name="Person"
          />
          <Area
            type="monotone"
            dataKey="fall"
            stroke="#EF4444"
            fillOpacity={1}
            fill="url(#colorFall)"
            name="Fall"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
