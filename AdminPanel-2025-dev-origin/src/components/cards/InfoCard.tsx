import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import AppBarChart from "../charts/AppBarChart";
import AppLineChart from "../charts/AppLineChart";
import AppPieChart from "../charts/AppPieChart";
import AppAreaChart from "../charts/AppAreaChart";
import type { CardData } from "@/app/(dashboard)/dashboard/page";

export default function InfoCard(props: CardData) {
  const {
    title,
    value,
    change,
    changeColor = "green",
    description,
    type,
    gradient = false,
    chartData,
    chartConfig,
    dataKey,
    nameKey,
    totalLabel,
    xAxisKey,
    areas,
    lines,
  } = props;

  const isPositive = changeColor === "green";

  const arrowIcon = change ? (
    isPositive ? (
      <ArrowUpRight className="w-4 h-4 mr-1" />
    ) : (
      <ArrowDownRight className="w-4 h-4 mr-1" />
    )
  ) : null;

  let ChartComponent = null;
  switch (type) {
    case "bar":
      ChartComponent = chartData && chartConfig && (
        <AppBarChart data={chartData} config={chartConfig} />
      );
      break;
    case "line":
      ChartComponent = chartData && chartConfig && (xAxisKey || dataKey) && (
        <AppLineChart
          data={chartData}
          config={chartConfig}
          lines={lines || []}
          xAxisKey={(xAxisKey ?? dataKey) as string}
        />
      );
      break;
    case "area":
      ChartComponent = chartData && chartConfig && (xAxisKey || dataKey) && (
        <AppAreaChart
          data={chartData}
          config={chartConfig}
          areas={areas || []}
          xAxisKey={(xAxisKey ?? dataKey) as string}
        />
      );
      break;
    case "pie":
      ChartComponent = chartData && chartConfig && nameKey && (
        <AppPieChart
          data={chartData}
          config={chartConfig}
          dataKey={dataKey || "visitors"}
          nameKey={nameKey}
          totalLabel={totalLabel || "Visitors"}
        />
      );
      break;
  }

  const isArea = type === "area";

  return (
    <Card
      className={`rounded-2xl transition ${
        isArea
          ? "bg-transparent border-none shadow-none"
          : gradient
          ? "bg-gradient-to-r from-green-200 to-green-400 dark:from-green-900 dark:to-green-700"
          : "bg-background shadow-md hover:shadow-lg"
      }`}
    >
      <CardContent className={isArea ? "p-0" : "p-4"}>
        {title && <div className="text-sm font-medium mb-1">{title}</div>}

        {change && (
          <div
            className={`flex items-center text-sm font-semibold ${
              isPositive
                ? "text-green-700 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {arrowIcon}
            {change}
          </div>
        )}

        {value !== undefined && (
          <h2 className="text-3xl font-bold tracking-tight mt-2">{value}</h2>
        )}

        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}

        {ChartComponent && <div className="mt-4">{ChartComponent}</div>}
      </CardContent>
    </Card>
  );
}
