
export interface CropData {
  id: string;
  name: string;
  idealTemperature: [number, number]; // min, max in Celsius
  idealRainfall: [number, number]; // min, max in mm
  idealHumidity: [number, number]; // min, max in percentage
  growthDays: number; // days to harvest
  averageYield: number; // ton per hectare
}

export interface HarvestData {
  date: string; // YYYY-MM format
  cropId: string;
  landArea: number; // in hectares
  yield: number; // in tons
  weather: WeatherData;
}

export interface WeatherData {
  temperature: number; // average in Celsius
  rainfall: number; // mm
  humidity: number; // percentage
}

export interface LandData {
  totalArea: number; // in hectares
  length: number; // in meters
  width: number; // in meters
  latitude?: number;
  longitude?: number;
  soilType?: string;
  irrigation?: string;
}

export interface OptimizationResult {
  recommendedCropId?: string;
  predictedYield: number; // in tons
  optimizedArea: number; // in hectares
  optimizedDimensions?: {
    length: number;
    width: number;
  };
  confidenceScore: number; // 0-100%
  yieldIncrease: number; // percentage increase from last harvest
}
