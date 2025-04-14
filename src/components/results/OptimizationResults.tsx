
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OptimizationResult, CropData } from "@/types";
import { Check, AlertTriangle } from "lucide-react";
import { crops } from "@/utils/mockData";

interface OptimizationResultsProps {
  result: OptimizationResult;
  originalArea: number;
}

export const OptimizationResults: React.FC<OptimizationResultsProps> = ({ result, originalArea }) => {
  const crop = result.recommendedCropId 
    ? crops.find(c => c.id === result.recommendedCropId) 
    : undefined;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Hasil Analisis Optimasi
          <span className={`text-sm px-3 py-1 rounded-full ${result.confidenceScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {result.confidenceScore}% keyakinan
          </span>
        </CardTitle>
        <CardDescription>
          Rekomendasi optimalisasi lahan berdasarkan data input
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lahan Optimal</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Area Optimal</span>
                  <span className="font-medium">{result.optimizedArea} hektar</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dari Total</span>
                  <span className="font-medium">{originalArea} hektar</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Persentase Optimal</span>
                  <span className="font-medium">{((result.optimizedArea / originalArea) * 100).toFixed(1)}%</span>
                </div>
                {result.optimizedDimensions && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Panjang Optimal</span>
                      <span className="font-medium">{result.optimizedDimensions.length} meter</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Lebar Optimal</span>
                      <span className="font-medium">{result.optimizedDimensions.width} meter</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hasil Panen</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Prediksi Hasil</span>
                  <span className="font-medium">{result.predictedYield} ton</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hasil per Hektar</span>
                  <span className="font-medium">{(result.predictedYield / result.optimizedArea).toFixed(2)} ton/ha</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Perubahan Hasil</span>
                  <span className={`font-medium ${result.yieldIncrease >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.yieldIncrease >= 0 ? '+' : ''}{result.yieldIncrease}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {crop && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-3">Informasi Tanaman: {crop.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Suhu Ideal</div>
                  <div className="text-base font-medium">{crop.idealTemperature[0]}-{crop.idealTemperature[1]}°C</div>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Curah Hujan Ideal</div>
                  <div className="text-base font-medium">{crop.idealRainfall[0]}-{crop.idealRainfall[1]} mm</div>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground">Kelembapan Ideal</div>
                  <div className="text-base font-medium">{crop.idealHumidity[0]}-{crop.idealHumidity[1]}%</div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-3">Rekomendasi Tindakan</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  {result.optimizedArea < originalArea 
                    ? `Fokuskan tanaman pada ${result.optimizedArea} hektar untuk hasil optimal.`
                    : `Seluruh lahan sebesar ${result.optimizedArea} hektar sudah optimal.`}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  {result.optimizedDimensions 
                    ? `Disarankan mengatur dimensi lahan menjadi ${result.optimizedDimensions.length}m × ${result.optimizedDimensions.width}m.`
                    : `Pertahankan dimensi lahan saat ini.`}
                </span>
              </li>
              {result.yieldIncrease < 15 && (
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Pertimbangkan untuk mengganti jenis tanaman atau menerapkan teknik intensifikasi pertanian.
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
