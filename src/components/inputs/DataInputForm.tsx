
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { LandData, WeatherData } from "@/types";
import { crops } from "@/utils/mockData";

interface DataInputFormProps {
  onSubmit: (cropId: string, landData: LandData, weatherData: WeatherData) => void;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({ onSubmit }) => {
  const [selectedCropId, setSelectedCropId] = useState("");
  const [landData, setLandData] = useState<LandData>({
    totalArea: 1,
    length: 100,
    width: 100,
    soilType: "loam",
    irrigation: "sprinkler",
  });
  
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 25,
    rainfall: 200,
    humidity: 70,
  });

  const handleCropChange = (value: string) => {
    setSelectedCropId(value);
  };

  const handleLandDataChange = (field: keyof LandData, value: number | string) => {
    setLandData((prev) => ({ ...prev, [field]: value }));
    
    // Update length and width if totalArea changes
    if (field === "totalArea") {
      const newArea = typeof value === 'number' ? value : parseFloat(value);
      // Convert hectares to square meters
      const areaInSqMeters = newArea * 10000;
      // Assuming square plot for simplicity
      const side = Math.sqrt(areaInSqMeters);
      setLandData((prev) => ({ 
        ...prev, 
        [field]: newArea,
        length: Math.round(side),
        width: Math.round(side)
      }));
    }
    
    // Update total area if length or width changes
    if (field === "length" || field === "width") {
      const newValue = typeof value === 'number' ? value : parseFloat(value);
      const otherSide = field === "length" ? landData.width : landData.length;
      const newArea = (newValue * otherSide) / 10000; // Convert sq meters to hectares
      setLandData((prev) => ({ ...prev, [field]: newValue, totalArea: Number(newArea.toFixed(2)) }));
    }
  };

  const handleWeatherDataChange = (field: keyof WeatherData, value: number) => {
    setWeatherData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCropId) {
      toast.error("Silakan pilih jenis tanaman");
      return;
    }
    
    if (landData.totalArea <= 0) {
      toast.error("Luas lahan harus lebih dari 0");
      return;
    }
    
    onSubmit(selectedCropId, landData, weatherData);
    toast.success("Data berhasil dianalisis");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Input Data Lahan</CardTitle>
        <CardDescription>
          Masukkan informasi lahan dan kondisi cuaca untuk analisis
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Tanaman</h3>
            <div className="grid gap-2">
              <Label htmlFor="crop">Jenis Tanaman</Label>
              <Select value={selectedCropId} onValueChange={handleCropChange}>
                <SelectTrigger id="crop">
                  <SelectValue placeholder="Pilih jenis tanaman" />
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
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Lahan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalArea">Luas Lahan (hektar)</Label>
                <Input
                  id="totalArea"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={landData.totalArea}
                  onChange={(e) => handleLandDataChange("totalArea", parseFloat(e.target.value))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="soilType">Jenis Tanah</Label>
                <Select 
                  value={landData.soilType} 
                  onValueChange={(value) => setLandData((prev) => ({ ...prev, soilType: value }))}
                >
                  <SelectTrigger id="soilType">
                    <SelectValue placeholder="Pilih jenis tanah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Tanah Liat</SelectItem>
                    <SelectItem value="loam">Tanah Lempung</SelectItem>
                    <SelectItem value="sand">Tanah Berpasir</SelectItem>
                    <SelectItem value="silt">Tanah Berdebu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="length">Panjang (meter)</Label>
                <Input
                  id="length"
                  type="number"
                  min="1"
                  value={landData.length}
                  onChange={(e) => handleLandDataChange("length", parseInt(e.target.value))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="width">Lebar (meter)</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  value={landData.width}
                  onChange={(e) => handleLandDataChange("width", parseInt(e.target.value))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="irrigation">Sistem Irigasi</Label>
                <Select 
                  value={landData.irrigation} 
                  onValueChange={(value) => setLandData((prev) => ({ ...prev, irrigation: value }))}
                >
                  <SelectTrigger id="irrigation">
                    <SelectValue placeholder="Pilih sistem irigasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drip">Tetes</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler</SelectItem>
                    <SelectItem value="flood">Banjir</SelectItem>
                    <SelectItem value="none">Tidak Ada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Kondisi Cuaca</h3>
            
            <div className="grid gap-3">
              <Label>
                Suhu Rata-rata: {weatherData.temperature}°C
              </Label>
              <Slider
                defaultValue={[25]}
                min={10}
                max={40}
                step={1}
                value={[weatherData.temperature]}
                onValueChange={(value) => handleWeatherDataChange("temperature", value[0])}
              />
            </div>
            
            <div className="grid gap-3">
              <Label>
                Curah Hujan: {weatherData.rainfall} mm
              </Label>
              <Slider
                defaultValue={[200]}
                min={0}
                max={500}
                step={10}
                value={[weatherData.rainfall]}
                onValueChange={(value) => handleWeatherDataChange("rainfall", value[0])}
              />
            </div>
            
            <div className="grid gap-3">
              <Label>
                Kelembapan: {weatherData.humidity}%
              </Label>
              <Slider
                defaultValue={[70]}
                min={10}
                max={100}
                step={1}
                value={[weatherData.humidity]}
                onValueChange={(value) => handleWeatherDataChange("humidity", value[0])}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">Analisis Data</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
