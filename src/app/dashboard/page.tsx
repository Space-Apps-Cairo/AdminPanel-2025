"use client";

import { useEffect, useState } from "react";
import CardsGrid from "@/components/cards/CardsGrid";
import { AppSidebar } from "@/components/app-sidebar"; 

export type CardData = {
  title?: string;
  value?: string;
  change?: string;
  changeColor?: "green" | "red";
  description?: string;
  type?: "bar" | "line" | "area" | "pie";
  gradient?: boolean;
  colSpan?: string;
  colStart?: string;
  rowStart?: string;
  chartData?: Record<string, string | number>[];
  chartConfig?: {
    [key: string]: {
      label: string;
      color?: string;
    };
  };
  dataKey?: string;
  nameKey?: string;
  totalLabel?: string;
  xAxisKey?: string;
  areas?: { dataKey: string; stroke?: string; fill?: string }[];
  lines?: { dataKey: string; stroke?: string }[];
};

export default function Dashboard() {
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("/api/cards");
        const data = await res.json();
        setCardsData(data);
      } catch (error) {
        console.error("Failed to fetch cards data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const filteredCards = cardsData.filter((card) =>
    card.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
     
  
   <div>
     <AppSidebar onSearch={setSearchQuery} />

      <main className="flex-1 p-4">
        <CardsGrid data={filteredCards} />
      </main>
   </div>
     
  );
}
