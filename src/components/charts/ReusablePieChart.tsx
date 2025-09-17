"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  data: { [key: string]: any }[];
  dataKey: string;
  nameKey: string;
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CFE",
  "#FF6699",
  "#33CC99",
  "#FF6666",
];

// Value inside the slice
const renderValueInside = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
    >
      {value}
    </text>
  );
};

export function ReusablePieChart({
  title,
  description,
  data,
  dataKey,
  nameKey,
}: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Tooltip
              formatter={(value, name) => [`${value}`, `${name}`]}
              contentStyle={{ borderRadius: "8px" }}
            />
            <Legend verticalAlign="bottom" height={80} />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="42%"
              outerRadius={150}
              labelLine={false}
              label={renderValueInside}
              minAngle={12}
              // paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  cx="50%"
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
