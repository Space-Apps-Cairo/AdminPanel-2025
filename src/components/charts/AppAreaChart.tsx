
"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type ChartDataItem = Record<string, string | number>;

type AreaItem = {
  dataKey: string;
  color?: string;
  stackId?: string;
  type?: "monotone" | "linear" | "step" | "natural" | "basis";
};

type AppAreaChartProps = {
  data: ChartDataItem[];
  config: ChartConfig;
  areas: AreaItem[];
  xAxisKey: string;
  title?: string;
  description?: string;
};

export default function AppAreaChart({
  data,
  config,
  areas,
  xAxisKey,
  title = "Sales Overview",
  description = "Showing total visitors for the last 3 months",
}: AppAreaChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => {
      const date = new Date(item[xAxisKey]);
      return date >= startDate;
    });
  }, [data, timeRange, xAxisKey]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 border-b py-5">
        <div className="flex-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={config}
          className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full"
        >
          <ResponsiveContainer>
            <AreaChart data={filteredData}>
              <defs>
                {areas.map((area) => (
                  <linearGradient
                    key={area.dataKey}
                    id={`fill-${area.dataKey}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`var(--color-${area.dataKey})`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--color-${area.dataKey})`}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value as string);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value as string).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              {areas.map((area) => (
                <Area
                  key={area.dataKey}
                  dataKey={area.dataKey}
                  type={area.type || "natural"}
                  fill={`url(#fill-${area.dataKey})`}
                  stroke={`var(--color-${area.dataKey})`}
                  stackId={area.stackId || "a"}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
