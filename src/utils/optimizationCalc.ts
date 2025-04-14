
import { crops, calculateOptimalLand } from "./mockData";
import { CropData, LandData, WeatherData, OptimizationResult } from "../types";

// Calculate optimal land dimensions based on area
export const calculateOptimalDimensions = (area: number): { length: number; width: number } => {
  // Convert area from hectares to square meters
  const areaInSqMeters = area * 10000;
  
  // For a rectangular field, ideal ratio is often 1.6:1 (golden ratio)
  const goldenRatio = 1.618;
  
  const width = Math.sqrt(areaInSqMeters / goldenRatio);
  const length = width * goldenRatio;
  
  return {
    length: Math.round(length),
    width: Math.round(width)
  };
};

// Calculate predicted yield based on crop, land, and weather data
export const predictYield = (
  cropId: string,
  landData: LandData,
  weatherData: WeatherData
): OptimizationResult => {
  return calculateOptimalLand(
    cropId,
    landData.totalArea,
    weatherData.temperature,
    weatherData.rainfall,
    weatherData.humidity
  );
};

// Find optimal crop for given conditions
export const findOptimalCrop = (
  landData: LandData,
  weatherData: WeatherData
): { cropId: string; name: string; score: number }[] => {
  return crops.map(crop => {
    const tempScore = scoreFactorMatch(weatherData.temperature, crop.idealTemperature[0], crop.idealTemperature[1]);
    const rainfallScore = scoreFactorMatch(weatherData.rainfall, crop.idealRainfall[0], crop.idealRainfall[1]);
    const humidityScore = scoreFactorMatch(weatherData.humidity, crop.idealHumidity[0], crop.idealHumidity[1]);
    
    const overallScore = (tempScore + rainfallScore + humidityScore) / 3;
    
    return {
      cropId: crop.id,
      name: crop.name,
      score: overallScore
    };
  }).sort((a, b) => b.score - a.score);
};

// Helper function to score how well a factor matches the ideal range
const scoreFactorMatch = (actual: number, min: number, max: number): number => {
  if (actual >= min && actual <= max) {
    return 1.0;
  }
  
  const distanceFromRange = actual < min ? (min - actual) / min : (actual - max) / max;
  return Math.max(0, 1 - distanceFromRange * 2);
};
