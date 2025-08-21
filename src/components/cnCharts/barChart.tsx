"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { JSX } from "react"

export interface ChartBarProps {
  title: string
  description?: string
  data: any[]
  config: ChartConfig
  footerText?: string
  footerSubText?: string
  trendValue?: string
  trendIcon?: JSX.Element
}

export function ChartBar({
  title,
  description,
  data,
  config,
  footerText,
  footerSubText,
  trendValue,
  trendIcon,
}: ChartBarProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "string" ? value.slice(0, 8) : value
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            {Object.keys(config).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={config[key].color}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>

      {(footerText || footerSubText || trendValue) && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {trendValue && trendIcon && (
            <div className="flex gap-2 leading-none font-medium">
              {trendValue} {trendIcon}
            </div>
          )}
          {footerText && <div className="font-medium">{footerText}</div>}
          {footerSubText && <div className="text-muted-foreground">{footerSubText}</div>}
        </CardFooter>
      )}
    </Card>
  )
}
