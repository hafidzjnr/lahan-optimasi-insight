
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { HarvestHistoryChart } from "@/components/charts/HarvestHistoryChart";
import { OptimizationChart } from "@/components/charts/OptimizationChart";
import { generateHistoricalData, crops } from "@/utils/mockData";
import { predictYield } from "@/utils/optimizationCalc";
import { LandData, WeatherData, OptimizationResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  // Demo state
  const [cropId, setCropId] = useState("1"); // Default to "Padi"
  const [landData, setLandData] = useState<LandData>({
    totalArea: 2.5,
    length: 158,
    width: 158,
  });
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 26,
    rainfall: 220,
    humidity: 72,
  });
  
  // Generate mock historical harvest data
  const harvestHistory = generateHistoricalData(cropId, 8);
  
  // Calculate optimization
  const optimizationResult = predictYield(cropId, landData, weatherData);
  
  const cropName = crops.find(c => c.id === cropId)?.name || "Tidak diketahui";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang di Sistem Pengoptimalisasi Lahan Pertanian
            </p>
          </div>
          <Button 
            onClick={() => navigate("/data-input")}
            className="flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            Input Data Baru
          </Button>
        </div>

        <DashboardSummary
          landArea={landData.totalArea}
          currentCrop={cropName}
          predictedYield={optimizationResult.predictedYield}
          confidenceScore={optimizationResult.confidenceScore}
          currentWeather={weatherData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <HarvestHistoryChart data={harvestHistory} />
          <OptimizationChart
            optimizedArea={optimizationResult.optimizedArea}
            totalArea={landData.totalArea}
            predictedYield={optimizationResult.predictedYield}
            yieldIncrease={optimizationResult.yieldIncrease}
          />
        </div>
        
        <div className="p-4 bg-muted/20 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">Insights</h3>
          <p className="text-muted-foreground">
            Berdasarkan analisis data, disarankan untuk fokus pada {optimizationResult.optimizedArea} hektar lahan untuk mengoptimalkan hasil panen {cropName}. 
            Hasil panen yang diprediksi adalah {optimizationResult.predictedYield} ton 
            ({optimizationResult.yieldIncrease >= 0 ? "+" : ""}{optimizationResult.yieldIncrease}% dari rata-rata sebelumnya).
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
