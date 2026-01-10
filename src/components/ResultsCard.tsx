import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ResultsCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  unit: string;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'indigo';
  loading?: boolean;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
}

export default function ResultsCard({
  icon,
  title,
  value,
  unit,
  subtitle,
  color,
  loading,
  trend,
  percentage
}: ResultsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-900',
      gradient: 'from-blue-500 to-cyan-500',
      ring: 'ring-blue-500',
      glow: 'shadow-blue-500/20',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-900',
      gradient: 'from-green-500 to-emerald-500',
      ring: 'ring-green-500',
      glow: 'shadow-green-500/20',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-900',
      gradient: 'from-purple-500 to-pink-500',
      ring: 'ring-purple-500',
      glow: 'shadow-purple-500/20',
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      text: 'text-indigo-900',
      gradient: 'from-indigo-500 to-purple-500',
      ring: 'ring-indigo-500',
      glow: 'shadow-indigo-500/20',
    },
  };

  const colors = colorClasses[color];

  const formatValue = (val: number, unitStr: string) => {
    if (unitStr === '$') {
      return val.toLocaleString();
    }
    if (unitStr === '%') {
      return val.toFixed(1);
    }
    return val.toLocaleString();
  };

  // Calculate progress percentage for visual indicator
  const getProgressPercentage = () => {
    if (percentage !== undefined) return percentage;
    if (unit === '%') return value;
    if (title.includes('Service Level')) return value;
    return 75; // Default
  };

  const progressPercentage = getProgressPercentage();

  // SVG circle progress indicator
  const CircularProgress = ({ percent }: { percent: number }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`text-${color}-500 transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${colors.text}`}>
            {Math.round(percent)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:${colors.glow} transition-all duration-300 overflow-hidden group`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

      {/* Decorative corner element */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.gradient} opacity-10 rounded-bl-full`}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Icon with animated pulse */}
          <div className={`p-3 rounded-xl ${colors.bg} relative group-hover:scale-110 transition-transform duration-300`}>
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            <div className={`${colors.icon} relative z-10`}>{icon}</div>
          </div>

          {/* Circular progress indicator */}
          {!loading && (
            <div className="flex flex-col items-end gap-1">
              <CircularProgress percent={progressPercentage} />
              {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  {trend === 'stable' && <Minus className="h-3 w-3" />}
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">{title}</h3>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <>
            {/* Main value with gradient text effect */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className={`text-5xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {unit === '$' && '$'}
                {formatValue(value, unit)}
              </span>
              {unit !== '$' && <span className={`text-2xl font-bold ${colors.text}`}>{unit}</span>}
            </div>

            {/* Subtitle with icon */}
            <div className="flex items-start gap-2">
              <div className={`w-1 h-full bg-gradient-to-b ${colors.gradient} rounded-full`}></div>
              <p className="text-sm text-gray-600 leading-relaxed">{subtitle}</p>
            </div>
          </>
        )}

        {/* Animated progress bar */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out relative`}
              style={{ width: loading ? '0%' : `${progressPercentage}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Mini sparkline visualization */}
        {!loading && (
          <div className="mt-4 flex items-end justify-between h-8 gap-1">
            {[40, 55, 45, 70, 60, 80, 75, progressPercentage].map((height, idx) => (
              <div
                key={idx}
                className={`flex-1 bg-gradient-to-t ${colors.gradient} rounded-t transition-all duration-500 opacity-30 hover:opacity-60`}
                style={{
                  height: `${height}%`,
                  transitionDelay: `${idx * 50}ms`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
