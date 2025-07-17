"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type AppBarChartProps = {
  data: Record<string, string | number>[];
  config: ChartConfig;
};

export default function AppBarChart({ data, config }: AppBarChartProps) {
  return (
    <ChartContainer config={config} className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.toString().slice(0, 3)}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(config).map((key) => {
            if (key === "label") return null;
            return (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                radius={4}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
