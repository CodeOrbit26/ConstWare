import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  initials?: string
  size?: "sm" | "md" | "lg"
}

export function Avatar({ className, src, alt, initials, size = "md", ...props }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-secondary items-center justify-center font-medium",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-secondary-foreground">{initials || "?"}</span>
      )}
    </div>
  )
}
