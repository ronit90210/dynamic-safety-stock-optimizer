import axios from 'axios';
import type { DemandData, ForecastResult, SafetyStockConfig, SafetyStockResult, MonteCarloResult } from '../types';
import { calculateSafetyStock, runMonteCarloSimulation, exponentialSmoothing } from '../utils/calculations';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

/**
 * Get ML-based demand forecast
 */
export async function getForecast(
  demandData: DemandData[],
  periods: number = 14
): Promise<ForecastResult> {
  try {
    const response = await api.post('/forecast', {
      data: demandData,
      periods,
    });
    return response.data;
  } catch (error) {
    console.warn('ML forecast API not available, using local exponential smoothing');

    // Fallback to local forecasting
    const forecast = exponentialSmoothing(demandData, 0.3, periods);
    const demands = demandData.map(d => d.demand);
    const mean = demands.reduce((sum, d) => sum + d, 0) / demands.length;
    const variance = demands.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / demands.length;
    const stdDev = Math.sqrt(variance);

    return {
      historical: demandData,
      forecast,
      demandMean: mean,
      demandStdDev: stdDev,
      confidence: {
        lower: forecast.map(f => f.demand - 1.96 * stdDev),
        upper: forecast.map(f => f.demand + 1.96 * stdDev),
      },
    };
  }
}

/**
 * Calculate safety stock (with optional ML enhancement)
 */
export async function calculateOptimalSafetyStock(
  config: SafetyStockConfig,
  demandData: DemandData[]
): Promise<SafetyStockResult> {
  try {
    const response = await api.post('/safety-stock', {
      config,
      data: demandData,
    });
    return response.data;
  } catch (error) {
    console.warn('ML safety stock API not available, using local calculation');
    // Fallback to local calculation
    return calculateSafetyStock(config, demandData);
  }
}

/**
 * Run Monte Carlo simulation (with optional backend processing)
 */
export async function runSimulation(
  config: SafetyStockConfig,
  demandData: DemandData[],
  numSimulations: number = 10000
): Promise<MonteCarloResult> {
  try {
    const response = await api.post('/simulate', {
      config,
      data: demandData,
      num_simulations: numSimulations,
    });
    return response.data;
  } catch (error) {
    console.warn('ML simulation API not available, using local simulation');
    // Fallback to local simulation
    return runMonteCarloSimulation(config, demandData, numSimulations);
  }
}

/**
 * Upload CSV and parse demand data
 */
export async function uploadCSV(file: File): Promise<DemandData[]> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('CSV upload failed:', error);
    throw new Error('Failed to upload CSV. Please check the format and try again.');
  }
}

/**
 * Health check for backend
 */
export async function checkHealth(): Promise<boolean> {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
}
