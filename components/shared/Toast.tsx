// We export the pre-configured Toaster from shadcn's sonner component,
// but we wrap it to ensure it uses the correct design tokens.
import * as React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toast = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium",
          success: "group-[.toaster]:bg-success/10 group-[.toaster]:text-success group-[.toaster]:border-success/20",
          error: "group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive group-[.toaster]:border-destructive/20",
          warning: "group-[.toaster]:bg-warning/10 group-[.toaster]:text-warning group-[.toaster]:border-warning/20",
          info: "group-[.toaster]:bg-blue-500/10 group-[.toaster]:text-blue-500 group-[.toaster]:border-blue-500/20",
        },
      }}
      {...props}
    />
  )
}

export { Toast }
