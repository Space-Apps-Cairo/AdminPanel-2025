"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface MultiBarChartProps {
  title: string;
  description?: string;
  data: Record<string, any>[];
  keys: {
    dataKey: string;
    label: string;
    color: string;
  }[];
  footerText?: string;
  footerSubText?: string;
  indicator?: React.ReactNode;
}

export function MultiBarChart({
  title,
  description,
  data,
  keys,
}: MultiBarChartProps) {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer
          config={keys.reduce((acc, key) => {
            acc[key.dataKey] = { label: key.label, color: key.color };
            return acc;
          }, {} as Record<string, { label: string; color: string }>)}
        >
          <BarChart barGap={1} accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {keys.map((key) => (
              <Bar
                key={key.dataKey}
                dataKey={key.dataKey}
                fill={key.color}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface MultiBarChartProps {
  title: string;
  description?: string;
  data: Record<string, any>[];
  keys: {
    dataKey: string;
    label: string;
    color: string;
  }[];
  footerText?: string;
  footerSubText?: string;
  indicator?: React.ReactNode;
}

export function MultiBarChart({
  title,
  description,
  data,
  keys,
}: MultiBarChartProps) {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer
          config={keys.reduce((acc, key) => {
            acc[key.dataKey] = { label: key.label, color: key.color };
            return acc;
          }, {} as Record<string, { label: string; color: string }>)}
        >
          <BarChart barGap={1} accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {keys.map((key) => (
              <Bar
                key={key.dataKey}
                dataKey={key.dataKey}
                fill={key.color}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
