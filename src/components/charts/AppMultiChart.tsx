"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

type BarChartProps = {
  title: string;
  description?: string;
  data: any[];
  config: ChartConfig;
  xKey: string;
  bars: { key: string; color: string }[];
  footerText?: string;
};

export function MultiBarChart({
  title,
  description,
  data,
  config,
  xKey,
  bars,
  footerText,
}: BarChartProps) {
  return (
   <Card className="w-full md:w-1/2 lg:w-1/3">
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    {description && <CardDescription>{description}</CardDescription>}
  </CardHeader>
  <CardContent className="h-[250px]">
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              fill={bar.color}
              radius={4}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
  {footerText && (
    <CardFooter className="flex-col items-start gap-2 text-sm">
      <div className="flex gap-2 leading-none font-medium">
        {footerText} <TrendingUp className="h-4 w-4" />
      </div>
    </CardFooter>
  )}
</Card>

  );
}
