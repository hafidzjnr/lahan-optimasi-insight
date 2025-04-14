
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudRain, Sun, Thermometer, Wind } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock weather data
const generateWeatherData = (days = 7) => {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayStr = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    
    // Add some random variation for weather
    const baseTemp = 25 + Math.sin(i / 7 * Math.PI) * 3;
    const baseRain = 10 + Math.sin(i / 3.5 * Math.PI) * 20;
    const baseHumidity = 70 + Math.sin(i / 5 * Math.PI) * 15;
    
    data.push({
      day: dayStr,
      temperature: Number((baseTemp + (Math.random() * 2 - 1)).toFixed(1)),
      rainfall: Math.max(0, Math.round(baseRain + (Math.random() * 10 - 5))),
      humidity: Math.round(baseHumidity + (Math.random() * 10 - 5)),
      windSpeed: Number((2 + Math.random() * 3).toFixed(1)),
    });
  }
  
  return data;
};

// Historical weather by month
const generateMonthlyWeather = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map(month => ({
    month,
    // Create seasonal pattern
    temperature: 22 + Math.sin(months.indexOf(month) / 6 * Math.PI) * 5,
    rainfall: 50 + Math.sin((months.indexOf(month) + 3) / 6 * Math.PI) * 150,
    humidity: 65 + Math.sin(months.indexOf(month) / 6 * Math.PI) * 15,
  }));
};

const Weather = () => {
  const [weatherForecast, setWeatherForecast] = useState(generateWeatherData());
  const [monthlyWeather, setMonthlyWeather] = useState(generateMonthlyWeather());
  const [location, setLocation] = useState("Jakarta, Indonesia");
  const [year, setYear] = useState("2024");
  
  const handleLocationUpdate = () => {
    toast.success(`Data cuaca untuk ${location} telah dimuat`);
    setWeatherForecast(generateWeatherData());
    setMonthlyWeather(generateMonthlyWeather());
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Cuaca</h1>
          <p className="text-muted-foreground">
            Pantau kondisi dan prediksi cuaca untuk perencanaan pertanian
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Lokasi</CardTitle>
            <CardDescription>Pilih lokasi untuk melihat data cuaca</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Masukkan nama kota"
                />
              </div>
              <div className="grid w-full max-w-xs items-center gap-1.5">
                <Label htmlFor="year">Tahun</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Pilih tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleLocationUpdate}>Perbarui Data</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Thermometer className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suhu Saat Ini</p>
                <h3 className="text-2xl font-bold">{weatherForecast[0].temperature}°C</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <CloudRain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Curah Hujan</p>
                <h3 className="text-2xl font-bold">{weatherForecast[0].rainfall} mm</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Wind className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kelembapan</p>
                <h3 className="text-2xl font-bold">{weatherForecast[0].humidity}%</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Sun className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kecepatan Angin</p>
                <h3 className="text-2xl font-bold">{weatherForecast[0].windSpeed} m/s</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="forecast">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="forecast">Prakiraan 7 Hari</TabsTrigger>
            <TabsTrigger value="historical">Data Historis</TabsTrigger>
          </TabsList>
          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle>Prakiraan Cuaca 7 Hari</CardTitle>
                <CardDescription>Prediksi cuaca untuk {location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-7 gap-2">
                        {weatherForecast.map((day, index) => (
                          <div
                            key={day.day}
                            className={`p-3 text-center rounded-md ${
                              index === 0 ? 'bg-muted/30 border' : ''
                            }`}
                          >
                            <p className="font-medium">{day.day}</p>
                            <div className="my-2">
                              {day.rainfall > 20 ? (
                                <CloudRain className="h-8 w-8 mx-auto text-blue-500" />
                              ) : (
                                <Sun className="h-8 w-8 mx-auto text-yellow-500" />
                              )}
                            </div>
                            <p className="text-lg font-bold">{day.temperature}°C</p>
                            <p className="text-xs text-muted-foreground">{day.rainfall} mm</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={weatherForecast}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" orientation="left" stroke="#ff7300" />
                      <YAxis yAxisId="right" orientation="right" stroke="#387908" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="temperature"
                        name="Suhu (°C)"
                        stroke="#ff7300"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="rainfall"
                        name="Curah Hujan (mm)"
                        stroke="#387908"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="historical">
            <Card>
              <CardHeader>
                <CardTitle>Data Historis {year}</CardTitle>
                <CardDescription>Ringkasan cuaca tahunan untuk {location}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={monthlyWeather}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#ff7300" />
                    <YAxis yAxisId="right" orientation="right" stroke="#387908" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      name="Suhu Rata-rata (°C)"
                      stroke="#ff7300"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="rainfall"
                      name="Curah Hujan (mm)"
                      stroke="#387908"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="humidity"
                      name="Kelembapan (%)"
                      stroke="#3b82f6"
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Implikasi untuk Pertanian</h3>
                  <p className="text-muted-foreground">
                    Berdasarkan data historis, periode terbaik untuk penanaman adalah pada bulan Maret hingga Juni karena 
                    memiliki kombinasi suhu dan curah hujan yang optimal untuk mayoritas tanaman pangan. 
                    Periode Oktober hingga Desember memiliki curah hujan tinggi yang cocok untuk tanaman 
                    seperti padi, tetapi perlu perhatian ekstra terhadap drainase.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Weather;
