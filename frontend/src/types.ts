export interface DemandData {
  date: string;
  demand: number;
  forecast?: number;
}

export interface SafetyStockConfig {
  serviceLevel: number; // 0.95 = 95%
  leadTime: number; // days
  leadTimeStdDev: number; // days
  reviewPeriod: number; // days
  holdingCostPerUnit: number; // $ per unit per year
  stockoutCostPerUnit: number; // $ per unit
}

export interface SafetyStockResult {
  safetyStock: number;
  reorderPoint: number;
  averageDemand: number;
  demandStdDev: number;
  stockoutProbability: number;
  expectedAnnualHoldingCost: number;
  expectedAnnualStockoutCost: number;
  totalCost: number;
  serviceLevel: number;
}

export interface MonteCarloResult {
  simulations: number[];
  stockoutCount: number;
  stockoutProbability: number;
  meanDemand: number;
  percentiles: {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

export interface ForecastResult {
  historical: DemandData[];
  forecast: DemandData[];
  demandMean: number;
  demandStdDev: number;
  confidence: {
    lower: number[];
    upper: number[];
  };
}
