import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export function LoadingSkeleton({
  variant = "card",
  className,
}: {
  variant?: "card" | "table"
  className?: string
}) {
  if (variant === "table") {
    return (
      <div className={cn("w-full space-y-4", className)}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <Skeleton className="h-[125px] w-full rounded-card" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
