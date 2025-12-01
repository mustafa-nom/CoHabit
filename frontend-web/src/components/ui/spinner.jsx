import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

export const Spinner = ({ className, size = "default" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <Loader2
      className={cn("animate-spin text-mint", sizeClasses[size], className)}
    />
  )
}
