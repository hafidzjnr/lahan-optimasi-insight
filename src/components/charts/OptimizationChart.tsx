
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

interface OptimizationChartProps {
  optimizedArea: number;
  totalArea: number;
  predictedYield: number;
  yieldIncrease: number;
}

export const OptimizationChart: React.FC<OptimizationChartProps> = ({
  optimizedArea,
  totalArea,
  predictedYield,
  yieldIncrease,
}) => {
  const data = [
    { name: "Area Optimal", value: optimizedArea },
    { name: "Area Tidak Optimal", value: Math.max(0, totalArea - optimizedArea) },
  ];
  
  const COLORS = ["#4aab25", "#e2e8f0"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Optimalisasi Lahan</CardTitle>
            <CardDescription>Analisis optimasi penggunaan lahan</CardDescription>
          </div>
          <Badge variant={yieldIncrease >= 0 ? "default" : "destructive"} className="text-xs">
            {yieldIncrease >= 0 ? "+" : ""}{yieldIncrease}% Hasil Panen
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)} ha`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 md:mt-0 w-full md:w-1/2 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Area Optimal</div>
              <div className="text-xl font-bold text-farm-600">{optimizedArea} ha</div>
              <div className="text-xs text-muted-foreground">dari total {totalArea} ha</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Hasil Prediksi</div>
              <div className="text-xl font-bold text-farm-600">{predictedYield} ton</div>
              <div className="text-xs text-muted-foreground">{(predictedYield / optimizedArea).toFixed(2)} ton/ha</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
