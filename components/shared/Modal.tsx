import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface ModalProps {
  title: string
  description?: string
  trigger?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Modal({
  title,
  description,
  trigger,
  children,
  footer,
  open,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px] rounded-[3.5rem] bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl border border-white/20 dark:border-slate-800/50 shadow-premium p-10 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        <DialogHeader className="space-y-4 mb-8">
          <DialogTitle className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-2">{children}</div>
        {footer && <DialogFooter className="mt-8">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
