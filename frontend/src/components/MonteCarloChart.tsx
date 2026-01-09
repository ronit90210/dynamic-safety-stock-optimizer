import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import type { MonteCarloResult } from '../types';

interface MonteCarloChartProps {
  results: MonteCarloResult;
  safetyStock: number;
  loading?: boolean;
}

export default function MonteCarloChart({ results, safetyStock, loading }: MonteCarloChartProps) {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Running simulation...</div>
      </div>
    );
  }

  // Create histogram bins
  const numBins = 40;
  const min = Math.min(...results.simulations);
  const max = Math.max(...results.simulations);
  const binSize = (max - min) / numBins;

  const bins = Array.from({ length: numBins }, (_, i) => {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    const count = results.simulations.filter((val) => val >= binStart && val < binEnd).length;
    return {
      range: Math.round(binStart),
      count,
      binStart,
      binEnd,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / results.simulations.length) * 100).toFixed(2);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">
            Demand: {data.binStart.toFixed(0)} - {data.binEnd.toFixed(0)} units
          </p>
          <p className="text-sm text-purple-600">
            <span className="font-medium">Occurrences:</span> {data.count} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const targetDemand = results.meanDemand + safetyStock;

  return (
    <div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={bins} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'Demand During Lead Time (units)', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Safety stock reference line */}
          <ReferenceLine
            x={Math.round(targetDemand)}
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              value: 'Safety Stock',
              position: 'top',
              fill: '#10b981',
              fontSize: 12,
            }}
          />

          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {bins.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.range >= targetDemand ? '#ef4444' : '#8b5cf6'}
                opacity={entry.range >= targetDemand ? 0.8 : 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Simulation Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-xs text-purple-700 font-medium">Stockout Probability</div>
          <div className="text-2xl font-bold text-purple-900">
            {results.stockoutProbability.toFixed(2)}%
          </div>
          <div className="text-xs text-purple-600 mt-1">
            {results.stockoutCount.toLocaleString()} / 10,000 runs
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-xs text-green-700 font-medium">Fill Rate</div>
          <div className="text-2xl font-bold text-green-900">
            {(100 - results.stockoutProbability).toFixed(2)}%
          </div>
          <div className="text-xs text-green-600 mt-1">
            Expected service level
          </div>
        </div>
      </div>

      {/* Percentiles */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs font-medium text-gray-700 mb-2">Demand Percentiles</div>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div>
            <div className="text-gray-600">P50</div>
            <div className="font-bold text-gray-900">{Math.round(results.percentiles.p50)}</div>
          </div>
          <div>
            <div className="text-gray-600">P75</div>
            <div className="font-bold text-gray-900">{Math.round(results.percentiles.p75)}</div>
          </div>
          <div>
            <div className="text-gray-600">P90</div>
            <div className="font-bold text-gray-900">{Math.round(results.percentiles.p90)}</div>
          </div>
          <div>
            <div className="text-blue-600">P95</div>
            <div className="font-bold text-blue-900">{Math.round(results.percentiles.p95)}</div>
          </div>
          <div>
            <div className="text-red-600">P99</div>
            <div className="font-bold text-red-900">{Math.round(results.percentiles.p99)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
