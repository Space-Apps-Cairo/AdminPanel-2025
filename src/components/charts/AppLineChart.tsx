










"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type CurveType =
  | "basis"
  | "basisClosed"
  | "basisOpen"
  | "linear"
  | "linearClosed"
  | "monotoneX"
  | "monotoneY"
  | "monotone"
  | "natural"
  | "step"
  | "stepAfter"
  | "stepBefore";

type ChartLine = {
  dataKey: string;
  type?: CurveType;
  stroke?: string;
};

type Props = {
  data: Record<string, string | number>[];
  config: ChartConfig;
  lines: ChartLine[];
  xAxisKey: string;
};

const AppLineChart = ({ data, config, lines, xAxisKey }: Props) => {
  return (
    <ChartContainer
      config={config}
      className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) =>
              typeof value === "string" ? value.slice(0, 3) : value
            }
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              dataKey={line.dataKey}
              type={line.type || "monotone"}
              stroke={line.stroke || `var(--color-${line.dataKey})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default AppLineChart;

