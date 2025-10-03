"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

export interface SectionCardData {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

interface SectionCardsProps {
  data: SectionCardData[];
  isLoading?: boolean;
}

export function SectionCards({ data, isLoading }: SectionCardsProps) {
  return (
    <div className="grid md:grid-cols-3 w-full gap-4 py-2">
      {isLoading
        ? // Render skeletons when loading
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border bg-card shadow-sm flex flex-col items-center justify-center gap-3"
            >
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))
        : // Render real data when not loading
          data.map((card, idx) => (
            <SummaryCard
              key={idx}
              title={card.title}
              value={card.value.toString()}
              icon={card.icon}
              color={card.color}
            />
          ))}
    </div>
  );
}
function SummaryCard({
  title,
  value,
  isLoading,
  icon,
  color,
}: {
  title: string;
  value?: string;
  isLoading?: boolean;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="w-full flex flex-row items-center justify-between gap-2 px-6">
      <div>
        <CardTitle className="text-lg font-medium gap-2 flex flex-col ">
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-12" /> : value}
          </div>
          {title}
        </CardTitle>
      </div>
      <div>
        {isLoading ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
          <div
            className={`${
              color ?? "bg-primary text-primary-foreground"
            } rounded-full p-4`}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
