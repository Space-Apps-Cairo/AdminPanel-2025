"use client";
import { Input } from "@/components/ui/input";
import { useSearch } from "./search-context";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <Input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full"
    />
  );
}
