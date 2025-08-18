import { Loader } from 'lucide-react';
import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
}

export default function Loading({className }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center h-screen   text-muted-foreground", className)}>
      <Loader className="animate-spin" size={50} />
    </div>
  )
}