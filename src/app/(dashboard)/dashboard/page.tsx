"use client";

import { useEffect, useState } from "react";
import CardsGrid from "@/components/cards/CardsGrid";
import { AppSidebar } from "@/components/app-sidebar";
import { useSearch } from "@/components/ui/search-context";
import Fuse from "fuse.js";

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
  const { searchQuery } = useSearch();

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

  // Fuzzy search with fuse.js
  const fuse = new Fuse(cardsData, {
    keys: ["title", "description"],
    threshold: 0.3,
  });

  const filteredCards = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : cardsData;

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div>
      <AppSidebar />
      <main className="flex-1 p-4">
        {filteredCards.length === 0 ? (
          <div className="text-center text-gray-500">No results found.</div>
        ) : (
          <CardsGrid data={filteredCards} />
        )}
      </main>
    </div>
  );
}
