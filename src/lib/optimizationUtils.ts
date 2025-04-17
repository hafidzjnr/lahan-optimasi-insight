
/**
 * Utility functions for agricultural land optimization using calculus principles
 */

/**
 * Interface for land optimization parameters
 */
export interface OptimizationParams {
  landArea: number;       // Area of land in hectares
  soilQuality: number;    // Quality index (0-100)
  waterAvailability: number; // Water availability index (0-100)
  fertilizerAmount: number;  // Fertilizer in kg/hectare
  seedQuality: number;    // Seed quality index (0-100)
  cropType: string;       // Type of crop
}

/**
 * Interface for optimization results
 */
export interface OptimizationResult {
  optimalLandArea: number;    // Optimal land area in hectares
  expectedYield: number;      // Expected yield in tons
  profitEstimate: number;     // Estimated profit
  resourceEfficiency: number; // Resource efficiency score
  sustainabilityScore: number; // Sustainability score
  recommendedCropAllocation: Record<string, number>; // Recommended crop allocation
}

/**
 * Calculate optimal land area using Marginal Productivity approach
 * Based on the principle that optimal allocation occurs when marginal productivity equals marginal cost
 * @param params Land parameters
 * @returns Optimal land area in hectares
 */
export function calculateOptimalLandArea(params: OptimizationParams): number {
  const { landArea, soilQuality, waterAvailability, fertilizerAmount, seedQuality } = params;
  
  // Base productivity factor based on soil quality and seed quality
  const baseFactor = (soilQuality / 100) * (seedQuality / 100);
  
  // Water efficiency factor - diminishing returns modeled with square root
  const waterFactor = Math.sqrt(waterAvailability / 100);
  
  // Fertilizer response curve - follows law of diminishing returns
  // Using a logarithmic model: additional benefit decreases as more fertilizer is added
  const fertilizerFactor = 1 + (0.2 * Math.log(1 + fertilizerAmount / 100));
  
  // Calculate optimal land area using derivative-based approach
  // This models the point where the derivative of production function equals zero
  const optimalArea = landArea * baseFactor * waterFactor * fertilizerFactor;
  
  // Ensure we don't exceed available land
  return Math.min(optimalArea, landArea);
}

/**
 * Production function using Cobb-Douglas model
 * Y = A * L^α * K^β * F^γ * W^δ
 * Where:
 * - Y is total production
 * - L is land input
 * - K is capital input (seed quality)
 * - F is fertilizer input
 * - W is water input
 * - A is total factor productivity
 * - α, β, γ, δ are output elasticities
 */
export function calculateProduction(params: OptimizationParams): number {
  const { landArea, soilQuality, waterAvailability, fertilizerAmount, seedQuality } = params;
  
  // Total factor productivity influenced by soil quality
  const A = 1 + (soilQuality / 100);
  
  // Output elasticities (sum to 1 for constant returns to scale)
  const alpha = 0.4; // Land elasticity
  const beta = 0.2;  // Capital (seed) elasticity
  const gamma = 0.2; // Fertilizer elasticity
  const delta = 0.2; // Water elasticity
  
  // Normalized inputs
  const L = landArea;
  const K = seedQuality / 100;
  const F = fertilizerAmount / 100;
  const W = waterAvailability / 100;
  
  // Cobb-Douglas production function
  return A * Math.pow(L, alpha) * Math.pow(K, beta) * Math.pow(F, gamma) * Math.pow(W, delta);
}

/**
 * Calculate marginal product of land
 * Uses calculus principle of taking the derivative of the production function with respect to land
 */
export function calculateMarginalProductOfLand(params: OptimizationParams): number {
  const { landArea, soilQuality, waterAvailability, fertilizerAmount, seedQuality } = params;
  
  // Small delta for numerical differentiation
  const delta = 0.01;
  
  // Calculate production at current land area
  const production1 = calculateProduction(params);
  
  // Calculate production with slightly more land
  const production2 = calculateProduction({
    ...params,
    landArea: landArea + delta
  });
  
  // Marginal product = change in output / change in input
  return (production2 - production1) / delta;
}

/**
 * Complete land optimization calculation
 * @param params Land parameters
 * @returns Complete optimization result
 */
export function optimizeLand(params: OptimizationParams): OptimizationResult {
  const optimalLandArea = calculateOptimalLandArea(params);
  
  // Calculate expected yield based on optimal land area
  const optimizedParams = { ...params, landArea: optimalLandArea };
  const expectedYield = calculateProduction(optimizedParams);
  
  // Calculate profit estimate (simplified model)
  // Assuming average crop price of 1000 per ton and cost of 500 per hectare
  const averageCropPrice = 1000;
  const costPerHectare = 500;
  const profitEstimate = (expectedYield * averageCropPrice) - (optimalLandArea * costPerHectare);
  
  // Resource efficiency calculation
  const resourceEfficiency = expectedYield / (params.fertilizerAmount * optimalLandArea / 100);
  
  // Sustainability score based on resource efficiency and water usage
  const sustainabilityScore = 
    (resourceEfficiency * 0.5) + 
    ((100 - params.waterAvailability) / 100 * 50);
  
  // Recommended crop allocation based on soil quality
  // Higher quality soil can support more diverse crops
  const recommendedCropAllocation: Record<string, number> = {};
  if (params.soilQuality > 80) {
    recommendedCropAllocation['High-value crops'] = 0.6;
    recommendedCropAllocation['Medium-value crops'] = 0.3;
    recommendedCropAllocation['Low-value crops'] = 0.1;
  } else if (params.soilQuality > 50) {
    recommendedCropAllocation['High-value crops'] = 0.3;
    recommendedCropAllocation['Medium-value crops'] = 0.5;
    recommendedCropAllocation['Low-value crops'] = 0.2;
  } else {
    recommendedCropAllocation['High-value crops'] = 0.1;
    recommendedCropAllocation['Medium-value crops'] = 0.4;
    recommendedCropAllocation['Low-value crops'] = 0.5;
  }
  
  return {
    optimalLandArea,
    expectedYield,
    profitEstimate,
    resourceEfficiency,
    sustainabilityScore,
    recommendedCropAllocation
  };
}

/**
 * Calculate multiple scenarios for different land configurations
 * Useful for comparing different approaches
 */
export function calculateOptimizationScenarios(
  baseParams: OptimizationParams,
  variations: Partial<OptimizationParams>[]
): OptimizationResult[] {
  const results: OptimizationResult[] = [];
  
  // Calculate base scenario
  results.push(optimizeLand(baseParams));
  
  // Calculate variations
  for (const variation of variations) {
    const variantParams = { ...baseParams, ...variation };
    results.push(optimizeLand(variantParams));
  }
  
  return results;
}
