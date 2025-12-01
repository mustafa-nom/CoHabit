import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-mint/20 text-mint border border-mint",
        success: "bg-green-500/20 text-green-400 border border-green-500",
        error: "bg-red-500/20 text-red-400 border border-red-500",
        warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const Badge = ({ className, variant, ...props }) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
