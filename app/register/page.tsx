import * as React from "react"
import { RegistrationForm } from "@/components/auth/RegistrationForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-12 px-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center font-bold text-xl text-white">CW</div>
        <span className="text-2xl font-bold tracking-tight text-navy dark:text-white">ConstWare</span>
      </div>
      
      <div className="text-center max-w-md mb-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Grow your business</h1>
        <p className="text-muted-foreground">Join thousands of contractors managing their projects efficiently with ConstWare.</p>
      </div>

      <RegistrationForm />
    </div>
  )
}
