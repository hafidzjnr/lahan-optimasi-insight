
/**
 * Utilitas untuk Optimasi Lahan Pertanian dengan Pendekatan Kalkulus
 * 
 * Metodologi Matematis:
 * 
 * 1. Fungsi Produksi Cobb-Douglas
 * - Model matematis yang menggambarkan hubungan antara input produksi dan output
 * - Bentuk umum: Y = A * L^α * K^β * F^γ * W^δ
 *   Y: Total produksi
 *   L: Input lahan
 *   K: Input modal (kualitas benih)
 *   F: Input pupuk
 *   W: Input air
 *   A: Faktor produktivitas total
 *   α, β, γ, δ: Elastisitas output
 * 
 * 2. Analisis Titik Optimum melalui Turunan (Derivative Analysis)
 * - Menggunakan kalkulus diferensial untuk menemukan titik produktivitas maksimal
 * - Prinsip: f'(x) = 0, di mana f adalah fungsi produksi
 * - Mencari kondisi di mana penambahan input tidak lagi meningkatkan output secara signifikan
 * 
 * 3. Hukum Hasil yang Semakin Berkurang (Diminishing Returns)
 * - Setiap penambahan input akan memberikan kontribusi yang semakin menurun terhadap output
 * - Dimodelkan menggunakan fungsi logaritmik dan akar kuadrat
 * - Mencegah asumsi pertambahan input linear yang tidak realistis
 */

/**
 * Antarmuka parameter optimasi lahan pertanian
 * Menggambarkan berbagai faktor yang mempengaruhi produktivitas lahan
 */
export interface OptimizationParams {
  landArea: number;       // Luas lahan dalam hektar
  soilQuality: number;    // Indeks kualitas tanah (0-100)
  waterAvailability: number; // Indeks ketersediaan air (0-100)
  fertilizerAmount: number;  // Jumlah pupuk dalam kg/hektar
  seedQuality: number;    // Indeks kualitas benih (0-100)
  cropType: string;       // Jenis tanaman
}

/**
 * Antarmuka hasil optimasi, menampilkan berbagai metrik yang dihasilkan dari perhitungan
 */
export interface OptimizationResult {
  optimalLandArea: number;    // Luas lahan optimal dalam hektar
  expectedYield: number;      // Perkiraan hasil panen dalam ton
  profitEstimate: number;     // Estimasi keuntungan
  resourceEfficiency: number; // Skor efisiensi sumber daya
  sustainabilityScore: number; // Skor keberlanjutan
  recommendedCropAllocation: Record<string, number>; // Rekomendasi alokasi tanaman
}

/**
 * Menghitung luas lahan optimal menggunakan pendekatan Produktivitas Marjinal
 * 
 * Prinsip dasar: Titik optimal terjadi ketika produktivitas marjinal sama dengan biaya marjinal
 * 
 * @param params Parameter-parameter lahan
 * @returns Luas lahan optimal dalam hektar
 */
export function calculateOptimalLandArea(params: OptimizationParams): number {
  const { landArea, soilQuality, waterAvailability, fertilizerAmount, seedQuality } = params;
  
  // Faktor produktivitas dasar berdasarkan kualitas tanah dan benih
  const baseFactor = (soilQuality / 100) * (seedQuality / 100);
  
  // Faktor efisiensi air - model penurunan hasil dengan akar kuadrat
  const waterFactor = Math.sqrt(waterAvailability / 100);
  
  // Kurva respons pupuk - mengikuti hukum hasil yang semakin berkurang
  // Menggunakan model logaritmik: manfaat tambahan menurun seiring penambahan pupuk
  const fertilizerFactor = 1 + (0.2 * Math.log(1 + fertilizerAmount / 100));
  
  // Menghitung luas lahan optimal menggunakan pendekatan turunan
  // Memodelkan titik di mana turunan fungsi produksi sama dengan nol
  const optimalArea = landArea * baseFactor * waterFactor * fertilizerFactor;
  
  // Memastikan tidak melebihi luas lahan yang tersedia
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
