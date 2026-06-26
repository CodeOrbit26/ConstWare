"use client"

import * as React from "react"
import { toast } from "sonner"
import { Smartphone } from "lucide-react"

export function PWARegistry() {
  React.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registered", reg))
        .catch((err) => console.log("SW registration failed", err))
    }

    const handleInstallPrompt = (e: any) => {
      e.preventDefault()
      // Store event to trigger it later if needed
      // For now, let's show a toast for the 3rd visit simulation
      const visitCount = parseInt(localStorage.getItem("visit_count") || "0")
      const newCount = visitCount + 1
      localStorage.setItem("visit_count", newCount.toString())

      if (newCount === 3) {
        toast("Install ConstWare Enterprise", {
          description: "Add to your home screen for rapid on-site access.",
          action: {
            label: "Install",
            onClick: () => {
               (e as any).prompt()
            },
          },
          icon: <Smartphone className="h-4 w-4 text-primary" />,
          duration: 10000,
        })
      }
    }

    window.addEventListener("beforeinstallprompt", handleInstallPrompt)
    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt)
  }, [])

  return null
}
