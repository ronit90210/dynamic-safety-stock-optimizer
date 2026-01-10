import { Settings } from 'lucide-react';
import type { SafetyStockConfig } from '../types';

interface ConfigPanelProps {
  config: SafetyStockConfig;
  onChange: (key: keyof SafetyStockConfig, value: number) => void;
  disabled?: boolean;
}

export default function ConfigPanel({ config, onChange, disabled }: ConfigPanelProps) {
  const handleChange = (key: keyof SafetyStockConfig, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange(key, numValue);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
      </div>

      <div className="space-y-5">
        {/* Lead Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Time (days)
          </label>
          <input
            type="number"
            value={config.leadTime}
            onChange={(e) => handleChange('leadTime', e.target.value)}
            disabled={disabled}
            min="1"
            max="90"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Time from order to delivery</p>
        </div>

        {/* Lead Time Std Dev */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Time Variability (days)
          </label>
          <input
            type="number"
            value={config.leadTimeStdDev}
            onChange={(e) => handleChange('leadTimeStdDev', e.target.value)}
            disabled={disabled}
            min="0"
            max="30"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Standard deviation of lead time</p>
        </div>

        {/* Review Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Period (days)
          </label>
          <input
            type="number"
            value={config.reviewPeriod}
            onChange={(e) => handleChange('reviewPeriod', e.target.value)}
            disabled={disabled}
            min="1"
            max="30"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">How often inventory is reviewed</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Cost Parameters</h4>
        </div>

        {/* Holding Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Holding Cost ($/unit/year)
          </label>
          <input
            type="number"
            value={config.holdingCostPerUnit}
            onChange={(e) => handleChange('holdingCostPerUnit', e.target.value)}
            disabled={disabled}
            min="0"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Cost to hold one unit for a year</p>
        </div>

        {/* Stockout Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stockout Cost ($/unit)
          </label>
          <input
            type="number"
            value={config.stockoutCostPerUnit}
            onChange={(e) => handleChange('stockoutCostPerUnit', e.target.value)}
            disabled={disabled}
            min="0"
            step="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Lost profit + customer dissatisfaction</p>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onChange('holdingCostPerUnit', 2);
              onChange('stockoutCostPerUnit', 20);
            }}
            disabled={disabled}
            className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Low Value
          </button>
          <button
            onClick={() => {
              onChange('holdingCostPerUnit', 5);
              onChange('stockoutCostPerUnit', 50);
            }}
            disabled={disabled}
            className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Standard
          </button>
          <button
            onClick={() => {
              onChange('holdingCostPerUnit', 10);
              onChange('stockoutCostPerUnit', 100);
            }}
            disabled={disabled}
            className="px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            High Value
          </button>
          <button
            onClick={() => {
              onChange('holdingCostPerUnit', 20);
              onChange('stockoutCostPerUnit', 200);
            }}
            disabled={disabled}
            className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Critical
          </button>
        </div>
      </div>
    </div>
  );
}
