
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataInputForm } from "@/components/inputs/DataInputForm";
import { OptimizationResults } from "@/components/results/OptimizationResults";
import { LandData, WeatherData, OptimizationResult } from "@/types";
import { predictYield } from "@/utils/optimizationCalc";
import { crops } from "@/utils/mockData";

const DataInput = () => {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [inputLandData, setInputLandData] = useState<LandData | null>(null);
  
  const handleFormSubmit = (cropId: string, landData: LandData, weatherData: WeatherData) => {
    const optimizationResult = predictYield(cropId, landData, weatherData);
    setResult(optimizationResult);
    setSelectedCropId(cropId);
    setInputLandData(landData);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Input Data</h1>
          <p className="text-muted-foreground">
            Masukkan informasi lahan dan kondisi lingkungan untuk analisis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataInputForm onSubmit={handleFormSubmit} />
          
          {result && inputLandData && (
            <div>
              <OptimizationResults
                result={result}
                originalArea={inputLandData.totalArea}
              />
            </div>
          )}
        </div>
        
        {selectedCropId && crops.find(c => c.id === selectedCropId) && (
          <div className="p-4 bg-muted/20 rounded-lg border">
            <h3 className="text-lg font-medium mb-2">Informasi Tanaman</h3>
            <p className="text-muted-foreground mb-4">
              {crops.find(c => c.id === selectedCropId)?.name} membutuhkan kondisi lingkungan yang optimal untuk pertumbuhan dan hasil maksimal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedCropId && (
                <>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Suhu Optimal</div>
                    <div className="text-lg font-semibold">
                      {crops.find(c => c.id === selectedCropId)?.idealTemperature[0]}-
                      {crops.find(c => c.id === selectedCropId)?.idealTemperature[1]}°C
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Curah Hujan Optimal</div>
                    <div className="text-lg font-semibold">
                      {crops.find(c => c.id === selectedCropId)?.idealRainfall[0]}-
                      {crops.find(c => c.id === selectedCropId)?.idealRainfall[1]} mm
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Kelembapan Optimal</div>
                    <div className="text-lg font-semibold">
                      {crops.find(c => c.id === selectedCropId)?.idealHumidity[0]}-
                      {crops.find(c => c.id === selectedCropId)?.idealHumidity[1]}%
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DataInput;
