import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import type { DemandData, ForecastResult } from '../types';
import { format, parseISO } from 'date-fns';

interface DemandChartProps {
  data: DemandData[];
  forecast: ForecastResult;
  loading?: boolean;
}

export default function DemandChart({ data, forecast, loading }: DemandChartProps) {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading forecast...</div>
      </div>
    );
  }

  // Combine historical and forecast data
  const chartData = [
    ...data.slice(-30).map((d) => ({
      date: d.date,
      actual: d.demand,
      forecast: null,
      lower: null,
      upper: null,
    })),
    ...forecast.forecast.map((d, idx) => ({
      date: d.date,
      actual: null,
      forecast: d.demand,
      lower: forecast.confidence.lower[idx],
      upper: forecast.confidence.upper[idx],
    })),
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {format(parseISO(label), 'MMM dd, yyyy')}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {entry.value ? Math.round(entry.value) : 'N/A'} units
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => format(parseISO(date), 'MM/dd')}
            stroke="#9ca3af"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'Demand (units)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            iconType="line"
          />

          {/* Confidence interval */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="url(#confidenceGradient)"
            name="95% Confidence"
            fillOpacity={1}
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="white"
            fillOpacity={1}
          />

          {/* Actual demand */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#1f2937"
            strokeWidth={2}
            dot={{ r: 3, fill: '#1f2937' }}
            name="Historical Demand"
            connectNulls={false}
          />

          {/* Forecast */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#3b82f6' }}
            name="ML Forecast"
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Stats Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">Avg Demand</div>
          <div className="text-lg font-bold text-gray-900">{Math.round(forecast.demandMean)}</div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">Std Deviation</div>
          <div className="text-lg font-bold text-gray-900">{Math.round(forecast.demandStdDev)}</div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">Forecast Period</div>
          <div className="text-lg font-bold text-gray-900">14 days</div>
        </div>
      </div>
    </div>
  );
}
