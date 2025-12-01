import { cn } from "@/utils/cn"

export const Container = ({ children, className }) => {
  return (
    <div className={cn("container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-6xl", className)}>
      {children}
    </div>
  )
}
