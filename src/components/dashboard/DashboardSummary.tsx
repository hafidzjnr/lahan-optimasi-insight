
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Thermometer, Droplets, Wind } from "lucide-react";

interface DashboardSummaryProps {
  landArea: number;
  currentCrop: string;
  predictedYield: number;
  confidenceScore: number;
  currentWeather: {
    temperature: number;
    rainfall: number;
    humidity: number;
  };
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  landArea,
  currentCrop,
  predictedYield,
  confidenceScore,
  currentWeather
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Luas Lahan</CardTitle>
          <CardDescription>Total area yang dikelola</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{landArea} ha</div>
            <div className="p-2 bg-farm-100 rounded-full">
              <Leaf className="h-4 w-4 text-farm-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {(landArea * 10000).toLocaleString()} m²
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tanaman Saat Ini</CardTitle>
          <CardDescription>Jenis tanaman yang ditanam</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentCrop}</div>
          <div className="flex items-center mt-2">
            <div className="w-full">
              <Progress value={confidenceScore} className="h-2" />
            </div>
            <span className="text-xs ml-2">{confidenceScore}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tingkat optimalisasi
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Hasil Prediksi</CardTitle>
          <CardDescription>Prediksi hasil panen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{predictedYield} ton</div>
          <p className="text-xs text-muted-foreground mt-2">
            {(predictedYield / landArea).toFixed(2)} ton per hektar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Kondisi Cuaca</CardTitle>
          <CardDescription>Kondisi terkini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <div className="p-1.5 bg-blue-100 rounded-full mb-1">
                <Thermometer className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-sm font-medium">{currentWeather.temperature}°C</span>
              <span className="text-xs text-muted-foreground">Suhu</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-1.5 bg-blue-100 rounded-full mb-1">
                <Droplets className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-sm font-medium">{currentWeather.rainfall} mm</span>
              <span className="text-xs text-muted-foreground">Curah Hujan</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-1.5 bg-blue-100 rounded-full mb-1">
                <Wind className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-sm font-medium">{currentWeather.humidity}%</span>
              <span className="text-xs text-muted-foreground">Kelembapan</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
