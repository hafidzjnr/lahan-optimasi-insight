
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HarvestHistoryChart } from "@/components/charts/HarvestHistoryChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from "recharts";
import { generateHistoricalData, crops } from "@/utils/mockData";
import { findOptimalCrop } from "@/utils/optimizationCalc";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Analytics = () => {
  const [selectedCropId, setSelectedCropId] = useState("1");
  
  // Generate mock historical harvest data
  const harvestHistory = generateHistoricalData(selectedCropId, 12);
  
  // Calculate weather impact data
  const weatherImpactData = harvestHistory.map(item => ({
    date: item.date,
    yield: item.yield,
    temperature: item.weather.temperature,
    rainfall: item.weather.rainfall,
    humidity: item.weather.humidity,
    yieldPerHa: Number((item.yield / item.landArea).toFixed(2)),
  }));
  
  // Calculate crop comparison data
  const cropComparisonData = crops.map(crop => {
    const cropHistory = generateHistoricalData(crop.id, 4);
    const avgYield = cropHistory.reduce((sum, item) => sum + item.yield, 0) / cropHistory.length;
    const avgYieldPerHa = cropHistory.reduce((sum, item) => sum + (item.yield / item.landArea), 0) / cropHistory.length;
    
    return {
      id: crop.id,
      name: crop.name,
      averageYield: Number(avgYield.toFixed(2)),
      averageYieldPerHa: Number(avgYieldPerHa.toFixed(2)),
      growthDays: crop.growthDays,
    };
  });

  // Find optimal crops based on average weather
  const avgWeather = {
    temperature: harvestHistory.reduce((sum, item) => sum + item.weather.temperature, 0) / harvestHistory.length,
    rainfall: harvestHistory.reduce((sum, item) => sum + item.weather.rainfall, 0) / harvestHistory.length,
    humidity: harvestHistory.reduce((sum, item) => sum + item.weather.humidity, 0) / harvestHistory.length,
  };
  
  const optimalCrops = findOptimalCrop({ totalArea: 1, length: 100, width: 100 }, avgWeather);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analisis Hasil</h1>
            <p className="text-muted-foreground">
              Lihat tren dan analisis data hasil panen
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Ekspor Data
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/20 p-4 rounded-lg">
          <div className="text-sm">Pilih tanaman untuk analisis:</div>
          <Select value={selectedCropId} onValueChange={setSelectedCropId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih tanaman" />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop.id} value={crop.id}>
                  {crop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <HarvestHistoryChart data={harvestHistory} />
          
          <Card>
            <CardHeader>
              <CardTitle>Pengaruh Cuaca Terhadap Hasil Panen</CardTitle>
              <CardDescription>Analisis korelasi antara kondisi cuaca dan hasil panen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={weatherImpactData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="yieldPerHa"
                      name="Hasil per Ha (ton)"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="rainfall"
                      name="Curah Hujan (mm)"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={weatherImpactData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      name="Suhu (°C)"
                      stroke="#ff7300"
                      fill="#ff730033"
                    />
                    <Area
                      type="monotone"
                      dataKey="humidity"
                      name="Kelembapan (%)"
                      stroke="#387908"
                      fill="#38790833"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Jenis Tanaman</CardTitle>
              <CardDescription>Analisis hasil panen berbagai jenis tanaman</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={cropComparisonData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageYieldPerHa" name="Hasil per Hektar (ton)" fill="#8884d8" />
                  <Bar dataKey="growthDays" name="Lama Pertumbuhan (hari)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Rekomendasi Tanaman Optimal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {optimalCrops.slice(0, 3).map((crop, index) => (
                    <div key={crop.cropId} className="p-4 bg-muted/20 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{index + 1}. {crop.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          index === 0 ? 'bg-green-100 text-green-800' : 
                          index === 1 ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          Score: {(crop.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {crop.name} adalah tanaman yang cocok untuk kondisi cuaca rata-rata di lahan Anda.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
