"use client"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export interface SectionCardData {
  title: string
  value: string
  description?: string
  trend?: "up" | "down"
  trendValue?: string
  footerMain?: string
  footerSub?: string
}

interface SectionCardsProps {
  data: SectionCardData[]
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="flex w-full gap-4 px-4 py-2">
      {data.map((card, idx) => {
        const TrendIcon = card.trend === "down" ? TrendingDown : TrendingUp
        return (
          <Card
            key={idx}
            className="flex-1 p-4 bg-gradient-to-t from-primary/5 to-card shadow-md rounded-xl"
          >
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {card.value}
              </CardTitle>
              {card.trend && card.trendValue && (
                <CardAction>
                  <Badge variant="outline">
                    <TrendIcon />
                    {card.trendValue}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            {card.description && (
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                {card.footerMain && (
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {card.footerMain} {card.trend && <TrendIcon className="size-4" />}
                  </div>
                )}
                {card.footerSub && <div className="text-muted-foreground">{card.footerSub}</div>}
              </CardFooter>
            )}
          </Card>
        )
      })}
    </div>
  )
}
