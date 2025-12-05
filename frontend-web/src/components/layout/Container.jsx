import { cn } from "@/utils/cn"

export const Container = ({ children, className }) => {
  return (
    <div className={cn("container px-4 py-6 pb-20 md:pb-6 max-w-md mx-auto", className)}>
      {children}
    </div>
  )
}
