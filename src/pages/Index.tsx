
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { optimizeLand, OptimizationParams } from "@/lib/optimizationUtils";

const LandOptimizationCalc = () => {
  const [params, setParams] = useState<OptimizationParams>({
    landArea: 10,
    soilQuality: 70,
    waterAvailability: 60,
    fertilizerAmount: 50,
    seedQuality: 80,
    cropType: "Wheat"
  });

  const [results, setResults] = useState<any>(null);
  const [scenarioResults, setScenarioResults] = useState<any[]>([]);

  const handleChange = (name: keyof OptimizationParams, value: any) => {
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const calculateOptimization = () => {
    const optimizationResults = optimizeLand(params);
    setResults(optimizationResults);

    // Generate comparison scenarios
    const scenarios = [
      { landArea: params.landArea * 0.8 },
      { landArea: params.landArea * 1.2 },
      { soilQuality: Math.min(params.soilQuality + 15, 100) }
    ];

    const scenarioData = scenarios.map((scenario, index) => {
      const scenarioParams = { ...params, ...scenario };
      const result = optimizeLand(scenarioParams);
      return {
        name: `Skenario ${index + 1}`,
        yield: parseFloat(result.expectedYield.toFixed(2)),
        profit: parseFloat((result.profitEstimate / 1000).toFixed(2)),
        efficiency: parseFloat(result.resourceEfficiency.toFixed(2)),
        ...scenario
      };
    });

    setScenarioResults([
      {
        name: "Dasar",
        yield: parseFloat(optimizationResults.expectedYield.toFixed(2)),
        profit: parseFloat((optimizationResults.profitEstimate / 1000).toFixed(2)),
        efficiency: parseFloat(optimizationResults.resourceEfficiency.toFixed(2))
      },
      ...scenarioData
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Optimasi Lahan Pertanian</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem optimasi lahan pertanian menggunakan pendekatan kalkulus untuk memaksimalkan hasil produksi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Parameter Lahan</CardTitle>
              <CardDescription>
                Masukkan parameter lahan untuk perhitungan optimasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="landArea">Luas Lahan (Hektar): {params.landArea}</Label>
                  <Input
                    id="landArea"
                    type="number"
                    value={params.landArea}
                    onChange={(e) => handleChange("landArea", parseFloat(e.target.value))}
                    min="1"
                    max="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soilQuality">Kualitas Tanah: {params.soilQuality}</Label>
                  <Slider
                    id="soilQuality"
                    defaultValue={[params.soilQuality]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleChange("soilQuality", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterAvailability">Ketersediaan Air: {params.waterAvailability}</Label>
                  <Slider
                    id="waterAvailability"
                    defaultValue={[params.waterAvailability]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleChange("waterAvailability", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fertilizerAmount">Jumlah Pupuk (kg/ha): {params.fertilizerAmount}</Label>
                  <Slider
                    id="fertilizerAmount"
                    defaultValue={[params.fertilizerAmount]}
                    max={200}
                    step={1}
                    onValueChange={(value) => handleChange("fertilizerAmount", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seedQuality">Kualitas Bibit: {params.seedQuality}</Label>
                  <Slider
                    id="seedQuality"
                    defaultValue={[params.seedQuality]}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleChange("seedQuality", value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cropType">Jenis Tanaman</Label>
                  <Input
                    id="cropType"
                    value={params.cropType}
                    onChange={(e) => handleChange("cropType", e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={calculateOptimization}>
                  Hitung Optimasi
                </Button>
              </div>
            </CardContent>
          </Card>

          {results && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Hasil Optimasi</CardTitle>
                <CardDescription>Perhitungan berdasarkan model kalkulus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Luas Lahan Optimal</h3>
                    <p className="text-2xl font-bold">{results.optimalLandArea.toFixed(2)} hektar</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Hasil Produksi yang Diperkirakan</h3>
                    <p className="text-2xl font-bold">{results.expectedYield.toFixed(2)} ton</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Estimasi Keuntungan</h3>
                    <p className="text-2xl font-bold">Rp {(results.profitEstimate).toLocaleString()}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Efisiensi Sumber Daya</h3>
                    <p className="text-2xl font-bold">{results.resourceEfficiency.toFixed(2)}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Skor Keberlanjutan</h3>
                    <p className="text-2xl font-bold">{results.sustainabilityScore.toFixed(2)}/100</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Alokasi Tanaman yang Direkomendasikan</h3>
                    <div className="space-y-2 mt-2">
                      {Object.entries(results.recommendedCropAllocation).map(([crop, allocation]) => (
                        <div key={crop} className="flex justify-between">
                          <span>{crop}:</span>
                          <span>{(Number(allocation) * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {scenarioResults.length > 0 && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle>Perbandingan Skenario</CardTitle>
              <CardDescription>
                Analisis perbandingan berdasarkan variasi parameter
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  yield: { color: "#2563eb", label: "Hasil (ton)" },
                  profit: { color: "#16a34a", label: "Profit (x1000)" },
                  efficiency: { color: "#d97706", label: "Efisiensi" }
                }}
              >
                <BarChart data={scenarioResults}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="yield" name="Hasil Produksi" fill="var(--color-yield)" />
                  <Bar dataKey="profit" name="Profit (x1000)" fill="var(--color-profit)" />
                  <Bar dataKey="efficiency" name="Efisiensi" fill="var(--color-efficiency)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LandOptimizationCalc;
