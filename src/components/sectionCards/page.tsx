"use client";
import {
  TrendingUp,
  TrendingDown,
  Presentation,
  Building2,
  GraduationCap,
  ScrollText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

export interface SectionCardData {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

interface SectionCardsProps {
  data: SectionCardData[];
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="grid md:grid-cols-3 w-full gap-4 py-2">
      {data.map((card, idx) => {
        return (
          <SummaryCard
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        );
      })}
    </div>
  );
}

// function SummaryCards({ dashboardData, isLoading }) {
//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 px-6">
//       <SummaryCard
//         title="Sessions"
//         value={dashboardData?.sessions}
//         isLoading={isLoading}
//         icon={<Contact />}
//       />
//       <SummaryCard
//         title="Certificates"
//         value={dashboardData?.certificates}
//         isLoading={isLoading}
//         icon={<ScrollText />}
//       />
//       <SummaryCard
//         title="Courses"
//         value={dashboardData?.courses}
//         isLoading={isLoading}
//         icon={<GraduationCap />}
//       />
//       <SummaryCard
//         title="Companies"
//         value={dashboardData?.companies}
//         isLoading={isLoading}
//         icon={<Building2 />}
//       />
//       <SummaryCard
//         title="Instructors"
//         value={dashboardData?.instructor}
//         isLoading={isLoading}
//         icon={<Presentation />}
//       />
//     </div>
//   );
// }
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
