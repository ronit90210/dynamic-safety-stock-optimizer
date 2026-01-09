import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SafetyStockConfig, DemandData } from '../types';
import { calculateSafetyStock } from '../utils/calculations';

interface CostChartProps {
  currentServiceLevel: number;
  config: SafetyStockConfig;
  demandData: DemandData[];
  loading?: boolean;
}

export default function CostChart({ currentServiceLevel, config, demandData, loading }: CostChartProps) {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Calculating costs...</div>
      </div>
    );
  }

  // Generate cost data for different service levels
  const serviceLevels = [];
  for (let sl = 0.90; sl <= 0.995; sl += 0.005) {
    serviceLevels.push(sl);
  }

  const costData = serviceLevels.map((sl) => {
    const tempConfig = { ...config, serviceLevel: sl };
    const result = calculateSafetyStock(tempConfig, demandData);

    return {
      serviceLevel: (sl * 100).toFixed(1),
      serviceLevelNum: sl,
      holdingCost: result.expectedAnnualHoldingCost,
      stockoutCost: result.expectedAnnualStockoutCost,
      totalCost: result.totalCost,
    };
  });

  // Find optimal service level (minimum total cost)
  const optimalPoint = costData.reduce((min, curr) =>
    curr.totalCost < min.totalCost ? curr : min
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">Service Level: {label}%</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentSL = (currentServiceLevel * 100).toFixed(1);
  const currentCost = costData.find((d) => d.serviceLevel === currentSL);
  const savingsVsOptimal = currentCost ? currentCost.totalCost - optimalPoint.totalCost : 0;

  return (
    <div>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={costData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="serviceLevel"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'Service Level (%)', position: 'insideBottom', offset: -10, style: { fontSize: 12 } }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: 'Annual Cost ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
            iconType="line"
          />

          {/* Total Cost */}
          <Line
            type="monotone"
            dataKey="totalCost"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={false}
            name="Total Cost"
          />

          {/* Holding Cost */}
          <Line
            type="monotone"
            dataKey="holdingCost"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Holding Cost"
          />

          {/* Stockout Cost */}
          <Line
            type="monotone"
            dataKey="stockoutCost"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Stockout Cost"
          />

          {/* Current service level marker */}
          {costData.filter((d) => d.serviceLevel === currentSL).map((point) => (
            <Line
              key="current"
              type="monotone"
              data={[point]}
              dataKey="totalCost"
              stroke="#10b981"
              strokeWidth={0}
              dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              name="Your Current Level"
            />
          ))}

          {/* Optimal point marker */}
          <Line
            type="monotone"
            data={[optimalPoint]}
            dataKey="totalCost"
            stroke="#f59e0b"
            strokeWidth={0}
            dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
            name="Optimal Point"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Cost Analysis */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-xs text-blue-700 font-medium mb-1">Your Current Level</div>
          <div className="text-2xl font-bold text-blue-900">{currentSL}%</div>
          <div className="text-sm text-blue-700 mt-2">
            Total Cost: ${costData.find((d) => d.serviceLevel === currentSL)?.totalCost.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
          <div className="text-xs text-amber-700 font-medium mb-1">Optimal Service Level</div>
          <div className="text-2xl font-bold text-amber-900">{optimalPoint.serviceLevel}%</div>
          <div className="text-sm text-amber-700 mt-2">
            Total Cost: ${optimalPoint.totalCost.toLocaleString()}
          </div>
        </div>

        <div className={`p-4 rounded-lg border-2 ${savingsVsOptimal! > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className={`text-xs font-medium mb-1 ${savingsVsOptimal! > 0 ? 'text-red-700' : 'text-green-700'}`}>
            {savingsVsOptimal! > 0 ? 'Potential Savings' : 'Premium Paid'}
          </div>
          <div className={`text-2xl font-bold ${savingsVsOptimal! > 0 ? 'text-red-900' : 'text-green-900'}`}>
            ${Math.abs(savingsVsOptimal!).toLocaleString()}
          </div>
          <div className={`text-sm mt-2 ${savingsVsOptimal! > 0 ? 'text-red-700' : 'text-green-700'}`}>
            {savingsVsOptimal! > 0
              ? 'Could be saved at optimal'
              : 'For premium service level'}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h4 className="text-sm font-semibold text-purple-900 mb-2">💡 Cost Optimization Insights</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Holding costs increase linearly with service level (more inventory = higher costs)</li>
          <li>• Stockout costs decrease exponentially (higher service = fewer stockouts)</li>
          <li>• The optimal point minimizes total cost while balancing both factors</li>
          <li>
            • Moving from {optimalPoint.serviceLevel}% to {currentSL}%
            {savingsVsOptimal! > 0
              ? ` adds $${Math.abs(savingsVsOptimal!).toLocaleString()} annual cost`
              : ` costs $${Math.abs(savingsVsOptimal!).toLocaleString()} but improves reliability`}
          </li>
        </ul>
      </div>
    </div>
  );
}
