
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { HarvestData } from "@/types";

interface HarvestHistoryChartProps {
  data: HarvestData[];
}

export const HarvestHistoryChart: React.FC<HarvestHistoryChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    date: item.date,
    yield: Number(item.yield.toFixed(2)),
    area: Number(item.landArea.toFixed(2)),
    yieldPerHectare: Number((item.yield / item.landArea).toFixed(2)),
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Riwayat Hasil Panen</CardTitle>
        <CardDescription>Tren hasil panen dari waktu ke waktu</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#4aab25" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="yield" name="Total Panen (ton)" fill="#4aab25" />
            <Bar yAxisId="right" dataKey="yieldPerHectare" name="Panen per Hektar (ton/ha)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
