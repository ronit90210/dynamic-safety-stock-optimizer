import type { DemandData, SafetyStockConfig, SafetyStockResult, MonteCarloResult } from '../types';

/**
 * Calculate Z-score for a given service level
 */
export function getZScore(serviceLevel: number): number {
  // Approximation of inverse normal CDF (probit function)
  // For common service levels
  const serviceLevelMap: { [key: number]: number } = {
    0.90: 1.282,
    0.95: 1.645,
    0.96: 1.751,
    0.97: 1.881,
    0.98: 2.054,
    0.99: 2.326,
    0.995: 2.576,
  };

  // Check if we have exact match
  if (serviceLevelMap[serviceLevel]) {
    return serviceLevelMap[serviceLevel];
  }

  // Linear interpolation for values in between
  const keys = Object.keys(serviceLevelMap)
    .map(Number)
    .sort((a, b) => a - b);

  for (let i = 0; i < keys.length - 1; i++) {
    if (serviceLevel >= keys[i] && serviceLevel <= keys[i + 1]) {
      const t =
        (serviceLevel - keys[i]) / (keys[i + 1] - keys[i]);
      return (
        serviceLevelMap[keys[i]] * (1 - t) +
        serviceLevelMap[keys[i + 1]] * t
      );
    }
  }

  // Default for extreme values
  return serviceLevel >= 0.995 ? 2.576 : 1.282;
}

/**
 * Calculate mean of array
 */
export function mean(arr: number[]): number {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

/**
 * Calculate standard deviation
 */
export function stdDev(arr: number[]): number {
  const avg = mean(arr);
  const squareDiffs = arr.map((val) => Math.pow(val - avg, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculate safety stock using standard formula
 * SS = Z * sqrt((LT * σ²ᴰ) + (D² * σ²ᴸᵀ))
 */
export function calculateSafetyStock(
  config: SafetyStockConfig,
  demandData: DemandData[]
): SafetyStockResult {
  const demands = demandData.map((d) => d.demand);
  const avgDemand = mean(demands);
  const demandStdDev = stdDev(demands);

  const z = getZScore(config.serviceLevel);

  // Safety stock formula considering both demand and lead time variability
  const leadTimeVariance = Math.pow(config.leadTimeStdDev, 2);
  const demandVariance = Math.pow(demandStdDev, 2);

  const safetyStock =
    z *
    Math.sqrt(
      config.leadTime * demandVariance +
        Math.pow(avgDemand, 2) * leadTimeVariance
    );

  // Reorder point = (average demand * lead time) + safety stock
  const reorderPoint = avgDemand * config.leadTime + safetyStock;

  // Calculate costs
  const expectedAnnualHoldingCost =
    safetyStock * config.holdingCostPerUnit;

  // Stockout probability (simplified)
  const stockoutProbability = 1 - config.serviceLevel;

  // Expected annual stockout cost (simplified estimation)
  const expectedDailyDemand = avgDemand;
  const expectedAnnualDemand = expectedDailyDemand * 365;
  const expectedStockoutUnits =
    expectedAnnualDemand * stockoutProbability;
  const expectedAnnualStockoutCost =
    expectedStockoutUnits * config.stockoutCostPerUnit;

  const totalCost =
    expectedAnnualHoldingCost + expectedAnnualStockoutCost;

  return {
    safetyStock: Math.round(safetyStock),
    reorderPoint: Math.round(reorderPoint),
    averageDemand: Math.round(avgDemand * 100) / 100,
    demandStdDev: Math.round(demandStdDev * 100) / 100,
    stockoutProbability:
      Math.round(stockoutProbability * 10000) / 100,
    expectedAnnualHoldingCost: Math.round(expectedAnnualHoldingCost),
    expectedAnnualStockoutCost: Math.round(
      expectedAnnualStockoutCost
    ),
    totalCost: Math.round(totalCost),
    serviceLevel: config.serviceLevel * 100,
  };
}

/**
 * Run Monte Carlo simulation
 */
export function runMonteCarloSimulation(
  config: SafetyStockConfig,
  demandData: DemandData[],
  numSimulations: number = 10000
): MonteCarloResult {
  const demands = demandData.map((d) => d.demand);
  const avgDemand = mean(demands);
  const demandStdDev = stdDev(demands);

  const simulations: number[] = [];
  let stockoutCount = 0;

  const safetyStockResult = calculateSafetyStock(config, demandData);
  const availableInventory = safetyStockResult.safetyStock;

  for (let i = 0; i < numSimulations; i++) {
    // Simulate demand during lead time using normal distribution
    let totalDemand = 0;

    // Simulate each day of lead time
    for (let day = 0; day < config.leadTime; day++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const dailyDemand = avgDemand + z0 * demandStdDev;
      totalDemand += Math.max(0, dailyDemand);
    }

    simulations.push(totalDemand);

    // Check if stockout occurs
    if (totalDemand > availableInventory + avgDemand * config.leadTime) {
      stockoutCount++;
    }
  }

  // Sort for percentile calculations
  const sortedSimulations = [...simulations].sort((a, b) => a - b);

  const getPercentile = (p: number) => {
    const index = Math.floor((p / 100) * sortedSimulations.length);
    return sortedSimulations[index];
  };

  return {
    simulations: sortedSimulations,
    stockoutCount,
    stockoutProbability: (stockoutCount / numSimulations) * 100,
    meanDemand: mean(simulations),
    percentiles: {
      p50: getPercentile(50),
      p75: getPercentile(75),
      p90: getPercentile(90),
      p95: getPercentile(95),
      p99: getPercentile(99),
    },
  };
}

/**
 * Generate demo demand data with seasonal patterns
 */
export function generateDemoData(days: number = 90): DemandData[] {
  const data: DemandData[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    // Base demand with trend and seasonality
    const trend = 100 + i * 0.5; // Slight upward trend
    const seasonality = 20 * Math.sin((i * 2 * Math.PI) / 30); // Monthly seasonality
    const weekdayEffect = [1, 0.8, 0.8, 0.85, 0.9, 1.2, 1.3][
      date.getDay()
    ]; // Weekend boost

    // Add random noise
    const noise = (Math.random() - 0.5) * 20;

    const demand = Math.max(
      50,
      Math.round((trend + seasonality) * weekdayEffect + noise)
    );

    data.push({
      date: date.toISOString().split('T')[0],
      demand,
    });
  }

  return data;
}

/**
 * Simple exponential smoothing for forecasting
 */
export function exponentialSmoothing(
  data: DemandData[],
  alpha: number = 0.3,
  periods: number = 14
): DemandData[] {
  const demands = data.map((d) => d.demand);
  let smoothed = demands[0];
  const forecast: DemandData[] = [];

  // Smooth historical data
  for (let i = 1; i < demands.length; i++) {
    smoothed = alpha * demands[i] + (1 - alpha) * smoothed;
  }

  // Generate forecast
  const lastDate = new Date(data[data.length - 1].date);
  for (let i = 1; i <= periods; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);

    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      demand: Math.round(smoothed),
      forecast: Math.round(smoothed),
    });
  }

  return forecast;
}
