"use client";

import { Label, Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

type ChartDataItem = Record<string, string | number>;

export type AppPieChartProps = {
  data: ChartDataItem[];
  dataKey: string;
  nameKey: string;
  totalLabel?: string;
  title?: string;
  config: ChartConfig;
};

const AppPieChart = ({
  data,
  dataKey,
  nameKey,
  config,
  totalLabel = "Visitors",
}: AppPieChartProps) => {
  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + Number(item[dataKey]), 0);
  }, [data, dataKey]);

  return (
    <div>
      <ChartContainer
        config={config}
        className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius="60%"
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill as string} />
              ))}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl sm:text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          {totalLabel}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="mt-4 flex flex-col gap-2 items-center text-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground text-sm">
          Showing total visitors for the last 6 months
        </div>
      </div>
    </div>
  );
};

export default AppPieChart;
