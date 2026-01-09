import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

interface ServiceLevelSliderProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function ServiceLevelSlider({ value, onChange, disabled }: ServiceLevelSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
  };

  const handleMouseUp = () => {
    onChange(localValue);
  };

  const getColor = (val: number) => {
    if (val >= 98) return 'from-green-500 to-emerald-500';
    if (val >= 95) return 'from-blue-500 to-cyan-500';
    if (val >= 90) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getLabel = (val: number) => {
    if (val >= 99) return 'Premium';
    if (val >= 97) return 'High';
    if (val >= 95) return 'Standard';
    if (val >= 90) return 'Basic';
    return 'Low';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Target Service Level</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getColor(localValue)} text-white`}>
            {getLabel(localValue)}
          </span>
          <span className="text-3xl font-bold text-gray-900">{localValue.toFixed(1)}%</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min="90"
          max="99.5"
          step="0.5"
          value={localValue}
          onChange={handleChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          disabled={disabled}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${((localValue - 90) / 9.5) * 100}%, rgb(229, 231, 235) ${((localValue - 90) / 9.5) * 100}%, rgb(229, 231, 235) 100%)`
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>90%</span>
          <span>92%</span>
          <span>94%</span>
          <span>96%</span>
          <span>98%</span>
          <span>99.5%</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-blue-900 font-medium">Lower Cost</div>
          <div className="text-blue-600 text-xs mt-1">90-95%</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-green-900 font-medium">Balanced</div>
          <div className="text-green-600 text-xs mt-1">95-97%</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-purple-900 font-medium">Premium</div>
          <div className="text-purple-600 text-xs mt-1">97-99.5%</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        <strong>Real-time Impact:</strong> Adjust the slider to see immediate changes in safety stock, costs, and stockout probability
      </p>
    </div>
  );
}
