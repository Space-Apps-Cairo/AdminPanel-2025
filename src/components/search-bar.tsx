"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type SearchBarProps = {
  onChange?: (value: string) => void
}

export default function SearchBar({ onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}
