
import { CropData, HarvestData, WeatherData } from "../types";

export const crops: CropData[] = [
  {
    id: "1",
    name: "Padi",
    idealTemperature: [24, 30],
    idealRainfall: [200, 300],
    idealHumidity: [70, 80],
    growthDays: 120,
    averageYield: 5.5,
  },
  {
    id: "2",
    name: "Jagung",
    idealTemperature: [20, 30],
    idealRainfall: [120, 250],
    idealHumidity: [65, 85],
    growthDays: 100,
    averageYield: 8.2,
  },
  {
    id: "3",
    name: "Kedelai",
    idealTemperature: [20, 32],
    idealRainfall: [150, 250],
    idealHumidity: [60, 75],
    growthDays: 100,
    averageYield: 2.5,
  },
  {
    id: "4",
    name: "Singkong",
    idealTemperature: [25, 32],
    idealRainfall: [100, 200],
    idealHumidity: [65, 80],
    growthDays: 300,
    averageYield: 20.0,
  },
  {
    id: "5",
    name: "Cabai",
    idealTemperature: [21, 28],
    idealRainfall: [80, 120],
    idealHumidity: [65, 70],
    growthDays: 90,
    averageYield: 8.0,
  },
];

const generateRandomWeather = (): WeatherData => ({
  temperature: 24 + Math.random() * 6,
  rainfall: 100 + Math.random() * 200,
  humidity: 65 + Math.random() * 20,
});

export const generateHistoricalData = (cropId: string, months = 12): HarvestData[] => {
  const today = new Date();
  const data: HarvestData[] = [];
  
  for (let i = 0; i < months; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    // Add some seasonality variation
    const seasonFactor = Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.2 + 1;
    const crop = crops.find(c => c.id === cropId);
    const baseYield = crop ? crop.averageYield : 5;
    
    data.unshift({
      date: yearMonth,
      cropId,
      landArea: 1 + Math.random() * 0.5,
      yield: baseYield * seasonFactor * (0.8 + Math.random() * 0.4),
      weather: generateRandomWeather(),
    });
  }
  
  return data;
};

export const calculateOptimalLand = (
  cropId: string,
  landArea: number,
  currentTemperature: number,
  currentRainfall: number,
  currentHumidity: number
) => {
  const crop = crops.find(c => c.id === cropId);
  
  if (!crop) {
    return {
      predictedYield: 0,
      optimizedArea: landArea,
      confidenceScore: 0,
      yieldIncrease: 0,
    };
  }
  
  // Simple model to calculate optimal conditions
  // In a real app, this would use more complex mathematical models
  
  const tempScore = calculateScore(
    currentTemperature,
    crop.idealTemperature[0],
    crop.idealTemperature[1]
  );
  
  const rainfallScore = calculateScore(
    currentRainfall,
    crop.idealRainfall[0],
    crop.idealRainfall[1]
  );
  
  const humidityScore = calculateScore(
    currentHumidity,
    crop.idealHumidity[0],
    crop.idealHumidity[1]
  );
  
  // Overall environmental score (simple average)
  const environmentScore = (tempScore + rainfallScore + humidityScore) / 3;
  
  // Calculate optimal land usage
  // For simplicity, we're assuming a quadratic function where:
  // yield = a*x^2 + b*x + c
  // where x is the land area
  
  // In reality, this would be based on a much more complex model
  
  // Let's assume that the optimal land usage is based on diminishing returns
  const optimalAreaRatio = Math.min(1, 0.8 + environmentScore * 0.4);
  const optimizedArea = landArea * optimalAreaRatio;
  
  // Calculate predicted yield
  // Base yield is crop's average * environmental conditions * optimized area * random factor
  const predictedYield = crop.averageYield * environmentScore * optimizedArea * (0.95 + Math.random() * 0.1);
  
  // Calculate confidence score (0-100%)
  const confidenceScore = Math.min(95, 60 + environmentScore * 35);
  
  // Calculate yield increase (compared to average yield)
  const baseYield = crop.averageYield * landArea;
  const yieldIncrease = ((predictedYield - baseYield) / baseYield) * 100;
  
  const aspect = Math.sqrt(landArea * 10000); // Convert to square meters
  
  return {
    recommendedCropId: cropId,
    predictedYield: Number(predictedYield.toFixed(2)),
    optimizedArea: Number(optimizedArea.toFixed(2)),
    optimizedDimensions: {
      length: Number((aspect * 1.2).toFixed(2)),
      width: Number((aspect / 1.2).toFixed(2)),
    },
    confidenceScore: Number(confidenceScore.toFixed(1)),
    yieldIncrease: Number(yieldIncrease.toFixed(1)),
  };
};

// Helper function to calculate score based on how close actual is to ideal range
const calculateScore = (actual: number, min: number, max: number) => {
  if (actual >= min && actual <= max) {
    return 1.0; // Optimal score
  }
  
  // Calculate distance from optimal range
  const distanceFromRange = actual < min ? min - actual : actual - max;
  const rangeSize = max - min;
  
  // Score decreases with distance from optimal range
  return Math.max(0, 1 - (distanceFromRange / rangeSize) * 0.5);
};
